import pool from "../config/db.js";

class ExpenseController {
  async createExpense(req, res) {
    let { description, amount, payer_id, split_with_ids } = req.body;
    const bot = req.app.get("bot");
    const GROUP_ID = "-1003562411449";

    try {
      const allParticipants = Array.from(
        new Set([...split_with_ids, payer_id]),
      );

      const expenseAmount = parseFloat(amount);
      const share = expenseAmount / allParticipants.length;

      const newExpense = await pool.query(
        "INSERT INTO expenses (description, amount, payer_id) VALUES ($1, $2, $3) RETURNING id",
        [description, expenseAmount, payer_id],
      );
      const expenseId = newExpense.rows[0].id;

      const splitPromises = allParticipants.map((userId) =>
        pool.query(
          "INSERT INTO expense_splits (expense_id, user_id, share_amount) VALUES ($1, $2, $3)",
          [expenseId, userId, share],
        ),
      );
      await Promise.all(splitPromises);

      const usersData = await pool.query(
        "SELECT id, full_name FROM users WHERE id = ANY($1)",
        [allParticipants],
      );

      const payerObj = usersData.rows.find((u) => u.id === payer_id);
      const payerName = payerObj ? payerObj.full_name : "Noma'lum";

      const namesList = usersData.rows.map((u) => u.full_name).join(", ");

      const message = `💰 *Yangi Xarajat!*
━━━━━━━━━━━━━━
📝 *Nima:* ${description}
💵 *Umumiy summa:* ${expenseAmount.toLocaleString()} so'm
👤 *To'ladi:* ${payerName}
👥 *Kimlar uchun:* ${namesList} (${allParticipants.length} kishi)
📊 *Har bir kishi uchun:* ${share.toLocaleString()} so'm
━━━━━━━━━━━━━━`;

      if (bot) {
        await bot.sendMessage(GROUP_ID, message, { parse_mode: "Markdown" });
      }

      res.status(201).json({
        success: true,
        message: "Xarajat saqlandi va guruhga yuborildi",
      });
    } catch (error) {
      console.error("Xarajat yaratishda xato:", error);
      res.status(500).json({ message: "Serverda xatolik" });
    }
  }
  async getBalance(req, res) {
    const { telegram_id } = req.params;

    try {
      const userResult = await pool.query(
        "SELECT id FROM users WHERE telegram_id = $1",
        [telegram_id],
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      }
      const userId = userResult.rows[0].id;

      const query = `
        WITH user_debts AS (
            -- Sizga berilishi kerak bo'lgan summalar (Siz to'lagan xarajatlar)
            SELECT es.user_id as peer_id, SUM(es.share_amount) as amount
            FROM expense_splits es
            JOIN expenses e ON es.expense_id = e.id
            WHERE e.payer_id = $1 AND es.user_id != $1 AND es.is_paid = FALSE
            GROUP BY es.user_id
        ),
        user_credits AS (
            -- Siz berishingiz kerak bo'lgan summalar (Boshqalar to'lagan xarajatlar)
            SELECT e.payer_id as peer_id, SUM(es.share_amount) as amount
            FROM expense_splits es
            JOIN expenses e ON es.expense_id = e.id
            WHERE es.user_id = $1 AND e.payer_id != $1 AND es.is_paid = FALSE
            GROUP BY e.payer_id
        )
        SELECT 
            u.full_name,
            u.telegram_id as peer_telegram_id,
            COALESCE(d.amount, 0) - COALESCE(c.amount, 0) as net_balance
        FROM users u
        LEFT JOIN user_debts d ON u.id = d.peer_id
        LEFT JOIN user_credits c ON u.id = c.peer_id
        WHERE u.id != $1;
      `;

      const result = await pool.query(query, [userId]);

      const receivables = [];
      let totlalReceivables = 0;
      const payables = [];
      let totlalPayables = 0;
      const ssettled = [];
      const allUsers = await pool.query("SELECT * FROM users ORDER BY id ASC");

      result.rows.forEach((row) => {
        const balance = parseFloat(row.net_balance);

        if (balance > 0) {
          receivables.push({
            full_name: row.full_name,
            amount: balance.toFixed(2),
          });
          totlalReceivables += balance;
        } else if (balance < 0) {
          payables.push({
            full_name: row.full_name,
            amount: Math.abs(balance).toFixed(2),
          });
          totlalPayables += Math.abs(balance);
        } else {
          ssettled.push({
            full_name: row.full_name,
          });
        }
      });

      res.json({
        totlalReceivables,
        totlalPayables,
        total: totlalReceivables - totlalPayables,
        receivables,
        payables,
        settled: ssettled,
        allUsers: allUsers.rows,
      });
    } catch (error) {
      console.error("Balansni hisoblashda xato:", error);
      res.status(500).json({ message: "Serverda xatolik" });
    }
  }
  async confirmPayment(req, res) {
    const { creditor_telegram_id, debtor_full_name } = req.body;

    try {
      const creditorResult = await pool.query(
        "SELECT id FROM users WHERE telegram_id = $1",
        [creditor_telegram_id],
      );

      if (creditorResult.rows.length === 0)
        return res.status(404).json({ message: "Haqdor topilmadi" });
      const creditorId = creditorResult.rows[0].id;

      // 2. Qarzdorning ID sini ism orqali topamiz (yoki ID orqali yuborsangiz yaxshiroq)
      const debtorResult = await pool.query(
        "SELECT id FROM users WHERE full_name = $1",
        [debtor_full_name],
      );

      if (debtorResult.rows.length === 0)
        return res.status(404).json({ message: "Qarzdor topilmadi" });
      const debtorId = debtorResult.rows[0].id;

      // 3. TRANSACTION: Siz haqdor bo'lgan va ushbu debtor qarzdor bo'lgan barcha splitslarni yopamiz
      // Muhim: Faqat siz payer bo'lgan xarajatlardagi ushbu userning ulushlarini yopadi
      await pool.query(
        `
      UPDATE expense_splits 
      SET is_paid = TRUE 
      WHERE user_id = $1 
      AND expense_id IN (SELECT id FROM expenses WHERE payer_id = $2)
      AND is_paid = FALSE`,
        [debtorId, creditorId],
      );

      res.json({
        success: true,
        message: `${debtor_full_name} bilan hisob-kitob yopildi!`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "To'lovni tasdiqlashda xatolik" });
    }
  }
  async updateCardNumber(req, res) {
    const { user_id, card_number } = req.body;

    if (!user_id || !card_number) {
      return res.status(400).json({ message: "user_id va card_number kerak" });
    }

    try {
      const result = await pool.query(
        `UPDATE users SET card_number = $1 WHERE id = $2 RETURNING *`,
        [card_number, user_id],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User topilmadi" });
      }

      res.json({ message: "Card number yangilandi", user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server xatosi" });
    }
  }
}

export default new ExpenseController();

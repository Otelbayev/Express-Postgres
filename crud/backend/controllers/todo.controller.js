import pool from "../config/db.js";

class TodoController {
  async create(req, res) {
    try {
      const { description, completed } = req.body;

      if (!description) {
        return res.status(400).json({ message: "All fielda are required" });
      }

      const newTodo = await pool.query(
        "INSERT INTO todo (description, completed) VALUES ($1,$2) RETURNING *",
        [description, completed || false],
      );

      res.status(201).json(newTodo.rows[0]);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async get(req, res) {
    try {
      const allTodos = await pool.query("SELECT * FROM todo");
      res.json(allTodos.rows);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const { completed, description } = req.body;
      if (!description) {
        return res.status(400).json({ message: "All fielda are required" });
      }

      const updatedTodo = await pool.query(
        "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
        [description, completed || false, id],
      );

      if (updatedTodo.rowCount === 0) {
        return res.status(404).json({ message: "Todo Not found" });
      }
      res.status(200).json({
        message: "Todo Updated",
        todo: updatedTodo.rows[0],
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleteTodo = await pool.query(
        "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
        [id],
      );

      if (deleteTodo.rowCount === 0) {
        res.status(404).json({ message: "Todo not found" });
      }
      res.status(200).json({
        message: "Todo was deleted!",
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new TodoController();

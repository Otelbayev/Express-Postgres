import { Router } from "express";
import expenseController from "../controllers/expense.controller.js";

const router = Router();

router.post("/create", expenseController.createExpense);
router.get("/balance/:telegram_id", expenseController.getBalance);
router.post("/confirm-payment", expenseController.confirmPayment);
router.post("/update-card-number", expenseController.updateCardNumber);
router.get("/archive/:telegram_id", expenseController.getArchive);

export default router;

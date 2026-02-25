import { Router } from "express";
import expenseRouter from "./expense.route.js";

const router = Router();

router.use("/expense", expenseRouter);

export default router;

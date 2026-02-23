import { Router } from "express";
import todoController from "../controllers/todo.controller.js";

const router = Router();

router.post("/", todoController.create);
router.get("/", todoController.get);
router.put("/:id", todoController.update);
router.delete("/:id", todoController.delete);

export default router;

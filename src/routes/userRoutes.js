import express from "express";
import { getUsers, createUser, getUserById, updateUser, deleteUser, toggleActive,} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate,getUsers);
router.get("/:id",authenticate,getUserById);
router.post("/", authenticate,createUser);   
router.put("/:id", authenticate, updateUser);
router.patch("/toggle-active/:id", toggleActive);
router.delete("/:id", authenticate, deleteUser);
router.get("/:id", authenticate, getUserById);

export default router;
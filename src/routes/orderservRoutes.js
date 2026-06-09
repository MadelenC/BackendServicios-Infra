import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderservcontroller.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();



router.get("/",authenticate, getOrders);            
router.get("/:id",authenticate,  getOrderById);      
router.post("/", authenticate, createOrder);         
router.put("/:id", authenticate, updateOrder);       
router.delete("/:id",authenticate,  deleteOrder);    

export default router;
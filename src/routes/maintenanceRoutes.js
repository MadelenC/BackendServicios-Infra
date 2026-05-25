import { Router } from "express";
import {
  getMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getTalleres,
} from "../controllers/maintenanceController.js";

const router = Router();
router.get("/talleres", getTalleres);
router.get("/", getMaintenances);
router.get("/:id", getMaintenanceById);
router.post("/", createMaintenance);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);


export default router;
import { Router } from "express";
import {
  getMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getTalleres,
  getMyInstitutionMaintenances,
} from "../controllers/maintenanceController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = Router();
router.get("/talleres", getTalleres);
router.get( "/my-institutions", authenticate, getMyInstitutionMaintenances);
router.get("/", getMaintenances);
router.get("/:id", getMaintenanceById);
router.post("/", createMaintenance);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);


export default router;
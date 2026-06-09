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
router.get("/talleres",authenticate, getTalleres);
router.get( "/my-institutions", authenticate, getMyInstitutionMaintenances);
router.get("/",authenticate, getMaintenances);
router.get("/:id", authenticate,getMaintenanceById);
router.post("/", authenticate,createMaintenance);
router.put("/:id",authenticate, updateMaintenance);
router.delete("/:id",authenticate, deleteMaintenance);


export default router;
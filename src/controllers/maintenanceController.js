// src/controllers/maintenanceController.js
import * as maintenanceService from "../services/maintenanceService.js";


export const getMaintenances =
  async (req, res) => {

    try {

      const {
        page = 1,
        limit = 8,
        search = "",
        taller = "",
        institution = "",
        aprobacion = "",
      } = req.query;

      const data =
        await maintenanceService
          .getAllMaintenances({
            page: Number(page),
            limit: Number(limit),
            search,
            taller,
            institution,
            aprobacion,
          });

      res.json(data);

    } catch (err) {

      res.status(500).json({
        error: err.message,
      });

    }

};

export const getTalleres = async (req, res) => {
  try {
    const data =
      await maintenanceService.getAllTalleres();
   res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

};

export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await maintenanceService.getMaintenanceById(
      Number(req.params.id)
    );
    res.json(maintenance);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};


export const createMaintenance = async (req, res) => {
  try {
    const nuevo = await maintenanceService.createMaintenance(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateMaintenance = async (req, res) => {
  try {
    const actualizado = await maintenanceService.updateMaintenance(
      Number(req.params.id),
      req.body
    );
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteMaintenance = async (req, res) => {
  try {
    await maintenanceService.deleteMaintenance(Number(req.params.id));
    res.json({ message: "Mantenimiento eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
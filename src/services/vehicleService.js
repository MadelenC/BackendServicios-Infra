import { vehicleRepository } from "../repositories/vehicleRepository.js";


export const getAllVehicles = async ({ page = 1, limit = 10, estado }) => {
  const query = vehicleRepository.createQueryBuilder("v");

  if (estado) {
    query.where("v.estado = :estado", { estado });
  }

  query.orderBy("v.id", "DESC");
  query.skip((page - 1) * limit).take(limit);

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
  };
};


export const getVehicleById = async (id) => {
  const vehicle = await vehicleRepository.findOne({
    where: { id },
  });

  if (!vehicle) throw new Error("Vehículo no encontrado");

  return vehicle;
};


export const createVehicle = async (data) => {
  const newVehicle = vehicleRepository.create({
    codigo: data.codigo,
    placa: data.placa,
    color: data.color,
    pasajeros: data.pasajeros,
    tipog: data.tipog,
    estado: data.estado,
    combustible: data.combustible,
    created_at: new Date(),
    updated_at: new Date(),
  });

  return await vehicleRepository.save(newVehicle);
};



export const updateVehicle = async (id, data) => {
  const vehicle = await vehicleRepository.findOne({
    where: { id },
  });

  if (!vehicle) throw new Error("Vehículo no encontrado");

  vehicleRepository.merge(vehicle, {
    codigo: data.codigo,
    placa: data.placa,
    color: data.color,
    pasajeros: data.pasajeros,
    tipog: data.tipog,
    estado: data.estado,
    combustible: data.combustible,
    updated_at: new Date(),
  });

  return await vehicleRepository.save(vehicle);
};


export const deleteVehicle = async (id) => {
  const vehicle = await vehicleRepository.findOne({
    where: { id },
  });

  if (!vehicle) throw new Error("Vehículo no encontrado");

  return await vehicleRepository.remove(vehicle);
};

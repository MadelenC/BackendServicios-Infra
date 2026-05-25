// src/services/institutionService.js
import { institutionRepository } from "../repositories/institutionRepository.js";

// Obtener todas las instituciones
export const getAllInstitutions = async ({
  page = 1,
  limit = 8,
  search = "",
  institution = "",
}) => {

  const query =
    institutionRepository
      .createQueryBuilder("institution")

      .leftJoinAndSelect(
        "institution.maintenances",
        "maintenances"
      );

  // SEARCH
  if (search) {

    query.andWhere(

      "LOWER(institution.nombre) LIKE LOWER(:search)",

      {
        search: `%${search}%`,
      }

    );

  }

  // FILTRO ID
  if (institution) {

    query.andWhere(
      "institution.id = :institution",
      {
        institution,
      }
    );

  }

  query
    .orderBy("institution.id", "DESC")
    .skip((page - 1) * limit)
    .take(limit);

  const [institutions, total] =
    await query.getManyAndCount();

  return {

    institutions,

    total,

    page: Number(page),

    limit: Number(limit),

    totalPages: Math.ceil(
      total / limit
    ),

  };

};

// Obtener por ID
export const getInstitutionById = async (id) => {
  const institution = await institutionRepository.findOne({
    where: { id },
    relations: ["maintenances"], // opcional
  });
  if (!institution) throw new Error("Institution no encontrada");
  return institution;
};

// Crear
export const createInstitution = async (data) => {
  const nuevo = institutionRepository.create({
    nombre: data.nombre,
  });

  return await institutionRepository.save(nuevo);
};

// Actualizar
export const updateInstitution = async (id, data) => {
  const institution = await institutionRepository.findOneBy({ id });
  if (!institution) throw new Error("Institution no encontrada");

  institutionRepository.merge(institution, data);
  return await institutionRepository.save(institution);
};

// Eliminar
export const deleteInstitution = async (id) => {
  const institution = await institutionRepository.findOneBy({ id });
  if (!institution) throw new Error("Institution no encontrada");

  return await institutionRepository.remove(institution);
};
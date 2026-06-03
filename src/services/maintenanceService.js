import { maintenanceRepository } from "../repositories/maintenanceRepository.js";
import { userRepository } from "../repositories/userRepository.js";


export const getAllMaintenances = async ({
  page = 1,
  limit = 8,
  search = "",
  taller = "",
  institution = "",
  aprobacion = "",
}) => {
  const query =maintenanceRepository
      .createQueryBuilder("m")
      .leftJoinAndSelect( "m.user", "user" )
      .leftJoinAndSelect(
        "m.institucion",
        "institucion"
      );

  
  if (search) {

    query.andWhere(

      `(
        LOWER(m.responsable)
        LIKE LOWER(:search)

        OR

        LOWER(m.encar)
        LIKE LOWER(:search)
      )`,

      {
        search: `%${search}%`,
      }

    );

  }


  if (taller) {
    query.andWhere(
      `
      LOWER(m.taller)
      LIKE LOWER(:taller)
      `,

      {
        taller: `%${taller}%`,
      }

    );

  }

  if (institution) {
    query.andWhere(   "institucion.id = :institution",{  institution,      }
    );
  }
  if (aprobacion) {

  query.andWhere(
    "LOWER(TRIM(m.aprobacion)) = LOWER(TRIM(:aprobacion))",
    { aprobacion }
  );

}

  query.orderBy("m.id", "DESC");
  query.skip((page - 1) * limit);
  query.take(limit);
  const [data, total] =await query.getManyAndCount();
  return {
    maintenances: data,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(
      total / limit
    ),
  };
};

export const getAllTalleres = async () => {

  const result =
    await maintenanceRepository
      .createQueryBuilder("m")
      .select("DISTINCT m.taller", "taller")
      .where("m.taller IS NOT NULL")
      .orderBy("m.taller", "ASC")
      .getRawMany();

  return result;
};

export const getMaintenancesByUserInstitutions = async ({
  page = 1,
  limit = 8,
  search = "",
  taller = "",
  aprobacion = "",
  userId,
}) => {
  try {
    const user = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userInstitutions", "ui")
      .leftJoinAndSelect("ui.institution", "institucion")
      .where("user.id = :userId", { userId })
      .getOne();

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const institutionIds =
      user.userInstitutions
        ?.map(ui => ui?.institution?.id)
        ?.filter(Boolean)
        ?.map(Number) || [];

    const query = maintenanceRepository
      .createQueryBuilder("m")
      .leftJoinAndSelect("m.user", "user")
      .leftJoinAndSelect("m.institucion", "institucion");

    if (institutionIds.length > 0) {
      query.andWhere("institucion.id IN (:...institutionIds)", {
        institutionIds,
      });
    }

    if (search?.trim()) {
      query.andWhere(
        `(LOWER(m.responsable) LIKE LOWER(:search)
        OR LOWER(m.encar) LIKE LOWER(:search))`,
        { search: `%${search}%` }
      );
    }

    if (taller?.trim()) {
      query.andWhere("LOWER(m.taller) LIKE LOWER(:taller)", {
        taller: `%${taller}%`,
      });
    }

    if (aprobacion?.trim()) {
      query.andWhere(
        "LOWER(TRIM(m.aprobacion)) = LOWER(TRIM(:aprobacion))",
        { aprobacion }
      );
    }

    query.orderBy("m.id", "DESC");
    query.skip((page - 1) * limit);
    query.take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      maintenances: data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("🔥 ERROR my-institutions:", error);
    throw error;
  }
};


export const getMaintenanceById = async (id) => {
  const maintenance = await maintenanceRepository.findOne({
    where: { id },
    relations: ["user", "institucion"], 
  });

  if (!maintenance) throw new Error("Mantenimiento no encontrado");
  return maintenance;
};


export const createMaintenance = async (data) => {
  const nuevo = maintenanceRepository.create({
    equipo: data.equipo,
    marca: data.marca,
    modelo: data.modelo,
    numero: data.numero,
    codigo: data.codigo,
    otros: data.otros,
    encar: data.encar,
    taller: data.taller,
    descripcion: data.descripcion,
    aprobacion: data.aprobacion,
    fecha: data.fecha,
    fecha_inicio: data.fecha_inicio,
    fecha_final: data.fecha_final,
    responsable: data.responsable,
    informe: data.informe,
    cumplido: data.cumplido,
    id_nro: data.id_nro,

    
    user: data.user_id ? { id: data.user_id } : null,
    institucion: data.institucion_id ? { id: data.institucion_id } : null,
     created_at: new Date(),
    updated_at: new Date(),
  });

  return await maintenanceRepository.save(nuevo);
};


export const updateMaintenance = async (id, data) => {

  const maintenance =
    await maintenanceRepository.findOne({
      where: { id },
      relations: ["user", "institucion"],
    });

  if (!maintenance) {
    throw new Error("Mantenimiento no encontrado");
  }

  maintenanceRepository.merge(maintenance, data);

  return await maintenanceRepository.save(maintenance);
};

export const deleteMaintenance = async (id) => {
  const maintenance = await maintenanceRepository.findOneBy({ id });
  if (!maintenance) throw new Error("Mantenimiento no encontrado");

  return await maintenanceRepository.remove(maintenance);
};
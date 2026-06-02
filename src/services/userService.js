import { userRepository } from "../repositories/userRepository.js";
import { entidadesRepository } from "../repositories/entidadesRepository.js";
import { maintenanceRepository } from "../repositories/maintenanceRepository.js";
import { userInstitutionRepository } from "../repositories/userInstitutionRepository.js";
import bcrypt from "bcrypt";


export const getAllUsers = async ({
  page,
  limit,
  search,
  role,
}) => {

  const query =
    userRepository
      .createQueryBuilder("user")

      .leftJoinAndSelect(
        "user.entidades",
        "entidades"
      )
      .leftJoinAndSelect(
        "user.maintenances",
        "maintenances"
      )
  if (search) {
    query.andWhere(

      `(
        LOWER(user.nombres) LIKE LOWER(:search)
        OR LOWER(user.apellidos) LIKE LOWER(:search)
        OR LOWER(user.cedula) LIKE LOWER(:search)
        OR LOWER(user.celular) LIKE LOWER(:search)
      )`,

      {
        search: `%${search}%`,
      }

    );

  }

  
  if (role) {

    query.andWhere(
      "user.tipo = :role",
      { role }
    );

  }

 
  const total =
    await query.getCount();


  query
    .skip((page - 1) * limit)
    .take(limit)

    .orderBy("user.id", "ASC");

  
  const users =
    await query.getMany();

  return {
    users,
    total,
    page,
    limit,
    totalPages:
      Math.ceil(total / limit),
  };
};

export const getUserById = async (id) => {
  return await userRepository.findOne({
    where: { id },
    relations: ["entidades", "maintenances"],
  });
};

export const createUser = async (data) => {
  try {
    const payload = { ...data };


    if (!payload.email) delete payload.email;
    if (!payload.cargo) delete payload.cargo;


    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const userAdd = {
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      cedula: payload.cedula,
      celular: payload.celular,
      email: payload.email,
      tipo: payload.tipo,

   
      insertador: payload.insertador || "DESCONOCIDO",

     
      password: hashedPassword,

      cargo: payload.cargo,
      avatar: payload.avatar || null,
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const user = userRepository.create(userAdd);

const savedUser =
  await userRepository.save(user);

// Registrar instituciones
if (
  payload.instituciones &&
  Array.isArray(payload.instituciones)
) {

  for (const institutionId of payload.instituciones) {

    const relation =
      userInstitutionRepository.create({

        user: savedUser,

        institution: {
          id: institutionId,
        },

        created_at: new Date(),
        updated_at: new Date(),
      });

    await userInstitutionRepository.save(
      relation
    );
  }
}

return savedUser;

  } catch (err) {
    console.error("Error al crear usuario:", err);

    if (err.code === "23505") {
      throw new Error(
        "Ya existe un usuario con algún dato único duplicado (cedula, celular o email)."
      );
    }

    throw new Error("No se pudo crear el usuario. Verifique los datos.");
  }
};


export const updateUser = async (id, data) => {
  try {
    console.log("📥 DATA QUE LLEGA:", data);

    const user = await userRepository.findOne({
      where: { id },
      relations: ["entidades"],
    });

    if (!user) {
      throw { status: 404, message: "Usuario no encontrado" };
    }

    const { entidades, ...userData } = data;

    console.log("👤 USER DATA:", userData);
    console.log("🏢 ENTIDADES:", entidades);

    if (!userData.password) {
      delete userData.password;
    }

    
    userRepository.merge(user, userData);
    await userRepository.save(user);

    
    if (Array.isArray(entidades)) {
      for (const eData of entidades) {

        console.log("➡️ PROCESANDO ENTIDAD:", eData);

        let entidad;

        if (eData.id) {
          entidad = await entidadesRepository.findOneBy({ id: eData.id });

          if (!entidad) {
            throw {
              status: 404,
              message: `Entidad ${eData.id} no encontrada`,
            };
          }

          entidadesRepository.merge(entidad, {
            ...eData,
            updated_at: new Date(), 
          });

        } else {
          entidad = entidadesRepository.create({
            ...eData,
            user,

            
            created_at: new Date(),
            updated_at: new Date(),
          });
        }

        console.log("💾 GUARDANDO ENTIDAD...");
        await entidadesRepository.save(entidad);
      }
    }

    
    const updatedUser = await userRepository.findOne({
      where: { id },
      relations: ["entidades"],
    });

    console.log("✅ USER FINAL:", updatedUser);

    return {
      ok: true,
      id: updatedUser.id,
      nombres: updatedUser.nombres,
      apellidos: updatedUser.apellidos,
      tipo: updatedUser.tipo,
      cedula: updatedUser.cedula,
      celular: updatedUser.celular,
      email: updatedUser.email,
      cargo: updatedUser.cargo,
      avatar: updatedUser.avatar,
      insertador: updatedUser.insertador,

      entidades: updatedUser.entidades?.map(e => ({
        id: e.id,
        facultad: e.facultad,
        carrera: e.carrera,
        materia: e.materia,
        sigla: e.sigla,
        
      })),
    };

  } catch (err) {
    console.error("❌ ERROR REAL EN UPDATE:", err);
    throw err;
  }
};

export const updateAvatar = async (id, avatarUrl) => {

  const user = await userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw {
      status: 404,
      message: "Usuario no encontrado",
    };
  }

  user.avatar = avatarUrl;
  user.updated_at = new Date();

  await userRepository.save(user);

  return {
    avatar: user.avatar,
  };
};

export const updateAvatar = async (id, avatarUrl) => {

  const user = await userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw {
      status: 404,
      message: "Usuario no encontrado",
    };
  }

  user.avatar = avatarUrl;
  user.updated_at = new Date();

  await userRepository.save(user);

  return {
    avatar: user.avatar,
  };
};


export const deleteUser = async (id) => {
  const user = await userRepository.findOne({
    where: { id },
    relations: ["entidades", "maintenances"],
  });

  if (!user) throw { status: 404, message: "Usuario no encontrado" };

  try {
    return await userRepository.remove(user);
  } catch (err) {
    throw { status: 500, message: "Error al eliminar usuario" };
  }
};


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

  const query = userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect(  "user.entidades",  "entidades" )
      .leftJoinAndSelect( "user.maintenances",  "maintenances" )
      .leftJoinAndSelect("user.userInstitutions","userInstitutions")
      .leftJoinAndSelect( "userInstitutions.institution", "institution" );

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
      "user.tipo_serv = :role",
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
    relations: [ "entidades","maintenances","userInstitutions", "userInstitutions.institution"]
  });
};

export const createUser = async (data) => {
  try {
    const payload = { ...data };
    const cedula = payload.cedula?.toString().trim();
     const existingUser = await userRepository.findOne({
        where: { cedula },
     });
      if (existingUser) {
      throw {
        status: 400,
        message: "La cédula ya está registrada",
      };
    }

    if (!payload.email) delete payload.email;
    if (!payload.cargo) delete payload.cargo;


    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const userAdd = {
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      cedula: payload.cedula,
      celular: payload.celular,
      email: payload.email,
      tipo: "ninguno",
      tipo_serv: payload.tipo_serv,
      insertador: payload.insertador || "DESCONOCIDO", 
      password: hashedPassword,
      cargo: payload.cargo,
      avatar: payload.avatar || null,
      active: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const user = userRepository.create(userAdd);

const savedUser =  await userRepository.save(user);

// Registrar instituciones
if (
  payload.instituciones &&
  Array.isArray(payload.instituciones)
) {

  for (const institutionId of payload.instituciones) {

    const relation =   userInstitutionRepository.create({
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

    throw new Error("No se pudo crear el usuario. Verifique que la cedula no este duplicada");
  }
};


export const updateUser = async (id, data) => {
  try {

    const user = await userRepository.findOne({
      where: { id },
      relations: [
        "entidades",
        "maintenances",
        "userInstitutions",
        "userInstitutions.institution",
      ],
    });

    if (!user) {
      throw {
        status: 404,
        message: "Usuario no encontrado",
      };
    }


    const { entidades, instituciones, ...userData } = data;

    if (!userData.password) {
      delete userData.password;
    }

    userRepository.merge(user, userData);

    await userRepository.save(user);

    if (Array.isArray(instituciones)) {

      await userInstitutionRepository.delete({
        user: { id: user.id },
      });

 
      for (const institutionId of instituciones) {

        const relation =  userInstitutionRepository.create({
            user,
            institution: {  id: institutionId, },
            active: true,
            created_at: new Date(),
            updated_at: new Date(),
          });

        await userInstitutionRepository.save(
          relation
        );
      }
    }


    if (Array.isArray(entidades)) {

      for (const eData of entidades) {


        let entidad;

        if (eData.id) {

          entidad =
            await entidadesRepository.findOneBy({
              id: eData.id,
            });

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


        await entidadesRepository.save(entidad);
      }
    }

  
    

    const updatedUser = await userRepository.findOne({
      where: { id },
      relations: [
        "entidades",
        "userInstitutions",
        "userInstitutions.institution",
      ],
    });


    return {
      ok: true,
      id: updatedUser.id,
      nombres: updatedUser.nombres,
      apellidos: updatedUser.apellidos,
      tipo: updatedUser.tipo,
      tipo_serv: updatedUser.tipo_serv,
      cedula: updatedUser.cedula,
      celular: updatedUser.celular,
      email: updatedUser.email,
      cargo: updatedUser.cargo,
      avatar: updatedUser.avatar,
      insertador: updatedUser.insertador,
      institutions:
        updatedUser.userInstitutions?.map((ui) => ({

          id: ui.institution.id,
          nombre: ui.institution.nombre,
          active: ui.active,

        })) || [],

      entidades:  updatedUser.entidades?.map((e) => ({
          id: e.id,
          facultad: e.facultad,
          carrera: e.carrera,
          materia: e.materia,
          sigla: e.sigla,

        })) || [],

    };

  } catch (err) {
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

export const toggleUserInstitution = async (userId) => {
  const relations =await userInstitutionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ["user"],
    });

  if (!relations.length) {
    throw {
      status: 404,
      message: "Relación no encontrada",
    };
  }

  for (const relation of relations) {

    relation.active =
      !relation.active;

    relation.updated_at =
      new Date();

    await userInstitutionRepository.save(
      relation
    );
  }

  return {
    ok: true,
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


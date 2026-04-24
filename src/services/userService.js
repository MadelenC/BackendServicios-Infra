import { userRepository } from "../repositories/userRepository.js";
import { entidadesRepository } from "../repositories/entidadesRepository.js";
import { maintenanceRepository } from "../repositories/maintenanceRepository.js";
import bcrypt from "bcrypt";

// 📌 GET ALL USERS
export const getAllUsers = async () => {
  return await userRepository.find({
    relations: ["entidades", "maintenances"],
  });
};

// 📌 GET USER BY ID
export const getUserById = async (id) => {
  return await userRepository.findOne({
    where: { id },
    relations: ["entidades", "maintenances"],
  });
};

// 📌 CREATE USER (CORREGIDO CON BCRYPT)
export const createUser = async (data) => {
  try {
    const payload = { ...data };

    // limpiar opcionales
    if (!payload.email) delete payload.email;
    if (!payload.cargo) delete payload.cargo;

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const userAdd = {
      nombres: payload.nombres,
      apellidos: payload.apellidos,
      cedula: payload.cedula,
      celular: payload.celular,
      email: payload.email,
      tipo: payload.tipo,

      // 🔥 insertador desde frontend (usuario logueado)
      insertador: payload.insertador || "DESCONOCIDO",

      // 🔐 PASSWORD CIFRADO
      password: hashedPassword,

      cargo: payload.cargo,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const user = userRepository.create(userAdd);
    return await userRepository.save(user);

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

// 📌 UPDATE USER
export const updateUser = async (id, data) => {
  const user = await userRepository.findOne({
    where: { id },
    relations: ["entidades", "maintenances"],
  });

  if (!user) throw { status: 404, message: "Usuario no encontrado" };

  userRepository.merge(user, data);

  if (data.entidades && Array.isArray(data.entidades)) {
    user.entidades = await Promise.all(
      data.entidades.map(async (eData) => {
        let ent;

        if (eData.id) {
          ent = await entidadesRepository.findOneBy({ id: eData.id });

          if (!ent) {
            throw {
              status: 404,
              message: `Entidad con id ${eData.id} no encontrada`,
            };
          }

          entidadesRepository.merge(ent, eData);
          await entidadesRepository.save(ent);
        } else {
          ent = entidadesRepository.create({ ...eData, user });
          await entidadesRepository.save(ent);
        }

        return ent;
      })
    );
  }

  try {
    return await userRepository.save(user);
  } catch (err) {
    if (err.code === "23505") {
      const field = err.detail?.match(/\((.+)\)/)?.[1];
      throw {
        status: 400,
        message: `Ya existe un registro con el mismo ${field}`,
      };
    }

    throw { status: 500, message: "Error al actualizar usuario" };
  }
};

// 📌 DELETE USER
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


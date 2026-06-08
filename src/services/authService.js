import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';

const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';

export const authService = {
  register: async (userData) => {
    const { email, password } = userData;
    
    if (!email || !password) throw new Error('Email and password are required');
    

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await userRepository.save(newUser); 

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  login: async ({ cedula, password }) => {
  const user = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.userInstitutions", "ui")
    .leftJoinAndSelect("ui.institution", "institution")
    .where("user.cedula = :cedula", { cedula })
    .getOne();

  if (!user) {
    throw new Error("Invalid Ci or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error("Invalid Ci or password");
  }
  const hasActiveInstitution = user.userInstitutions?.some(
    (ui) => ui.active === true
  );

  if (!hasActiveInstitution) {
    throw new Error("Usuario inactivo o sin instituciones activas contactese con el administrador");
  }

  const token = jwt.sign(
    { id: user.id, cedula: user.cedula },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  const { password: _, ...cleanUser } = user;

  return {
    user: {
      ...cleanUser,
      role: user.tipo_serv,
      institutions: user.userInstitutions?.map(ui => ui.institution) || []
    },
    token
  };
},
  getByCi: async (ci) => {
    const user = await userRepository.findOneBy({ cedula: ci });
    return user;
  },

  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },

};

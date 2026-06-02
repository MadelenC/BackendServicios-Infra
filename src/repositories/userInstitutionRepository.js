import { AppDataSource } from "../config/data-source.js";
import { UserInstitution } from "../models/UserInstitution.js";

export const userInstitutionRepository =
  AppDataSource.getRepository(UserInstitution);
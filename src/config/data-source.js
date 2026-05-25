import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Maintenance } from "../models/Maintenance.js";
import { Institution } from "../models/Institution.js";
import { Entidades } from "../models/entidades.js";
import { application } from "../models/Application.js";
import {Requests} from "../models/Requests.js";
import {Pedidoserv}from "../models/Orderserv.js"
import { Vehiculos } from "../models/vehicle.js";
import { Accessories} from "../models/Accessories.js"; 

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, 
  logging: false,                           
  poolSize:10,
  extra:{
    max:10
  },
  entities: [
    User, 
    Entidades, 
    application,
    Maintenance,
    Institution,
    Requests,
    Pedidoserv,
    Vehiculos,
    Accessories
  ],   
});

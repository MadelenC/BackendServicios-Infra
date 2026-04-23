import { AppDataSource } from "../config/data-source.js";
import { Pedidoserv } from "../models/Orderserv.js";

export const PedidoservRepository = AppDataSource.getRepository(Pedidoserv);
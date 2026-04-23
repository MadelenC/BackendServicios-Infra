import { PedidoservRepository } from "../repositories/orderservRepository.js";


export const getAllOrders = async () => {
  return await PedidoservRepository.find();
};


export const getOrderById = async (id) => {
  const order = await PedidoservRepository.findOneBy({ id });

  if (!order) throw new Error("Orden no encontrada");
  return order;
};


export const createOrder = async (data) => {
  const nuevo = PedidoservRepository.create({
    man_id: data.man_id,
    ins_id: data.ins_id,
    taller: data.taller,

    // datos de control
    estado: data.estado || "pendiente",
    aprobacion: data.aprobacion || "pendiente",

    encargado: data.encargado,
    jefe: data.jefe,

    // SIN RELACIÓN (solo campo normal)
    user_id: data.user_id || null,
  });

  return await PedidoservRepository.save(nuevo);
};


export const updateOrder = async (id, data) => {
  const order = await PedidoservRepository.findOneBy({ id });

  if (!order) throw new Error("Orden no encontrada");

 PedidoservRepository.merge(order, {
    ...data,

    // asegurar que no se rompa el user_id
    user_id: data.user_id ?? order.user_id,
  });

  return await PedidoservRepository.save(order);
};


export const deleteOrder = async (id) => {
  const order = await PedidoservRepository.findOneBy({ id });

  if (!order) throw new Error("Orden no encontrada");

  return await PedidoservRepository.remove(order);
};
import { PedidoservRepository } from "../repositories/orderservRepository.js";
import { maintenanceRepository } from "../repositories/maintenanceRepository.js";

export const getAllOrders = async ({
  page = 1,
  limit = 8,
  search = "",
  taller = "",
  institution = "",
}) => {

 const query = PedidoservRepository
  .createQueryBuilder("p")
  .leftJoin(
    "mantenimiento",
    "m",
    "m.id = CAST(p.man_id AS INTEGER)"
  )
  .select([
    "p",
    "m.descripcion AS descripcion"
  ]);

  
  if (search) {

    query.andWhere(
      `
      (
        CAST(p.id AS TEXT) LIKE :search
        OR LOWER(p.taller) LIKE LOWER(:search)
      )
      `,
      {
        search: `%${search}%`,
      }
    );
  }

  
  if (taller) {

    query.andWhere(
      `
      LOWER(p.taller)
      LIKE LOWER(:taller)
      `,
      {
        taller: `%${taller}%`,
      }
    );
  }

  
  if (institution) {

    query.andWhere(
      "p.ins_id = :institution",
      {
        institution,
      }
    );
  }



  query.orderBy("p.id", "DESC");

  query.skip((page - 1) * limit);

  query.take(limit);

  const resultRaw = await query.getRawMany();

  const total = await query.getCount();

  const result = resultRaw.map(r => ({
  id: r.p_id,
  man_id: r.p_man_id,
  ins_id: r.p_ins_id,
  taller: r.p_taller,
  estado: r.p_estado,
  aprobacion: r.p_aprobacion,
  descripcion: r.descripcion,

}));

  return {
    orders: result,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
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


    estado: data.estado || "pendiente",
    aprobacion: data.aprobacion || "pendiente",

    encargado: data.encargado,
    jefe: data.jefe,

   
    user_id: data.user_id || null,
  });

  return await PedidoservRepository.save(nuevo);
};


export const updateOrder = async (id, data) => {
  const order = await PedidoservRepository.findOneBy({ id });

  if (!order) throw new Error("Orden no encontrada");

 PedidoservRepository.merge(order, {
    ...data,

    
    user_id: data.user_id ?? order.user_id,
  });

  return await PedidoservRepository.save(order);
};


export const deleteOrder = async (id) => {
  const order = await PedidoservRepository.findOneBy({ id });

  if (!order) throw new Error("Orden no encontrada");

  return await PedidoservRepository.remove(order);
};
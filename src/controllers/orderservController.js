import * as orderservService from "../services/orderservService.js";


export const getOrders = async (req, res) => {
  try {
    const orders = await orderservService.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await orderservService.getOrderById(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};


export const createOrder = async (req, res) => {
  try {
    const resultado = await orderservService.createOrder(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateOrder = async (req, res) => {
  try {
    const resultado = await orderservService.updateOrder(
      parseInt(req.params.id),
      req.body
    );

    if (!resultado) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const resultado = await orderservService.deleteOrder(
      parseInt(req.params.id)
    );

    if (!resultado) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ message: "Orden eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
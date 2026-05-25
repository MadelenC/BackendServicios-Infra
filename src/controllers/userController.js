import * as userService from "../services/userService.js";

export const getUsers = async (req, res) => {

  try {

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 8;

    const search =
      req.query.search || "";

    const role =
      req.query.role || "";

    const result =
      await userService.getAllUsers({

        page,

        limit,

        search,

        role,

      });

    res.json(result);

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//desde aqui 
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if(!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if(!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if(!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
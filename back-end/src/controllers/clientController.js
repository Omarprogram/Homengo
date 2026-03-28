import Client from "../models/Client.js";

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate("userId");
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

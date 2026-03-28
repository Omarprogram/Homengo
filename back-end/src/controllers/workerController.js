import Worker from "../models/Worker.js";

export const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate("userId")
      .populate({ path: "professionId", populate: { path: "categoryId" } });
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

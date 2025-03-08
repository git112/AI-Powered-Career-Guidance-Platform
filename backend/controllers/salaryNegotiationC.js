import SalaryNegotiation from "../models/SalaryNegotiation.js"

export const getSalaryNegotiation = async (req, res) => {
  try {
    const negotiation = await SalaryNegotiation.findOne({ userId: req.params.userId });
    if (!negotiation) return res.status(404).json({ message: "Negotiation data not found" });
    res.json(negotiation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

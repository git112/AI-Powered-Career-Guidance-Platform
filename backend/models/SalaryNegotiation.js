import mongoose from "mongoose";

const SalaryNegotiationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobTitle: { type: String },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: "IndustryInsight" },
  currentOffer: { type: Number },
  expectedSalary: { type: Number },
  negotiationTips: { type: String }
}, { timestamps: true });

export default mongoose.model("SalaryNegotiation", SalaryNegotiationSchema);

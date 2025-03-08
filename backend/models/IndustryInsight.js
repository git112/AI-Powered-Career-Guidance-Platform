import mongoose from "mongoose";

const IndustryInsightSchema = new mongoose.Schema({
  industry: { type: String, unique: true },
  salaryRanges: [{ level: String, minSalary: Number, maxSalary: Number }],
  growthRate: { type: Number },
  demandLevel: { type: String },
  topSkills: { type: [String] },
  marketOutlook: { type: String },
  keyTrends: { type: [String] },
  recommendedSkills: { type: [String] },
  lastUpdated: { type: Date, default: Date.now },
  nextUpdate: { type: Date }
});

export default mongoose.model("IndustryInsight", IndustryInsightSchema);

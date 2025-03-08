import mongoose from "mongoose";

const JobRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobTitle: { type: String, required: true },
  companyName: { type: String },
  location: { type: String },
  salaryRange: { type: Number },
  jobUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("JobRecommendation", JobRecommendationSchema);

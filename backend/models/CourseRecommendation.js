import mongoose from "mongoose";

const CourseRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseName: { type: String, required: true },
  provider: { type: String },
  skillImproved: { type: String },
  courseUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("CourseRecommendation", CourseRecommendationSchema);

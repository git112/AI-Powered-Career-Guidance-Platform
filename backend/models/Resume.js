import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  atsScore: { type: Number },
  feedback: { type: String },
}, { timestamps: true });

export default mongoose.model("Resume", ResumeSchema);

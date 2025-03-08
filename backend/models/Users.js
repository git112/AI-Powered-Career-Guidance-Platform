import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  imageUrl: { type: String },
  industry: { type: mongoose.Schema.Types.ObjectId, ref: "Industry" },
  location: { type: String },
  bio: { type: String },
  experience: { type: Number },
  skills: { type: [String] },
  competencyScore: { type: Number },
  preferredRoles: { type: [String] },
  salaryExpectation: { type: Number },
}, { timestamps: true });

export default mongoose.model("User", UserSchema);

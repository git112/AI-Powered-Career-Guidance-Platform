import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    select: false,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  
  industry: {
    type: String,
    trim: true,
  },
  subIndustry: {
    type: String,
    trim: true,
  },
  experience: {
    type: Number,
    min: 0,
    max: 50,
  },
  skills: [String],
  bio: {
    type: String,
    trim: true,
  },
  industryInsight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IndustryInsight",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedTests: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompTest'
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", UserSchema);
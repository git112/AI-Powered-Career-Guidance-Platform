import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: function() {
      return !this.googleId; // Password is required only if not using Google auth
    }
  },
  name: { 
    type: String,
    trim: true 
  },
  imageUrl: { type: String },
  industry: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Industry" 
  },
  location: { type: String },
  bio: { 
    type: String,
    maxlength: 500 
  },
  experience: { 
    type: Number,
    min: 0,
    max: 50
  },
  skills: { 
    type: [String],
    default: [] 
  },
  competencyScore: { 
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  preferredRoles: { 
    type: [String],
    default: []
  },
  salaryExpectation: { 
    type: Number,
    min: 0
  },
  googleId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Remove clerkUserId as it's not being used with your current auth system

export default mongoose.model("User", UserSchema);

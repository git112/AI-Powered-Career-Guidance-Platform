import mongoose from "mongoose";

const CourseRecommendationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  courseName: { 
    type: String, 
    required: true,
    trim: true 
  },
  
  provider: { 
    type: String,
    required: true,
    trim: true 
  },
  
  skillsImproved: [{ 
    type: String,
    trim: true 
  }],
  
  courseUrl: { 
    type: String,
    required: true 
  },
  
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  
  duration: {
    type: String,
    trim: true
  },
  
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  status: {
    type: String,
    enum: ['New', 'Started', 'Completed', 'Saved'],
    default: 'New'
  }
}, { 
  timestamps: true 
});

export default mongoose.model("CourseRecommendation", CourseRecommendationSchema);

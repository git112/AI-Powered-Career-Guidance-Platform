import mongoose from "mongoose";

const IndustryInsightSchema = new mongoose.Schema({
  industry: { 
    type: String, 
    unique: true,
    required: true,
    trim: true
  },
  salaryRanges: [{ 
    level: String, 
    minSalary: {
      type: Number,
      min: 0
    }, 
    maxSalary: {
      type: Number,
      min: 0
    } 
  }],
  growthRate: { 
    type: Number,
    min: -100,
    max: 100
  },
  demandLevel: { 
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High']
  },
  topSkills: { 
    type: [String],
    default: []
  },
  marketOutlook: { 
    type: String,
    enum: ['Negative', 'Neutral', 'Positive', 'Very Positive']
  },
  keyTrends: { 
    type: [String],
    default: []
  },
  recommendedSkills: { 
    type: [String],
    default: []
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  nextUpdate: { 
    type: Date,
    required: true
  }
});

export default mongoose.model("IndustryInsight", IndustryInsightSchema);

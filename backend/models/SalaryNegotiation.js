import mongoose from "mongoose";

const SalaryNegotiationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  jobTitle: { 
    type: String,
    required: true,
    trim: true
  },
  
  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IndustryInsight"
  },
  
  currentOffer: { 
    type: Number,
    required: true,
    min: 0
  },
  
  expectedSalary: { 
    type: Number,
    required: true,
    min: 0
  },
  
  marketRate: {
    min: { type: Number },
    max: { type: Number }
  },
  
  negotiationTips: [{
    tip: String,
    category: {
      type: String,
      enum: ['Benefits', 'Salary', 'Equity', 'Other']
    }
  }],
  
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Successful', 'Unsuccessful'],
    default: 'Pending'
  },
  
  notes: {
    type: String,
    maxLength: 1000
  },
  
  outcome: {
    finalSalary: Number,
    additionalBenefits: [String],
    negotiationDate: Date
  }
}, { 
  timestamps: true 
});

export default mongoose.model("SalaryNegotiation", SalaryNegotiationSchema);

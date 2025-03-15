// // import mongoose from "mongoose";

// // const IndustryInsightSchema = new mongoose.Schema({
// //   userId: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   industry: { 
// //     type: String, 
// //     required: true,
// //     trim: true
// //   },

// //   marketOverview: {
// //     outlook: String,
// //     growthRate: Number,
// //     demandLevel: String,
// //     marketTrends: [String]
// //   },

// //   salaryInsights: {
// //     ranges: {
// //       entry: String,
// //       mid: String,
// //       senior: String
// //     },
// //     expectedRange: String,
// //     skillPremiums: [String]
// //   },

// //   skillsAnalysis: {
// //     topSkills: [String],
// //     emergingSkills: [String],
// //     skillGaps: [String]
// //   },

// //   careerGrowth: {
// //     nextSteps: [String],
// //     learningPaths: [String],
// //     certifications: [String]
// //   },

// //   marketInsights: {
// //     topCompanies: [{
// //       name: String,
// //       description: String,
// //       rating: Number
// //     }],
// //     keyProjects: [String],
// //     industryLeaders: [String]
// //   },

// //   quickInsights: [{
// //     title: String,
// //     type: String
// //   }],

// //   lastUpdated: { 
// //     type: Date, 
// //     default: Date.now 
// //   },

// //   nextUpdate: {
// //     type: Date,
// //     default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
// //   }
// // }, {
// //   timestamps: true
// // });

// // // Method to check if insights need updating
// // IndustryInsightSchema.methods.needsUpdate = function() {
// //   return new Date() >= this.nextUpdate;
// // };

// // // Method to get formatted salary ranges
// // IndustryInsightSchema.methods.getFormattedSalaryRanges = function() {
// //   return this.salaryRanges.map(range => ({
// //     ...range,
// //     minSalary: range.minSalary / 1000, // Convert to thousands
// //     medianSalary: range.medianSalary / 1000,
// //     maxSalary: range.maxSalary / 1000
// //   }));
// // };

// // // Virtual for time until next update
// // IndustryInsightSchema.virtual('timeUntilUpdate').get(function() {
// //   return this.nextUpdate - new Date();
// // });

// // // Ensure virtuals are included in JSON output
// // IndustryInsightSchema.set('toJSON', { virtuals: true });
// // IndustryInsightSchema.set('toObject', { virtuals: true });

// // export default mongoose.model("IndustryInsight", IndustryInsightSchema);



// import mongoose from "mongoose";

// const IndustryInsightSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   industry: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
  
//   // Fields aligned with frontend expectations
//   industryOverview: {
//     type: String,
//     default: "Industry overview information not available"
//   },
  
//   marketDemand: [{
//     skill: String,
//     demandScore: Number
//   }],
  
//   salaryRanges: [{
//     role: String,
//     minSalary: Number,
//     medianSalary: Number,
//     maxSalary: Number
//   }],
  
//   expectedSalaryRange: {
//     min: Number,
//     max: Number,
//     currency: {
//       type: String,
//       default: 'USD'
//     }
//   },
  
//   skillBasedBoosts: [{
//     skill: String,
//     salaryIncrease: Number
//   }],
  
//   topCompanies: [{
//     name: String,
//     openPositions: Number,
//     roles: [String]
//   }],
  
//   recommendedCourses: [{
//     name: String,
//     platform: String,
//     url: String,
//     skillsCovered: [String]
//   }],
  
//   careerPathInsights: [{
//     title: String,
//     description: String,
//     growthPotential: String
//   }],
  
//   emergingTrends: [{
//     name: String,
//     description: String
//   }],
  
//   quickInsights: [{
//     title: String,
//     type: String
//   }],

//   lastUpdated: { 
//     type: Date, 
//     default: Date.now 
//   },

//   nextUpdate: {
//     type: Date,
//     default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//   }
// }, {
//   timestamps: true
// });

// // Method to check if insights need updating
// IndustryInsightSchema.methods.needsUpdate = function() {
//   return new Date() >= this.nextUpdate;
// };

// // Virtual for time until next update
// IndustryInsightSchema.virtual('timeUntilUpdate').get(function() {
//   return this.nextUpdate - new Date();
// });

// // Ensure virtuals are included in JSON output
// IndustryInsightSchema.set('toJSON', { virtuals: true });
// IndustryInsightSchema.set('toObject', { virtuals: true });

// export default mongoose.model("IndustryInsight", IndustryInsightSchema);


import mongoose from "mongoose";

const IndustryInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  industry: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Fields aligned with frontend expectations
  industryOverview: {
    type: String,
    default: "Industry overview information not available"
  },
  
  marketDemand: [{
    skill: String,
    demandScore: Number
  }],
  
  salaryRanges: [{
    role: String,
    minSalary: Number,
    medianSalary: Number,
    maxSalary: Number
  }],
  
  expectedSalaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  skillBasedBoosts: [{
    skill: String,
    salaryIncrease: Number
  }],
  
  topCompanies: [{
    name: String,
    openPositions: Number,
    roles: [String]
  }],
  
  recommendedCourses: [{
    name: String,
    platform: String,
    url: String,
    skillsCovered: [String]
  }],
  
  careerPathInsights: [{
    title: String,
    description: String,
    growthPotential: String
  }],
  
  emergingTrends: [{
    name: String,
    description: String
  }],
  
  quickInsights: {
    type: [{
      title: String,
      type: String
    }],
    default: []
  },

  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },

  nextUpdate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true
});

// Method to check if insights need updating
IndustryInsightSchema.methods.needsUpdate = function() {
  return new Date() >= this.nextUpdate;
};

// Virtual for time until next update
IndustryInsightSchema.virtual('timeUntilUpdate').get(function() {
  return this.nextUpdate - new Date();
});

// Ensure virtuals are included in JSON output
IndustryInsightSchema.set('toJSON', { virtuals: true });
IndustryInsightSchema.set('toObject', { virtuals: true });

export default mongoose.model("IndustryInsight", IndustryInsightSchema);
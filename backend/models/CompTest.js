import mongoose from "mongoose";

const CompTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  quizScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  questions: [{
    question: String,
    answer: String,
    userAnswer: String,
    isCorrect: Boolean
  }],

  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Behavioral', 'Industry']
  },

  improvementTip: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model("CompTest", CompTestSchema);

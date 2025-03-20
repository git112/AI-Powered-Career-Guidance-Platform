import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowRight, CheckCircle, XCircle, Award, BookOpen, Briefcase, ChevronRight, User, TrendingUp, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompetencyTestUI = ({ quizResult }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('results');
  
  // Sample user data (this would come from your backend)
  const userData = {
    name: "Alex Johnson",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "CSS"],
    experience: 3,
    industry: "Technology",
    subIndustry: "Web Development"
  };
  
  // Default test result data if none is passed
  const testResult = quizResult || {
    quizScore: 78,
    category: 'Technical',
    questions: [
      { question: "What is the primary purpose of React hooks?", answer: "To add state and lifecycle features to functional components", userAnswer: "To add state and lifecycle features to functional components", isCorrect: true },
      { question: "Which of the following is NOT a valid HTTP method?", answer: "PATCH", userAnswer: "CONNECT", isCorrect: false },
      { question: "What does CSS stand for?", answer: "Cascading Style Sheets", userAnswer: "Cascading Style Sheets", isCorrect: true },
      { question: "What is the time complexity of binary search?", answer: "O(log n)", userAnswer: "O(log n)", isCorrect: true },
      { question: "Which of these is not a JavaScript framework?", answer: "Django", userAnswer: "Django", isCorrect: true }
    ],
    improvementTip: "Focus on deepening your understanding of HTTP methods and RESTful API design principles. Consider reviewing the MDN Web Docs on HTTP request methods."
  };
  
  // Generate job recommendations based on test category
  const getJobRecommendations = () => {
    if (testResult.category === 'Technical') {
      return [
        { title: "Frontend Developer", match: 85, missingSkills: ["TypeScript", "Redux"] },
        { title: "MERN Stack Developer", match: 78, missingSkills: ["Express.js", "AWS"] },
        { title: "UI Developer", match: 72, missingSkills: ["Figma", "SASS"] }
      ];
    } else if (testResult.category === 'Behavioral') {
      return [
        { title: "Product Manager", match: 82, missingSkills: ["Agile Methodology", "User Research"] },
        { title: "Team Lead", match: 76, missingSkills: ["Conflict Resolution", "Performance Management"] },
        { title: "Project Coordinator", match: 70, missingSkills: ["Stakeholder Management", "Risk Assessment"] }
      ];
    } else {
      return [
        { title: "Business Analyst", match: 80, missingSkills: ["Data Visualization", "SQL"] },
        { title: "Market Research Analyst", match: 75, missingSkills: ["Statistical Analysis", "Market Trends"] },
        { title: "Sales Representative", match: 68, missingSkills: ["CRM Software", "Negotiation"] }
      ];
    }
  };
  
  // Learning resources based on test category
  const getLearningResources = () => {
    if (testResult.category === 'Technical') {
      return [
        { title: "MDN Web Docs - HTTP Methods", type: "Documentation", difficulty: "Intermediate" },
        { title: "RESTful API Design Best Practices", type: "Article", difficulty: "Advanced" },
        { title: "Complete HTTP Networking Course", type: "Video Course", difficulty: "Beginner to Advanced" }
      ];
    } else if (testResult.category === 'Behavioral') {
      return [
        { title: "Effective Communication in Teams", type: "Workshop", difficulty: "Intermediate" },
        { title: "Leadership Essentials", type: "Book", difficulty: "Beginner" },
        { title: "Conflict Resolution Techniques", type: "Course", difficulty: "Advanced" }
      ];
    } else {
      return [
        { title: "Business Analytics Fundamentals", type: "Course", difficulty: "Beginner" },
        { title: "Market Research Methodologies", type: "Webinar", difficulty: "Intermediate" },
        { title: "Financial Analysis for Non-Finance Professionals", type: "Workshop", difficulty: "Advanced" }
      ];
    }
  };
  
  // Data for the chart
  const chartData = [
    { name: 'Correct', value: testResult.questions.filter(q => q.isCorrect).length },
    { name: 'Incorrect', value: testResult.questions.filter(q => !q.isCorrect).length }
  ];
  
  const COLORS = ['#06b6d4', '#f43f5e']; // Cyan and rose/red
  
  const handleTryAgain = () => {
    navigate('/competency-test/categories');
  };
  
  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black min-h-screen text-white pt-16 pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-cyan-900/30 to-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-50 mb-2 flex items-center">
                <Brain className="mr-3 text-cyan-400" size={28} />
                Competency Test Results
              </h1>
              <h2 className="text-xl text-cyan-300 font-medium">
                {testResult.category} Assessment
              </h2>
            </div>
            <button
              onClick={handleTryAgain}
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white py-2 px-6 rounded-lg flex items-center transition-all shadow-md self-start md:self-auto"
            >
              <User className="mr-2" size={18} />
              Try Another Test
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex mb-6 border-b border-zinc-700 overflow-x-auto">
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'results' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-cyan-200'}`}
            onClick={() => setActiveTab('results')}
          >
            Results
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'recommendations' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-cyan-200'}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Job Matches
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'learning' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-cyan-200'}`}
            onClick={() => setActiveTab('learning')}
          >
            Learning Resources
          </button>
        </div>
        
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Score and Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
                <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                  <Award className="mr-2 text-cyan-400" size={20} />
                  Your Score
                </h3>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-900/20 to-zinc-800/20 border border-zinc-700 flex items-center justify-center text-center">
                      <div>
                        <div className="text-6xl font-bold text-cyan-400">{testResult.quizScore}%</div>
                        <div className="text-cyan-200 mt-2">
                          {testResult.quizScore >= 80 ? 'Excellent!' : 
                           testResult.quizScore >= 60 ? 'Good job!' : 'Keep practicing!'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
                <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                  <TrendingUp className="mr-2 text-cyan-400" size={20} />
                  Results Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Question Details */}
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                <BookOpen className="mr-2 text-cyan-400" size={20} />
                Question Details
              </h3>
              <div className="space-y-4">
                {testResult.questions.map((question, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-gradient-to-r from-zinc-800/30 to-zinc-900/30 rounded-lg border border-zinc-700 hover:border-cyan-500 transition-all"
                  >
                    <div className="flex items-start">
                      {question.isCorrect ? (
                        <CheckCircle className="text-cyan-400 mr-3 mt-1 flex-shrink-0" size={20} />
                      ) : (
                        <XCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" size={20} />
                      )}
                      <div>
                        <p className="font-medium text-cyan-50">{question.question}</p>
                        <p className={`mt-2 ${question.isCorrect ? 'text-cyan-300' : 'text-zinc-400'}`}>
                          Your answer: {question.userAnswer}
                        </p>
                        {!question.isCorrect && (
                          <p className="mt-1 text-rose-300">
                            Correct answer: {question.answer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Improvement Tips */}
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
              <h3 className="text-xl font-semibold text-cyan-50 mb-4 flex items-center">
                <BookOpen className="mr-2 text-cyan-400" size={20} />
                Improvement Tips
              </h3>
              <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-zinc-800/20 rounded-lg border border-cyan-900/30">
                <p className="text-cyan-100">{testResult.improvementTip}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'recommendations' && (
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-50 mb-6 flex items-center">
              <Briefcase className="mr-2 text-cyan-400" size={20} />
              Job Recommendations
            </h3>
            
            <div className="space-y-6">
              {getJobRecommendations().map((job, index) => (
                <div 
                  key={index} 
                  className="border border-zinc-700 hover:border-cyan-500 rounded-lg overflow-hidden transition-all shadow-md"
                >
                  <div className="bg-gradient-to-r from-cyan-900/30 to-zinc-800/30 p-4 flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-cyan-50">{job.title}</h4>
                    <div className="bg-cyan-900/40 text-cyan-300 px-3 py-1 rounded-full font-medium">
                      {job.match}% Match
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-zinc-800/30 to-zinc-900/30">
                    <div className="mb-4">
                      <p className="text-zinc-400 mb-2">
                        <span className="text-cyan-300">Your Skills:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, i) => (
                          <span key={i} className="bg-cyan-900/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-zinc-400 mb-2">
                        <span className="text-cyan-300">Missing Skills:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.missingSkills.map((skill, i) => (
                          <span key={i} className="bg-zinc-800/40 text-zinc-300 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-700">
                      <button className="text-cyan-400 font-medium flex items-center hover:text-cyan-300 transition-colors">
                        View Job Details <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'learning' && (
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-50 mb-6 flex items-center">
              <Award className="mr-2 text-cyan-400" size={20} />
              Recommended Learning Resources
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getLearningResources().map((resource, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 p-5 rounded-lg border border-zinc-700 hover:border-cyan-500 transition-all shadow-md h-full flex flex-col"
                >
                  <h4 className="text-cyan-300 font-medium text-lg mb-2">{resource.title}</h4>
                  <div className="flex justify-between text-zinc-400 mb-4 mt-auto">
                    <span className="bg-zinc-800/40 px-3 py-1 rounded-full text-sm">{resource.type}</span>
                    <span className="bg-cyan-900/20 text-cyan-300 px-3 py-1 rounded-full text-sm">{resource.difficulty}</span>
                  </div>
                  <button className="text-cyan-400 font-medium flex items-center hover:text-cyan-300 transition-colors mt-2">
                    Access Resource <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetencyTestUI;
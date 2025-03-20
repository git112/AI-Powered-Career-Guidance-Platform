import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Users, Briefcase } from 'lucide-react';

const CompetencyCategories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const categories = [
    {
      id: 'technical',
      name: 'Technical Skills',
      icon: <Code size={32} className="text-cyan-400" />,
      description: 'Assess your programming, database, and system architecture knowledge',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'API Design']
    },
    {
      id: 'behavioral',
      name: 'Behavioral Assessment',
      icon: <Users size={32} className="text-cyan-400" />,
      description: 'Evaluate your communication, teamwork, and leadership abilities',
      skills: ['Communication', 'Problem-solving', 'Teamwork', 'Leadership', 'Adaptability']
    },
    {
      id: 'industry',
      name: 'Industry Knowledge',
      icon: <Briefcase size={32} className="text-cyan-400" />,
      description: 'Test your understanding of industry trends and best practices',
      skills: ['Market Analysis', 'Competitive Intelligence', 'Industry Trends', 'Best Practices']
    }
  ];
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  const handleStartTest = () => {
    if (selectedCategory) {
      navigate(`/competency-test/quiz/${selectedCategory.id}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Competency Assessment</h1>
          <p className="text-cyan-100">Select a category to assess your skills and discover career opportunities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`bg-gray-900 rounded-xl p-6 border transition-all cursor-pointer ${
                selectedCategory?.id === category.id 
                  ? 'border-cyan-400 shadow-lg shadow-cyan-900/20' 
                  : 'border-cyan-800 hover:border-cyan-600'
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-cyan-900/20 rounded-lg mr-4">
                  {category.icon}
                </div>
                <h2 className="text-xl font-medium text-white">{category.name}</h2>
              </div>
              <p className="text-gray-400 mb-4">{category.description}</p>
              <div>
                <h3 className="text-sm font-medium text-cyan-300 mb-2">Skills Assessed:</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-cyan-300 mb-4">About This Assessment</h2>
          <div className="bg-gray-900 rounded-xl p-6 border border-cyan-800">
            <div className="space-y-4">
              <p>This assessment will help you identify your strengths and areas for improvement in your chosen category.</p>
              <p>Each test takes approximately <span className="text-cyan-300 font-medium">15-20 minutes</span> to complete and consists of multiple-choice questions.</p>
              <p>After completing the assessment, you'll receive:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>A detailed skill gap analysis</li>
                <li>Personalized learning recommendations</li>
                <li>Job matches based on your current skill profile</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleStartTest}
            disabled={!selectedCategory}
            className={`px-10 py-3 rounded-lg text-lg font-medium transition-all ${
              selectedCategory
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedCategory ? `Start ${selectedCategory.name} Assessment` : 'Select a Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetencyCategories;
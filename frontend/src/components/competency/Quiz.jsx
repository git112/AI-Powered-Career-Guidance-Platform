import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const CompetencyQuiz = ({ categoryId }) => {
  const navigate = useNavigate();
  // State management
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Mock quiz data based on category
  const mockQuizzes = {
    technical: {
      quizId: "tech-comp-123",
      category: "Technical",
      timeLimit: 900, // 15 minutes in seconds
      questions: [
        {
          id: "q1",
          question: "Which of the following is a JavaScript framework?",
          options: ["Django", "Flask", "React", "Laravel"],
          correctAnswer: "React"
        },
        {
          id: "q2",
          question: "What does API stand for?",
          options: ["Application Programming Interface", "Application Process Integration", "Automated Program Interface", "Advanced Programming Interface"],
          correctAnswer: "Application Programming Interface"
        },
        {
          id: "q3",
          question: "Which database is classified as NoSQL?",
          options: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
          correctAnswer: "MongoDB"
        },
        {
          id: "q4",
          question: "What is the primary purpose of version control systems like Git?",
          options: ["To optimize code execution", "To track changes in files", "To compile code", "To debug applications"],
          correctAnswer: "To track changes in files"
        },
        {
          id: "q5",
          question: "Which HTML tag is used to create a hyperlink?",
          options: ["<link>", "<a>", "<href>", "<url>"],
          correctAnswer: "<a>"
        }
      ]
    },
    behavioral: {
      quizId: "behav-comp-456",
      category: "Behavioral",
      timeLimit: 900,
      questions: [
        {
          id: "q1",
          question: "What would you do if you realized you wouldn't meet a deadline?",
          options: [
            "Work overtime without telling anyone", 
            "Communicate with your manager immediately", 
            "Reduce the quality to meet the deadline", 
            "Blame external factors"
          ],
          correctAnswer: "Communicate with your manager immediately"
        },
        {
          id: "q2",
          question: "How do you typically handle conflicts within a team?",
          options: [
            "Avoid the conflict altogether", 
            "Address it directly with the involved parties", 
            "Complain to other team members", 
            "Escalate to management immediately"
          ],
          correctAnswer: "Address it directly with the involved parties"
        },
        {
          id: "q3",
          question: "What's your approach to receiving critical feedback?",
          options: [
            "Become defensive", 
            "Listen actively and ask for specific examples", 
            "Ignore it", 
            "Argue against the points made"
          ],
          correctAnswer: "Listen actively and ask for specific examples"
        },
        {
          id: "q4",
          question: "When leading a project, how do you ensure team members stay motivated?",
          options: [
            "Set unrealistic goals to push them", 
            "Provide regular recognition and clear direction", 
            "Leave them to figure things out independently", 
            "Monitor their work constantly"
          ],
          correctAnswer: "Provide regular recognition and clear direction"
        },
        {
          id: "q5",
          question: "How do you prioritize tasks when you have multiple deadlines?",
          options: [
            "Work on whatever feels most urgent in the moment", 
            "Assess impact and urgency, then create a structured plan", 
            "Focus on the easiest tasks first", 
            "Ask someone else to decide for you"
          ],
          correctAnswer: "Assess impact and urgency, then create a structured plan"
        }
      ]
    },
    industry: {
      quizId: "indus-comp-789",
      category: "Industry",
      timeLimit: 900,
      questions: [
        {
          id: "q1",
          question: "What is the primary benefit of cloud computing for businesses?",
          options: [
            "Lower security risks", 
            "Increased scalability and flexibility", 
            "Simpler compliance requirements", 
            "Elimination of all IT costs"
          ],
          correctAnswer: "Increased scalability and flexibility"
        },
        {
          id: "q2",
          question: "What does 'digital transformation' primarily refer to?",
          options: [
            "Converting paper documents to digital files", 
            "Replacing employees with automation", 
            "Integrating digital technology into all areas of business", 
            "Creating a company website"
          ],
          correctAnswer: "Integrating digital technology into all areas of business"
        },
        {
          id: "q3",
          question: "Which of the following is NOT typically considered a disruptive technology?",
          options: [
            "Artificial Intelligence", 
            "Blockchain", 
            "Desktop computers", 
            "Internet of Things (IoT)"
          ],
          correctAnswer: "Desktop computers"
        },
        {
          id: "q4",
          question: "What is a key characteristic of agile methodology?",
          options: [
            "Comprehensive documentation", 
            "Iterative development with frequent reassessment", 
            "Minimal customer involvement until product completion", 
            "Fixed requirements throughout the project"
          ],
          correctAnswer: "Iterative development with frequent reassessment"
        },
        {
          id: "q5",
          question: "What is the primary purpose of a SWOT analysis?",
          options: [
            "To evaluate employee performance", 
            "To assess organizational strengths, weaknesses, opportunities, and threats", 
            "To determine software development priorities", 
            "To calculate return on investment"
          ],
          correctAnswer: "To assess organizational strengths, weaknesses, opportunities, and threats"
        }
      ]
    }
  };

  // Simulating API call to fetch quiz data from backend
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // In a real application, replace this with a fetch call to your backend API
        // const response = await fetch(`/api/competency-tests/new?category=${categoryId}`);
        // const data = await response.json();
        
        // Using mock data for demonstration
        const data = mockQuizzes[categoryId] || mockQuizzes.technical;
        
        // Remove correct answers from questions during quiz time
        const quizQuestions = data.questions.map(q => ({
          id: q.id,
          question: q.question,
          options: q.options
        }));
        
        setQuizData({
          ...data,
          questions: quizQuestions
        });
        setTimeLeft(data.timeLimit);
        
        // Short timeout just to simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        // Handle error state
      }
    };
    
    fetchQuizData();
  }, [categoryId]);
  
  // Timer effect
  useEffect(() => {
    if (!timeLeft || quizSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, quizSubmitted]);
  
  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers({
      ...answers,
      [questionId]: selectedAnswer
    });
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Submit quiz to backend
  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    
    try {
      // In a real app, send answers to backend
      // const response = await fetch('/api/competency-tests/submit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     quizId: quizData.quizId,
      //     category: quizData.category,
      //     answers: answers
      //   })
      // });
      // const result = await response.json();
      
      // Get the original quiz with answers for comparison
      const originalQuiz = mockQuizzes[categoryId] || mockQuizzes.technical;
      
      // Calculate score and prepare result data
      let correctCount = 0;
      const questionsWithResults = originalQuiz.questions.map(q => {
        const isCorrect = answers[q.id] === q.correctAnswer;
        if (isCorrect) correctCount++;
        
        return {
          question: q.question,
          answer: q.correctAnswer,
          userAnswer: answers[q.id] || "Not answered",
          isCorrect: isCorrect
        };
      });
      
      const score = Math.round((correctCount / originalQuiz.questions.length) * 100);
      
      // Create result object
      const result = {
        quizScore: score,
        category: originalQuiz.category,
        questions: questionsWithResults,
        improvementTip: `Consider focusing more on ${originalQuiz.category.toLowerCase()} concepts to improve your skills.`
      };
      
      // Navigate to results page with data
      navigate('/competency-test/results', { state: { quizResult: result } });
      
    } catch (error) {
      console.error("Error submitting quiz:", error);
      // Handle submission error
    }
  };
  
  // Quiz completion status
  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = quizData?.questions?.length || 0;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-cyan-400 mx-auto mb-4" size={40} />
          <p className="text-xl">Loading your competency test...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 pt-20 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400">{quizData.category} Competency Assessment</h1>
          <p className="text-cyan-100 mt-1">Complete all questions to get your personalized skill analysis</p>
        </div>
        
        {/* Progress and timer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4 border border-cyan-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-cyan-300">{answeredQuestions}/{totalQuestions} Questions</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-cyan-500 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 border border-cyan-800">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Time Remaining</span>
              <div className="flex items-center text-sm">
                <Clock size={16} className="text-cyan-400 mr-1" />
                <span className={`font-mono ${timeLeft < 60 ? 'text-red-400' : 'text-cyan-300'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Current question */}
        <div className="bg-gray-900 rounded-xl p-6 border border-cyan-800 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-cyan-300">
              Question {currentQuestion + 1} of {quizData.questions.length}
            </h2>
            {answers[quizData.questions[currentQuestion].id] && (
              <span className="bg-cyan-900/30 text-cyan-300 px-3 py-1 rounded-full text-sm">
                Answered
              </span>
            )}
          </div>
          
          <p className="text-xl mb-6">{quizData.questions[currentQuestion].question}</p>
          
          <div className="space-y-3">
            {quizData.questions[currentQuestion].options.map((option, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border cursor-pointer transition
                  ${answers[quizData.questions[currentQuestion].id] === option 
                    ? 'bg-cyan-900/30 border-cyan-500' 
                    : 'bg-gray-800 border-gray-700 hover:border-cyan-700'}`}
                onClick={() => handleAnswerSelect(quizData.questions[currentQuestion].id, option)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center
                    ${answers[quizData.questions[currentQuestion].id] === option 
                      ? 'bg-cyan-500' 
                      : 'border border-gray-600'}`}
                  >
                    {answers[quizData.questions[currentQuestion].id] === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg flex items-center 
              ${currentQuestion === 0 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            Previous
          </button>
          
          {currentQuestion < quizData.questions.length - 1 ? (
            <button 
              onClick={handleNextQuestion}
              className="px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 flex items-center"
            >
              Next Question
              <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <button 
              onClick={handleQuizSubmit}
              className="px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 flex items-center"
            >
              Submit Quiz
              <CheckCircle size={18} className="ml-2" />
            </button>
          )}
        </div>
        
        {/* Question navigation panel */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-cyan-800">
          <p className="text-sm text-gray-400 mb-3">Question Navigation:</p>
          <div className="flex flex-wrap gap-2">
            {quizData.questions.map((q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 flex items-center justify-center rounded
                  ${currentQuestion === index 
                    ? 'bg-cyan-700 text-white' 
                    : answers[q.id]
                      ? 'bg-cyan-900/40 text-cyan-300'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetencyQuiz;
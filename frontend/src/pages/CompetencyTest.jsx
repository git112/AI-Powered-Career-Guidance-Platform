import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CompetencyCategories from '../components/competency/CategorySelection';
import CompetencyQuiz from '../components/competency/Quiz';
import CompetencyTestUI from '../components/competency/TestUI';

const CompetencyTest = ({ page }) => {
  const params = useParams();
  const location = useLocation();
  const categoryId = params.categoryId;
  
  // Check if there are results in the location state
  const hasResults = location.state?.quizResult;
  
  // Determine which page to show
  const renderPage = () => {
    if (page === "quiz" && categoryId) {
      return <CompetencyQuiz categoryId={categoryId} />;
    } else if (page === "results" || hasResults) {
      return <CompetencyTestUI quizResult={location.state?.quizResult} />;
    } else {
      return <CompetencyCategories />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderPage()}
    </div>
  );
};

export default CompetencyTest;
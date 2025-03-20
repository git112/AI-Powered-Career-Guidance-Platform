
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/Landingpage';
import OnBoarding from './pages/OnBoarding';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/protectedRoutes';
import ProfileEdit from './pages/ProfileEdit';
import ResumeBuilder from './pages/ResumeBuilder';
import IndustryInsightsPage from './pages/IndustryInsightsPage';
import CompetencyTest from './pages/CompetencyTest';

import './index.css';

function App() {
  return (
    <Router>
      <Header/>
      <div className='min-h-screen'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnBoarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            } 
          />
          
          {/* Main protected routes */}
          <Route path="/industry-insights" element={
            <ProtectedRoute>
              <IndustryInsightsPage />
            </ProtectedRoute>
          } />
          
          {/* Tools routes */}
          <Route path="/resume-generator" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          
          {/* Competency Test Routes */}
          <Route path="/competency-test" element={
            <ProtectedRoute>
              <CompetencyTest />
            </ProtectedRoute>
          } />
          <Route path="/competency-test/quiz/:categoryId" element={
            <ProtectedRoute>
              <CompetencyTest page="quiz" />
            </ProtectedRoute>
          } />
          <Route path="/competency-test/results" element={
            <ProtectedRoute>
              <CompetencyTest page="results" />
            </ProtectedRoute>
          } />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/dashboard/industry-insights" element={
            <ProtectedRoute>
              <IndustryInsightsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

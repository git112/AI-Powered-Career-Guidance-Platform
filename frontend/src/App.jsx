// import LandingPage from './pages/Landingpage'
import IndustryInsightsPage from './pages/IndustryInsightsPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/Landingpage';
import OnBoarding from './pages/OnBoarding';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/protectedRoutes';
import ProfileEdit from './pages/ProfileEdit';
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
          <Route path="/industry-insights" element={<IndustryInsightsPage />} />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App

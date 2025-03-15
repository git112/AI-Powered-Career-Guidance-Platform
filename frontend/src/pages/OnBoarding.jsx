'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { FaIndustry, FaGraduationCap, FaBriefcase, FaCode, FaUser } from 'react-icons/fa';

const industries = [
  {
    id: 'tech',
    name: 'Technology',
    subIndustries: [
      'Software Development',
      'Data Science',
      'Cybersecurity',
      'Cloud Computing',
      'Web Development',
      'Mobile Development',
      'Game Development',
      'UI/UX Design',
    ],
    // Add more industries and sub-industries as needed
  },
  {
    id: 'finance',
    name: 'Finance',
    subIndustries: ['Banking', 'Investment', 'Insurance', 'Fintech'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    subIndustries: [
      'Medical Devices',
      'Pharmaceuticals',
      'Healthcare IT',
      'Biotechnology',
    ],
  },
];

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    industry: '',
    subIndustry: '',
    experience: '',
    skills: '',
    bio: '',
    profilePicture: '',
    authProvider: 'local',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormCompletion = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/auth');
        return;
      }

      // Prepare the profile data
      const profileData = {
        industry: formData.industry,
        subIndustry: formData.subIndustry,
        experience: parseInt(formData.experience),
        skills: typeof formData.skills === 'string' 
          ? formData.skills.split(',').map(s => s.trim()).filter(s => s) 
          : (Array.isArray(formData.skills) ? formData.skills : []),
        bio: formData.bio,
        authProvider: formData.authProvider,
        profilePicture: formData.profilePicture
      };

      console.log('Sending profile data:', profileData);

      // Update user profile - use the correct API path with /api prefix
      const profileResponse = await api.put('/api/users/profile', profileData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile updated successfully:', profileResponse.data);

      if (profileResponse.data) {
        // Generate insights with the same data and correct API path
        const insightResponse = await api.post('/api/industry-insights/generate', {
          industry: profileData.subIndustry || profileData.industry,
          experience: parseInt(profileData.experience),
          skills: profileData.skills
        }, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Insights generation response:', insightResponse.data);

        // Store updated user data
        localStorage.setItem('userData', JSON.stringify(profileResponse.data));

        // Navigate to insights page
        console.log('Navigating to dashboard...');
        navigate('/dashboard/industry-insights');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 0 && !formData.industry) {
      setError('Please select an industry');
      return;
    }
    if (step === 1 && !formData.experience) {
      setError('Please enter your experience level');
      return;
    }
    if (step === 2 && !formData.skills) {
      setError('Please enter at least one skill');
      return;
    }
    
    setError(null);
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFormCompletion();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-100 mb-2">Select Your Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-cyan-100"
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry.id} value={industry.name}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </div>
            
            {formData.industry && (
              <div>
                <label className="block text-cyan-100 mb-2">Select Sub-Industry</label>
                <select
                  name="subIndustry"
                  value={formData.subIndustry}
                  onChange={handleChange}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-cyan-100"
                >
                  <option value="">Select Sub-Industry</option>
                  {industries
                    .find(ind => ind.name === formData.industry)
                    ?.subIndustries.map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <label className="block text-cyan-100 mb-2">Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              max="50"
              placeholder="Years of experience"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-cyan-100"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label className="block text-cyan-100 mb-2">Your Skills (comma separated)</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. JavaScript, React, Node.js"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-cyan-100 h-32"
            />
          </div>
        );
      case 3:
        return (
          <div>
            <label className="block text-cyan-100 mb-2">Professional Bio (optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about your professional background..."
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-cyan-100 h-32"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 0:
        return <FaIndustry className="text-4xl text-cyan-400" />;
      case 1:
        return <FaBriefcase className="text-4xl text-cyan-400" />;
      case 2:
        return <FaCode className="text-4xl text-cyan-400" />;
      case 3:
        return <FaUser className="text-4xl text-cyan-400" />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "Select Your Industry";
      case 1:
        return "Your Experience";
      case 2:
        return "Your Skills";
      case 3:
        return "About You";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-zinc-800 rounded-xl shadow-lg p-6 border border-zinc-700">
        <div className="flex flex-col items-center mb-6">
          {getStepIcon()}
          <h1 className="text-2xl font-bold text-cyan-100 mt-4">{getStepTitle()}</h1>
          <div className="flex justify-center w-full mt-4">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`h-2 w-full mx-1 rounded-full ${
                  i === step ? 'bg-cyan-500' : i < step ? 'bg-cyan-700' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">{renderStepContent()}</div>

        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className={`px-4 py-2 rounded-lg ${
              step === 0
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                : 'bg-zinc-700 text-cyan-100 hover:bg-zinc-600'
            }`}
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={isSubmitting}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : step === 3 ? (
              'Complete'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
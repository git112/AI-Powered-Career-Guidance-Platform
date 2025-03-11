// 'use client';

// import { useState } from 'react';
// import { 
//   Factory, 
//   GraduationCap, 
//   Briefcase, 
//   Code, 
//   User 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import api from '../lib/axios'; // Import the configured axios instance

// const industries = [
//   {
//     id: 'tech',
//     name: 'Technology',
//     subIndustries: [
//       'Software Development',
//       'Data Science',
//       'Cybersecurity',
//       'Cloud Computing',
//     ],
//   },
//   {
//     id: 'finance',
//     name: 'Finance',
//     subIndustries: ['Banking', 'Investment', 'Insurance', 'Fintech'],
//   },
//   {
//     id: 'healthcare',
//     name: 'Healthcare',
//     subIndustries: [
//       'Medical Devices',
//       'Pharmaceuticals',
//       'Healthcare IT',
//       'Biotechnology',
//     ],
//   },
// ];

// const OnboardingForm = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(0);
//   const [formData, setFormData] = useState({
//     industry: '',
//     subIndustry: '',
//     experience: '',
//     skills: '',
//     bio: '',
//   });

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFormCompletion = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post('/api/users/profile', formData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       navigate('/'); // or wherever you want to redirect after onboarding
//     } catch (error) {
//       console.error('Error saving profile:', error);
//     }
//   };

//   // Update the nextStep function
//   const nextStep = () => {
//     if (step < 4) {
//       setStep(step + 1);
//     } else {
//       handleFormCompletion();
//     }
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     nextStep();
//   };

//   // Only validate current step field
//   const canContinue = () => {
//     switch(step) {
//       case 0:
//         return formData.industry !== '';
//       case 1:
//         return formData.subIndustry !== '';
//       case 2:
//         return formData.experience !== '';
//       case 3:
//         return formData.skills !== '';
//       case 4:
//         return formData.bio !== '';
//       default:
//         return false;
//     }
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 0:
//         return (
//           <>
//             <label className="block mb-3 text-lg font-medium text-cyan-200">
//               <Factory className="inline-block mr-2 h-5 w-5" />
//               Select your industry
//             </label>
//             <select
//               name="industry"
//               value={formData.industry}
//               onChange={handleChange}
//               className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             >
//               <option value="">Select an industry</option>
//               {industries.map(ind => (
//                 <option key={ind.id} value={ind.id}>
//                   {ind.name}
//                 </option>
//               ))}
//             </select>
//           </>
//         );
//       case 1:
//         return (
//           <>
//             <label className="block mb-3 text-lg font-medium text-cyan-200">
//               <GraduationCap className="inline-block mr-2 h-5 w-5" />
//               Select your specialization
//             </label>
//             <select
//               name="subIndustry"
//               value={formData.subIndustry}
//               onChange={handleChange}
//               className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//             >
//               <option value="">Select a specialization</option>
//               {industries
//                 .find(ind => ind.id === formData.industry)
//                 ?.subIndustries.map(sub => (
//                   <option key={sub} value={sub}>
//                     {sub}
//                   </option>
//                 ))}
//             </select>
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <label className="block mb-3 text-lg font-medium text-cyan-200">
//               <Briefcase className="inline-block mr-2 h-5 w-5" />
//               Years of Experience
//             </label>
//             <input
//               type="number"
//               name="experience"
//               value={formData.experience}
//               onChange={handleChange}
//               min="0"
//               max="50"
//               className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               placeholder="Enter years of experience"
//             />
//           </>
//         );
//       case 3:
//         return (
//           <>
//             <label className="block mb-3 text-lg font-medium text-cyan-200">
//               <Code className="inline-block mr-2 h-5 w-5" />
//               Skills
//             </label>
//             <input
//               type="text"
//               name="skills"
//               value={formData.skills}
//               onChange={handleChange}
//               className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               placeholder="e.g., Python, JavaScript, Project Management"
//             />
//             <p className="mt-2 text-sm text-cyan-200">
//               Separate multiple skills with commas
//             </p>
//           </>
//         );
//       case 4:
//         return (
//           <>
//             <label className="block mb-3 text-lg font-medium text-cyan-200">
//               <User className="inline-block mr-2 h-5 w-5" />
//               Professional Bio
//             </label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-36"
//               placeholder="Tell us about your professional background..."
//             />
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   // Added navigation controls
//   const goBack = () => {
//     if (step > 0) {
//       setStep(step - 1);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-black">
//       <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-800">
//         <h2 className="text-2xl font-bold text-cyan-200 mb-6 text-center">
//           Complete Your Profile
//         </h2>
//         <div className="mb-6">
//           <div className="flex justify-between mb-2">
//             {[0, 1, 2, 3, 4].map(i => (
//               <div
//                 key={i}
//                 className={`h-1.5 w-1/6 rounded-full ${
//                   i <= step ? 'bg-cyan-400' : 'bg-zinc-700'
//                 }`}
//               />
//             ))}
//           </div>
//           <p className="text-center text-cyan-200 text-sm">
//             Step {step + 1} of 5
//           </p>
//         </div>
        
//         <div className="space-y-6">
//           {renderStep()}
          
//           <div className="flex gap-3 pt-4">
//             {step > 0 && (
//               <button
//                 type="button"
//                 onClick={goBack}
//                 className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-4 rounded-md transition duration-200"
//               >
//                 Back
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={nextStep}
//               disabled={!canContinue()}
//               className={`flex-1 font-medium py-3 px-4 rounded-md transition duration-200 ${
//                 canContinue()
//                   ? "bg-cyan-500 hover:bg-cyan-600 text-white"
//                   : "bg-zinc-600 text-zinc-400 cursor-not-allowed"
//               }`}
//             >
//               {step < 4 ? 'Continue' : 'Complete Profile'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnboardingForm;



'use client';

import { useState } from 'react';
import { 
  Factory, 
  GraduationCap, 
  Briefcase, 
  Code, 
  User 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios'; // Import the configured axios instance

const industries = [
  {
    id: 'tech',
    name: 'Technology',
    subIndustries: [
      'Software Development',
      'Data Science',
      'Cybersecurity',
      'Cloud Computing',
    ],
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
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormCompletion = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/users/profile', formData, {  // Removed the "/api" prefix
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard/industry-insights'); // Redirect to dashboard industry insights page
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Update the nextStep function
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleFormCompletion();
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    nextStep();
  };

  // Only validate current step field
  const canContinue = () => {
    switch(step) {
      case 0:
        return formData.industry !== '';
      case 1:
        return formData.subIndustry !== '';
      case 2:
        return formData.experience !== '';
      case 3:
        return formData.skills !== '';
      case 4:
        return formData.bio !== '';
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <label className="block mb-3 text-lg font-medium text-cyan-200">
              <Factory className="inline-block mr-2 h-5 w-5" />
              Select your industry
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Select an industry</option>
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
          </>
        );
      case 1:
        return (
          <>
            <label className="block mb-3 text-lg font-medium text-cyan-200">
              <GraduationCap className="inline-block mr-2 h-5 w-5" />
              Select your specialization
            </label>
            <select
              name="subIndustry"
              value={formData.subIndustry}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Select a specialization</option>
              {industries
                .find(ind => ind.id === formData.industry)
                ?.subIndustries.map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </>
        );
      case 2:
        return (
          <>
            <label className="block mb-3 text-lg font-medium text-cyan-200">
              <Briefcase className="inline-block mr-2 h-5 w-5" />
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              max="50"
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter years of experience"
            />
          </>
        );
      case 3:
        return (
          <>
            <label className="block mb-3 text-lg font-medium text-cyan-200">
              <Code className="inline-block mr-2 h-5 w-5" />
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="e.g., Python, JavaScript, Project Management"
            />
            <p className="mt-2 text-sm text-cyan-200">
              Separate multiple skills with commas
            </p>
          </>
        );
      case 4:
        return (
          <>
            <label className="block mb-3 text-lg font-medium text-cyan-200">
              <User className="inline-block mr-2 h-5 w-5" />
              Professional Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-36"
              placeholder="Tell us about your professional background..."
            />
          </>
        );
      default:
        return null;
    }
  };

  // Added navigation controls
  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-lg bg-zinc-900 p-8 rounded-lg shadow-xl border border-zinc-800">
        <h2 className="text-2xl font-bold text-cyan-200 mb-6 text-center">
          Complete Your Profile
        </h2>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`h-1.5 w-1/6 rounded-full ${
                  i <= step ? 'bg-cyan-400' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-cyan-200 text-sm">
            Step {step + 1} of 5
          </p>
        </div>
        
        <div className="space-y-6">
          {renderStep()}
          
          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-4 rounded-md transition duration-200"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              disabled={!canContinue()}
              className={`flex-1 font-medium py-3 px-4 rounded-md transition duration-200 ${
                canContinue()
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "bg-zinc-600 text-zinc-400 cursor-not-allowed"
              }`}
            >
              {step < 4 ? 'Continue' : 'Complete Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
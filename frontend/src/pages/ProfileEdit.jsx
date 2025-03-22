import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { 
  Factory, 
  GraduationCap, 
  Briefcase, 
  Code, 
  User,
  Building,
  DollarSign,
  Target
} from 'lucide-react';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    industry: '',
    subIndustry: '',
    experience: '',
    skills: [],
    bio: '',
    location: '',
    preferredRoles: [],
    salaryExpectation: '',
    competencyScore: 0
  });

  useEffect(() => {
    // Fetch user profile data when component mounts
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }
        
        // Use the correct API path with /api prefix
        const response = await api.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Profile data loaded:', response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Use the correct API path with /api prefix
      const profileResponse = await api.put('/api/users/profile', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile updated successfully:', profileResponse.data);
      
      // After updating profile, generate new insights
      const insightResponse = await api.post('/api/industry-insights/generate', {
        industry: formData.subIndustry || formData.industry,
        experience: parseInt(formData.experience),
        skills: formData.skills
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('New insights generated:', insightResponse.data);
      
      // Update local storage with new user data
      localStorage.setItem('userData', JSON.stringify(profileResponse.data));
      
      // Navigate back to insights page
      navigate('/dashboard/industry-insights');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-zinc-900 p-4">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 pt-20
    ">
      <div className="max-w-2xl mx-auto bg-zinc-800/50 p-6 rounded-xl border border-cyan-400">
        <h2 className="text-2xl font-bold text-cyan-50 mb-6">Edit Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Factory className="mr-2 h-5 w-5" />
              Industry
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              required
            >
              <option value="">Select Industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </div>
          
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Sub-Industry
            </label>
            <select
              name="subIndustry"
              value={formData.subIndustry}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
            >
              <option value="">Select Sub-Industry</option>
              {formData.industry === 'Technology' && (
                <>
                  <option value="Software Development">Software Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </>
              )}
              {formData.industry === 'Finance' && (
                <>
                  <option value="Banking">Banking</option>
                  <option value="Investment">Investment</option>
                  <option value="Insurance">Insurance</option>
                </>
              )}
            </select>
          </div>
          
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              required
              min="0"
              max="50"
            />
          </div>
          
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
              onChange={handleSkillsChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
              rows="4"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
            />
          </div>
          
          <div>
            <label className="block text-cyan-100 mb-2 flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Salary Expectation
            </label>
            <input
              type="text"
              name="salaryExpectation"
              value={formData.salaryExpectation}
              onChange={handleChange}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/industry-insights')}
              className="bg-zinc-600 hover:bg-zinc-700 text-white py-2 px-6 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-6 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;

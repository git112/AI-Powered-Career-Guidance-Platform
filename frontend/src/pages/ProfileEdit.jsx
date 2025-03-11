import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/axios';
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
        const token = localStorage.getItem('token');
        const response = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.put('/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 p-8">
        <h2 className="text-2xl font-bold text-cyan-200 mb-6">Edit Your Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Industry Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-cyan-200 flex items-center">
              <Factory className="mr-2" /> Industry Information
            </h3>
            {/* Add your existing industry fields here */}
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-cyan-200 flex items-center">
              <Building className="mr-2" /> Location
            </h3>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100"
              placeholder="Your location"
            />
          </div>

          {/* Career Goals Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-cyan-200 flex items-center">
              <Target className="mr-2" /> Career Goals
            </h3>
            <input
              type="text"
              name="preferredRoles"
              value={formData.preferredRoles.join(', ')}
              onChange={(e) => setFormData({...formData, preferredRoles: e.target.value.split(',')})}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100"
              placeholder="Preferred roles (comma-separated)"
            />
          </div>

          {/* Salary Expectations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-cyan-200 flex items-center">
              <DollarSign className="mr-2" /> Salary Expectations
            </h3>
            <input
              type="number"
              name="salaryExpectation"
              value={formData.salaryExpectation}
              onChange={(e) => setFormData({...formData, salaryExpectation: e.target.value})}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100"
              placeholder="Expected annual salary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-md transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;

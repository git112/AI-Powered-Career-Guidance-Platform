import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, User } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import api from '@/lib/axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', formData);
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google login success, getting user info...');
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        
        console.log('User info received:', userInfo.data);
        
        const payload = {
          googleToken: tokenResponse.access_token,
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture
        };
  
        console.log('Sending payload to backend:', payload);
        
        const response = await api.post('/auth/google', payload);
  
        console.log('Backend response:', response.data);
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Login error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        
        // Show more specific error message
        const errorMessage = error.response?.data?.message || error.message;
        alert(`Login failed: ${errorMessage}`);
      }
    },
    flow: 'implicit',
    ux_mode: 'popup',
  });

  const handleGoogleAuth = () => {
    login(); // This triggers the Google OAuth flow
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-cyan-100">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full border-zinc-700 hover:bg-zinc-800"
              onClick={handleGoogleAuth}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-cyan-100">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-cyan-500" />
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-cyan-500" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-cyan-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <div className="text-center text-sm text-cyan-100">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage; 
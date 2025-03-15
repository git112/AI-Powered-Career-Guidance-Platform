import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import api from '../lib/axios';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleManualAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const { data } = await api.post(endpoint, payload);
      
      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Redirect based on profile completion
      if (data.user.isProfileComplete) {
        navigate('/dashboard/industry-insights');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const { data } = await api.post('/api/auth/google', {
        access_token: tokenResponse.access_token
      });
      
      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Redirect based on profile completion
      if (data.user.isProfileComplete) {
        navigate('/dashboard/industry-insights');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setError('Google login failed. Please try again.');
    },
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-cyan-100">
            {isLogin ? 'Welcome Back!' : 'Create an Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-100">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-zinc-500" />
                  </div>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-100">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-zinc-500" />
                </div>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-cyan-100">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-zinc-500" />
                </div>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                  required
                />
              </div>
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-cyan-100">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-zinc-500" />
                  </div>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-cyan-100"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-red-400 text-sm py-2">
                {error}
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-400">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-zinc-700 hover:bg-zinc-800"
            onClick={() => login()}
            disabled={loading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm text-zinc-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-cyan-400 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage; 
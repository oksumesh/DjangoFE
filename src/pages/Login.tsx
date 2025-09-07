import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { handleGoogleSuccess, handleGoogleError } from '../services/googleAuth';
import Input from '../components/UI/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, googleLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const googleUserInfo = await handleGoogleSuccess(credentialResponse);
      await googleLogin(googleUserInfo);
      navigate('/');
    } catch (error: any) {
      setErrors({ email: error.message || 'Google authentication failed' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#2F0000' }}>
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Film className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Red Curtain</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Login to Your Account</h2>
          <p className="mt-2 text-gray-300">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 z-10" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 z-10" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-6 w-6 z-10" /> : <Eye className="h-6 w-6 z-10" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-400 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-3xl hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-gray-300 text-sm">Don't have an account? </span>
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-400 font-bold text-sm transition-colors duration-200"
            >
              Register
            </Link>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              width="100%"
              text="signin_with"
              shape="pill"
              logo_alignment="left"
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
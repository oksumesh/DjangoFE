import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, Mail, Lock, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const cinemas = [
  { id: '1', name: 'AMC Times Square', location: 'New York, NY' },
  { id: '2', name: 'Regal Union Square', location: 'New York, NY' },
  { id: '3', name: 'Cinemark Century City', location: 'Los Angeles, CA' },
  { id: '4', name: 'AMC Metreon', location: 'San Francisco, CA' },
  { id: '5', name: 'Landmark Theaters', location: 'Chicago, IL' },
];

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredCinemas: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.preferredCinemas.length === 0) {
      newErrors.preferredCinemas = 'Please select at least one preferred cinema';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email,
        preferredCinemas: formData.preferredCinemas,
        password: formData.password,
      });
      navigate('/');
    } catch (error) {
      setErrors({ email: 'Registration failed. Please try again.' });
    }
  };

  const handleCinemaChange = (cinemaId: string) => {
    setFormData(prev => ({
      ...prev,
      preferredCinemas: prev.preferredCinemas.includes(cinemaId)
        ? prev.preferredCinemas.filter(id => id !== cinemaId)
        : [...prev.preferredCinemas, cinemaId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Film className="h-12 w-12 text-accent-400" />
            <span className="text-3xl font-bold text-white">MoviePoll</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-gray-400">Join the community and start voting on movies</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
                className="pl-10"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                className="pl-10"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                error={errors.password}
                className="pl-10 pr-10"
                helperText="Must be at least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                error={errors.confirmPassword}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Preferred Cinemas */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Preferred Cinemas
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cinemas.map((cinema) => (
                  <label key={cinema.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferredCinemas.includes(cinema.name)}
                      onChange={() => handleCinemaChange(cinema.name)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-300">
                      {cinema.name} - {cinema.location}
                    </span>
                  </label>
                ))}
              </div>
              {errors.preferredCinemas && (
                <p className="mt-1 text-sm text-red-400">{errors.preferredCinemas}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Create Account
          </Button>

          {/* Sign in link */}
          <div className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200"
            >
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
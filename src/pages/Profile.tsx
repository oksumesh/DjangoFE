import React, { useState } from 'react';
import { User, MapPin, Mail, Edit2, Save, X, Star, Settings, HelpCircle, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../services/profile';

const cinemas = [
  { id: '1', name: 'AMC Times Square', location: 'New York, NY' },
  { id: '2', name: 'Regal Union Square', location: 'New York, NY' },
  { id: '3', name: 'Cinemark Century City', location: 'Los Angeles, CA' },
  { id: '4', name: 'AMC Metreon', location: 'San Francisco, CA' },
  { id: '5', name: 'Landmark Theaters', location: 'Chicago, IL' },
];

const Profile: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferredCinemas: user?.preferredCinemas || [],
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('access');
      if (!token) throw new Error('Not authenticated');
      const updatedProfile = await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: '', // Add phone if you want to support it
        preferred_cinemas: formData.preferredCinemas,
        is_verified: false // Or true if you want to support verification
      }, token);
      // Update user context/localStorage with API response
      const updatedUser = {
        ...user,
        name: updatedProfile.name,
        email: updatedProfile.email,
        preferredCinemas: updatedProfile.preferred_cinemas,
        username: updatedProfile.username
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsSaving(false);
      setIsEditing(false);
    } catch (err) {
      setIsSaving(false);
      // Optionally show error to user
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      preferredCinemas: user.preferredCinemas,
    });
    setIsEditing(false);
  };

  const handleCinemaChange = (cinemaName: string) => {
    setFormData(prev => ({
      ...prev,
      preferredCinemas: prev.preferredCinemas.includes(cinemaName)
        ? prev.preferredCinemas.filter(name => name !== cinemaName)
        : [...prev.preferredCinemas, cinemaName]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const votingStats = {
    totalVotes: 23,
    activePolls: 3,
    completedPolls: 15,
    favoriteGenre: 'Action'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2F0000' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-300 transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-600">
            <User className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
          <p className="text-gray-300">{user.email}</p>
          {user.isAdmin && (
            <span className="inline-block mt-2 px-3 py-1 bg-orange-500 text-black text-sm rounded-full font-medium">
              Admin
            </span>
          )}
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          {/* Loyalty Rewards */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-lg p-4 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-orange-500 mr-4" />
              <span className="text-white font-medium">Loyalty Rewards</span>
            </div>
          </div>

          {/* Edit Profile */}
          <div 
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-lg p-4 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            <div className="flex items-center">
              <Edit2 className="h-6 w-6 text-orange-500 mr-4" />
              <span className="text-white font-medium">Edit Profile</span>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-lg p-4 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-orange-500 mr-4" />
              <span className="text-white font-medium">Settings</span>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-lg p-4 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer">
            <div className="flex items-center">
              <HelpCircle className="h-6 w-6 text-orange-500 mr-4" />
              <span className="text-white font-medium">Help & Support</span>
            </div>
          </div>

          {/* Logout */}
          <div 
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-lg p-4 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer"
            onClick={handleLogout}
          >
            <div className="flex items-center">
              <LogOut className="h-6 w-6 text-red-400 mr-4" />
              <span className="text-white font-medium">Logout</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
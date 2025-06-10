import React, { useState } from 'react';
import { User, MapPin, Mail, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';

const cinemas = [
  { id: '1', name: 'AMC Times Square', location: 'New York, NY' },
  { id: '2', name: 'Regal Union Square', location: 'New York, NY' },
  { id: '3', name: 'Cinemark Century City', location: 'Los Angeles, CA' },
  { id: '4', name: 'AMC Metreon', location: 'San Francisco, CA' },
  { id: '5', name: 'Landmark Theaters', location: 'Chicago, IL' },
];

const Profile: React.FC = () => {
  const { user } = useAuth();
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    // In real app, would update user context here
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

  const votingStats = {
    totalVotes: 23,
    activePolls: 3,
    completedPolls: 15,
    favoriteGenre: 'Action'
  };

  return (
    <div className="bg-dark-900 py-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">{user.name}</h1>
          <p className="text-gray-400">{user.email}</p>
          {user.isAdmin && (
            <span className="inline-block mt-2 px-3 py-1 bg-secondary-600 text-white text-sm rounded-full">
              Admin
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Personal Information</h2>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSave}
                      loading={isSaving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <p className="text-white bg-dark-800 px-3 py-2 rounded-lg">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <p className="text-white bg-dark-800 px-3 py-2 rounded-lg">{user.email}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Cinema Preferences */}
            <Card>
              <div className="flex items-center space-x-2 mb-6">
                <MapPin className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Cinema Preferences</h2>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">
                    Select your preferred cinemas to get relevant movie polls
                  </p>
                  {cinemas.map((cinema) => (
                    <label key={cinema.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.preferredCinemas || []).includes(cinema.name)}
                        onChange={() => handleCinemaChange(cinema.name)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-300">
                        {cinema.name} - {cinema.location}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {(user.preferredCinemas || []).length > 0 ? (
                    (user.preferredCinemas || []).map((cinema, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{cinema}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No preferred cinemas selected</p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Statistics */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Voting Statistics</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{votingStats.totalVotes}</div>
                  <div className="text-gray-400 text-sm">Total Votes Cast</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-secondary-400">{votingStats.activePolls}</div>
                    <div className="text-gray-400 text-xs">Active Polls</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-accent-400">{votingStats.completedPolls}</div>
                    <div className="text-gray-400 text-xs">Completed</div>
                  </div>
                </div>

                <div className="text-center pt-2 border-t border-dark-700">
                  <div className="text-gray-400 text-sm">Favorite Genre</div>
                  <div className="text-white font-semibold">{votingStats.favoriteGenre}</div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="text-white">Voted on "Best Horror Movie"</div>
                  <div className="text-gray-400">2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="text-white">Participated in "Action Movie Marathon"</div>
                  <div className="text-gray-400">1 day ago</div>
                </div>
                <div className="text-sm">
                  <div className="text-white">Voted on "Classic Movie Night"</div>
                  <div className="text-gray-400">3 days ago</div>
                </div>
              </div>
            </Card>

            {/* Account Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Download My Data
                </Button>
                <Button variant="danger" className="w-full" size="sm">
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
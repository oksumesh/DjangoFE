import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { createPoll } from '../services/polls';
import { useAuth } from '../context/AuthContext';

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    question: '',
    imageUrl: '',
    options: ['', '', ''],
    isAnonymous: false,
    duration: null,
    visibility: 'PUBLIC'
  });

  const durations = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '1 Week' },
    { value: '14', label: '2 Weeks' },
    { value: '30', label: '1 Month' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        options: newOptions
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('access');
      if (!token || !user) {
        throw new Error('Not authenticated');
      }

      // Filter out empty options
      const validOptions = formData.options.filter(option => option.trim() !== '');
      
      if (validOptions.length < 3) {
        throw new Error('Please provide at least 3 answer choices');
      }

      // Convert duration to proper datetime format if provided
      let durationDateTime = undefined;
      if (formData.duration) {
        const days = parseInt(formData.duration);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        durationDateTime = endDate.toISOString();
      }

      const pollData = {
        question: formData.question.trim(),
        options: validOptions,
        category: 'Movies', // Default category as mobile app doesn't have category selection
        isAnonymous: formData.isAnonymous,
        duration: durationDateTime,
        visibility: formData.visibility,
        imageUrl: formData.imageUrl.trim() || undefined,
        createdByUserId: parseInt(user.id)
      };

      const result = await createPoll(pollData, token);
      navigate(`/poll/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2F0000' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Create New Poll</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Poll Title/Question */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Poll Title/Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => handleInputChange('question', e.target.value)}
              placeholder="Enter your poll question here..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-300 resize-none"
              required
            />
          </div>

          {/* Poll Image URL */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Poll Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder="Enter Image URL"
              className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-300"
            />
            <button
              type="button"
              className="mt-3 text-orange-400 hover:text-orange-300 text-sm flex items-center space-x-1"
            >
              <span>How to Upload Image?</span>
            </button>
          </div>

          {/* Answer Choices */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Answer Choices *
            </label>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Answer Choice ${index + 1}`}
                      className="w-full px-4 py-2 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-300"
                    />
                  </div>
                  {formData.options.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {formData.options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Answer Choice</span>
              </button>
            )}
          </div>

          {/* Poll Settings */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-medium text-white mb-4">Poll Settings</h3>
            
            {/* Anonymous Voting */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="text-white font-medium mb-1">Anonymous Voting</div>
                <div className="text-gray-400 text-sm">Allow users to vote anonymously</div>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('isAnonymous', !formData.isAnonymous)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  formData.isAnonymous
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}
              >
                {formData.isAnonymous ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Poll Duration */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="text-white font-medium mb-1">Poll Duration</div>
                <div className="text-gray-400 text-sm">Set a duration for the poll</div>
              </div>
              <select
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', e.target.value || null)}
                className="px-4 py-2 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-300"
              >
                <option value="">No Duration</option>
                {durations.map(duration => (
                  <option key={duration.value} value={duration.value}>{duration.label}</option>
                ))}
              </select>
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-white font-medium mb-1">Visibility</div>
                <div className="text-gray-400 text-sm">Set visibility for the poll</div>
              </div>
              <select
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="px-4 py-2 bg-gray-800/60 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-300"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>


          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-gray-700/60 hover:bg-gray-600/60 text-white rounded-lg transition-colors"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={loading || !formData.question.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 font-medium"
            >
              {loading ? 'Publishing...' : 'Publish Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;

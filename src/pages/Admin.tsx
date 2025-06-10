import React, { useState } from 'react';
import { Plus, BarChart3, Settings, Upload, Calendar, Users } from 'lucide-react';
import { Poll, Movie } from '../types';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';

// Mock data
const mockPolls: Poll[] = [
  {
    id: '1',
    question: 'Which superhero movie should we watch this weekend?',
    options: [
      {
        id: '1',
        movie: {
          id: '1',
          title: 'Avengers: Endgame',
          poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: 'Action',
          releaseDate: '2019-04-26',
          rating: 8.4
        },
        votes: 45
      }
    ],
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    totalVotes: 83
  },
  {
    id: '2',
    question: 'Best Horror Movie for Halloween?',
    options: [
      {
        id: '2',
        movie: {
          id: '2',
          title: 'The Conjuring',
          poster: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: 'Horror',
          releaseDate: '2013-07-19',
          rating: 7.5
        },
        votes: 32
      }
    ],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    totalVotes: 32
  }
];

const Admin: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    description: '',
    deadline: '',
    movieOptions: [{ title: '', poster: '', genre: '', releaseDate: '', rating: 0 }]
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'polls' | 'create'>('overview');

  const handleCreatePoll = () => {
    // In real app, would make API call
    const poll: Poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      description: newPoll.description,
      options: newPoll.movieOptions.map((movie, index) => ({
        id: (index + 1).toString(),
        movie: {
          id: (index + 1).toString(),
          title: movie.title,
          poster: movie.poster || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: movie.genre,
          releaseDate: movie.releaseDate,
          rating: movie.rating
        },
        votes: 0
      })),
      deadline: newPoll.deadline,
      status: 'draft',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      totalVotes: 0
    };

    setPolls(prev => [poll, ...prev]);
    setIsCreateModalOpen(false);
    setNewPoll({
      question: '',
      description: '',
      deadline: '',
      movieOptions: [{ title: '', poster: '', genre: '', releaseDate: '', rating: 0 }]
    });
  };

  const handleStatusChange = (pollId: string, newStatus: 'active' | 'closed' | 'draft') => {
    setPolls(prev => prev.map(poll => 
      poll.id === pollId ? { ...poll, status: newStatus } : poll
    ));
  };

  const addMovieOption = () => {
    setNewPoll(prev => ({
      ...prev,
      movieOptions: [...prev.movieOptions, { title: '', poster: '', genre: '', releaseDate: '', rating: 0 }]
    }));
  };

  const updateMovieOption = (index: number, field: string, value: string | number) => {
    setNewPoll(prev => ({
      ...prev,
      movieOptions: prev.movieOptions.map((movie, i) => 
        i === index ? { ...movie, [field]: value } : movie
      )
    }));
  };

  const removeMovieOption = (index: number) => {
    setNewPoll(prev => ({
      ...prev,
      movieOptions: prev.movieOptions.filter((_, i) => i !== index)
    }));
  };

  const stats = {
    totalPolls: polls.length,
    activePolls: polls.filter(p => p.status === 'active').length,
    totalVotes: polls.reduce((acc, p) => acc + p.totalVotes, 0),
    draftPolls: polls.filter(p => p.status === 'draft').length
  };

  return (
    <div className="bg-dark-900 py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage movie polls and view analytics</p>
          </div>
          
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Poll
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-dark-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('polls')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'polls'
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-2" />
            Manage Polls
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400">{stats.totalPolls}</div>
                  <div className="text-gray-400 text-sm">Total Polls</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-400">{stats.activePolls}</div>
                  <div className="text-gray-400 text-sm">Active Polls</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-400">{stats.totalVotes}</div>
                  <div className="text-gray-400 text-sm">Total Votes</div>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">{stats.draftPolls}</div>
                  <div className="text-gray-400 text-sm">Draft Polls</div>
                </div>
              </Card>
            </div>

            {/* Recent Polls */}
            <Card>
              <h3 className="text-xl font-bold text-white mb-6">Recent Polls</h3>
              <div className="space-y-4">
                {polls.slice(0, 5).map((poll) => (
                  <div key={poll.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{poll.question}</h4>
                      <p className="text-gray-400 text-sm">
                        {poll.totalVotes} votes • Created {new Date(poll.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      poll.status === 'active' ? 'bg-secondary-600 text-white' :
                      poll.status === 'draft' ? 'bg-orange-600 text-white' :
                      'bg-red-600 text-white'
                    }`}>
                      {poll.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Manage Polls Tab */}
        {activeTab === 'polls' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-white mb-6">All Polls</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Question</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Votes</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Deadline</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {polls.map((poll) => (
                      <tr key={poll.id} className="border-b border-dark-800">
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{poll.question}</div>
                          <div className="text-gray-400 text-sm">
                            Created {new Date(poll.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={poll.status}
                            onChange={(e) => handleStatusChange(poll.id, e.target.value as any)}
                            className="bg-dark-700 border border-dark-600 rounded px-3 py-1 text-white text-sm"
                          >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-white">{poll.totalVotes}</td>
                        <td className="py-4 px-4 text-gray-300 text-sm">
                          {new Date(poll.deadline).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Create Poll Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Poll"
          size="lg"
        >
          <div className="space-y-6">
            <Input
              label="Poll Question"
              placeholder="What movie should we watch?"
              value={newPoll.question}
              onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Add a description for your poll..."
                value={newPoll.description}
                onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <Input
              label="Poll Deadline"
              type="datetime-local"
              value={newPoll.deadline}
              onChange={(e) => setNewPoll(prev => ({ ...prev, deadline: e.target.value }))}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Movie Options
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMovieOption}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Movie
                </Button>
              </div>

              <div className="space-y-4">
                {newPoll.movieOptions.map((movie, index) => (
                  <div key={index} className="border border-dark-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">Movie {index + 1}</h4>
                      {newPoll.movieOptions.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeMovieOption(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Movie Title"
                        value={movie.title}
                        onChange={(e) => updateMovieOption(index, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Genre"
                        value={movie.genre}
                        onChange={(e) => updateMovieOption(index, 'genre', e.target.value)}
                      />
                      <Input
                        placeholder="Poster URL"
                        value={movie.poster}
                        onChange={(e) => updateMovieOption(index, 'poster', e.target.value)}
                      />
                      <Input
                        placeholder="Release Date"
                        type="date"
                        value={movie.releaseDate}
                        onChange={(e) => updateMovieOption(index, 'releaseDate', e.target.value)}
                      />
                      <Input
                        placeholder="Rating (0-10)"
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={movie.rating}
                        onChange={(e) => updateMovieOption(index, 'rating', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                onClick={handleCreatePoll}
                disabled={!newPoll.question || !newPoll.deadline}
                className="flex-1"
              >
                Create Poll
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Admin;
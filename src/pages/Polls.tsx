import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Users } from 'lucide-react';
import { Poll } from '../types';
import PollCard from '../components/Poll/PollCard';
import { fetchPolls } from '../services/polls';

const Polls: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'category'>('popular');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    fetchPolls(token)
      .then(data => {
        // Handle paginated response structure
        const pollsArray = Array.isArray(data) ? data : (data.results || []);
        setPolls(pollsArray);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load polls');
        setLoading(false);
      });
  }, []);

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || poll.status === filter;
    return matchesSearch && matchesFilter;
  });

  const sortedPolls = [...filteredPolls].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.totalVotes - a.totalVotes;
      case 'newest':
        const aDate = a.createdAt || a.created_at || '';
        const bDate = b.createdAt || b.created_at || '';
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      case 'category':
        return (a.category || '').localeCompare(b.category || '');
      default:
        return 0;
    }
  });

  const handleViewDetails = (pollId: string) => {
    navigate(`/poll/${pollId}`);
  };

  const handleCreatePoll = () => {
    navigate('/create-poll');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: '#2F0000' }}>Loading polls...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400" style={{ backgroundColor: '#2F0000' }}>{error}</div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2F0000' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search, Filter and Stats Bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-center mb-6">
          {/* Search - Left Side */}
          <div className="w-full lg:w-80 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-400 z-10" />
            <input
              type="text"
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/60 backdrop-blur-sm border border-gray-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-300 text-sm shadow-inner"
            />
          </div>

          {/* Spacer to push filter and stats to far right */}
          <div className="flex-1"></div>

          {/* Filter and Stats - Far Right Side */}
          <div className="flex flex-row gap-2 items-center">
            {/* Filter */}
            <div className="w-40 relative">
              <select
                value={`${filter}-${sortBy}`}
                onChange={(e) => {
                  const [newFilter, newSortBy] = e.target.value.split('-');
                  setFilter(newFilter as 'all' | 'active' | 'closed');
                  setSortBy(newSortBy as 'popular' | 'newest' | 'category');
                }}
                className="w-full appearance-none bg-gray-800/60 border border-gray-500/50 rounded-lg px-3 py-2 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-400/50 transition-all duration-300 text-xs shadow-inner cursor-pointer hover:bg-gray-700/60"
              >
                <optgroup label="Filter">
                  <option value="all-popular">All Polls</option>
                  <option value="active-popular">Active Only</option>
                  <option value="closed-popular">Closed Only</option>
                </optgroup>
                <optgroup label="Sort">
                  <option value="all-popular">Most Popular</option>
                  <option value="all-newest">Newest First</option>
                  <option value="all-category">By Category</option>
                </optgroup>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-orange-400 pointer-events-none" />
            </div>

            {/* Stats */}
            <div className="flex gap-1 items-center">
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-lg px-3 py-2 text-center backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-xs font-bold text-orange-400">{polls.filter(p => p.status === 'active').length} <span className="text-gray-300 text-xs font-medium">Active</span></div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-lg px-3 py-2 text-center backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-xs font-bold text-orange-400">{polls.reduce((acc, p) => acc + p.totalVotes, 0)} <span className="text-gray-300 text-xs font-medium">Votes</span></div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-lg px-3 py-2 text-center backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-xs font-bold text-orange-400">{polls.length} <span className="text-gray-300 text-xs font-medium">Total</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Polls Section */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Users className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-bold text-white">Community Polls</h2>
          </div>
          
          {sortedPolls.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-300 text-lg mb-2">No polls found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedPolls.map((poll) => (
                <div key={poll.id} className="animate-slide-up">
                  <PollCard
                    poll={poll}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Floating Create Poll Button */}
        <button
          onClick={handleCreatePoll}
          className="fixed bottom-20 right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 z-50"
          aria-label="Create new poll"
        >
          <Plus className="h-6 w-6" />
        </button>

      </div>
    </div>
  );
};

export default Polls;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { Poll } from '../types';
import PollCard from '../components/Poll/PollCard';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

// Mock data
const mockPolls: Poll[] = [
  {
    id: '1',
    question: 'Which superhero movie should we watch this weekend?',
    description: 'Vote for your favorite superhero blockbuster!',
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
      },
      {
        id: '2',
        movie: {
          id: '2',
          title: 'Spider-Man: No Way Home',
          poster: 'https://images.pexels.com/photos/7991438/pexels-photo-7991438.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: 'Action',
          releaseDate: '2021-12-17',
          rating: 8.2
        },
        votes: 38
      }
    ],
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    totalVotes: 83,
    media: {
      type: 'image',
      url: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  },
  {
    id: '2',
    question: 'Best Horror Movie for Halloween Night?',
    options: [
      {
        id: '3',
        movie: {
          id: '3',
          title: 'The Conjuring',
          poster: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: 'Horror',
          releaseDate: '2013-07-19',
          rating: 7.5
        },
        votes: 32
      },
      {
        id: '4',
        movie: {
          id: '4',
          title: 'Hereditary',
          poster: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: 'Horror',
          releaseDate: '2018-06-08',
          rating: 7.3
        },
        votes: 28
      }
    ],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    totalVotes: 60,
    userVote: '3'
  },
  {
    id: '3',
    question: 'Classic Movie Marathon Selection',
    options: [
      {
        id: '5',
        movie: {
          id: '5',
          title: 'The Godfather',
          poster: 'https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: 'Drama',
          releaseDate: '1972-03-24',
          rating: 9.2
        },
        votes: 67
      },
      {
        id: '6',
        movie: {
          id: '6',
          title: 'Casablanca',
          poster: 'https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=400',
          genre: 'Drama',
          releaseDate: '1942-11-26',
          rating: 8.5
        },
        votes: 43
      }
    ],
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'closed',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    totalVotes: 110
  }
];

const Home: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const navigate = useNavigate();

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || poll.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleVote = (pollId: string) => {
    navigate(`/poll/${pollId}`);
  };

  const handleViewDetails = (pollId: string) => {
    navigate(`/poll/${pollId}`);
  };

  return (
    <div className="bg-dark-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Movie Polls
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Vote on the latest movie polls and help decide what the community watches next
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'secondary' : 'ghost'}
              onClick={() => setFilter('active')}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filter === 'closed' ? 'outline' : 'ghost'}
              onClick={() => setFilter('closed')}
              size="sm"
            >
              Closed
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-primary-800/20 border border-primary-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-400">{polls.filter(p => p.status === 'active').length}</div>
            <div className="text-gray-400 text-sm">Active Polls</div>
          </div>
          <div className="bg-secondary-800/20 border border-secondary-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary-400">{polls.reduce((acc, p) => acc + p.totalVotes, 0)}</div>
            <div className="text-gray-400 text-sm">Total Votes</div>
          </div>
          <div className="bg-accent-800/20 border border-accent-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent-400">{polls.length}</div>
            <div className="text-gray-400 text-sm">Total Polls</div>
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-accent-400" />
            <h2 className="text-2xl font-bold text-white">Trending Polls</h2>
          </div>
          
          {filteredPolls.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No polls found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map((poll) => (
                <div key={poll.id} className="animate-slide-up">
                  <PollCard
                    poll={poll}
                    onVote={handleVote}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
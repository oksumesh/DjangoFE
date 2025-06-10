import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, Calendar, Users, BarChart3 } from 'lucide-react';
import { Poll } from '../types';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

// Mock results data
const mockPoll: Poll = {
  id: '1',
  question: 'Which superhero movie should we watch this weekend?',
  description: 'The community has spoken! Here are the final results.',
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
      votes: 67
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
      votes: 45
    },
    {
      id: '3',
      movie: {
        id: '3',
        title: 'Doctor Strange: Multiverse of Madness',
        poster: 'https://images.pexels.com/photos/7991680/pexels-photo-7991680.jpeg?auto=compress&cs=tinysrgb&w=400',
        genre: 'Action',
        releaseDate: '2022-05-06',
        rating: 6.9
      },
      votes: 28
    }
  ],
  deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'closed',
  createdBy: 'admin',
  createdAt: new Date().toISOString(),
  totalVotes: 140
};

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    // In real app, fetch poll results from API
    setPoll(mockPoll);
  }, [id]);

  if (!poll) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading results...</div>
      </div>
    );
  }

  const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
  const winner = sortedOptions[0];
  const getPercentage = (votes: number) => (votes / poll.totalVotes) * 100;

  return (
    <div className="bg-dark-900 py-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Results Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">Poll Results</h1>
          <p className="text-gray-400 text-lg">{poll.question}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Winner Announcement */}
            <Card className="text-center bg-gradient-to-br from-accent-900/20 to-accent-700/20 border-accent-600">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Trophy className="h-16 w-16 text-accent-400 animate-pulse-slow" />
                </div>
                <h2 className="text-2xl font-bold text-white">Winner!</h2>
                <div className="flex justify-center">
                  <img
                    src={winner.movie.poster}
                    alt={winner.movie.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-accent-400">{winner.movie.title}</h3>
                  <p className="text-gray-400">
                    {winner.votes} votes ({getPercentage(winner.votes).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </Card>

            {/* Detailed Results */}
            <Card>
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="h-5 w-5 text-primary-400" />
                <h2 className="text-xl font-bold text-white">Detailed Results</h2>
              </div>
              
              <div className="space-y-4">
                {sortedOptions.map((option, index) => {
                  const percentage = getPercentage(option.votes);
                  const isWinner = index === 0;
                  
                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 transition-all duration-300 ${
                        isWinner 
                          ? 'border-accent-500 bg-accent-500/10' 
                          : 'border-dark-600'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className={`text-2xl font-bold ${
                          isWinner ? 'text-accent-400' : 'text-gray-400'
                        }`}>
                          #{index + 1}
                        </div>

                        {/* Movie Poster */}
                        <img
                          src={option.movie.poster}
                          alt={option.movie.title}
                          className="w-16 h-20 object-cover rounded-lg"
                        />

                        {/* Movie Details and Results */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-white">
                              {option.movie.title}
                            </h3>
                            {isWinner && (
                              <Trophy className="h-5 w-5 text-accent-400" />
                            )}
                          </div>
                          
                          <p className="text-gray-400 text-sm mb-2">
                            {option.movie.genre} • {new Date(option.movie.releaseDate).getFullYear()} • ⭐ {option.movie.rating}
                          </p>

                          {/* Vote Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">{option.votes} votes</span>
                              <span className={`font-semibold ${
                                isWinner ? 'text-accent-400' : 'text-gray-400'
                              }`}>
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-dark-700 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                                  isWinner ? 'bg-accent-500' : 'bg-primary-500'
                                }`}
                                style={{ 
                                  width: `${percentage}%`,
                                  animationDelay: `${index * 0.2}s`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                className="flex-1"
              >
                View More Polls
              </Button>
              
              <Button
                onClick={() => navigate('/past-polls')}
                variant="outline"
                className="flex-1"
              >
                View Past Polls
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poll Summary */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Poll Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Total Votes:</span>
                  <span className="text-white font-semibold">{poll.totalVotes}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">Ended:</span>
                  <span className="text-white text-sm">
                    {new Date(poll.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Vote Distribution */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Vote Distribution</h3>
              <div className="space-y-2">
                {sortedOptions.map((option, index) => (
                  <div key={option.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 truncate">
                      {option.movie.title}
                    </span>
                    <span className={`font-semibold ${
                      index === 0 ? 'text-accent-400' : 'text-white'
                    }`}>
                      {getPercentage(option.votes).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Share Results */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Share Results</h3>
              <p className="text-gray-400 text-sm mb-4">
                Share these exciting results with your friends!
              </p>
              <Button variant="secondary" className="w-full" size="sm">
                Share Results
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
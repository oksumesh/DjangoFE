import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { Poll } from '../types';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

// Mock poll data (in real app, this would come from API)
const mockPoll: Poll = {
  id: '1',
  question: 'Which superhero movie should we watch this weekend?',
  description: 'Vote for your favorite superhero blockbuster! The winning movie will be shown at all participating cinemas this weekend.',
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
      votes: 32
    }
  ],
  deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'active',
  createdBy: 'admin',
  createdAt: new Date().toISOString(),
  totalVotes: 115,
  media: {
    type: 'image',
    url: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg?auto=compress&cs=tinysrgb&w=800'
  }
};

const PollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // In real app, fetch poll data from API
    setPoll(mockPoll);
    setHasVoted(!!mockPoll.userVote);
    setSelectedOption(mockPoll.userVote || '');
  }, [id]);

  if (!poll) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading poll...</div>
      </div>
    );
  }

  const timeLeft = new Date(poll.deadline).getTime() - new Date().getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
  const isExpired = timeLeft <= 0;

  const handleSubmitVote = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasVoted(true);
    setIsSubmitting(false);
    
    // Update poll data
    setPoll(prev => prev ? {
      ...prev,
      userVote: selectedOption,
      totalVotes: prev.totalVotes + (prev.userVote ? 0 : 1),
      options: prev.options.map(option => 
        option.id === selectedOption 
          ? { ...option, votes: option.votes + (prev.userVote === selectedOption ? 0 : 1) }
          : prev.userVote === option.id 
            ? { ...option, votes: option.votes - 1 }
            : option
      )
    } : null);
  };

  const getPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? (votes / poll.totalVotes) * 100 : 0;
  };

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
          Back to Polls
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Poll Header */}
            <Card>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white">{poll.question}</h1>
                {poll.description && (
                  <p className="text-gray-400 text-lg">{poll.description}</p>
                )}

                {/* Poll Media */}
                {poll.media && (
                  <div className="rounded-lg overflow-hidden">
                    {poll.media.type === 'image' ? (
                      <img
                        src={poll.media.url}
                        alt="Poll media"
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <video
                        src={poll.media.url}
                        className="w-full h-64 object-cover"
                        controls
                      />
                    )}
                  </div>
                )}

                {/* Poll Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{poll.totalVotes} votes</span>
                    </div>
                    
                    {!isExpired && (
                      <div className="flex items-center space-x-1 text-accent-400">
                        <Clock className="h-4 w-4" />
                        <span>
                          {hoursLeft > 0 ? `${hoursLeft}h ` : ''}
                          {minutesLeft}m left
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {hasVoted && (
                      <span className="flex items-center space-x-1 text-secondary-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Voted</span>
                      </span>
                    )}
                    {isExpired && (
                      <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full">
                        Poll Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Movie Options */}
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Choose Your Movie</h2>
              <div className="space-y-4">
                {poll.options.map((option) => {
                  const percentage = getPercentage(option.votes);
                  const isSelected = selectedOption === option.id;
                  const userVoted = hasVoted && poll.userVote === option.id;
                  
                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-500/10' 
                          : 'border-dark-600 hover:border-dark-500'
                      } ${isExpired || hasVoted ? 'cursor-default' : ''}`}
                      onClick={() => {
                        if (!isExpired && !hasVoted) {
                          setSelectedOption(option.id);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Radio Button */}
                        {!isExpired && !hasVoted && (
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-400'
                          }`}>
                            {isSelected && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                        )}

                        {/* Movie Poster */}
                        <img
                          src={option.movie.poster}
                          alt={option.movie.title}
                          className="w-16 h-20 object-cover rounded-lg"
                        />

                        {/* Movie Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-white">
                              {option.movie.title}
                            </h3>
                            {userVoted && (
                              <CheckCircle className="h-5 w-5 text-secondary-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {option.movie.genre} • {new Date(option.movie.releaseDate).getFullYear()}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Rating: {option.movie.rating}/10
                          </p>
                          
                          {/* Vote Count and Percentage */}
                          {(hasVoted || isExpired) && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-400">{option.votes} votes</span>
                                <span className="text-gray-400">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-dark-700 rounded-full h-2">
                                <div
                                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Submit Button */}
            {!isExpired && !hasVoted && (
              <Button
                onClick={handleSubmitVote}
                disabled={!selectedOption}
                loading={isSubmitting}
                className="w-full"
                size="lg"
              >
                Submit Vote
              </Button>
            )}

            {isExpired && (
              <Button
                onClick={() => navigate(`/results/${poll.id}`)}
                className="w-full"
                size="lg"
              >
                View Full Results
              </Button>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poll Status */}
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">Poll Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    poll.status === 'active' ? 'bg-secondary-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {poll.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Votes</span>
                  <span className="text-white font-semibold">{poll.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline</span>
                  <span className="text-white text-sm">
                    {new Date(poll.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            {(hasVoted || isExpired) && (
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Current Results</h3>
                <div className="space-y-3">
                  {poll.options
                    .sort((a, b) => b.votes - a.votes)
                    .map((option, index) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <div className={`text-lg font-bold ${
                          index === 0 ? 'text-accent-400' : 'text-gray-400'
                        }`}>
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">
                            {option.movie.title}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {option.votes} votes ({getPercentage(option.votes).toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetail;
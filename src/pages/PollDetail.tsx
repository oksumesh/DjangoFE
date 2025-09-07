import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import { Poll } from '../types';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { fetchPollDetail, submitVote } from '../services/polls';

const PollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token || !id) {
      setError('Not authenticated or poll not found');
      setLoading(false);
      return;
    }
    fetchPollDetail(id, token)
      .then(data => {
        setPoll(data);
        setHasVoted(!!data.userVote);
        setSelectedOption(data.userVote ? String(data.userVote) : '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load poll');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2F0000' }}>
        <div className="text-white text-lg">Loading poll...</div>
      </div>
    );
  }
  if (error || !poll) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2F0000' }}>
        <div className="text-red-400 text-lg">{error || 'Poll not found'}</div>
      </div>
    );
  }

  // Handle duration field from API response
  const deadline = poll.duration || poll.deadline;
  const timeLeft = deadline ? new Date(deadline).getTime() - new Date().getTime() : 0;
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
  const isExpired = timeLeft <= 0 || !poll.is_active;

  const handleSubmitVote = async () => {
    if (!selectedOption || !poll) return;
    setIsSubmitting(true);
    setError(null);
    const token = localStorage.getItem('access');
    if (!token) {
      setError('Not authenticated');
      setIsSubmitting(false);
      return;
    }
    try {
      // Get user ID from the user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData.id) {
        setError('User not found. Please log in again.');
        return;
      }
      
      // Convert user ID to number if it's a string
      const userId = typeof userData.id === 'string' ? parseInt(userData.id, 10) : userData.id;
      
      await submitVote(poll.id.toString(), selectedOption, userId, token);
      setHasVoted(true);
      // Optionally, refetch poll details to update vote counts
      const updatedPoll = await fetchPollDetail(poll.id.toString(), token);
      setPoll(updatedPoll);
    } catch (err: any) {
      setError(err.message || 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPercentage = (optionKey: string) => {
    if (poll.totalVotes === 0) return 0;
    const votes = poll.votes?.[optionKey] || 0;
    return (votes / poll.totalVotes) * 100;
  };

  const getVoteCount = (optionKey: string) => {
    return poll.votes?.[optionKey] || 0;
  };

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#2F0000' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Polls
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3">
            {/* Poll Header */}
            <Card>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">{poll.question}</h1>
                {poll.description && (
                  <p className="text-gray-400 text-sm">{poll.description}</p>
                )}

                {/* Poll Media */}
                {poll.media && (
                  <div className="rounded-lg overflow-hidden">
                    {poll.media.type === 'image' ? (
                      <img
                        src={poll.media.url}
                        alt="Poll media"
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <video
                        src={poll.media.url}
                        className="w-full h-32 object-cover"
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
              <h2 className="text-lg font-bold text-white mb-2">Choose Your Movie</h2>
              <div className="space-y-2">
                {poll.options.map((option, index) => {
                  const optionKey = String(index + 1); // Convert to 1-based key to match API
                  const percentage = getPercentage(optionKey);
                  const voteCount = getVoteCount(optionKey);
                  const isSelected = selectedOption === optionKey;
                  const userVoted = hasVoted && poll.userVote === optionKey;
                  
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-500/10' 
                          : 'border-dark-600 hover:border-dark-500'
                      } ${isExpired || hasVoted ? 'cursor-default' : ''}`}
                      onClick={() => {
                        if (!isExpired && !hasVoted) {
                          setSelectedOption(optionKey);
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

                        {/* Movie Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-white">
                              {option}
                            </h3>
                            {userVoted && (
                              <CheckCircle className="h-5 w-5 text-secondary-400" />
                            )}
                          </div>
                          
                          {/* Vote Count and Percentage */}
                          {(hasVoted || isExpired) && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-400">{voteCount} votes</span>
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
          <div className="space-y-3">
            {/* Poll Status */}
            <Card>
              <h3 className="text-base font-semibold text-white mb-2">Poll Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    poll.is_active ? 'bg-secondary-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {poll.is_active ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Votes</span>
                  <span className="text-white font-semibold">{poll.totalVotes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline</span>
                  <span className="text-white text-sm">
                    {deadline ? new Date(deadline).toLocaleDateString() : 'No deadline set'}
                  </span>
                </div>
                {!isExpired && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Left</span>
                    <span className="text-white text-sm">
                      {hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m` : `${minutesLeft}m`}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            {(hasVoted || isExpired) && (
              <Card>
                <h3 className="text-base font-semibold text-white mb-2">Current Results</h3>
                <div className="space-y-2">
                  {poll.options
                    .map((option, index) => {
                      const optionKey = String(index + 1);
                      const voteCount = getVoteCount(optionKey);
                      return { option, index, optionKey, voteCount };
                    })
                    .sort((a, b) => b.voteCount - a.voteCount)
                    .map(({ option, index, optionKey, voteCount }, sortedIndex) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`text-lg font-bold ${
                          sortedIndex === 0 ? 'text-accent-400' : 'text-gray-400'
                        }`}>
                          #{sortedIndex + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">
                            {option}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {voteCount} votes ({getPercentage(optionKey).toFixed(1)}%)
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
import React from 'react';
import { Clock, Users, ChevronRight } from 'lucide-react';
import { Poll } from '../../types';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string) => void;
  onViewDetails: (pollId: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote, onViewDetails }) => {
  const timeLeft = new Date(poll.deadline).getTime() - new Date().getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  const isExpired = timeLeft <= 0;
  const hasVoted = !!poll.userVote;

  return (
    <Card hover className="overflow-hidden h-full flex flex-col">
      {/* Poll Media - Fixed height for consistency */}
      <div className="h-48 -mx-6 -mt-6 mb-4 bg-dark-700 flex items-center justify-center">
        {poll.media ? (
          poll.media.type === 'image' ? (
            <img
              src={poll.media.url}
              alt="Poll media"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={poll.media.url}
              className="w-full h-full object-cover"
              controls
            />
          )
        ) : (
          <div className="text-gray-500 text-sm">No media</div>
        )}
      </div>

      {/* Poll Content - Flex grow to fill remaining space */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Title and Description - Fixed height area */}
        <div className="min-h-[100px]">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{poll.question}</h3>
          {poll.description && (
            <p className="text-gray-400 text-sm line-clamp-2">{poll.description}</p>
          )}
        </div>

        {/* Movie Options Preview - Fixed height */}
        <div className="h-20">
          <div className="flex space-x-2 overflow-x-auto">
            {poll.options.slice(0, 3).map((option) => (
              <div key={option.id} className="flex-shrink-0">
                <img
                  src={option.movie.poster}
                  alt={option.movie.title}
                  className="w-16 h-20 object-cover rounded-lg"
                />
              </div>
            ))}
            {poll.options.length > 3 && (
              <div className="flex-shrink-0 w-16 h-20 bg-dark-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">+{poll.options.length - 3}</span>
              </div>
            )}
          </div>
        </div>

        {/* Poll Stats */}
        <div className="flex items-center justify-between text-sm">
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
              <span className="text-xs px-2 py-1 bg-secondary-600 text-white rounded-full">
                Voted
              </span>
            )}
            {isExpired && (
              <span className="text-xs px-2 py-1 bg-red-600 text-white rounded-full">
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons - Always at bottom */}
        <div className="flex space-x-2 mt-auto">
          {!isExpired && !hasVoted && (
            <Button
              onClick={() => onVote(poll.id)}
              className="flex-1"
              size="sm"
            >
              Vote Now
            </Button>
          )}
          
          <Button
            onClick={() => onViewDetails(poll.id)}
            variant={!isExpired && !hasVoted ? 'outline' : 'primary'}
            className="flex-1"
            size="sm"
          >
            {isExpired ? 'View Results' : 'View Details'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PollCard;
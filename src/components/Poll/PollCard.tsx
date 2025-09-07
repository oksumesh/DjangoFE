import React from 'react';
import { Clock, Users, ChevronRight } from 'lucide-react';
import { Poll } from '../../types';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface PollCardProps {
  poll: Poll;
  onViewDetails: (pollId: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onViewDetails }) => {
  // Calculate time left based on duration if available
  let timeLeft = 0;
  let hoursLeft = 0;
  let minutesLeft = 0;
  let isExpired = false;

  if (poll.duration) {
    timeLeft = new Date(poll.duration).getTime() - new Date().getTime();
    hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
    isExpired = timeLeft <= 0;
  } else {
    // If no duration, consider it as active
    isExpired = false;
  }

  // Check if poll is active based on is_active field or expiration
  const isActive = poll.is_active && !isExpired;
  const hasVoted = !!poll.userVote;

  return (
    <Card hover className="overflow-hidden h-full flex flex-col">
      {/* Poll Media - Compact height */}
      <div className="h-32 -mx-6 -mt-6 mb-3 bg-gray-800 flex items-center justify-center">
        {poll.media && poll.media.type === 'image' && poll.media.url ? (
          <img
            src={poll.media.url}
            alt="Poll media"
            className="w-full h-full object-cover"
          />
        ) : poll.media && poll.media.type === 'video' && poll.media.url ? (
          <video
            src={poll.media.url}
            className="w-full h-full object-cover"
            controls
          />
        ) : poll.image_url ? (
          <img
            src={poll.image_url}
            alt="Poll media"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-500 text-xs">No media</div>
        )}
      </div>

      {/* Poll Content - Compact layout */}
      <div className="flex-1 flex flex-col space-y-3">
        {/* Title and Description - Compact height */}
        <div className="min-h-[60px]">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{poll.question}</h3>
          {poll.description && (
            <p className="text-gray-400 text-xs line-clamp-1">{poll.description}</p>
          )}
        </div>

        {/* Poll Stats - Compact */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-gray-400">
              <Users className="h-3 w-3" />
              <span>{poll.totalVotes} votes</span>
            </div>
            
            {!isExpired && poll.duration && (
              <div className="flex items-center space-x-1 text-orange-400">
                <Clock className="h-3 w-3" />
                <span>
                  {hoursLeft > 0 ? `${hoursLeft}h ` : ''}
                  {minutesLeft}m left
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {hasVoted && (
              <span className="text-xs px-2 py-0.5 bg-orange-600 text-white rounded-full">
                Voted
              </span>
            )}
            {isActive ? (
              <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full">
                Active
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 bg-red-600 text-white rounded-full">
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Action Button - Single button */}
        <div className="mt-auto">
          <Button
            onClick={() => onViewDetails(poll.id.toString())}
            className="w-full text-sm py-2"
            size="sm"
          >
            Vote Now
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PollCard;
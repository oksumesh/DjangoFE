export interface User {
  id: string;
  name: string;
  email: string;
  preferredCinemas: string[];
  isAdmin?: boolean;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  genre: string;
  releaseDate: string;
  rating: number;
}

export interface PollOption {
  id: string;
  movie: Movie;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  options: PollOption[];
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  createdBy: string;
  createdAt: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  totalVotes: number;
  userVote?: string;
}

export interface Cinema {
  id: string;
  name: string;
  location: string;
}

export interface VoteStats {
  pollId: string;
  optionId: string;
  percentage: number;
  votes: number;
}
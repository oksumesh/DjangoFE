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
  text: string;
  movie: Movie;
  votes: number;
}

export interface Poll {
  id: string | number;
  question: string;
  description?: string;
  options: string[]; // API returns options as string array
  deadline?: string; // Legacy field, use duration instead
  status?: 'active' | 'closed' | 'draft'; // Optional, use is_active instead
  createdBy: {
    id: string | number;
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  createdAt?: string;
  created_at?: string; // API uses snake_case
  updated_at?: string; // API uses snake_case
  category: string;
  is_active?: boolean; // Primary status field from API
  is_anonymous?: boolean;
  duration?: string; // Primary deadline field from API
  visibility?: string;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  image_url?: string;
  totalVotes: number;
  userVote?: string;
  votes?: { [key: string]: number }; // API votes structure: {"1": 0, "2": 0, "3": 0}
  error?: string | null; // API error field
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
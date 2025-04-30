// Define types for mock data storage

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  level?: number;
  points?: number;
  region?: string;
  country?: string;
  joinDate?: Date;
  lastActive?: Date;
}

export interface Map {
  name: string;
  furiaScore: number;
  opponentScore: number;
}

export interface Highlight {
  description: string;
  type: string;
  player: string;
  timestamp: Date;
}

export interface Match {
  _id: string;
  opponent: string;
  tournament: string;
  status: 'scheduled' | 'live' | 'finished';
  maps: Map[];
  highlights?: Highlight[];
  startTime?: Date;
}

export interface Reaction {
  userId: string;
  type: string;
  reaction: string;
}

export interface PollVote {
  userId: string;
  option: string;
}

export interface Message {
  _id: string;
  user: string;
  content: string;
  type: string;
  matchId?: string;
  pollOptions?: string[];
  pollVotes?: PollVote[];
  timestamp: Date;
  reactions: Reaction[];
}

export interface MockData {
  users: User[];
  matches: Match[];
  messages: Message[];
} 
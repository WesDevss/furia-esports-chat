import mongoose, { Document, Schema } from 'mongoose';

interface IMap {
  name: string;
  furiaScore: number;
  opponentScore: number;
}

interface IHighlight {
  description: string;
  type: 'clutch' | 'ace' | 'important' | 'other';
  player: string;
  timestamp: Date;
}

interface IPoll {
  question: string;
  options: string[];
  votes: { [key: string]: number };
  endTime: Date;
  active: boolean;
}

export interface IMatch extends Document {
  opponent: string;
  tournament: string;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'live' | 'completed';
  maps: IMap[];
  highlights: IHighlight[];
  polls: IPoll[];
  updateScore(mapIndex: number, furiaScore: number, opponentScore: number): Promise<void>;
  addHighlight(description: string, type: IHighlight['type'], player: string): Promise<void>;
  createPoll(question: string, options: string[], duration: number): Promise<void>;
  voteInPoll(pollIndex: number, option: string, userId: string): Promise<void>;
}

const MapSchema = new Schema({
  name: { type: String, required: true },
  furiaScore: { type: Number, default: 0 },
  opponentScore: { type: Number, default: 0 }
});

const HighlightSchema = new Schema({
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['clutch', 'ace', 'important', 'other'],
    required: true 
  },
  player: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const PollSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  votes: { type: Map, of: Number, default: new Map() },
  endTime: { type: Date, required: true },
  active: { type: Boolean, default: true },
  voterIds: [{ type: String }]
});

const MatchSchema = new Schema({
  opponent: { type: String, required: true },
  tournament: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { 
    type: String, 
    enum: ['scheduled', 'live', 'completed'],
    default: 'scheduled'
  },
  maps: [MapSchema],
  highlights: [HighlightSchema],
  polls: [PollSchema]
});

MatchSchema.methods.updateScore = async function(
  mapIndex: number,
  furiaScore: number,
  opponentScore: number
): Promise<void> {
  if (mapIndex >= this.maps.length) {
    throw new Error('Invalid map index');
  }
  this.maps[mapIndex].furiaScore = furiaScore;
  this.maps[mapIndex].opponentScore = opponentScore;
  await this.save();
};

MatchSchema.methods.addHighlight = async function(
  description: string,
  type: IHighlight['type'],
  player: string
): Promise<void> {
  this.highlights.push({
    description,
    type,
    player,
    timestamp: new Date()
  });
  await this.save();
};

MatchSchema.methods.createPoll = async function(
  question: string,
  options: string[],
  duration: number
): Promise<void> {
  const endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + duration);
  
  this.polls.push({
    question,
    options,
    votes: {},
    endTime,
    active: true
  });
  await this.save();
};

MatchSchema.methods.voteInPoll = async function(
  pollIndex: number,
  option: string,
  userId: string
): Promise<void> {
  if (pollIndex >= this.polls.length) {
    throw new Error('Invalid poll index');
  }

  const poll = this.polls[pollIndex];
  if (!poll.active) {
    throw new Error('Poll is no longer active');
  }

  if (!poll.options.includes(option)) {
    throw new Error('Invalid option');
  }

  if (!poll.voterIds) {
    poll.voterIds = [];
  }
  
  if (poll.voterIds.includes(userId)) {
    throw new Error('User has already voted');
  }
  
  poll.voterIds.push(userId);
  
  poll.votes[option] = (poll.votes[option] || 0) + 1;
  await this.save();
};

export const Match = mongoose.model<IMatch>('Match', MatchSchema); 
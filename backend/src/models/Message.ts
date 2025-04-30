import mongoose, { Document, Schema } from 'mongoose';
import { Message } from '../types';

export interface IMessage extends Document {
  user: Schema.Types.ObjectId;
  content: string;
  type: 'text' | 'match-update' | 'poll';
  matchId?: Schema.Types.ObjectId;
  pollOptions?: string[];
  pollVotes?: { [key: string]: number };
  reactions?: { [key: string]: string[] };
  voterIds?: string[];
  timestamp: Date;
  addReaction(userId: string, reaction: string): Promise<IMessage>;
  removeReaction(userId: string, reaction: string): Promise<IMessage>;
  vote(userId: string, option: string): Promise<IMessage>;
}

const messageSchema = new Schema<IMessage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'match-update', 'poll'],
      default: 'text',
    },
    matchId: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
    },
    pollOptions: [{
      type: String,
      trim: true,
    }],
    pollVotes: {
      type: Map,
      of: Number,
      default: {},
    },
    reactions: {
      type: Map,
      of: [String],
      default: {},
    },
    voterIds: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
messageSchema.index({ timestamp: -1 });
messageSchema.index({ user: 1, timestamp: -1 });
messageSchema.index({ matchId: 1, timestamp: -1 });

// Method to add a reaction
messageSchema.methods.addReaction = function (userId: string, reaction: string) {
  if (!this.reactions) {
    this.reactions = new Map();
  }
  
  const userReactions = this.reactions.get(reaction) || [];
  if (!userReactions.includes(userId)) {
    userReactions.push(userId);
    this.reactions.set(reaction, userReactions);
  }
  
  return this.save();
};

// Method to remove a reaction
messageSchema.methods.removeReaction = function (userId: string, reaction: string) {
  if (!this.reactions) return this.save();
  
  const userReactions = this.reactions.get(reaction) || [];
  const updatedReactions = userReactions.filter((id: string) => id !== userId);
  
  if (updatedReactions.length === 0) {
    this.reactions.delete(reaction);
  } else {
    this.reactions.set(reaction, updatedReactions);
  }
  
  return this.save();
};

// Method to vote in a poll
messageSchema.methods.vote = function (userId: string, option: string) {
  if (this.type !== 'poll') {
    throw new Error('This message is not a poll');
  }
  
  if (!this.pollOptions?.includes(option)) {
    throw new Error('Invalid poll option');
  }
  
  if (!this.pollVotes) {
    this.pollVotes = new Map();
  }
  
  // Registra o ID do usuário que votou
  if (!this.voterIds) {
    this.voterIds = [];
  }
  
  // Verifica se o usuário já votou
  if (this.voterIds.includes(userId)) {
    throw new Error('User has already voted');
  }
  
  // Adiciona o usuário à lista de votantes
  this.voterIds.push(userId);
  
  const currentVotes = this.pollVotes.get(option) || 0;
  this.pollVotes.set(option, currentVotes + 1);
  
  return this.save();
};

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);

// Export the Message interface from types.ts
export { Message }; 
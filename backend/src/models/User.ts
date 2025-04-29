import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  points: number;
  rank: string;
  joinDate: Date;
  lastActive: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateRank(): void;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    points: {
      type: Number,
      default: 0,
    },
    rank: {
      type: String,
      enum: ['Bronze', 'Prata', 'Ouro', 'Platina', 'Diamante', 'Mestre', 'Grão-Mestre'],
      default: 'Bronze',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update rank based on points
userSchema.methods.updateRank = function () {
  if (this.points >= 10000) this.rank = 'Grão-Mestre';
  else if (this.points >= 7500) this.rank = 'Mestre';
  else if (this.points >= 5000) this.rank = 'Diamante';
  else if (this.points >= 2500) this.rank = 'Platina';
  else if (this.points >= 1000) this.rank = 'Ouro';
  else if (this.points >= 500) this.rank = 'Prata';
  else this.rank = 'Bronze';
};

export const User = mongoose.model<IUser>('User', userSchema); 
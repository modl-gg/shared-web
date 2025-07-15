import mongoose, { Schema, model, Document } from 'mongoose';

export interface IAdminUser extends Document {
  email: string;
  loggedInIps: string[];
  lastActivityAt: Date;
  createdAt: Date;
}

export const AdminUserSchema = new Schema<IAdminUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  loggedInIps: [{
    type: String,
    trim: true
  }],
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'admin_users'
});

AdminUserSchema.index({ lastActivityAt: -1 }); 
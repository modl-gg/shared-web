import mongoose, { Schema, model, Document } from 'mongoose';

export interface IEmailCode extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export const EmailCodeSchema = new Schema<IEmailCode>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  used: {
    type: Boolean,
    default: false,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'email_codes'
});

EmailCodeSchema.index({ email: 1, used: 1 });
EmailCodeSchema.index({ code: 1, used: 1 }); 
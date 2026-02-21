import mongoose, { Schema, model, Document } from 'mongoose';

// This combines fields from both modl-admin and modl-panel definitions.
export interface IModlServer extends Document {
  // Core Identifiers
  _id: any; // Mongoose will add this
  serverName: string;
  customDomain: string; // The subdomain used for routing
  databaseName?: string;

  // Admin & Verification
  adminEmail: string;
  emailVerified: boolean;
  emailVerificationToken?: string;

  // Provisioning & Status
  provisioningStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  provisioningNotes?: string;
  provisioningSignInToken?: string;
  provisioningSignInTokenExpiresAt?: Date;

  // Plan & Billing
  plan: 'FREE' | 'PREMIUM';
  subscriptionStatus?: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'INACTIVE' | 'TRIALING' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'UNPAID' | 'PAUSED';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;

  // Usage Tracking & Billing
  cdnUsageCurrentPeriod?: number; // GB used in current billing period
  aiRequestsCurrentPeriod?: number; // AI requests used in current billing period
  usageBillingEnabled?: boolean; // Whether to charge for overages
  usageBillingUpdatedAt?: Date;

  // Migration Settings
  migrationFileSizeLimit?: number; // Custom migration file size limit in bytes (optional, defaults to 5GB)

  // Custom Domain
  customDomainOverride?: string;
  customDomainStatus?: 'PENDING' | 'ACTIVE' | 'ERROR' | 'VERIFYING';
  customDomainLastChecked?: Date;
  customDomainError?: string;
  customDomainCloudflareId?: string;
  
  // Analytics/Stats from modl-admin
  userCount: number;
  ticketCount: number;
  region?: string;
  lastActivityAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export const ModlServerSchema = new Schema<IModlServer>({
  serverName: { type: String, required: true, unique: true, trim: true },
  customDomain: { type: String, required: true, unique: true, trim: true },
  adminEmail: { type: String, required: true, lowercase: true, trim: true },
  databaseName: { type: String, sparse: true },

  emailVerified: { type: Boolean, default: false, index: true },
  emailVerificationToken: { type: String, unique: true, sparse: true },
  
  provisioningStatus: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'], default: 'PENDING', index: true },
  provisioningNotes: { type: String },
  provisioningSignInToken: { type: String, unique: true, sparse: true },
  provisioningSignInTokenExpiresAt: { type: Date },

  plan: { type: String, enum: ['FREE', 'PREMIUM'], default: 'FREE', index: true },
  subscriptionStatus: { type: String, enum: ['ACTIVE', 'CANCELED', 'PAST_DUE', 'INACTIVE', 'TRIALING', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'UNPAID', 'PAUSED'], default: 'INACTIVE', index: true },
  currentPeriodStart: { type: Date, sparse: true },
  currentPeriodEnd: { type: Date, sparse: true },
  stripeCustomerId: { type: String, unique: true, sparse: true },
  stripeSubscriptionId: { type: String, unique: true, sparse: true },

  // Usage Tracking & Billing
  cdnUsageCurrentPeriod: { type: Number, default: 0 },
  aiRequestsCurrentPeriod: { type: Number, default: 0 },
  usageBillingEnabled: { type: Boolean, default: false },
  usageBillingUpdatedAt: { type: Date, sparse: true },
  
  // Migration Settings
  migrationFileSizeLimit: { type: Number, sparse: true },
  
  customDomainOverride: { type: String, unique: true, sparse: true },
  customDomainStatus: { type: String, enum: ['PENDING', 'ACTIVE', 'ERROR', 'VERIFYING'], sparse: true },
  customDomainLastChecked: { type: Date, sparse: true },
  customDomainError: { type: String, sparse: true },
  customDomainCloudflareId: { type: String, unique: true, sparse: true },
  
  userCount: { type: Number, default: 0 },
  ticketCount: { type: Number, default: 0 },
  region: { type: String, trim: true, sparse: true },
  lastActivityAt: { type: Date, sparse: true },
  
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'servers' 
});

// Indexes for common queries
ModlServerSchema.index({ adminEmail: 1 });
ModlServerSchema.index({ plan: 1, subscriptionStatus: 1 });
ModlServerSchema.index({ provisioningStatus: 1, emailVerified: 1 });
ModlServerSchema.index({ serverName: 'text', customDomain: 'text', adminEmail: 'text' });

// Only create the model on server-side (Node.js environment)
export const ModlServerModel = typeof window === 'undefined' && mongoose?.models
  ? (mongoose.models.ModlServer || model<IModlServer>('ModlServer', ModlServerSchema))
  : null; 

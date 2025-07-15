import mongoose, { Schema, Document } from 'mongoose';

export const SECURITY_EVENT_TYPES = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  CONFIG_CHANGE: 'config_change',
  PRIVILEGE_ESCALATION: 'privilege_escalation',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  UNAUTHORIZED_ACCESS: 'unauthorized_access'
};

export interface ISecurityEvent extends Document {
  timestamp: Date;
  type: string;
  source: string;
  target: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  details: Record<string, any>;
}

export const SecurityEventSchema = new Schema<ISecurityEvent>({
  timestamp: { type: Date, default: Date.now, index: -1 },
  type: { type: String, enum: Object.values(SECURITY_EVENT_TYPES), required: true, index: true },
  source: { type: String, required: true, index: true }, // e.g. IP address
  target: { type: String, required: true, index: true }, // e.g. endpoint, service name
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true, index: true },
  blocked: { type: Boolean, default: false },
  details: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: false,
  collection: 'security_events'
});

SecurityEventSchema.index({ timestamp: -1, severity: 1 });
SecurityEventSchema.index({ type: 1, timestamp: -1 });
// TTL index to automatically delete old events after 180 days
SecurityEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 }); 
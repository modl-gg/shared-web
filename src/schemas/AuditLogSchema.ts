import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: Date;
  adminId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
  success: boolean;
}

export const AuditLogSchema = new Schema<IAuditLog>({
  timestamp: { type: Date, default: Date.now, index: -1 },
  adminId: { type: String, required: true, index: true },
  action: { type: String, required: true, index: true },
  resource: { type: String, required: true, index: true },
  details: { type: Schema.Types.Mixed, default: {} },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true, index: true },
  success: { type: Boolean, required: true, index: true }
}, {
  timestamps: false,
  collection: 'audit_logs'
});

AuditLogSchema.index({ timestamp: -1, severity: 1 });
// TTL index to automatically delete old logs after 1 year
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }); 
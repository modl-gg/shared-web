import mongoose, { Schema, model, Document } from 'mongoose';

export interface ISystemConfig extends Document {
  configId: string;
  general: {
    systemName: string;
    adminEmail: string;
    timezone: string;
    defaultLanguage: string;
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  logging: {
    pm2LoggingEnabled: boolean;
    logRetentionDays: number;
    maxLogSizePerDay: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    requireTwoFactor: boolean;
    passwordMinLength: number;
    passwordRequireSpecial: boolean;
    ipWhitelist: string[];
    corsOrigins: string[];
  };
  notifications: {
    emailNotifications: boolean;
    criticalAlerts: boolean;
    weeklyReports: boolean;
    maintenanceAlerts: boolean;
    slackWebhook?: string;
    discordWebhook?: string;
  };
  performance: {
    cacheTtl: number;
    rateLimitRequests: number;
    rateLimitWindow: number;
    databaseConnectionPool: number;
    enableCompression: boolean;
    enableCaching: boolean;
  };
  features: {
    analyticsEnabled: boolean;
    auditLoggingEnabled: boolean;
    apiAccessEnabled: boolean;
    bulkOperationsEnabled: boolean;
    advancedFiltering: boolean;
    realTimeUpdates: boolean;
  };
}

export const SystemConfigSchema = new Schema<ISystemConfig>({
  configId: { type: String, required: true, unique: true, default: 'main_config' },
  general: { type: Object, required: true },
  logging: { type: Object, required: true },
  security: { type: Object, required: true },
  notifications: { type: Object, required: true },
  performance: { type: Object, required: true },
  features: { type: Object, required: true }
}, {
  timestamps: true,
  collection: 'system_configs'
}); 
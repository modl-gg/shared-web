import { Types, Connection } from 'mongoose';
import { IModlServer } from '../schemas/ModlServerSchema';

// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any;
}

// Admin & Staff
export interface AdminUser {
  _id: string;
  email: string;
  loggedInIps: string[];
  lastActivityAt: Date;
  createdAt: Date;
}

export interface StaffMember {
  _id: string;
  email: string;
  username: string;
  role: 'Super Admin' | 'Admin' | 'Moderator' | 'Helper';
  createdAt: string;
  status: 'Active' | 'Pending Invitation';
}

export interface Invitation {
  _id: string;
  email: string;
  role: 'Admin' | 'Moderator' | 'Helper';
  token: string;
  expiresAt: Date;
  status: 'pending' | 'accepted';
}

// Authentication & Session
export interface EmailCode {
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// @ts-ignore
declare module 'express-session' {
  interface SessionData {
    adminId?: string;
    userId?: string;
    email?: string;
    username?: string;
    role?: 'Super Admin' | 'Admin' | 'Moderator' | 'Helper';
    isAuthenticated?: boolean;
  }
}

declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminUser;
      currentUser?: {
        userId: string;
        email: string;
        username: string;
        role: 'Super Admin' | 'Admin' | 'Moderator' | 'Helper';
      },
      serverDbConnection?: Connection;
      serverName?: string;
      modlServer?: IModlServer;
    }
  }
}

// Player & Punishments
export interface IUsername {
  username: string;
  date: Date;
}

export interface INote {
  text: string;
  date: Date;
  issuerName: string;
  issuerId?: string;
}

export interface IIPAddress {
  ipAddress: string;
  country?: string;
  region?: string;
  asn?: string;
  proxy?: boolean;
  hosting?: boolean;
  firstLogin: Date;
  logins: Date[];
}

export interface IModification {
  type: string;
  issuerName: string;
  issued: Date;
  effectiveDuration?: number;
  reason?: string;
}

export interface IEvidence {
  text: string;
  issuerName: string;
  date: Date;
  type: 'text' | 'url' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export interface IPunishment {
  id: string;
  issuerName: string;
  issued: Date;
  started?: Date; // Only set when server acknowledges execution
  type_ordinal: number;
  modifications: IModification[];
  notes: INote[];
  evidence: IEvidence[];
  attachedTicketIds: string[];
  data: Map<string, any>;
}

export interface IPlayer {
  _id: string;
  minecraftUuid: string;
  usernames: IUsername[];
  notes: INote[];
  ipList: IIPAddress[];
  punishments: IPunishment[];
  pendingNotifications: any[];
  data: Map<string, any>;
}

export interface Player {
  _id: string;
  minecraftUuid: string;
  usernames: { username: string; date: Date }[];
  notes: { text: string; date: Date; issuerName: string; issuerId?: string }[];
  ipList: { ipAddress: string; country?: string; region?: string; asn?: string; firstLogin: Date; logins: Date[] }[];
  punishments: any[]; // Define punishment structure if needed
  status: 'Active' | 'Warned' | 'Banned';
  lastOnline: string;
}


// Tickets & Appeals
export interface IReply {
  _id?: any;
  name: string;
  content: string;
  type: string;
  created: Date;
  staff?: boolean;
  avatar?: string;
  action?: string;
  attachments?: any[];
  creatorIdentifier?: string; // Browser/device identifier for creator verification
}

export interface ITicket extends Document {
  _id: string;
  tags: string[];
  type: 'bug' | 'player' | 'chat' | 'appeal' | 'staff' | 'support';
  status: string;
  subject: string;
  created: Date;
  updatedAt: Date;
  creator: string;
  creatorUuid: string;
  reportedPlayer?: string;
  reportedPlayerUuid?: string;
  chatMessages?: string[];
  notes: any[]; // Consider defining a proper INote interface
  replies: IReply[];
  locked: boolean;
  formData: Map<string, any>;
  data: Map<string, any>;
}

// Knowledgebase
export interface KnowledgebaseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  ordinal: number;
  articles: KnowledgebaseArticleStub[];
}

export interface KnowledgebaseArticleStub {
  id: string;
  title: string;
  slug: string;
  ordinal: number;
  is_visible: boolean;
  categoryId: string;
}

export interface KnowledgebaseArticle extends KnowledgebaseArticleStub {
  content: string;
  category: { id: string; name: string; slug: string; };
  created_at: string;
  updated_at: string;
}

// Homepage Cards
export interface HomepageCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon_color?: string;
  action_type: 'url' | 'category_dropdown';
  action_url?: string;
  action_button_text?: string;
  category_id?: string;
  background_color?: string;
  is_enabled: boolean;
  ordinal: number;
  category?: KnowledgebaseCategory;
}

// System & Logs
export interface SystemLog {
  _id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  category?: string;
  timestamp: string;
  metadata?: Record<string, any>;
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface AuditLog {
  user: string;
  userType: string;
  actionType: 'staff' | 'ai' | 'system' | 'admin';
  action: string;
  detail: string;
  viewText: string;
  time: string;
  color: 'primary' | 'secondary' | 'info' | 'warning';
}

// Window Management
export interface WindowPosition {
  x: number | string;
  y: number | string;
}

export interface Window {
  id: string;
  title: string;
  isOpen: boolean;
  position: WindowPosition;
  size: { width: number; height: number };
}

export interface WindowState {
  windows: Record<string, Window>;
}

// Registration (from modl-landing)
export interface Registration {
  email: string;
  serverName: string;
  customDomain: string;
  plan: 'free' | 'premium';
  agreeTerms: boolean;
}

// This is a simplified version for the landing page's conceptual schema
export interface InsertServer {
  adminEmail: string;
  serverName: string;
  customDomain: string;
  plan: 'free' | 'premium';
  emailVerificationToken?: string;
  emailVerified?: boolean;
}
export type Server = InsertServer & { id: string; }; 
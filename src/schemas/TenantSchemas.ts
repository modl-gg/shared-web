import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';

// Player Schemas
export const UsernameSchema = new Schema({
  username: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const NoteSchema = new Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  issuerName: { type: String, required: true },
  issuerId: { type: String }
});

export const IpAddressSchema = new Schema({
  ipAddress: { type: String, required: true },
  country: { type: String },
  region: { type: String },
  asn: { type: String },
  proxy: { type: Boolean, default: false },
  hosting: { type: Boolean, default: false },
  firstLogin: { type: Date, default: Date.now },
  logins: [{ type: Date }]
});

export const ModificationSchema = new Schema({
  type: { type: String, required: true },
  issuerName: { type: String, required: true },
  issued: { type: Date, default: Date.now },
  effectiveDuration: { type: Number },
  reason: { type: String }
});

export const EvidenceSchema = new Schema({
  text: { type: String, required: true },
  issuerName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['text', 'url', 'file'], default: 'text' },
  fileUrl: { type: String },
  fileName: { type: String },
  fileType: { type: String },
  fileSize: { type: Number }
});

export const PunishmentSchema = new Schema({
  id: { type: String, required: true },
  issuerName: { type: String, required: true },
  issued: { type: Date, default: Date.now },
  started: { type: Date, default: null }, // No default - only set when server acknowledges
  type_ordinal: { type: Number, required: true },
  modifications: [ModificationSchema],
  notes: [NoteSchema],
  evidence: [EvidenceSchema],
  attachedTicketIds: [{ type: String }],
  data: { type: Map, of: mongoose.Schema.Types.Mixed }
});

// Define notification schema for type safety
export const NotificationSchema = new Schema({
  id: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  timestamp: { type: Date, required: true },
  data: { type: Map, of: mongoose.Schema.Types.Mixed }
}, { _id: false }); // Disable _id for subdocuments

export const PlayerSchema = new Schema({
  _id: { type: String, required: true },
  minecraftUuid: { type: String, required: true, unique: true },
  usernames: [UsernameSchema],
  notes: [NoteSchema],
  ipList: [IpAddressSchema],
  ipAddresses: [IpAddressSchema],
  punishments: [PunishmentSchema],
  pendingNotifications: [NotificationSchema],
  data: { type: Map, of: mongoose.Schema.Types.Mixed }
});

// Staff & Invitation Schemas
export const StaffSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true }, // Removed enum to allow custom roles - validation handled in application logic
  assignedMinecraftUuid: { type: String, sparse: true, index: true },
  assignedMinecraftUsername: { type: String, sparse: true },
  
  // Ticket subscription tracking
  subscribedTickets: [{
    ticketId: { type: String, required: true },
    subscribedAt: { type: Date, default: Date.now },
    lastReadAt: { type: Date },
    active: { type: Boolean, default: true }
  }],
  
  // Ticket subscription settings
  ticketSubscriptionSettings: {
    // Enable/disable all ticket notifications
    enabled: { type: Boolean, default: true },
    // Email notification preferences
    emailNotifications: {
      enabled: { type: Boolean, default: true },
      // Notification types for email
      newTickets: { type: Boolean, default: true },
      ticketReplies: { type: Boolean, default: true },
      ticketStatusChanges: { type: Boolean, default: true },
      ticketAssignments: { type: Boolean, default: true },
      // Ticket type subscriptions
      subscribedTypes: {
        type: [String],
        enum: ['bug', 'player', 'chat', 'appeal', 'staff', 'support'],
        default: ['bug', 'player', 'chat', 'appeal', 'staff', 'support']
      }
    },
    // Push notification preferences (for future web push notifications)
    pushNotifications: {
      enabled: { type: Boolean, default: false },
      newTickets: { type: Boolean, default: false },
      ticketReplies: { type: Boolean, default: false },
      ticketStatusChanges: { type: Boolean, default: false },
      ticketAssignments: { type: Boolean, default: false }
    },
    // Frequency settings
    frequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily', 'weekly'],
      default: 'immediate'
    }
  }
}, { timestamps: true });

export const InvitationSchema = new Schema({
  email: { type: String, required: true },
  role: { type: String, required: true }, // Removed enum to allow custom roles - validation handled in application logic
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });


// Ticket Schemas
export const TicketNoteSchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const ReplySchema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  created: { type: Date, default: Date.now },
  staff: { type: Boolean, default: false },
  action: { type: String },
  attachments: [{ type: mongoose.Schema.Types.Mixed }],
  creatorIdentifier: { type: String } // Browser/device identifier for creator verification
});

export const TicketSchema = new Schema({
  _id: { type: String },
  tags: [{ type: String }],
  type: { type: String, required: true, enum: ['bug', 'player', 'chat', 'appeal', 'staff', 'support'], default: 'bug' },
  status: { type: String, required: true, enum: ['Unfinished', 'Open', 'Closed', 'Under Review', 'Pending Player Response', 'Resolved'], default: 'Unfinished' },
  subject: { type: String, default: '' },
  created: { type: Date, default: Date.now },
  creatorName: { type: String, required: true },
  creatorUuid: { type: String },
  reportedPlayer: { type: String },
  reportedPlayerUuid: { type: String },
  chatMessages: [{ type: String }],
  notes: [TicketNoteSchema],
  replies: [ReplySchema],
  locked: { type: Boolean, default: false },
  formData: { type: Map, of: mongoose.Schema.Types.Mixed },
  data: { type: Map, of: mongoose.Schema.Types.Mixed }
}, { timestamps: true });


// Log Schema
export const LogSchema = new Schema({
  created: { type: Date, default: Date.now },
  description: { type: String, required: true },
  level: { type: String, enum: ['info', 'warning', 'error', 'moderation'], default: 'info' },
  source: { type: String, default: 'system' }
});


// Settings Schema
export const FormFieldSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'textarea', 'select', 'checkbox', 'radio'] },
  required: { type: Boolean, default: false },
  options: [{ type: String }],
  placeholder: { type: String },
  helpText: { type: String }
});

export const FormTemplateSchema = new Schema({
  ticketType: { type: String, required: true, enum: ['bug', 'player', 'chat', 'staff', 'support'] },
  title: { type: String, required: true },
  description: { type: String },
  fields: [FormFieldSchema]
});

export const SettingsSchema = new Schema({
  formTemplates: [FormTemplateSchema],
  settings: { type: Map, of: mongoose.Schema.Types.Mixed }
});


// Knowledgebase Schemas
export const KnowledgebaseArticleSchema = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    isVisible: { type: Boolean, default: true },
    ordinal: { type: Number, default: 0 },
  }, { timestamps: true }
);

KnowledgebaseArticleSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const KnowledgebaseCategorySchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true },
    ordinal: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

KnowledgebaseCategorySchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

KnowledgebaseCategorySchema.virtual('articles', {
  ref: 'KnowledgebaseArticle',
  localField: '_id',
  foreignField: 'categoryId',
  justOne: false,
  options: { sort: { ordinal: 1 } }
});


// Homepage Card Schema
export const HomepageCardSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    iconColor: { type: String, trim: true },
    actionType: { type: String, required: true, enum: ['url', 'category_dropdown'], default: 'url' },
    actionUrl: { type: String, trim: true,
      validate: {
        validator: function(this: any, v: string) {
          return this.actionType !== 'url' || Boolean(v && v.length > 0);
        },
        message: 'URL is required when action type is URL'
      }
    },
    actionButtonText: { type: String, trim: true,
      default: function(this: any) {
        return this.actionType === 'url' ? 'Learn More' : undefined;
      }
    },
    categoryId: { type: String,
      validate: {
        validator: function(this: any, v: string) {
          return this.actionType !== 'category_dropdown' || Boolean(v);
        },
        message: 'Category is required when action type is category dropdown'
      }
    },
    backgroundColor: { type: String, trim: true },
    isEnabled: { type: Boolean, default: true },
    ordinal: { type: Number, default: 0 },
  }, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

HomepageCardSchema.virtual('category', {
  ref: 'KnowledgebaseCategory',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
}); 

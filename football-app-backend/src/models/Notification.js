// src/models/Notification.js - AI-ENHANCED ⚡
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // User who will receive the notification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Index for faster queries
  },

  // Notification type for categorization
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    enum: [
      'match_reminder',     // Match starting soon
      'match_result',       // Match finished
      'team_update',        // Team news/updates
      'league_update',      // League standings/news
      'player_news',        // Player transfer/injury news
      'educational_new',    // New educational content
      'achievement',        // User achievements
      'system',            // System announcements
      'promotion',         // App promotions
      'social'             // Social interactions
    ],
    index: true
  },

  // 🆕 AI Enhancement: Multi-language Support (i18n)
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },

  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters'],
    trim: true
  },

  // 🆕 AI Enhancement: Multi-language content support
  i18n: {
    en: {
      title: {
        type: String,
        maxlength: [100, 'English title cannot exceed 100 characters'],
        trim: true
      },
      message: {
        type: String,
        maxlength: [500, 'English message cannot exceed 500 characters'],
        trim: true
      }
    },
    hi: {
      title: {
        type: String,
        maxlength: [100, 'Hindi title cannot exceed 100 characters'],
        trim: true
      },
      message: {
        type: String,
        maxlength: [500, 'Hindi message cannot exceed 500 characters'],
        trim: true
      }
    },
    // Ready for more languages (Punjabi, Bengali, etc.)
    default: {}
  },

  // Related entity references (optional)
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['match', 'team', 'league', 'player', 'news', 'educational_content', 'user'],
      default: null
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },

  // Notification status
  status: {
    type: String,
    enum: ['unread', 'read', 'dismissed'],
    default: 'unread',
    index: true
  },

  // 🆕 AI Enhancement: Soft Delete for Auditing
  isDeleted: {
    type: Boolean,
    default: false,
    index: true // For efficient filtering
  },

  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Delivery settings
  delivery: {
    // In-app notification
    inApp: {
      type: Boolean,
      default: true
    },
    // Push notification
    push: {
      type: Boolean,
      default: false
    },
    // Email notification
    email: {
      type: Boolean,
      default: false
    },
    // SMS notification
    sms: {
      type: Boolean,
      default: false
    }
  },

  // Scheduling (for future notifications)
  scheduledFor: {
    type: Date,
    default: null,
    index: true
  },

  // When notification was actually sent
  sentAt: {
    type: Date,
    default: null
  },

  // When user read the notification
  readAt: {
    type: Date,
    default: null
  },

  // 🆕 AI Enhancement: User Interaction Analytics
  interactedAt: {
    type: Date,
    default: null
  },

  interactionType: {
    type: String,
    enum: ['clicked', 'dismissed', 'ignored', 'opened', 'shared'],
    default: null
  },

  // 🆕 AI Enhancement: Enhanced Action Button with Action Types
  actionButton: {
    text: {
      type: String,
      maxlength: [30, 'Action button text cannot exceed 30 characters']
    },
    action: {
      type: String, // URL or action identifier
      maxlength: [200, 'Action cannot exceed 200 characters']
    },
    // 🆕 AI Enhancement: Action Type Classification
    actionType: {
      type: String,
      enum: ['open_url', 'navigate_internal', 'dismiss', 'custom', 'share', 'download'],
      default: 'navigate_internal'
    }
  },

  // Notification metadata
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },

  // 🆕 AI Enhancement: Delivery Tracking
  deliveryStatus: {
    inApp: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date, default: null },
      error: { type: String, default: null }
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date, default: null },
      error: { type: String, default: null }
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date, default: null },
      error: { type: String, default: null }
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: { type: Date, default: null },
      error: { type: String, default: null }
    }
  },

  // Expiry date (auto-delete old notifications)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      // Don't expose deleted notifications in API responses
      if (ret.isDeleted) {
        return null;
      }
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// 🆕 AI Enhancement: Enhanced Compound Indexes
notificationSchema.index({ userId: 1, status: 1, isDeleted: 1 }); // Active user notifications
notificationSchema.index({ userId: 1, type: 1, isDeleted: 1 }); // User notifications by type (non-deleted)
notificationSchema.index({ userId: 1, createdAt: -1, isDeleted: 1 }); // Recent active notifications
notificationSchema.index({ scheduledFor: 1, status: 1, isDeleted: 1 }); // Scheduled active notifications
notificationSchema.index({ type: 1, createdAt: -1, isDeleted: 1 }); // Recent active by type
notificationSchema.index({ interactionType: 1, createdAt: -1 }); // Analytics queries

// Virtual for checking if notification is recent (last 24 hours)
notificationSchema.virtual('isRecent').get(function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Virtual for time since creation
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// 🆕 AI Enhancement: Virtual for localized content
notificationSchema.virtual('localizedContent').get(function() {
  // Default to English, fallback to original title/message
  return {
    title: this.i18n?.en?.title || this.title,
    message: this.i18n?.en?.message || this.message
  };
});

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// 🆕 AI Enhancement: Soft delete instead of hard delete
notificationSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.status = 'dismissed';
  return this.save();
};

// Instance method to dismiss notification
notificationSchema.methods.dismiss = function() {
  this.status = 'dismissed';
  return this.save();
};

// 🆕 AI Enhancement: Track user interaction
notificationSchema.methods.trackInteraction = function(interactionType) {
  this.interactionType = interactionType;
  this.interactedAt = new Date();
  return this.save();
};

// 🆕 AI Enhancement: Get localized content by language
notificationSchema.methods.getLocalizedContent = function(language = 'en') {
  if (this.i18n && this.i18n[language]) {
    return {
      title: this.i18n[language].title || this.title,
      message: this.i18n[language].message || this.message
    };
  }
  return {
    title: this.title,
    message: this.message
  };
};

// Static method to get user's unread count (excluding deleted)
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    userId: userId, 
    status: 'unread',
    isDeleted: false 
  });
};

// Static method to get user's recent notifications (excluding deleted)
notificationSchema.statics.getRecentNotifications = function(userId, limit = 10) {
  return this.find({ 
    userId: userId,
    isDeleted: false 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('relatedEntity.entityId');
};

// Static method to mark all as read for user
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { 
      userId: userId, 
      status: 'unread',
      isDeleted: false 
    },
    { 
      status: 'read',
      readAt: new Date()
    }
  );
};

// 🆕 AI Enhancement: Get interaction analytics
notificationSchema.statics.getInteractionAnalytics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$interactionType',
        count: { $sum: 1 },
        avgResponseTime: {
          $avg: {
            $subtract: ['$interactedAt', '$createdAt']
          }
        }
      }
    }
  ]);
};

// Static method to create match reminder notifications
notificationSchema.statics.createMatchReminder = function(userId, match, minutesBefore = 30) {
  const scheduledTime = new Date(match.date.getTime() - (minutesBefore * 60 * 1000));
  
  return this.create({
    userId: userId,
    type: 'match_reminder',
    title: `Match Starting Soon!`,
    message: `${match.homeTeam.name} vs ${match.awayTeam.name} starts in ${minutesBefore} minutes`,
    // 🆕 AI Enhancement: Multi-language reminder
    i18n: {
      en: {
        title: `Match Starting Soon!`,
        message: `${match.homeTeam.name} vs ${match.awayTeam.name} starts in ${minutesBefore} minutes`
      },
      hi: {
        title: `मैच जल्दी शुरू हो रहा है!`,
        message: `${match.homeTeam.name} बनाम ${match.awayTeam.name} ${minutesBefore} मिनट में शुरू होता है`
      }
    },
    relatedEntity: {
      entityType: 'match',
      entityId: match._id
    },
    scheduledFor: scheduledTime,
    priority: 'high',
    delivery: {
      inApp: true,
      push: true
    }
  });
};

// Static method to create bulk notifications
notificationSchema.statics.createBulkNotifications = function(notifications) {
  return this.insertMany(notifications);
};

// 🆕 AI Enhancement: Hard cleanup of very old soft-deleted notifications
notificationSchema.statics.cleanupOldDeletedNotifications = function(daysOld = 90) {
  const cutoffDate = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
  return this.deleteMany({
    isDeleted: true,
    updatedAt: { $lt: cutoffDate }
  });
};

// Pre-save middleware to set sentAt when status changes to read
notificationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'read' && !this.sentAt) {
    this.sentAt = new Date();
  }
  next();
});

// Pre-save middleware for scheduling validation
notificationSchema.pre('save', function(next) {
  if (this.scheduledFor && this.scheduledFor <= new Date()) {
    this.scheduledFor = null; // Clear if scheduled time has passed
  }
  next();
});

// 🆕 AI Enhancement: Pre-find middleware to exclude deleted by default
notificationSchema.pre(/^find/, function(next) {
  // Only add this filter if it hasn't been explicitly set
  if (!this.getQuery().hasOwnProperty('isDeleted')) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

// 🆕 AI Enhancement: Post-save hook for real-time broadcasting (Socket.io ready)
notificationSchema.post('save', function(doc, next) {
  // Ready for Socket.io integration
  // Example: socketService.emitToUser(doc.userId, 'newNotification', doc);
  
  // Log for debugging (remove in production)
  console.log(`📱 Notification ${doc.type} created for user ${doc.userId}`);
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
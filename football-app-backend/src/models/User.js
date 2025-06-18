// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication fields
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Profile information
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [30, 'First name cannot exceed 30 characters']
    },
    
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [30, 'Last name cannot exceed 30 characters']
    },
    
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(date) {
          return date < new Date();
        },
        message: 'Date of birth must be in the past'
      }
    },
    
    profilePicture: {
      type: String,
      default: null
    },
    
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      trim: true
    },
    
    location: {
      country: String,
      state: String,
      city: String
    }
  },
  
  // Football preferences
  footballPreferences: {
    favoriteTeams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }],
    
    favoriteLeagues: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League'
    }],
    
    favoritePosition: {
      type: String,
      enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger']
    },
    
    playingLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
      default: 'Beginner'
    }
  },
  
  // App usage data
  appData: {
    joinDate: {
      type: Date,
      default: Date.now
    },
    
    lastActive: {
      type: Date,
      default: Date.now
    },
    
    totalMatches: {
      type: Number,
      default: 0
    },
    
    newsRead: {
      type: Number,
      default: 0
    },
    
    lessonsCompleted: {
      type: Number,
      default: 0
    }
  },
  
  // Settings
  settings: {
    notifications: {
      matchAlerts: {
        type: Boolean,
        default: true
      },
      newsUpdates: {
        type: Boolean,
        default: true
      },
      teamUpdates: {
        type: Boolean,
        default: true
      },
      educationalContent: {
        type: Boolean,
        default: true
      }
    },
    
    privacy: {
      profileVisible: {
        type: Boolean,
        default: true
      },
      showFavoriteTeams: {
        type: Boolean,
        default: true
      }
    },
    
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi']
    },
    
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },
  
  // Account status
  accountStatus: {
    isVerified: {
      type: Boolean,
      default: false
    },
    
    isActive: {
      type: Boolean,
      default: true
    },
    
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },
    
    subscriptionType: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'appData.lastActive': -1 });
userSchema.index({ 'footballPreferences.favoriteTeams': 1 });
// 🔍 CHATGPT SUGGESTION #1: Compound index for team + league-based personalization
userSchema.index({
  'footballPreferences.favoriteTeams': 1,
  'footballPreferences.favoriteLeagues': 1
});

// Virtual for full name
userSchema.virtual('profile.fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for age
userSchema.virtual('profile.age').get(function() {
  if (!this.profile.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.profile.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Static method to find active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ 'accountStatus.isActive': true });
};

// Static method to find users by favorite team
userSchema.statics.findByFavoriteTeam = function(teamId) {
  return this.find({ 'footballPreferences.favoriteTeams': teamId });
};

// Remove existing pre-save password hashing middleware
// Add instead a new static method for auth
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Update comparePassword to be simpler
userSchema.methods.comparePassword = function(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = mongoose.model('User', userSchema);
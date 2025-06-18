// src/models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    maxlength: [100, 'Player name cannot exceed 100 characters']
  },
  
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(date) {
        return date < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true,
    maxlength: [50, 'Nationality cannot exceed 50 characters']
  },
  
  // Physical Attributes
  height: {
    type: Number, // in cm
    min: [140, 'Height must be at least 140cm'],
    max: [220, 'Height cannot exceed 220cm']
  },
  
  weight: {
    type: Number, // in kg
    min: [40, 'Weight must be at least 40kg'],
    max: [150, 'Weight cannot exceed 150kg']
  },
  
  // 🆕 CHATGPT ENHANCEMENT: Footedness for tactical analysis
  foot: {
    type: String,
    enum: ['Left', 'Right', 'Both'],
    default: 'Right'
  },
  
  // Team & Position
  currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  
  position: {
    type: String,
    required: [true, 'Position is required'],
    enum: {
      values: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'],
      message: 'Position must be Goalkeeper, Defender, Midfielder, or Forward'
    }
  },
  
  detailedPosition: {
    type: String,
    enum: [
      // Goalkeeper
      'Goalkeeper',
      // Defenders
      'Centre-Back', 'Left-Back', 'Right-Back', 'Wing-Back',
      // Midfielders
      'Defensive Midfielder', 'Central Midfielder', 'Attacking Midfielder', 
      'Left Midfielder', 'Right Midfielder',
      // Forwards
      'Striker', 'Winger', 'False 9', 'Second Striker'
    ]
  },
  
  jerseyNumber: {
    type: Number,
    min: [1, 'Jersey number must be at least 1'],
    max: [99, 'Jersey number cannot exceed 99']
  },
  
  // Career Statistics
  statistics: {
    matchesPlayed: {
      type: Number,
      default: 0,
      min: [0, 'Matches played cannot be negative']
    },
    goals: {
      type: Number,
      default: 0,
      min: [0, 'Goals cannot be negative']
    },
    assists: {
      type: Number,
      default: 0,
      min: [0, 'Assists cannot be negative']
    },
    yellowCards: {
      type: Number,
      default: 0,
      min: [0, 'Yellow cards cannot be negative']
    },
    redCards: {
      type: Number,
      default: 0,
      min: [0, 'Red cards cannot be negative']
    },
    minutesPlayed: {
      type: Number,
      default: 0,
      min: [0, 'Minutes played cannot be negative']
    }
  },
  
  // Market Information
  marketValue: {
    type: Number, // in millions
    min: [0, 'Market value cannot be negative']
  },
  
  contractExpiry: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Contract expiry must be in the future'
    }
  },
  
  // Media & Social
  profileImage: {
    type: String,
    validate: {
      validator: function(url) {
        return !url || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
      },
      message: 'Profile image must be a valid image URL'
    }
  },
  
  socialMedia: {
    instagram: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || /^https?:\/\/(www\.)?instagram\.com\//.test(url);
        },
        message: 'Invalid Instagram URL'
      }
    },
    twitter: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//.test(url);
        },
        message: 'Invalid Twitter/X URL'
      }
    }
  },
  
  // Status & Availability
  isActive: {
    type: Boolean,
    default: true
  },
  
  injuryStatus: {
    isInjured: {
      type: Boolean,
      default: false
    },
    injuryDescription: {
      type: String,
      maxlength: [200, 'Injury description cannot exceed 200 characters']
    },
    expectedReturn: {
      type: Date,
      validate: {
        validator: function(date) {
          return !date || date >= new Date();
        },
        message: 'Expected return date must be in the future or today'
      }
    }
  },
  
  // Additional Information
  biography: {
    type: String,
    maxlength: [1000, 'Biography cannot exceed 1000 characters']
  },
  
  achievements: [{
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      maxlength: [100, 'Achievement title cannot exceed 100 characters']
    },
    year: {
      type: Number,
      min: [1800, 'Achievement year must be after 1800'],
      max: [new Date().getFullYear(), 'Achievement year cannot be in the future']
    },
    description: {
      type: String,
      maxlength: [300, 'Achievement description cannot exceed 300 characters']
    }
  }],
  
  previousTeams: [{
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required for previous team']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required for previous team']
    },
    appearances: {
      type: Number,
      default: 0,
      min: [0, 'Appearances cannot be negative']
    },
    goals: {
      type: Number,
      default: 0,
      min: [0, 'Goals cannot be negative']
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for player age
playerSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for goals per match ratio
playerSchema.virtual('goalsPerMatch').get(function() {
  if (!this.statistics.matchesPlayed || this.statistics.matchesPlayed === 0) return 0;
  return (this.statistics.goals / this.statistics.matchesPlayed).toFixed(2);
});

// 🆕 CHATGPT ENHANCEMENT: Virtual for total disciplinary cards
playerSchema.virtual('totalCards').get(function() {
  return this.statistics.yellowCards + this.statistics.redCards;
});

// Virtual for full name display
playerSchema.virtual('displayName').get(function() {
  return `${this.name} (#${this.jerseyNumber || 'N/A'})`;
});

// Indexes for better query performance
playerSchema.index({ name: 1 });
playerSchema.index({ currentTeam: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ nationality: 1 });
playerSchema.index({ 'statistics.goals': -1 });
playerSchema.index({ marketValue: -1 });
playerSchema.index({ isActive: 1 });

// 🆕 CHATGPT ENHANCEMENT: Compound unique index for jersey number uniqueness
playerSchema.index(
  { currentTeam: 1, jerseyNumber: 1 },
  { unique: true, sparse: true }
);

// Static methods
playerSchema.statics.findByPosition = function(position) {
  return this.find({ position, isActive: true });
};

playerSchema.statics.findTopScorers = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'statistics.goals': -1 })
    .limit(limit)
    .populate('currentTeam', 'name logo');
};

playerSchema.statics.findByTeam = function(teamId) {
  return this.find({ currentTeam: teamId, isActive: true })
    .sort({ jerseyNumber: 1 });
};

// 🆕 ENHANCEMENT: Static method for discipline rankings
playerSchema.statics.findMostDisciplined = function(limit = 10) {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $addFields: {
        totalCards: { $add: ['$statistics.yellowCards', '$statistics.redCards'] }
      }
    },
    { $sort: { totalCards: 1 } },
    { $limit: limit }
  ]);
};

// Instance methods
playerSchema.methods.updateStatistics = function(matchData) {
  this.statistics.matchesPlayed += 1;
  this.statistics.goals += matchData.goals || 0;
  this.statistics.assists += matchData.assists || 0;
  this.statistics.yellowCards += matchData.yellowCards || 0;
  this.statistics.redCards += matchData.redCards || 0;
  this.statistics.minutesPlayed += matchData.minutesPlayed || 0;
  
  return this.save();
};

playerSchema.methods.setInjury = function(description, expectedReturn) {
  this.injuryStatus.isInjured = true;
  this.injuryStatus.injuryDescription = description;
  this.injuryStatus.expectedReturn = expectedReturn;
  
  return this.save();
};

playerSchema.methods.clearInjury = function() {
  this.injuryStatus.isInjured = false;
  this.injuryStatus.injuryDescription = undefined;
  this.injuryStatus.expectedReturn = undefined;
  
  return this.save();
};

// Pre middleware - Enhanced with compound index support
playerSchema.pre('save', function(next) {
  // Note: With compound unique index, MongoDB will handle uniqueness
  // But we keep this for better error messaging
  if (this.isNew || this.isModified('jerseyNumber') || this.isModified('currentTeam')) {
    if (this.jerseyNumber && this.currentTeam) {
      this.constructor.findOne({
        currentTeam: this.currentTeam,
        jerseyNumber: this.jerseyNumber,
        _id: { $ne: this._id }
      }).then(existingPlayer => {
        if (existingPlayer) {
          next(new Error(`Jersey number ${this.jerseyNumber} is already taken in this team`));
        } else {
          next();
        }
      }).catch(next);
    } else {
      next();
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Player', playerSchema);
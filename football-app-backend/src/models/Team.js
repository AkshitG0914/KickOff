// src/models/Team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  // Basic team information
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [50, 'Team name cannot exceed 50 characters']
  },
  
  shortName: {
    type: String,
    required: [true, 'Short name is required'],
    trim: true,
    maxlength: [10, 'Short name cannot exceed 10 characters'],
    uppercase: true
  },
  
  fullName: {
    type: String,
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  
  // Visual identity
  logo: {
    type: String,
    required: [true, 'Team logo URL is required']
  },
  
  colors: {
    primary: {
      type: String,
      required: [true, 'Primary color is required'],
      match: [/^#[0-9A-F]{6}$/i, 'Primary color must be a valid hex color']
    },
    secondary: {
      type: String,
      match: [/^#[0-9A-F]{6}$/i, 'Secondary color must be a valid hex color']
    }
  },
  
  // Location and venue
  location: {
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      trim: true
    }
  },
  
  venue: {
    stadiumName: {
      type: String,
      required: [true, 'Stadium name is required'],
      trim: true
    },
    capacity: {
      type: Number,
      min: [1, 'Stadium capacity must be at least 1'],
      max: [200000, 'Stadium capacity seems unrealistic']
    },
    address: {
      type: String,
      trim: true
    }
  },
  
  // Team details
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year must be after 1800'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
    required: [true, 'Founded year is required']
  },
  
  // League associations
  currentLeague: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: [true, 'Current league is required']
  },
  
  division: {
    type: String,
    enum: ['Premier', 'Championship', 'League One', 'League Two', 'Division 1', 'Division 2', 'Division 3'],
    required: [true, 'Division is required']
  },
  
  // Team statistics
  statistics: {
    totalMatches: {
      type: Number,
      default: 0,
      min: [0, 'Total matches cannot be negative']
    },
    wins: {
      type: Number,
      default: 0,
      min: [0, 'Wins cannot be negative']
    },
    draws: {
      type: Number,
      default: 0,
      min: [0, 'Draws cannot be negative']
    },
    losses: {
      type: Number,
      default: 0,
      min: [0, 'Losses cannot be negative']
    },
    goalsFor: {
      type: Number,
      default: 0,
      min: [0, 'Goals for cannot be negative']
    },
    goalsAgainst: {
      type: Number,
      default: 0,
      min: [0, 'Goals against cannot be negative']
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative']
    },
    position: {
      type: Number,
      min: [1, 'Position must be at least 1']
    }
  },
  
  // Current season data
  currentSeason: {
    season: {
      type: String,
      required: [true, 'Current season is required'],
      match: [/^\d{4}-\d{4}$/, 'Season must be in format YYYY-YYYY']
    },
    form: [{
      type: String,
      enum: ['W', 'D', 'L'],
      maxlength: 5 // Last 5 matches
    }],
    homeRecord: {
      played: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 }
    },
    awayRecord: {
      played: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 }
    }
  },
  
  // Team management
  management: {
    manager: {
      name: {
        type: String,
        required: [true, 'Manager name is required'],
        trim: true
      },
      nationality: {
        type: String,
        trim: true
      },
      appointedDate: {
        type: Date,
        default: Date.now
      }
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    viceCaptain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }
  },
  
  // Squad information
  squad: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    jerseyNumber: {
      type: Number,
      min: [1, 'Jersey number must be at least 1'],
      max: [99, 'Jersey number cannot exceed 99']
    },
    position: {
      type: String,
      enum: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'],
      required: [true, 'Player position is required']
    },
    status: {
      type: String,
      enum: ['Active', 'Injured', 'Suspended', 'Transferred'],
      default: 'Active'
    }
  }],
  
  // Social media and website
  socialMedia: {
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Website must be a valid URL']
    },
    twitter: {
      type: String,
      match: [/^@[A-Za-z0-9_]+$/, 'Twitter handle must start with @ and contain only letters, numbers, and underscores']
    },
    instagram: {
      type: String,
      match: [/^@[A-Za-z0-9_.]+$/, 'Instagram handle must start with @ and contain only letters, numbers, dots, and underscores']
    },
    facebook: {
      type: String
    }
  },
  
  // Team status
  status: {
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    tier: {
      type: String,
      enum: ['Professional', 'Semi-Professional', 'Amateur'],
      default: 'Professional'
    }
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
teamSchema.index({ name: 1 });
teamSchema.index({ shortName: 1 });
teamSchema.index({ currentLeague: 1 });
teamSchema.index({ 'location.country': 1 });
teamSchema.index({ 'currentSeason.season': 1 });
teamSchema.index({ 'statistics.position': 1 });

// Compound index for location-based queries
teamSchema.index({ 'location.country': 1, 'location.city': 1 });

// Virtual for win percentage
teamSchema.virtual('statistics.winPercentage').get(function() {
  if (this.statistics.totalMatches === 0) return 0;
  return Math.round((this.statistics.wins / this.statistics.totalMatches) * 100);
});

// Virtual for goal difference
teamSchema.virtual('statistics.goalDifference').get(function() {
  return this.statistics.goalsFor - this.statistics.goalsAgainst;
});

// Virtual for form string
teamSchema.virtual('currentSeason.formString').get(function() {
  return this.currentSeason.form.join('');
});

// Virtual for squad size
teamSchema.virtual('squadSize').get(function() {
  return this.squad.length;
});

// Pre-save middleware to update lastUpdated
teamSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Instance method to add a match result
teamSchema.methods.addMatchResult = function(result, goalsFor, goalsAgainst) {
  // Update statistics
  this.statistics.totalMatches += 1;
  this.statistics.goalsFor += goalsFor;
  this.statistics.goalsAgainst += goalsAgainst;
  
  if (result === 'win') {
    this.statistics.wins += 1;
    this.statistics.points += 3;
    this.currentSeason.form.unshift('W');
  } else if (result === 'draw') {
    this.statistics.draws += 1;
    this.statistics.points += 1;
    this.currentSeason.form.unshift('D');
  } else if (result === 'loss') {
    this.statistics.losses += 1;
    this.currentSeason.form.unshift('L');
  }
  
  // Keep only last 5 form results
  if (this.currentSeason.form.length > 5) {
    this.currentSeason.form = this.currentSeason.form.slice(0, 5);
  }
  
  return this.save();
};

// Instance method to add player to squad
teamSchema.methods.addPlayer = function(playerId, jerseyNumber, position) {
  // Check if jersey number is already taken
  const existingPlayer = this.squad.find(s => s.jerseyNumber === jerseyNumber);
  if (existingPlayer) {
    throw new Error(`Jersey number ${jerseyNumber} is already taken`);
  }
  
  this.squad.push({
    player: playerId,
    jerseyNumber: jerseyNumber,
    position: position
  });
  
  return this.save();
};

// Static method to find teams by league
teamSchema.statics.findByLeague = function(leagueId) {
  return this.find({ currentLeague: leagueId });
};

// Static method to find teams by country
teamSchema.statics.findByCountry = function(country) {
  return this.find({ 'location.country': country });
};

// Static method to get league table
teamSchema.statics.getLeagueTable = function(leagueId) {
  return this.find({ currentLeague: leagueId })
    .sort({ 'statistics.points': -1, 'statistics.goalDifference': -1 })
    .populate('currentLeague', 'name');
};

module.exports = mongoose.model('Team', teamSchema);
// src/models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  // Basic match information
  homeTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Home team is required']
  },
  
  awayTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: [true, 'Away team is required']
  },
  
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: [true, 'League is required']
  },
  
  // Match scheduling
  matchDate: {
    type: Date,
    required: [true, 'Match date is required']
  },
  
  kickoffTime: {
    type: String,
    required: [true, 'Kickoff time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Kickoff time must be in HH:MM format']
  },
  
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  
  // Match details
  season: {
    type: String,
    required: [true, 'Season is required'],
    match: [/^\d{4}-\d{4}$/, 'Season must be in format YYYY-YYYY']
  },
  
  matchday: {
    type: Number,
    required: [true, 'Matchday is required'],
    min: [1, 'Matchday must be at least 1']
  },
  
  venue: {
    stadium: {
      type: String,
      required: [true, 'Stadium is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1']
    }
  },
  
  // Match status
  status: {
    type: String,
    enum: ['Scheduled', 'Live', 'HT', 'FT', 'Postponed', 'Cancelled', 'Abandoned'],
    default: 'Scheduled',
    required: [true, 'Match status is required']
  },
  
  // 🆕 CHATGPT ENHANCEMENT: Duration override for special circumstances
  durationOverride: {
    type: Number,
    min: [0, 'Duration override cannot be negative'],
    max: [300, 'Duration override cannot exceed 300 minutes'], // 5 hours max
    validate: {
      validator: function(duration) {
        // Only allow override if it's different from standard durations
        return !duration || duration !== 90;
      },
      message: 'Duration override should only be used for non-standard match durations'
    }
  },
  
  // Additional context for duration override
  durationReason: {
    type: String,
    enum: ['Penalty Shootout', 'Weather Delay', 'Technical Issues', 'Extra Time', 'Abandoned Early', 'Other'],
    required: function() {
      return this.durationOverride && this.durationOverride !== 90;
    }
  },
  
  // Score information
  score: {
    homeTeam: {
      type: Number,
      default: 0,
      min: [0, 'Home team score cannot be negative']
    },
    awayTeam: {
      type: Number,
      default: 0,
      min: [0, 'Away team score cannot be negative']
    },
    halfTime: {
      homeTeam: {
        type: Number,
        default: 0,
        min: [0, 'Home team half-time score cannot be negative']
      },
      awayTeam: {
        type: Number,
        default: 0,
        min: [0, 'Away team half-time score cannot be negative']
      }
    },
    // 🆕 ENHANCEMENT: Penalty shootout scores
    penalties: {
      homeTeam: {
        type: Number,
        min: [0, 'Penalty score cannot be negative']
      },
      awayTeam: {
        type: Number,
        min: [0, 'Penalty score cannot be negative']
      }
    }
  },
  
  // Match events
  events: [{
    type: {
      type: String,
      enum: ['Goal', 'Own Goal', 'Penalty', 'Yellow Card', 'Red Card', 'Substitution', 'VAR Decision'],
      required: [true, 'Event type is required']
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player is required for event']
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team is required for event']
    },
    minute: {
      type: Number,
      required: [true, 'Event minute is required'],
      min: [0, 'Minute cannot be negative'],
      max: [300, 'Minute cannot exceed 300'] // Increased for extended matches
    },
    additionalInfo: {
      type: String,
      trim: true
    }
  }],
  
  // Lineups
  lineups: {
    homeTeam: {
      formation: {
        type: String,
        match: [/^\d-\d-\d(-\d)?$/, 'Formation must be in format like 4-4-2 or 4-2-3-1']
      },
      startingXI: [{
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
          required: [true, 'Starting player is required']
        },
        position: {
          type: String,
          enum: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'],
          required: [true, 'Player position is required']
        },
        jerseyNumber: {
          type: Number,
          required: [true, 'Jersey number is required'],
          min: [1, 'Jersey number must be at least 1'],
          max: [99, 'Jersey number cannot exceed 99']
        }
      }],
      substitutes: [{
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
          required: [true, 'Substitute player is required']
        },
        position: {
          type: String,
          enum: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'],
          required: [true, 'Substitute position is required']
        },
        jerseyNumber: {
          type: Number,
          required: [true, 'Jersey number is required'],
          min: [1, 'Jersey number must be at least 1'],
          max: [99, 'Jersey number cannot exceed 99']
        }
      }]
    },
    awayTeam: {
      formation: {
        type: String,
        match: [/^\d-\d-\d(-\d)?$/, 'Formation must be in format like 4-4-2 or 4-2-3-1']
      },
      startingXI: [{
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
          required: [true, 'Starting player is required']
        },
        position: {
          type: String,
          enum: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'],
          required: [true, 'Player position is required']
        },
        jerseyNumber: {
          type: Number,
          required: [true, 'Jersey number is required'],
          min: [1, 'Jersey number must be at least 1'],
          max: [99, 'Jersey number cannot exceed 99']
        }
      }],
      substitutes: [{
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
          required: [true, 'Substitute player is required']
        },
        position: {
          type: String,
          enum: ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'],
          required: [true, 'Substitute position is required']
        },
        jerseyNumber: {
          type: Number,
          required: [true, 'Jersey number is required'],
          min: [1, 'Jersey number must be at least 1'],
          max: [99, 'Jersey number cannot exceed 99']
        }
      }]
    }
  },
  
  // Match statistics
  statistics: {
    possession: {
      homeTeam: {
        type: Number,
        min: [0, 'Possession cannot be negative'],
        max: [100, 'Possession cannot exceed 100%']
      },
      awayTeam: {
        type: Number,
        min: [0, 'Possession cannot be negative'],
        max: [100, 'Possession cannot exceed 100%']
      }
    },
    shots: {
      homeTeam: {
        total: { type: Number, default: 0, min: [0, 'Shots cannot be negative'] },
        onTarget: { type: Number, default: 0, min: [0, 'Shots on target cannot be negative'] }
      },
      awayTeam: {
        total: { type: Number, default: 0, min: [0, 'Shots cannot be negative'] },
        onTarget: { type: Number, default: 0, min: [0, 'Shots on target cannot be negative'] }
      }
    },
    corners: {
      homeTeam: { type: Number, default: 0, min: [0, 'Corners cannot be negative'] },
      awayTeam: { type: Number, default: 0, min: [0, 'Corners cannot be negative'] }
    },
    fouls: {
      homeTeam: { type: Number, default: 0, min: [0, 'Fouls cannot be negative'] },
      awayTeam: { type: Number, default: 0, min: [0, 'Fouls cannot be negative'] }
    },
    yellowCards: {
      homeTeam: { type: Number, default: 0, min: [0, 'Yellow cards cannot be negative'] },
      awayTeam: { type: Number, default: 0, min: [0, 'Yellow cards cannot be negative'] }
    },
    redCards: {
      homeTeam: { type: Number, default: 0, min: [0, 'Red cards cannot be negative'] },
      awayTeam: { type: Number, default: 0, min: [0, 'Red cards cannot be negative'] }
    }
  },
  
  // Weather conditions
  weather: {
    temperature: {
      type: Number,
      min: [-50, 'Temperature too low'],
      max: [60, 'Temperature too high']
    },
    condition: {
      type: String,
      enum: ['Clear', 'Cloudy', 'Rainy', 'Snowy', 'Windy', 'Foggy']
    },
    humidity: {
      type: Number,
      min: [0, 'Humidity cannot be negative'],
      max: [100, 'Humidity cannot exceed 100%']
    }
  },
  
  // Match officials
  officials: {
    referee: {
      name: {
        type: String,
        required: [true, 'Referee name is required'],
        trim: true
      },
      nationality: {
        type: String,
        trim: true
      }
    },
    assistantReferees: [{
      name: {
        type: String,
        required: [true, 'Assistant referee name is required'],
        trim: true
      },
      nationality: {
        type: String,
        trim: true
      }
    }],
    fourthOfficial: {
      name: {
        type: String,
        trim: true
      },
      nationality: {
        type: String,
        trim: true
      }
    },
    var: {
      name: {
        type: String,
        trim: true
      },
      nationality: {
        type: String,
        trim: true
      }
    }
  },
  
  // Additional match data
  attendance: {
    type: Number,
    min: [0, 'Attendance cannot be negative']
  },
  
  matchType: {
    type: String,
    enum: ['League', 'Cup', 'Friendly', 'International', 'Playoff'],
    default: 'League',
    required: [true, 'Match type is required']
  },
  
  importance: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Derby', 'Final'],
    default: 'Medium'
  },
  
  // Broadcast information
  broadcast: {
    isLive: {
      type: Boolean,
      default: false
    },
    channels: [{
      type: String,
      trim: true
    }],
    streamingPlatforms: [{
      type: String,
      trim: true
    }]
  },
  
  // Match notes and summary
  matchSummary: {
    type: String,
    maxlength: [1000, 'Match summary cannot exceed 1000 characters'],
    trim: true
  },
  
  highlights: [{
    title: {
      type: String,
      required: [true, 'Highlight title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    videoUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Video URL must be valid']
    },
    thumbnailUrl: {
      type: String,
      match: [/^https?:\/\/.+/, 'Thumbnail URL must be valid']
    },
    minute: {
      type: Number,
      min: [0, 'Minute cannot be negative'],
      max: [300, 'Minute cannot exceed 300'] // Updated for extended matches
    }
  }],
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  dataSource: {
    type: String,
    enum: ['Manual', 'API', 'Live Feed'],
    default: 'Manual'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
matchSchema.index({ homeTeam: 1, awayTeam: 1 });
matchSchema.index({ league: 1, season: 1 });
matchSchema.index({ matchDate: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ season: 1, matchday: 1 });

// Compound indexes
matchSchema.index({ homeTeam: 1, matchDate: -1 });
matchSchema.index({ awayTeam: 1, matchDate: -1 });
matchSchema.index({ league: 1, matchDate: -1 });

// Virtual for match result from home team perspective
matchSchema.virtual('result').get(function() {
  if (this.status !== 'FT') return null;
  
  if (this.score.homeTeam > this.score.awayTeam) return 'home_win';
  if (this.score.homeTeam < this.score.awayTeam) return 'away_win';
  return 'draw';
});

// Virtual for total goals in match
matchSchema.virtual('totalGoals').get(function() {
  return this.score.homeTeam + this.score.awayTeam;
});

// 🆕 ENHANCED: Virtual for match duration with override support
matchSchema.virtual('duration').get(function() {
  // Use override if specified
  if (this.durationOverride) {
    return this.durationOverride;
  }
  
  // Otherwise calculate from events or default to 90
  if (this.events.length === 0) return 90;
  const lastEvent = this.events[this.events.length - 1];
  return Math.max(90, lastEvent.minute);
});

// Virtual for goal scorers
matchSchema.virtual('goalScorers').get(function() {
  return this.events
    .filter(event => ['Goal', 'Penalty'].includes(event.type))
    .map(event => ({
      player: event.player,
      team: event.team,
      minute: event.minute,
      type: event.type
    }));
});

// 🆕 ENHANCEMENT: Virtual for match outcome including penalties
matchSchema.virtual('finalResult').get(function() {
  if (this.status !== 'FT') return null;
  
  const result = {
    regulation: this.result,
    penalties: null
  };
  
  // If penalties exist and it was a draw in regulation
  if (this.score.penalties && 
      this.score.penalties.homeTeam !== undefined && 
      this.score.penalties.awayTeam !== undefined &&
      this.result === 'draw') {
    
    if (this.score.penalties.homeTeam > this.score.penalties.awayTeam) {
      result.penalties = 'home_win';
    } else {
      result.penalties = 'away_win';
    }
  }
  
  return result;
});

// Pre-save validation
matchSchema.pre('save', function(next) {
  // Ensure home and away teams are different
  if (this.homeTeam.equals(this.awayTeam)) {
    return next(new Error('Home team and away team cannot be the same'));
  }
  
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Instance method to add an event
matchSchema.methods.addEvent = function(eventType, playerId, teamId, minute, additionalInfo = '') {
  this.events.push({
    type: eventType,
    player: playerId,
    team: teamId,
    minute: minute,
    additionalInfo: additionalInfo
  });
  
  // Update score if it's a goal
  if (['Goal', 'Penalty'].includes(eventType)) {
    if (teamId.equals(this.homeTeam)) {
      this.score.homeTeam += 1;
    } else if (teamId.equals(this.awayTeam)) {
      this.score.awayTeam += 1;
    }
  }
  
  return this.save();
};

// Instance method to update match status
matchSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  // Set half-time scores when match goes to half-time
  if (newStatus === 'HT') {
    this.score.halfTime.homeTeam = this.score.homeTeam;
    this.score.halfTime.awayTeam = this.score.awayTeam;
  }
  
  return this.save();
};

// 🆕 ENHANCEMENT: Instance method to set duration override
matchSchema.methods.setDurationOverride = function(duration, reason) {
  this.durationOverride = duration;
  this.durationReason = reason;
  return this.save();
};

// 🆕 ENHANCEMENT: Instance method to set penalty scores
matchSchema.methods.setPenaltyScore = function(homeScore, awayScore) {
  this.score.penalties = {
    homeTeam: homeScore,
    awayTeam: awayScore
  };
  return this.save();
};

// Static method to find matches by team
matchSchema.statics.findByTeam = function(teamId) {
  return this.find({
    $or: [
      { homeTeam: teamId },
      { awayTeam: teamId }
    ]
  }).populate('homeTeam awayTeam league');
};

// Static method to find upcoming matches
matchSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({
    matchDate: { $gte: new Date() },
    status: 'Scheduled'
  })
  .sort({ matchDate: 1 })
  .limit(limit)
  .populate('homeTeam awayTeam league');
};

// Static method to find live matches
matchSchema.statics.findLive = function() {
  return this.find({
    status: { $in: ['Live', 'HT'] }
  }).populate('homeTeam awayTeam league');
};

// Static method to find matches by date range
matchSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    matchDate: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('homeTeam awayTeam league');
};

// 🆕 ENHANCEMENT: Static method to find extended duration matches
matchSchema.statics.findExtendedMatches = function() {
  return this.find({
    durationOverride: { $exists: true, $ne: null }
  }).populate('homeTeam awayTeam league');
};

module.exports = mongoose.model('Match', matchSchema);
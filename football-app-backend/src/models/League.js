// src/models/League.js
const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
  // Basic league information
  name: {
    type: String,
    required: [true, 'League name is required'],
    trim: true,
    maxlength: [100, 'League name cannot exceed 100 characters']
  },
  
  // 🆕 AI ENHANCEMENT: SEO-friendly slug field
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true // For faster slug-based queries
  },
  
  shortName: {
    type: String,
    required: [true, 'Short name is required'],
    trim: true,
    maxlength: [20, 'Short name cannot exceed 20 characters'],
    uppercase: true
  },
  
  fullName: {
    type: String,
    trim: true,
    maxlength: [150, 'Full name cannot exceed 150 characters']
  },
  
  // Visual identity
  logo: {
    type: String,
    required: [true, 'League logo URL is required'],
    match: [/^https?:\/\/.+/, 'Logo must be a valid URL']
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
  
  // Geographic information
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  
  region: {
    type: String,
    enum: ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'International'],
    required: [true, 'Region is required']
  },
  
  // League hierarchy
  tier: {
    type: Number,
    required: [true, 'League tier is required'],
    min: [1, 'Tier must be at least 1'],
    max: [10, 'Tier cannot exceed 10']
  },
  
  division: {
    type: String,
    enum: ['Premier', 'Championship', 'League One', 'League Two', 'Division 1', 'Division 2', 'Division 3', 'Regional'],
    required: [true, 'Division is required']
  },
  
  // League format
  format: {
    type: String,
    enum: ['Round Robin', 'Knockout', 'Group Stage + Knockout', 'Swiss System'],
    default: 'Round Robin',
    required: [true, 'League format is required']
  },
  
  numberOfTeams: {
    type: Number,
    required: [true, 'Number of teams is required'],
    min: [2, 'League must have at least 2 teams'],
    max: [50, 'League cannot have more than 50 teams']
  },
  
  // Season information
  currentSeason: {
    season: {
      type: String,
      required: [true, 'Current season is required'],
      match: [/^\d{4}-\d{4}$/, 'Season must be in format YYYY-YYYY']
    },
    startDate: {
      type: Date,
      required: [true, 'Season start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Season end date is required']
    },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed', 'Suspended'],
      default: 'Not Started'
    },
    totalMatchdays: {
      type: Number,
      min: [1, 'Total matchdays must be at least 1']
    },
    currentMatchday: {
      type: Number,
      default: 0,
      min: [0, 'Current matchday cannot be negative']
    }
  },
  
  // Competition rules
  rules: {
    pointsForWin: {
      type: Number,
      default: 3,
      min: [1, 'Points for win must be at least 1']
    },
    pointsForDraw: {
      type: Number,
      default: 1,
      min: [0, 'Points for draw cannot be negative']
    },
    pointsForLoss: {
      type: Number,
      default: 0,
      min: [0, 'Points for loss cannot be negative']
    },
    promotionSpots: {
      type: Number,
      default: 0,
      min: [0, 'Promotion spots cannot be negative']
    },
    relegationSpots: {
      type: Number,
      default: 0,
      min: [0, 'Relegation spots cannot be negative']
    },
    playoffSpots: {
      type: Number,
      default: 0,
      min: [0, 'Playoff spots cannot be negative']
    }
  },
  
  // Prize information
  prizes: {
    totalPrizePool: {
      type: Number,
      min: [0, 'Prize pool cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'BRL']
    },
    winnerPrize: {
      type: Number,
      min: [0, 'Winner prize cannot be negative']
    },
    runnerUpPrize: {
      type: Number,
      min: [0, 'Runner-up prize cannot be negative']
    }
  },
  
  // Participating teams
  teams: [{
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team is required']
    },
    joinedDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended', 'Expelled'],
      default: 'Active'
    }
  }],
  
  // League statistics
  statistics: {
    totalMatches: {
      type: Number,
      default: 0,
      min: [0, 'Total matches cannot be negative']
    },
    totalGoals: {
      type: Number,
      default: 0,
      min: [0, 'Total goals cannot be negative']
    },
    averageGoalsPerMatch: {
      type: Number,
      default: 0,
      min: [0, 'Average goals per match cannot be negative']
    },
    topScorer: {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
      },
      goals: {
        type: Number,
        default: 0,
        min: [0, 'Goals cannot be negative']
      }
    },
    topAssist: {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
      },
      assists: {
        type: Number,
        default: 0,
        min: [0, 'Assists cannot be negative']
      }
    }
  },
  
  // Historical data
  history: {
    founded: {
      type: Number,
      required: [true, 'Founded year is required'],
      min: [1800, 'Founded year must be after 1800'],
      max: [new Date().getFullYear(), 'Founded year cannot be in the future']
    },
    previousWinners: [{
      season: {
        type: String,
        required: [true, 'Season is required'],
        match: [/^\d{4}-\d{4}$/, 'Season must be in format YYYY-YYYY']
      },
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: [true, 'Winner team is required']
      },
      runnerUp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      },
      points: {
        type: Number,
        min: [0, 'Points cannot be negative']
      }
    }],
    mostSuccessfulTeam: {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      },
      titles: {
        type: Number,
        default: 0,
        min: [0, 'Titles cannot be negative']
      }
    }
  },
  
  // Governance
  governance: {
    organizer: {
      name: {
        type: String,
        required: [true, 'Organizer name is required'],
        trim: true
      },
      type: {
        type: String,
        enum: ['Federation', 'Association', 'Company', 'Club', 'Government'],
        required: [true, 'Organizer type is required']
      },
      website: {
        type: String,
        match: [/^https?:\/\/.+/, 'Website must be a valid URL']
      }
    },
    president: {
      name: {
        type: String,
        trim: true
      },
      since: {
        type: Date
      }
    },
    headquarters: {
      city: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      }
    }
  },
  
  // Media and broadcast
  media: {
    officialWebsite: {
      type: String,
      match: [/^https?:\/\/.+/, 'Website must be a valid URL']
    },
    socialMedia: {
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
      },
      youtube: {
        type: String
      }
    },
    broadcastPartners: [{
      name: {
        type: String,
        required: [true, 'Broadcast partner name is required'],
        trim: true
      },
      region: {
        type: String,
        trim: true
      },
      type: {
        type: String,
        enum: ['TV', 'Streaming', 'Radio', 'Digital'],
        required: [true, 'Broadcast type is required']
      }
    }]
  },
  
  // League status
  status: {
    isActive: {
      type: Boolean,
      default: true
    },
    isOfficial: {
      type: Boolean,
      default: true
    },
    isProfessional: {
      type: Boolean,
      default: true
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private', 'Restricted'],
      default: 'Public'
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
leagueSchema.index({ name: 1 });
leagueSchema.index({ shortName: 1 });
leagueSchema.index({ slug: 1 }); // 🆕 AI ENHANCEMENT: Index for slug queries
leagueSchema.index({ country: 1 });
leagueSchema.index({ region: 1 });
leagueSchema.index({ tier: 1 });
leagueSchema.index({ 'currentSeason.season': 1 });
leagueSchema.index({ 'currentSeason.status': 1 });

// Compound indexes
leagueSchema.index({ country: 1, tier: 1 });
leagueSchema.index({ region: 1, tier: 1 });

// Virtual for active teams count
leagueSchema.virtual('activeTeamsCount').get(function() {
  return this.teams.filter(team => team.status === 'Active').length;
});

// Virtual for league progress percentage
leagueSchema.virtual('currentSeason.progress').get(function() {
  if (!this.currentSeason.totalMatchdays) return 0;
  return Math.round((this.currentSeason.currentMatchday / this.currentSeason.totalMatchdays) * 100);
});

// Virtual for season duration in days
leagueSchema.virtual('currentSeason.duration').get(function() {
  if (!this.currentSeason.startDate || !this.currentSeason.endDate) return 0;
  const diffTime = Math.abs(this.currentSeason.endDate - this.currentSeason.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// 🆕 AI ENHANCEMENT: Virtual for days remaining in season
leagueSchema.virtual('currentSeason.daysRemaining').get(function() {
  if (!this.currentSeason.endDate) return null;
  const diff = this.currentSeason.endDate - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// 🆕 AI ENHANCEMENT: Pre-save hook to auto-generate slug from name
leagueSchema.pre('save', function(next) {
  // Auto-generate slug if name is modified or slug doesn't exist
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  }
  
  // Validate season dates
  if (this.currentSeason.startDate >= this.currentSeason.endDate) {
    return next(new Error('Season start date must be before end date'));
  }
  
  // Validate current matchday
  if (this.currentSeason.currentMatchday > this.currentSeason.totalMatchdays) {
    return next(new Error('Current matchday cannot exceed total matchdays'));
  }
  
  // Update lastUpdated timestamp
  this.lastUpdated = new Date();
  
  next();
});

// Instance method to add team to league
leagueSchema.methods.addTeam = function(teamId) {
  // Check if team is already in league
  const existingTeam = this.teams.find(t => t.team.equals(teamId));
  if (existingTeam) {
    throw new Error('Team is already in this league');
  }
  
  // Check if league is full
  if (this.teams.length >= this.numberOfTeams) {
    throw new Error('League is full');
  }
  
  this.teams.push({ team: teamId });
  return this.save();
};

// Instance method to remove team from league
leagueSchema.methods.removeTeam = function(teamId) {
  this.teams = this.teams.filter(t => !t.team.equals(teamId));
  return this.save();
};

// Instance method to update season status
leagueSchema.methods.updateSeasonStatus = function(status) {
  this.currentSeason.status = status;
  return this.save();
};

// Instance method to advance matchday
leagueSchema.methods.advanceMatchday = function() {
  if (this.currentSeason.currentMatchday < this.currentSeason.totalMatchdays) {
    this.currentSeason.currentMatchday += 1;
    
    // If all matchdays completed, mark season as completed
    if (this.currentSeason.currentMatchday === this.currentSeason.totalMatchdays) {
      this.currentSeason.status = 'Completed';
    }
  }
  
  return this.save();
};

// 🆕 AI ENHANCEMENT: Instance method to get top players by statistic
leagueSchema.methods.getTopPlayers = async function(statType = 'goals', limit = 5) {
  const Player = mongoose.model('Player');
  
  // Get all team IDs in this league
  const teamIds = this.teams.map(t => t.team);
  
  // Valid stat types for sorting
  const validStats = ['goals', 'assists', 'appearances', 'yellowCards', 'redCards'];
  if (!validStats.includes(statType)) {
    throw new Error(`Invalid stat type. Must be one of: ${validStats.join(', ')}`);
  }
  
  // Build sort object dynamically
  const sortObj = {};
  sortObj[`statistics.${statType}`] = -1;
  
  return await Player.find({ 
    currentTeam: { $in: teamIds } 
  })
  .sort(sortObj)
  .limit(limit)
  .populate('currentTeam', 'name logo')
  .select('name position statistics currentTeam');
};

// Static method to find leagues by country
leagueSchema.statics.findByCountry = function(country) {
  return this.find({ country: country });
};

// Static method to find leagues by region
leagueSchema.statics.findByRegion = function(region) {
  return this.find({ region: region });
};

// Static method to find leagues by tier
leagueSchema.statics.findByTier = function(tier) {
  return this.find({ tier: tier });
};

// 🆕 AI ENHANCEMENT: Static method to find league by slug
leagueSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug: slug });
};

// Static method to find active leagues
leagueSchema.statics.findActive = function() {
  return this.find({ 
    'status.isActive': true,
    'currentSeason.status': { $in: ['In Progress', 'Not Started'] }
  });
};

// Static method to find top leagues (tier 1)
leagueSchema.statics.findTopLeagues = function() {
  return this.find({ tier: 1, 'status.isOfficial': true })
    .sort({ 'statistics.totalMatches': -1 });
};

module.exports = mongoose.model('League', leagueSchema);
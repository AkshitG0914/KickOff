// src/models/EducationalContent.js
const mongoose = require('mongoose');

const educationalContentSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Educational content title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters'],
    minlength: [5, 'Title must be at least 5 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  
  // Content Classification
  type: {
    type: String,
    required: [true, 'Content type is required'],
    enum: {
      values: [
        'Training Drill',
        'Tactical Guide', 
        'Technical Skills',
        'Fitness Program',
        'Match Analysis',
        'Rules & Regulations',
        'Coaching Tips',
        'Player Development',
        'Injury Prevention',
        'Mental Training',
        'Video Tutorial',
        'Interactive Quiz',
        'Case Study',
        'Best Practices'
      ],
      message: 'Invalid content type'
    }
  },
  
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Beginner',
        'Intermediate', 
        'Advanced',
        'Professional',
        'Youth Training',
        'Goalkeeper Training',
        'Coaching Education',
        'Referee Training',
        'Parent Guide'
      ],
      message: 'Invalid category'
    }
  },
  
  skillLevel: {
    type: String,
    required: [true, 'Skill level is required'],
    enum: {
      values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      message: 'Skill level must be Beginner, Intermediate, Advanced, or Expert'
    }
  },

  skillLevelRank: {
    type: Number,
    min: [1, 'Skill level rank must be at least 1'],
    max: [4, 'Skill level rank cannot exceed 4'],
    validate: {
      validator: function(rank) {
        if (!this.skillLevel || rank == null) return true;
        const ranks = {
          'Beginner': 1,
          'Intermediate': 2,
          'Advanced': 3,
          'Expert': 4
        };
        return rank === ranks[this.skillLevel];
      },
      message: 'Skill level rank must match the corresponding skill level'
    }
  },
  
  // Target Audience
  targetAudience: [{
    type: String,
    enum: [
      'Players',
      'Coaches', 
      'Parents',
      'Referees',
      'Youth Players',
      'Amateur Players',
      'Professional Players',
      'Goalkeepers',
      'Defenders',
      'Midfielders',
      'Forwards'
    ]
  }],
  
  ageGroup: {
    min: {
      type: Number,
      min: [5, 'Minimum age cannot be less than 5'],
      max: [50, 'Minimum age cannot exceed 50']
    },
    max: {
      type: Number,
      min: [5, 'Maximum age cannot be less than 5'],
      max: [50, 'Maximum age cannot exceed 50']
    }
  },
  
  // Content Structure
  sections: [{
    title: {
      type: String,
      required: [true, 'Section title is required'],
      maxlength: [100, 'Section title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Section content is required'],
      minlength: [10, 'Section content must be at least 10 characters']
    },
    order: {
      type: Number,
      required: [true, 'Section order is required'],
      min: [1, 'Section order must be at least 1']
    },
    duration: {
      type: Number, // in minutes
      min: [1, 'Section duration must be at least 1 minute']
    }
  }],
  
  // Media Resources
  media: {
    images: [{
      url: {
        type: String,
        required: [true, 'Image URL is required'],
        validate: {
          validator: function(url) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
          },
          message: 'Image must be a valid image URL'
        }
      },
      caption: {
        type: String,
        maxlength: [200, 'Image caption cannot exceed 200 characters']
      },
      alt: {
        type: String,
        maxlength: [100, 'Image alt text cannot exceed 100 characters']
      }
    }],
    
    videos: [{
      url: {
        type: String,
        required: [true, 'Video URL is required'],
        validate: {
          validator: function(url) {
            return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(url);
          },
          message: 'Video URL must be from YouTube or Vimeo'
        }
      },
      title: {
        type: String,
        maxlength: [100, 'Video title cannot exceed 100 characters']
      },
      duration: {
        type: Number, // in seconds
        min: [1, 'Video duration must be at least 1 second']
      },
      thumbnail: {
        type: String,
        validate: {
          validator: function(url) {
            return !url || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
          },
          message: 'Thumbnail must be a valid image URL'
        }
      }
    }],
    
    documents: [{
      url: {
        type: String,
        required: [true, 'Document URL is required']
      },
      title: {
        type: String,
        required: [true, 'Document title is required'],
        maxlength: [100, 'Document title cannot exceed 100 characters']
      },
      type: {
        type: String,
        enum: ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'XLS', 'XLSX'],
        required: [true, 'Document type is required']
      },
      size: {
        type: Number, // in bytes
        min: [1, 'Document size must be at least 1 byte']
      }
    }]
  },
  
  // Training Specifics (for drills and exercises)
  trainingDetails: {
    equipment: [{
      name: {
        type: String,
        required: [true, 'Equipment name is required'],
        maxlength: [50, 'Equipment name cannot exceed 50 characters']
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, 'Equipment quantity must be at least 1']
      },
      isOptional: {
        type: Boolean,
        default: false
      }
    }],
    
    playersRequired: {
      min: {
        type: Number,
        min: [1, 'Minimum players must be at least 1']
      },
      max: {
        type: Number,
        min: [1, 'Maximum players must be at least 1']
      }
    },
    
    duration: {
      type: Number, // in minutes
      min: [1, 'Duration must be at least 1 minute'],
      max: [300, 'Duration cannot exceed 300 minutes']
    },
    
    spaceRequired: {
      type: String,
      enum: ['Small Area', 'Half Pitch', 'Full Pitch', 'Indoor', 'Gymnasium', 'Any']
    },
    
    objectives: [{
      type: String,
      maxlength: [200, 'Objective cannot exceed 200 characters']
    }],
    
    instructions: [{
      step: {
        type: Number,
        required: [true, 'Instruction step number is required'],
        min: [1, 'Step number must be at least 1']
      },
      description: {
        type: String,
        required: [true, 'Instruction description is required'],
        maxlength: [500, 'Instruction description cannot exceed 500 characters']
      }
    }],
    
    variations: [{
      name: {
        type: String,
        required: [true, 'Variation name is required'],
        maxlength: [100, 'Variation name cannot exceed 100 characters']
      },
      description: {
        type: String,
        required: [true, 'Variation description is required'],
        maxlength: [300, 'Variation description cannot exceed 300 characters']
      }
    }],
    
    safetyNotes: [{
      type: String,
      maxlength: [200, 'Safety note cannot exceed 200 characters']
    }]
  },
  
  // Quiz/Assessment (for interactive content)
  quiz: {
    questions: [{
      question: {
        type: String,
        required: [true, 'Question is required'],
        maxlength: [300, 'Question cannot exceed 300 characters']
      },
      type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
        required: [true, 'Question type is required']
      },
      options: [{
        text: {
          type: String,
          required: [true, 'Option text is required'],
          maxlength: [200, 'Option text cannot exceed 200 characters']
        },
        isCorrect: {
          type: Boolean,
          default: false
        }
      }],
      correctAnswer: {
        type: String,
        maxlength: [500, 'Correct answer cannot exceed 500 characters']
      },
      explanation: {
        type: String,
        maxlength: [500, 'Explanation cannot exceed 500 characters']
      },
      points: {
        type: Number,
        default: 1,
        min: [1, 'Points must be at least 1']
      }
    }],
    
    passingScore: {
      type: Number,
      min: [0, 'Passing score cannot be negative'],
      max: [100, 'Passing score cannot exceed 100']
    },
    
    timeLimit: {
      type: Number, // in minutes
      min: [1, 'Time limit must be at least 1 minute']
    }
  },
  
  // Content Management
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    qualifications: [{
      type: String,
      maxlength: [100, 'Qualification cannot exceed 100 characters']
    }],
    bio: {
      type: String,
      maxlength: [500, 'Author bio cannot exceed 500 characters']
    },
    avatar: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: 'Avatar must be a valid image URL'
      }
    }
  },
  
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['draft', 'review', 'published', 'archived'],
      message: 'Status must be draft, review, published, or archived'
    },
    default: 'draft'
  },
  
  publishedAt: {
    type: Date
  },
  
  lastReviewedAt: {
    type: Date
  },
  
  // Engagement & Feedback
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  
  reviews: [{
    user: {
      type: String,
      required: [true, 'Reviewer name is required'],
      maxlength: [50, 'Reviewer name cannot exceed 50 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Review rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  
  completions: {
    type: Number,
    default: 0,
    min: [0, 'Completions cannot be negative']
  },
  
  bookmarks: {
    type: Number,
    default: 0,
    min: [0, 'Bookmarks cannot be negative']
  },
  
  // SEO & Discoverability
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  keywords: [{
    type: String,
    trim: true,
    maxlength: [50, 'Keyword cannot exceed 50 characters']
  }],
  
  // Content Relationships
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationalContent'
  }],
  
  relatedContent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationalContent'
  }],
  
  // Accessibility
  accessibility: {
    hasAudioDescription: {
      type: Boolean,
      default: false
    },
    hasSubtitles: {
      type: Boolean,
      default: false
    },
    isScreenReaderFriendly: {
      type: Boolean,
      default: false
    },
    languages: [{
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ar', 'zh', 'ja']
    }]
  },
  
  // Versioning
  version: {
    type: String,
    default: '1.0.0'
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for completion rate
educationalContentSchema.virtual('completionRate').get(function() {
  if (this.views === 0) return 0;
  return ((this.completions / this.views) * 100).toFixed(2);
});

// Virtual for difficulty badge
educationalContentSchema.virtual('difficultyBadge').get(function() {
  const badges = {
    'Beginner': '🟢',
    'Intermediate': '🟡',
    'Advanced': '🟠',
    'Expert': '🔴'
  };
  return badges[this.skillLevel] || '⚪';
});

// Virtual for estimated study time
educationalContentSchema.virtual('estimatedStudyTime').get(function() {
  let totalTime = 0;
  
  // Add section durations
  if (this.sections && this.sections.length > 0) {
    totalTime += this.sections.reduce((sum, section) => sum + (section.duration || 5), 0);
  }
  
  // Add video durations
  if (this.media && this.media.videos && this.media.videos.length > 0) {
    totalTime += this.media.videos.reduce((sum, video) => sum + (video.duration || 0), 0) / 60;
  }
  
  // Add quiz time
  if (this.quiz && this.quiz.timeLimit) {
    totalTime += this.quiz.timeLimit;
  }
  
  return Math.ceil(totalTime || this.trainingDetails?.duration || 15);
});

// Indexes for better query performance
educationalContentSchema.index({ title: 'text', description: 'text', content: 'text' });
educationalContentSchema.index({ type: 1, category: 1 });
educationalContentSchema.index({ skillLevel: 1 });
educationalContentSchema.index({ targetAudience: 1 });
educationalContentSchema.index({ status: 1, publishedAt: -1 });
educationalContentSchema.index({ tags: 1 });
educationalContentSchema.index({ 'rating.average': -1 });
educationalContentSchema.index({ views: -1 });
educationalContentSchema.index({ completions: -1 });
educationalContentSchema.index({ isActive: 1, status: 1 });

// Static methods
educationalContentSchema.statics.findByType = function(type, limit = 20) {
  return this.find({ 
    type, 
    status: 'published', 
    isActive: true 
  })
  .sort({ 'rating.average': -1, views: -1 })
  .limit(limit);
};

educationalContentSchema.statics.findBySkillLevel = function(skillLevel, limit = 20) {
  return this.find({ 
    skillLevel, 
    status: 'published', 
    isActive: true 
  })
  .sort({ 'rating.average': -1 })
  .limit(limit);
};

educationalContentSchema.statics.findForAudience = function(audience, limit = 20) {
  return this.find({ 
    targetAudience: { $in: [audience] },
    status: 'published',
    isActive: true
  })
  .sort({ 'rating.average': -1 })
  .limit(limit);
};

educationalContentSchema.statics.searchContent = function(query, filters = {}) {
  let searchQuery = {
    $text: { $search: query },
    status: 'published',
    isActive: true
  };
  
  if (filters.type) searchQuery.type = filters.type;
  if (filters.skillLevel) searchQuery.skillLevel = filters.skillLevel;
  if (filters.category) searchQuery.category = filters.category;
  if (filters.targetAudience) searchQuery.targetAudience = { $in: [filters.targetAudience] };
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, 'rating.average': -1 })
    .limit(filters.limit || 20);
};

// Instance methods
educationalContentSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

educationalContentSchema.methods.incrementCompletions = function() {
  this.completions += 1;
  return this.save();
};

educationalContentSchema.methods.addReview = function(user, rating, comment) {
  this.reviews.push({
    user,
    rating,
    comment,
    createdAt: new Date()
  });
  
  // Recalculate average rating
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = (totalRating / this.reviews.length).toFixed(1);
  this.rating.count = this.reviews.length;
  
  return this.save();
};

educationalContentSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

educationalContentSchema.methods.archive = function() {
  this.status = 'archived';
  this.isActive = false;
  return this.save();
};

// Add new method for marking content as reviewed
educationalContentSchema.methods.markReviewed = function() {
  this.lastReviewedAt = new Date();
  return this.save();
};

// Pre middleware
educationalContentSchema.pre('save', function(next) {
  // Set skillLevelRank based on skillLevel if not set
  if (this.skillLevel && !this.skillLevelRank) {
    const ranks = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    };
    this.skillLevelRank = ranks[this.skillLevel];
  }

  // Validate age group
  if (this.ageGroup && this.ageGroup.min && this.ageGroup.max) {
    if (this.ageGroup.min > this.ageGroup.max) {
      return next(new Error('Minimum age cannot be greater than maximum age'));
    }
  }
  
  // Validate players required
  if (this.trainingDetails && this.trainingDetails.playersRequired) {
    const { min, max } = this.trainingDetails.playersRequired;
    if (min && max && min > max) {
      return next(new Error('Minimum players cannot be greater than maximum players'));
    }
  }
  
  // Set published date when publishing
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Update lastUpdated
  this.lastUpdated = new Date();
  
  next();
});

module.exports = mongoose.model('EducationalContent', educationalContentSchema);
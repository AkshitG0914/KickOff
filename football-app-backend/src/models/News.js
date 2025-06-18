// src/models/News.js - AI-ENHANCED VERSION ⚡
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  // Basic Article Information
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    minlength: [10, 'Title must be at least 10 characters']
  },
  
  // 🆕 AI ENHANCEMENT: Persistent slug field for SEO and unique lookups
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [250, 'Slug cannot exceed 250 characters'],
    validate: {
      validator: function(slug) {
        return /^[a-z0-9-]+$/.test(slug);
      },
      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  },
  
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  
  content: {
    type: String,
    required: [true, 'News content is required'],
    minlength: [50, 'Content must be at least 50 characters'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  
  excerpt: {
    type: String,
    required: [true, 'News excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    minlength: [20, 'Excerpt must be at least 20 characters']
  },
  
  // Author Information
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    email: {
      type: String,
      validate: {
        validator: function(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Invalid email format'
      }
    },
    bio: {
      type: String,
      maxlength: [300, 'Author bio cannot exceed 300 characters']
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
  
  // Content Categorization
  category: {
    type: String,
    required: [true, 'News category is required'],
    enum: {
      values: [
        'Transfer News',
        'Match Reports', 
        'Player Interviews',
        'Team News',
        'League Updates',
        'Training Reports',
        'Injury Updates',
        'Match Previews',
        'Analysis',
        'Breaking News',
        'Youth Football',
        'Women\'s Football',
        'International Football',
        'Tournament News'
      ],
      message: 'Invalid news category'
    }
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  // Related Entities
  relatedTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  
  relatedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  
  relatedMatches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }],
  
  relatedLeagues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  }],
  
  // Media Content
  featuredImage: {
    url: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: 'Featured image must be a valid image URL'
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
  },
  
  gallery: [{
    url: {
      type: String,
      required: [true, 'Gallery image URL is required'],
      validate: {
        validator: function(url) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: 'Gallery image must be a valid image URL'
      }
    },
    caption: {
      type: String,
      maxlength: [200, 'Gallery image caption cannot exceed 200 characters']
    },
    alt: {
      type: String,
      maxlength: [100, 'Gallery image alt text cannot exceed 100 characters']
    }
  }],
  
  videoUrl: {
    type: String,
    validate: {
      validator: function(url) {
        return !url || /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(url);
      },
      message: 'Video URL must be from YouTube or Vimeo'
    }
  },
  
  // Publication Status
  status: {
    type: String,
    required: [true, 'Publication status is required'],
    enum: {
      values: ['draft', 'published', 'archived', 'scheduled'],
      message: 'Status must be draft, published, archived, or scheduled'
    },
    default: 'draft'
  },
  
  publishedAt: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || this.status === 'scheduled' || date <= new Date();
      },
      message: 'Published date cannot be in the future unless status is scheduled'
    }
  },
  
  scheduledFor: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || this.status === 'scheduled';
      },
      message: 'Scheduled date can only be set when status is scheduled'
    }
  },
  
  // SEO & Social Media
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      maxlength: [50, 'Keyword cannot exceed 50 characters']
    }],
    canonicalUrl: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || /^https?:\/\/.+/.test(url);
        },
        message: 'Canonical URL must be a valid URL'
      }
    }
  },
  
  socialMedia: {
    shareTitle: {
      type: String,
      maxlength: [100, 'Social share title cannot exceed 100 characters']
    },
    shareDescription: {
      type: String,
      maxlength: [200, 'Social share description cannot exceed 200 characters']
    },
    shareImage: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: 'Social share image must be a valid image URL'
      }
    }
  },
  
  // Engagement Metrics
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  
  shares: {
    type: Number,
    default: 0,
    min: [0, 'Shares cannot be negative']
  },
  
  // 🔄 AI ENHANCEMENT: Simplified comments for better performance
  // Full comments will be handled via separate API endpoints for pagination
  commentsCount: {
    type: Number,
    default: 0,
    min: [0, 'Comments count cannot be negative']
  },
  
  // Content Management
  priority: {
    type: String,
    enum: {
      values: ['low', 'normal', 'high', 'urgent'],
      message: 'Priority must be low, normal, high, or urgent'
    },
    default: 'normal'
  },
  
  isBreakingNews: {
    type: Boolean,
    default: false
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  isSticky: {
    type: Boolean,
    default: false
  },
  
  expiresAt: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Expiration date must be in the future'
    }
  },
  
  // Analytics
  readingTime: {
    type: Number, // in minutes
    min: [1, 'Reading time must be at least 1 minute']
  },
  
  source: {
    name: {
      type: String,
      maxlength: [100, 'Source name cannot exceed 100 characters']
    },
    url: {
      type: String,
      validate: {
        validator: function(url) {
          return !url || /^https?:\/\/.+/.test(url);
        },
        message: 'Source URL must be a valid URL'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🆕 AI ENHANCEMENT: Virtual for clean URL generation
newsSchema.virtual('url').get(function() {
  return `/news/${this.slug}`;
});

// Virtual for reading time calculation
newsSchema.virtual('estimatedReadingTime').get(function() {
  if (this.readingTime) return this.readingTime;
  
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Virtual for engagement score
newsSchema.virtual('engagementScore').get(function() {
  return (this.views * 0.1) + (this.likes * 2) + (this.shares * 5) + (this.commentsCount * 3);
});

// Indexes for better query performance
newsSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ 'author.name': 1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ relatedTeams: 1 });
newsSchema.index({ relatedPlayers: 1 });
newsSchema.index({ views: -1 });
newsSchema.index({ isBreakingNews: 1, publishedAt: -1 });
newsSchema.index({ isFeatured: 1, publishedAt: -1 });
newsSchema.index({ priority: 1, publishedAt: -1 });
newsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// 🆕 AI ENHANCEMENT: Index for slug-based lookups
newsSchema.index({ slug: 1 }, { unique: true });

// Static methods
newsSchema.statics.findPublished = function() {
  return this.find({ 
    status: 'published',
    publishedAt: { $lte: new Date() }
  }).sort({ publishedAt: -1 });
};

newsSchema.statics.findByCategory = function(category, limit = 10) {
  return this.find({ 
    category, 
    status: 'published',
    publishedAt: { $lte: new Date() }
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

newsSchema.statics.findBreakingNews = function() {
  return this.find({ 
    isBreakingNews: true, 
    status: 'published',
    publishedAt: { $lte: new Date() }
  }).sort({ publishedAt: -1 });
};

newsSchema.statics.findFeatured = function(limit = 5) {
  return this.find({ 
    isFeatured: true, 
    status: 'published',
    publishedAt: { $lte: new Date() }
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// 🆕 AI ENHANCEMENT: Find by slug for SEO-friendly URLs
newsSchema.statics.findBySlug = function(slug) {
  return this.findOne({ 
    slug, 
    status: 'published',
    publishedAt: { $lte: new Date() }
  });
};

newsSchema.statics.searchNews = function(query, options = {}) {
  const { category, tags, limit = 20, skip = 0 } = options;
  
  let searchQuery = {
    $text: { $search: query },
    status: 'published',
    publishedAt: { $lte: new Date() }
  };
  
  if (category) searchQuery.category = category;
  if (tags && tags.length > 0) searchQuery.tags = { $in: tags };
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, publishedAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Instance methods
newsSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// 🆕 AI ENHANCEMENT: Simplified comment tracking
newsSchema.methods.incrementComments = function() {
  this.commentsCount += 1;
  return this.save();
};

newsSchema.methods.decrementComments = function() {
  if (this.commentsCount > 0) {
    this.commentsCount -= 1;
  }
  return this.save();
};

// 🆕 AI ENHANCEMENT: Get clean URL method
newsSchema.methods.getURL = function() {
  return `/news/${this.slug}`;
};

// 🆕 AI ENHANCEMENT: Generate unique slug
newsSchema.methods.generateSlug = function() {
  const baseSlug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  return baseSlug;
};

newsSchema.methods.publish = function() {
  this.status = 'published';
  this.publishedAt = new Date();
  return this.save();
};

newsSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Pre middleware
newsSchema.pre('save', async function(next) {
  // Auto-generate excerpt if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + '...';
  }
  
  // Calculate reading time if not provided
  if (!this.readingTime && this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  // Set published date when publishing
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // 🆕 AI ENHANCEMENT: Auto-generate unique slug
  if (!this.slug || this.isModified('title')) {
    let baseSlug = this.generateSlug();
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Ensure slug uniqueness
    while (await this.constructor.findOne({ slug: finalSlug, _id: { $ne: this._id } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = finalSlug;
  }
  
  next();
});

module.exports = mongoose.model('News', newsSchema);
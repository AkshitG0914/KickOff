const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Enter a valid email',
    'string.empty': 'Email is required'
  }),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, and a number',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 30 characters',
      'string.empty': 'Password is required'
    }),

  role: Joi.string().valid('user', 'admin', 'premium').default('user').messages({
    'any.only': 'Invalid role specified'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Enter a valid email',
    'string.empty': 'Email is required'
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = { registerSchema, loginSchema, refreshTokenSchema };

import Joi from 'joi';

import {
  contactNumberRegexp,
  contactTypeList,
} from '../constants/contacts-constants.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string.',
    'any.required': 'Name is required.',
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot be longer than 20 characters.',
  }),

  phoneNumber: Joi.string().pattern(contactNumberRegexp).required().messages({
    'string.base': 'Phone number must be a string.',
    'string.pattern.base': 'Phone number must be a valid phone number.',
    'any.required': 'Phone number is required.',
  }),

  email: Joi.string().email().optional().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
  }),

  isFavourite: Joi.boolean().optional().messages({
    'boolean.base': 'IsFavourite must be a boolean value (true or false).',
  }),

  contactType: Joi.string()
    .valid(...contactTypeList)
    .optional()
    .messages({
      'string.base': 'Contact type must be a string.',
      'any.only': `Contact type must be one of ${contactTypeList.join(', ')}.`,
    }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).optional().messages({
    'string.base': 'Name must be a string.',
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot be longer than 20 characters.',
  }),

  phoneNumber: Joi.string().pattern(contactNumberRegexp).optional().messages({
    'string.base': 'Phone number must be a string.',
    'string.pattern.base': 'Phone number must be a valid phone number.',
  }),

  email: Joi.string().email().optional().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Email must be a valid email address.',
  }),

  isFavourite: Joi.boolean().optional().messages({
    'boolean.base': 'IsFavourite must be a boolean value (true or false).',
  }),

  contactType: Joi.string()
    .valid(...contactTypeList)
    .optional()
    .messages({
      'string.base': 'Contact type must be a string.',
      'any.only': `Contact type must be one of ${contactTypeList.join(', ')}.`,
    }),
});

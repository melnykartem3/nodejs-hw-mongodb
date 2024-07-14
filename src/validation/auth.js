import Joi from 'joi';

import { emailRegexp } from '../constants/users.js';

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp).messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.empty': `"email" cannot be an empty field`,
    'string.pattern.base': `"email" must be a valid email address`,
    'any.required': `"email" is a required field`,
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required',
  }),
  token: Joi.string().required().messages({
    'string.base': 'Token should be a type of text',
    'string.empty': 'Token cannot be empty',
    'any.required': 'Token is required',
  }),
});

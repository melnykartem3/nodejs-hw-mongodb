import Joi from 'joi';

import { emailRegexp } from '../constants/users.js';

export const userSignupSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'any.required': `"name" is a required field`,
  }),
  email: Joi.string().required().pattern(emailRegexp).messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.empty': `"email" cannot be an empty field`,
    'string.pattern.base': `"email" must be a valid email address`,
    'any.required': `"email" is a required field`,
  }),
  password: Joi.string().required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'any.required': `"password" is a required field`,
  }),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp).messages({
    'string.base': `"email" should be a type of 'text'`,
    'string.empty': `"email" cannot be an empty field`,
    'string.pattern.base': `"email" must be a valid email address`,
    'any.required': `"email" is a required field`,
  }),
  password: Joi.string().required().messages({
    'string.base': `"password" should be a type of 'text'`,
    'string.empty': `"password" cannot be an empty field`,
    'any.required': `"password" is a required field`,
  }),
});

export const userGoogleOAuthSchema = Joi.object({
  code: Joi.string().required().messages({
    'string.base': `"code" should be a type of 'text'`,
    'string.empty': `"code" cannot be an empty field`,
    'any.required': `"code" is a required field`,
  }),
});

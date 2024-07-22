import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import handlebars from 'handlebars';

import env from '../utils/env.js';
import { compareValue, hashValue } from '../utils/hash.js';
import sendEmail from '../utils/sendEmail.js';
import {
  generateAuthUrl,
  getGoogleOAuthName,
  validateGoogleOAuthCode,
} from '../utils/googleOAuth2.js';

import { TEMPLATES_DIR } from '../constants/index.js';

import { findUser, resetPassword, signup } from '../services/auth.js';

import {
  createSession,
  deleteSession,
  findSession,
} from '../services/session.js';

const app_domain = env('APP_DOMAIN');
const jwt_secret = env('JWT_SECRET');

const passwordPath = path.join(TEMPLATES_DIR, 'reset-password.html');

const setupResponseSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const signupController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const newUser = await signup(req.body);

  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'Email not found');
  }
  const passwordCompare = await compareValue(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Password invalid');
  }

  const session = await createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const currentSession = await findSession({ _id: sessionId, refreshToken });

  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }

  const refreshTokenValidUntil = currentSession?.refreshTokenValidUntil;

  if (!refreshTokenValidUntil) {
    throw createHttpError(500, 'Cannot read refreshTokenValidUntil');
  }

  const refreshTokenExpired = new Date() > new Date(refreshTokenValidUntil);

  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }

  const newSession = await createSession(currentSession.userId);

  setupResponseSession(res, newSession);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }

  await deleteSession({ _id: sessionId });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const payload = {
    id: user._id,
    email,
  };

  const resetToken = jwt.sign(payload, jwt_secret, { expiresIn: '5m' });

  const resetPasswordTemplateSource = await fs.readFile(passwordPath, 'utf-8');
  const resetPasswordTemplate = handlebars.compile(resetPasswordTemplateSource);

  const html = resetPasswordTemplate({
    name: user.name,
    link: `${app_domain}/reset-password?token=${resetToken}`,
  });

  const result = await sendEmail({
    subject: 'Reset your password',
    to: email,
    html,
  });

  if (!result) {
    createHttpError(500, 'Failed to send the email, please try again later.');
  }

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { token, password: newPassword } = req.body;
  try {
    const { id, email } = jwt.verify(token, jwt_secret);

    const user = await findUser({ _id: id, email });

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await hashValue(newPassword);

    await resetPassword({ _id: user._id }, { password: encryptedPassword });

    await deleteSession({ userId: user._id });
    console.log(await findSession());
    res.json({
      status: 200,
      message: 'Reset password successful.',
      data: {},
    });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.json({
    status: 200,
    message: 'googleOAuth url generate succesfully',
    data: {
      url,
    },
  });
};

export const authGoogleController = async (req, res) => {
  const { code } = req.body;
  console.log('Received OAuth code:', code);
  const ticket = await validateGoogleOAuthCode(code);
  const userPayload = ticket.getPayload();

  if (!userPayload) {
    throw createHttpError(401);
  }

  let user = await findUser({ email: userPayload.email });

  if (!user) {
    const signupData = {
      email: userPayload.email,
      password: randomBytes(10),
      name: getGoogleOAuthName(userPayload),
    };
    user = await signupData();
  }

  const session = createSession(user._id);

  setupResponseSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import createHttpError from 'http-errors';

import env from './env.js';

const googleOAuthSettingsPath = path.resolve('google-oauth.json');

const googleOAuthConfig = await JSON.parse(
  await readFile(googleOAuthSettingsPath),
);

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_OAUTH_CLIENT_ID'),
  clientSecret: env('GOOGLE_OAUTH_CLIENT_SECRET'),
  redirectUri: googleOAuthConfig.web.redirect_uris[0],
});

export const validateGoogleOAuthCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) {
    throw createHttpError(401, 'Google OAuth code invaild');
  }

  const ticket = googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });

  return ticket;
};

export const getGoogleOAuthName = ({ given_name, family_name }) => {
  if (!given_name) return 'User';

  const name = `family_name ? ${given_name} ${family_name} : given_name`;

  return name;
};

export const generateAuthUrl = () => {
  return googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

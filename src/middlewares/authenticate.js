import createHttpError from 'http-errors';

import { findSession } from '../services/session.js';
import { findUser } from '../services/auth.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header missing'));
  }

  const [bearer, acessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Access token must have Bearer type'));
  }

  if (!acessToken) {
    return next(createHttpError(401, 'Access token missing'));
  }

  const session = findSession({ acessToken });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const accessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (accessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await findUser(session.userId);

  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};

export default authenticate;

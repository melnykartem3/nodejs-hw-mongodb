import { hashValue } from '../utils/hash.js';

import User from '../db/models/User.js';

export const findUser = (filter) => User.findOne(filter);

export const resetPassword = async (filter, update) => {
  return await User.findOneAndUpdate(filter, update);
};

export const signup = async (data) => {
  const { password } = data;
  const hashPassword = await hashValue(password);
  return User.create({ ...data, password: hashPassword });
};

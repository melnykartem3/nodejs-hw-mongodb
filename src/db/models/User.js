import { Schema, model } from 'mongoose';

import { mongooseSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/users.js';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: emailRegexp,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

UserSchema.pre('findOneAndUpdate', setUpdateSettings);

UserSchema.post('save', mongooseSaveError);

UserSchema.post('findOneAndUpdate', mongooseSaveError);

const User = model('user', UserSchema);

export default User;

import { model, Schema } from 'mongoose';

import {
  contactNumberRegexp,
  contactTypeList,
} from '../../constants/contacts.js';
import { emailRegexp } from '../../constants/users.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      match: contactNumberRegexp,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactTypeList,
      default: contactTypeList[2],
    },
    photo: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactsSchema.pre('findOneAndUpdate', setUpdateSettings);

contactsSchema.post('save', mongooseSaveError);

contactsSchema.post('findOneAndUpdate', mongooseSaveError);

const ContactsCollection = model('contacts', contactsSchema);

export default ContactsCollection;

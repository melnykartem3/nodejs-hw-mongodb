import { model, Schema } from 'mongoose';
import { contactTypeList } from '../../constants/contacts-constants.js';
import { mongooseSaveError, setUpdateSettings } from './hooks.js';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
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

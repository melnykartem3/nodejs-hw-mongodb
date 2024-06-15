import contactsCollection from '../db/models/Contact.js';

export const getAllContacts = async () => {
  return await contactsCollection.find();
};

export const getContactById = async (contactId) => {
  return await contactsCollection.findById(contactId);
};

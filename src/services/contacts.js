import ContactsCollection from '../db/models/Contact.js';
import contactsCollection from '../db/models/Contact.js';

export const getAllContacts = async () => {
  return await contactsCollection.find();
};

export const getContactById = async (contactId) => {
  return await contactsCollection.findById(contactId);
};

export const addContact = (data) => contactsCollection.create(data);

export const upsertContact = async (filter, data, options = {}) => {
  const result = await ContactsCollection.findOneAndUpdate(filter, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  const isNew = Boolean(result?.lastErrorObject?.upserted);

  return {
    data: result.value,
    isNew,
  };
};

export const deleteContact = (filter) =>
  ContactsCollection.findOneAndDelete(filter);

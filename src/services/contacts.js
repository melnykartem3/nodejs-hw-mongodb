import ContactsCollection from '../db/models/Contact.js';
import contactsCollection from '../db/models/Contact.js';
import calcPaginationData from '../utils/calcPaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = 'asc',
  filter,
}) => {
  const skip = (page - 1) * perPage;

  const databaseQuery = contactsCollection.find();

  if (filter.type) {
    console.log(`Filtering by type: ${filter.type}`); // Debugging
    databaseQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== null) {
    console.log(`Filtering by isFavourite: ${filter.isFavourite}`); // Debugging
    databaseQuery.where('isFavourite').equals(filter.isFavourite);
  }

  console.log(`Final Query: ${JSON.stringify(databaseQuery.getFilter())}`); // Log the final query

  const data = await databaseQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const totalItems = await contactsCollection
    .find()
    .merge(databaseQuery)
    .countDocuments();

  const { totalPages, hasNextPage, hasPrevPage } = calcPaginationData(
    totalItems,
    page,
    perPage,
  );

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export const getContactById = (contactId) =>
  contactsCollection.findById(contactId);

export const addContact = (data) => contactsCollection.create(data);

export const upsertContact = async (filter, data, options = {}) => {
  const result = await ContactsCollection.findOneAndUpdate(filter, data, {
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

import createHttpError from 'http-errors';

import { contactFieldList } from '../constants/contacts.js';

import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import parseContactsFilterParams from '../utils/parseContactsFilterParams.js';
import saveFileToPublicDir from '../utils/saveFileToPublicDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import env from '../utils/env.js';

import {
  deleteContact,
  getAllContacts,
  getContact,
  addContact,
  upsertContact,
} from '../services/contacts.js';

const enable_cloudinary = env('ENABLE_CLOUDINARY');

export const getAllContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  const { query } = req;
  const { page, perPage } = parsePaginationParams(query);
  const { sortBy, sortOrder } = parseSortParams(query, contactFieldList);
  const filter = { ...parseContactsFilterParams(query), userId };

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: '200',
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await getContact({ _id: contactId, userId });

  if (!contact) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
    });
  }

  res.json({
    status: '200',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  let photo = '';

  if (req.file) {
    try {
      if (enable_cloudinary === 'true') {
        photo = await saveFileToCloudinary(req.file, 'photos');
      } else {
        photo = await saveFileToPublicDir(req.file, 'photos');
      }
    } catch (error) {
      throw createHttpError(500, error.message);
    }
  }

  const data = await addContact({ ...req.body, userId, photo });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  let updatesFields = { ...req.body };

  if (req.file) {
    try {
      let photo;
      if (enable_cloudinary === 'true') {
        photo = await saveFileToCloudinary(req.file, 'photos');
      } else {
        photo = await saveFileToPublicDir(req.file, 'photos');
      }
      updatesFields.photo = photo;
    } catch (error) {
      throw createHttpError(500, error.message);
    }
  }

  const result = await upsertContact(
    { _id: contactId, userId },
    updatesFields,
    {
      upsert: true,
    },
  );

  if (!result) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
    });
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;

  const { _id: userId } = req.user;

  const result = await deleteContact({ _id: contactId, userId });

  if (!result) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
    });
  }

  res.status(204).json({
    status: 204,
    message: 'Successfully deleted contact!',
    data: result,
  });
};

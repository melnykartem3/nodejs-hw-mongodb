import createHttpError from 'http-errors';

import {
  deleteContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';
import { addContact } from '../services/contacts.js';
import { upsertContact } from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.json({
    status: '200',
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

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
  const data = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await upsertContact({ _id: contactId }, req.body);

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

  const result = await deleteContact({ _id: contactId });

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

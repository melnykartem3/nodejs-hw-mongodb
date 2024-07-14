import { Router } from 'express';

import authenticate from '../middlewares/authenticate.js';
import isValidId from '../middlewares/isValidId.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';

import {
  getAllContactsController,
  getContactController,
  addContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import upload from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:contactId', isValidId, ctrlWrapper(getContactController));

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(addContactController),
);

contactsRouter.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;

import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contacts-controllers.js';
import isValidId from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/', ctrlWrapper(addContactController));

contactsRouter.patch(
  '/:contactId',
  isValidId,
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import env from './utils/env.js';

import { getAllContacts, getContactById } from './services/contacts.js';

const port = env('PORT', '3000');

const setupServer = () => {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  const app = express();

  app.use(cors());
  app.use(logger);

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 'success',
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(port, () => console.log(`Server running on port ${port}`));
};

export default setupServer;

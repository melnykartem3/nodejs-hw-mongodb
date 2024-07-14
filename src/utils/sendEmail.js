import nodemailer from 'nodemailer';

import 'dotenv/config';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  secure: false,
});

const sendEmail = async (data) => {
  const email = { ...data, from: SMTP_FROM };
  return await transporter.sendMail(email);
};

export default sendEmail;

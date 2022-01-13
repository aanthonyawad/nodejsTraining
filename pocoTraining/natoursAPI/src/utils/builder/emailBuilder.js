// IMPORTS
import nodemailer from 'nodemailer';
import htmlToText from 'html-to-text';
import pug from 'pug';

//DIRNMAE ALT
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

class EmailBuilder {
  constructor() {
    this.transporter;
    this.options;
  }

  createTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //Activate in gmail "less secure app" option
    });
    return this;
  }

  defineEmailOptions(options) {
    this.options = {
      from: `Info Natours, <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
    };
    return this;
  }

  async sendEmailWelcome() {
    const html = pug.renderFile(`${__dirname}/../../views/email/welcome.pug`);
    this.options.html = html;
    this.options.text = htmlToText.fromString(html);
    await this.transporter.sendMail(this.options);
  }
}
export default EmailBuilder;

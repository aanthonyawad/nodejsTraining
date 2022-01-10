import nodemailer from 'nodemailer';

class Email {
  constructor() {
    this.transporter;
    this.options;
  }

  createTransporter() {
    this.transporter = nodemailer.createTransport({
      port: process.env.EMAIL_PORT,
      host: process.env.EMAIL_HOST,
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
      from: 'Info Natours, <info@awad.io>',
      to: options.email,
      subject: options.subject,
      text: options.text,
      // html:
    };
    return this;
  }

  async sendEmail() {
    await this.transporter.sendMail(this.options);
  }
}
export default Email;

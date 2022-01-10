//IMPORTS
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// MODEL
import User from './user.model.js';
//UTIL
import MongoPaginationPipeline from '../utils/MongoPagination.js';
import * as process from 'process';
import Email from '../utils/email/email.js';

class UserService {
  constructor() {
    this.email = new Email();
  }
  addData = (data) => {
    const user = new User({
      ...data,
      updatedDate: new Date(),
    });
    return user;
  };

  generateToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  signup = async (body) => {
    let user = this.addData(body);
    user.active = true;
    user.deleted = false;
    user.createdDate = new Date();
    if (user.secret.password != user.secret.passwordConfirm) {
      throw new Error('invalidPassword');
    }
    await user.save();
    const token = this.generateToken(user._id);
    return { token: token };
  };

  login = async (body) => {
    let { email, password } = body;
    if (!email && !password) {
      throw new Error('invalidInput');
    }

    const user = await this.getSingleUser(body);
    if (!user) {
      throw new Error('userDoesNotExist');
    }
    const token = this.generateToken(user._id);
    return { token: token };
  };

  getSingleUser = async (body) => {
    const user = await User.findOne({
      email: body.username,
    });
    if (!user) {
      throw new Error('invalidInput');
    }
    const verifiedPassword = await user.verifyPassword(body.password);
    if (!verifiedPassword) {
      throw new Error('invalidInput');
    }
    return user;
  };

  forgotPassword = async (body) => {
    const user = await User.findOne({
      email: body.username,
    });
    if (!user) {
      throw new Error('invalidInput');
    }

    const resetTokenObj = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const options = {
      email: 'user.awad@email.com',
      subject: 'Reset Password Email',
      text: `hello ${resetTokenObj.resetToken}\n your password will expire exactly after 10 mins at ${resetTokenObj.passwordResetExpires} `,
    };
    await this.sendEmail(options);
    const token = this.generateToken(user._id);
    return { step1: 'Forgot Email Step 1  Sent!' };
  };

  resetPassword = async (unhashedPasswordResetToken) => {
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(unhashedPasswordResetToken)
      .digest('hex');
    const user = await User.findOne({ passwordResetToken: passwordResetToken });
    if (user.passwordResetExpires < Date.now()) throw new Error('invalidInput');
    user.secret.password = 'pass1234';
    user.secret.passwordConfirm = 'pass1234';
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    const options = {
      email: 'user.awad@email.com',
      subject: 'Reset Password Email',
      text: `Reset Password Complete New Password is pass1234`,
    };
    await this.sendEmail(options);
    const token = this.generateToken(user._id);
    return { token: token };
  };
  sendEmail = async (options) => {
    await new Email()
      .createTransporter()
      .defineEmailOptions(options)
      .sendEmail();
  };
}
export default UserService;

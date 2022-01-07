//IMPORTS
import jwt from 'jsonwebtoken';

// MODEL
import User from './user.model.js';
//UTIL
import MongoPaginationPipeline from '../utils/MongoPagination.js';
import * as process from 'process';

class UserService {
  addData = (data) => {
    const user = new User({
      ...data,
      updatedDate: new Date(),
    });
    return user;
  };

  signup = async (body) => {
    let user = this.addData(body);
    user.active = true;
    user.deleted = false;
    user.createdDate = new Date();
    if (user.secret.password != user.secret.passwordConfirm) {
      throw new Error('invalidPassword');
    }
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return { token: token };
  };

  getSingleUser = async (body) => {
    const user = await User.findOne({
      email: body.username,
      'secret.password': body.password,
    });
    return user;
  };
}
export default UserService;

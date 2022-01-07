// MODEL
import User from './user.model.js';
//UTIL
import MongoPaginationPipeline from '../utils/MongoPagination.js';

class UserService {
  addData = (data) => {
    const user = new User({
      ...data,
      updatedDate: new Date(),
    });
    return user;
  };

  signup = async (body) => {
    console.log(body);
    let user = this.addData(body);
    user.active = true;
    user.deleted = false;
    user.createdDate = new Date();
    if (user.secret.password != user.secret.passwordConfirm) {
      throw new Error('invalidPassword');
    }

    await user.save();
    return user;
  };
}
export default UserService;

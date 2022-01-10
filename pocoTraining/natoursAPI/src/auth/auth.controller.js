//IMPORTS
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

//UTIL
import AppError from '../utils/error/appError.js';
class AuthControllerMiddleware {
  constructor() {}

  protect = async (req, res, next) => {
    try {
      // check if token exists
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
          throw new Error('invalidLogin');
        }
        //verify token
        console.log('decoded');
        const decoded = await promisify(jwt.verify)(
          token,
          process.env.JWT_SECRET
        );
        console.log(decoded);
      } else {
        throw new Error('invalidLogin');
      }
    } catch (err) {
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
    return next();
  };
}
export default AuthControllerMiddleware;

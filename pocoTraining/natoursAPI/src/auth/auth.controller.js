//IMPORTS
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

//UTIL
const AppError = require('../utils/error/appError');

//Models
const User = require('../user/user.model');

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
        const decoded = await promisify(jwt.verify)(
          token,
          process.env.JWT_SECRET
        );
        // check if user exists
        const freshUser = await User.findById(decoded.id);
        if (!freshUser) {
          throw new Error('invalidLogin');
        }
        if (freshUser.changedPasswordAfter(decoded.iat)) {
          throw new Error('invalidLogin');
        }
        req.user = freshUser;
      } else {
        throw new Error('invalidLogin');
      }
    } catch (err) {
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
    return next();
  };

  restrictTo = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        const appError = new AppError('accessDenied', 403, req.lang);
        next(appError);
      }
      next();
    };
  };
}

module.exports = AuthControllerMiddleware;

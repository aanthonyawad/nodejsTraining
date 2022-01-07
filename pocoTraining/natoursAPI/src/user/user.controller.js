// IMPORTS
import express from 'express';
import UserService from './user.service.js';

//UTIL
import AppError from '../utils/error/appError.js';

class UserController {
  constructor(app) {
    this.route = `/api/v1/user`;
    this.cmsRoute = `/api/v1/cms/user`;
    this.service = new UserService();
    this.initializesRoutes(app);
  }
  signup = async (req, res, next) => {
    try {
      const user = await this.service.signup(req.body);
      return res.status(201).send(user);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      const appError = new AppError(err.message, 400, req.lang);
      return next(appError);
    }
  };
  initializesRoutes = async (app) => {
    app.post(`${this.route}/signup`, this.signup);
  };
}
export default UserController;

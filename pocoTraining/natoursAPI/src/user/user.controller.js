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
      const token = await this.service.signup(req.body);
      return res.status(201).json(token);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      const appError = new AppError(err.message, 400, req.lang);
      return next(appError);
    }
  };

  login = async (req, res, next) => {
    try {
      const token = await this.service.login(req.body);
      return res.status(200).json(token);
    } catch (err) {
      console.log(err);
      //IMPLEMENT LANGUAGE ERROR HANDLING
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  forgotPassword = async (req, res, next) => {
    try {
      const resetToken = await this.service.forgotPassword(req.body);
      return res.status(200).json(resetToken);
    } catch (err) {
      console.log(err);
      //IMPLEMENT LANGUAGE ERROR HANDLING
      const appError = new AppError(err.message, 400, req.lang);
      return next(appError);
    }
  };
  resetPassword = async (req, res, next) => {
    try {
      const token = await this.service.resetPassword(req.params.token);
      return res.status(200).json(token);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  initializesRoutes = async (app) => {
    app.post(`${this.route}/login`, this.login);
    app.post(`${this.route}/forgotpassword`, this.forgotPassword);
    app.post(`${this.route}/resetPassword/:token`, this.resetPassword);

    app.post(`${this.route}/signup`, this.signup);
  };
}
export default UserController;

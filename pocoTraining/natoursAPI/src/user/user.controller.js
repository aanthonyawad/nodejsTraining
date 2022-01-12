// IMPORTS
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
//UTIL
import AppError from '../utils/error/appError.js';

// CONTROLLERS
import AuthControllerMiddleware from '../auth/auth.controller.js';

// SERVICES
import UserService from './user.service.js';
import FactoryService from '../utils/factory/factory.service.js';

class UserController {
  constructor(app) {
    this.route = `/api/v1/user`;
    this.cmsRoute = `/api/v1/cms/user`;
    this.service = new UserService();
    this.authControllerMiddeware = new AuthControllerMiddleware();
    this.factoryService = new FactoryService();
    this.initializesRoutes(app);
  }
  signup = async (req, res, next) => {
    try {
      const token = await this.service.signup(req.body);
      res.cookie('token', token, {
        expiresIn: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        // secure: true,
        httpOnly: true,
      });
      return res.status(201).json(token);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      const appError = new AppError(err.message, 400, req.lang);
      return next(appError);
    }
  };

  login = async (req, res, next) => {
    try {
      console.log(req.file);
      console.log(req.body);
      const token = await this.service.login(req.body);

      res.cookie('token', token, {
        expiresIn: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        // secure: true,
        httpOnly: true,
      });
      console.log(req.file.filename);
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

  changePassword = async (req, res, next) => {
    try {
      // i have the logged in user from the middleware
      const token = await this.service.changePassword(req.user, req.body);
      res.cookie('token', token, {
        expiresIn: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        // secure: true,
        httpOnly: true,
      });
      return res.status(200).json(token);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  me = async (req, res, next) => {
    try {
      const me = await req.user;
      return res.json(me);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  initializesRoutes = async (app) => {
    app.post(`${this.route}/login`, this.upload, this.resizePhoto, this.login);
    app.post(`${this.route}/forgotpassword`, this.forgotPassword);
    app.post(`${this.route}/resetPassword/:token`, this.resetPassword);
    app.post(`${this.route}/signup`, this.signup);

    app.use(`${this.route}/`, this.authControllerMiddeware.protect);
    app.get(`${this.route}/me`, this.me);
    app.patch(`${this.route}/updatepassword`, this.changePassword);
  };
  multerStorage = () => ({
    destination: (req, file, cb) => {
      cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      // id = req.user._id;
      cb(null, `user-id-${Date.now()}.${ext}`);
    },
  });

  multerImageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('fail'), false);
    }
  };

  upload = multer({
    storage: multer.memoryStorage(),
    filter: this.multerImageFilter,
  }).single('photo');

  resizePhoto = async (req, res, next) => {
    if (!req.file) next();
    const ext = req.file.mimetype.split('/')[1];
    req.file.filename = `user-id-${Date.now()}-.${ext}`;
    await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
    next();
  };
}
export default UserController;

//IMPORTS
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

//CONTROLLERS
import TourController from './tour/tour.controller.js';
import UserController from './user/user.controller.js';

//DIRNMAE ALT
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

//UTILS
import AppError from './utils/error/appError.js';

class Middleware {
  constructor(app) {
    this.initMiddleware(app);
    this.initDb(app);
    this.initControllers(app);
    this.initUnkownRoute(app);
    this.initErrorMiddleware(app);
  }

  initMiddleware(app) {
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.static(`${__dirname}/public`));
    app.use(cors());
    app.use(cookieParser());

    //DATA NEEDED BEFORE EVERY REQUEST
    app.use((req, res, next) => {
      req.lang =
        req.headers['accept-language'] != null
          ? req.headers['accept-language']
          : 'en';
      req.requestStartMillisec = Date.now();
      next();
    });
  }

  initDb() {
    mongoose.connect(
      process.env.DATABASEURL,
      {
        useNewUrlParser: true,
      },
      (error) => {
        if (error) console.log(error);
      }
    );
  }

  initControllers(app) {
    const controllers = [new TourController(app), new UserController(app)];
  }

  initUnkownRoute(app) {
    app.all('*', (req, res, next) => {
      next(new AppError(`fail`, 404, req.lang));
    });
  }

  initErrorMiddleware(app) {
    app.use((err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        return this.sendErrorDev(err, res);
      } else if (process.env.NODE_ENV === 'production') {
        return this.sendErrorProd(err, res);
      }
    });
  }

  //////////////////////////////////
  // ERROR FUNCTIONS
  //////////////////////////////////
  sendErrorProd(err, res) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: statusCode,
      data: err.data,
    });
  }
  sendErrorDev(err, res) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      status: statusCode,
      data: err.data,
      stack: err.stack,
    });
  }
}
export default Middleware;

//IMPORTS
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import sanitizer from 'express-mongo-sanitize';
import hpp from 'hpp';
import pug from 'pug';

//CONTROLLERS
import TourController from './tour/tour.controller.js';
import UserController from './user/user.controller.js';
import ReviewController from './review/review.controller.js';
import PugController from './pug/pug.controller.js';

//DIRNMAE ALT
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

//UTILS
import AppError from './utils/error/appError.js';

class Middleware {
  constructor(app) {
    this.initPug(app);
    this.initMiddleware(app);
    this.initDb(app);
    this.initControllers(app);
    this.initUnkownRoute(app);
    this.initErrorMiddleware(app);
  }

  initMiddleware(app) {
    app.use(helmet());
    this.rateLimiter(app);
    if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
    app.use(express.json());
    //DATA Sanitization against NOSQL query injection
    app.use(sanitizer());
    //DATA Sanitization against XSS
    app.use(xss());
    app.use(hpp());
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
    new PugController(app);
    new TourController(app);
    new UserController(app);
    new ReviewController(app);
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

  rateLimiter(app) {
    const limiter = rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message: 'Too many request from this IP please try again later.',
    });
    app.use('/api', limiter);
  }

  initPug(app) {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    app.use(express.static(path.join(__dirname, 'public')));
  }
}
export default Middleware;

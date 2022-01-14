//IMPORTS
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const sanitizer = require('express-mongo-sanitize');
const hpp = require('hpp');
const pug = require('pug');

//CONTROLLERS
const TourController = require('./tour/tour.controller');
const UserController = require('./user/user.controller');
const ReviewController = require('./review/review.controller');
const PugController = require('./pug/pug.controller');

//UTILS
const AppError = require('./utils/error/appError.js');

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
      }
      if (process.env.NODE_ENV === 'production') {
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
module.exports = Middleware;

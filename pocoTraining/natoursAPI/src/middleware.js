import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import mongoose from 'mongoose';
import TourController from './tour/tour.controller.js';
import UserController from './user/user.controller.js';
class Middleware {
  constructor(app) {
    this.initMiddleware(app);
    this.initDb(app);
    this.initControllers(app);
  }

  initMiddleware(app) {
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    //DATA NEEDED BEFORE EVERY REQUEST
    app.use((req, res, next) => {
      req.lang =
        req.headers['accept-headers'] != null
          ? req.headers['accept-headers']
          : 'en';
      req.requestStartMillisec = Date.now();
      next();
    });
  }

  initDb() {
    mongoose.connect(
      'mongodb://localhost:27017/natours',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
      () => console.log('Successfully connected to MongoDB')
    );
  }

  initControllers(app) {
    const controllers = [new TourController(app), new UserController(app)];
  }
}
export default Middleware;

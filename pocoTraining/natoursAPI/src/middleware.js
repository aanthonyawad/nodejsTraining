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

class Middleware {
  constructor(app) {
    this.initMiddleware(app);
    this.initDb(app);
    this.initControllers(app);
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
        req.headers['accept-headers'] != null
          ? req.headers['accept-headers']
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
}
export default Middleware;

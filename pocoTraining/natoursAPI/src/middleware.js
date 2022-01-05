import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
class Middleware {
  constructor(app) {
    this.initMiddleware(app);
    this.initDb(app);
    this.initControllers(app);
  }

  initMiddleware(app) {
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
    // const controllers = [new DashboardController(app)];
  }
}
export default Middleware;

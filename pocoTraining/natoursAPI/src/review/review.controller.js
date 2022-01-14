// IMPORTS
const ReviewService = require('./review.service');

//UTIL
const AppError = require('../utils/error/appError');
const AuthControllerMiddleware = require('../auth/auth.controller');

class TourController {
  constructor(app) {
    this.route = `/api/v1/review`;
    this.cmsRoute = `/api/v1/review`;
    this.service = new ReviewService();
    this.authControllerMiddeware = new AuthControllerMiddleware();
    this.initializesRoutes(app);
  }

  getAllReviews = async (req, res, next) => {
    try {
      const reviews = await this.service.getAllReviews();
      return res.json(reviews);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  createNewReview = async (req, res, next) => {
    try {
      const reviews = await this.service.createNewReview(req.body, req.user);
      return res.json(reviews);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };
  findOneReview = async (req, res, next) => {
    try {
      const reviews = await this.service.findOneReview(req.params.id);
      return res.json(reviews);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  deleteReview = async (req, res, next) => {
    try {
      const reviews = await this.service.deleteUndeleteReview(
        true,
        req.params.id
      );
      return res.json(reviews);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  initializesRoutes = async (app) => {
    app.use(`${this.route}/`, this.authControllerMiddeware.protect);
    app.get(`${this.route}/`, this.getAllReviews);
    app.post(`${this.route}/`, this.createNewReview);
    app.get(`${this.route}/:id`, this.findOneReview);
    app.delete(`${this.route}/:id`, this.deleteReview);
  };
}
module.exports = TourController;

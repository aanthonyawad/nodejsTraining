// IMPORTS
import express from 'express';
import TourService from './tour.service.js';

//MODEL
import Tour from './tour.model.js';

//UTIL
import AppError from '../utils/error/appError.js';
import AuthControllerMiddleware from '../auth/auth.controller.js';
import FactoryService from '../utils/factory/factory.service.js';
class TourController {
  constructor(app) {
    this.route = `/api/v1/tour`;
    this.cmsRoute = `/api/v1/cmstour`;
    this.service = new TourService();
    this.authControllerMiddeware = new AuthControllerMiddleware();
    this.factoryService = new FactoryService(Tour);
    this.initializesRoutes(app);
  }

  getAllTours = async (req, res, next) => {
    try {
      //TODO create result obj
      const tours = await this.service.getAllToursPaginated(req.query);
      return res.send(tours);
    } catch (e) {
      console.log(e);
      return res.send(e);
    }
  };

  findOneTour = async (req, res, next) => {
    try {
      //TODO create result obj
      const tour = await this.service.findOneTour(req.params.id);
      return res.send(tour);
    } catch (e) {
      const appError = new AppError(`notFound`, 400, req.lang);
      return next(appError);
    }
  };

  deleteTour = async (req, res, next) => {
    try {
      const deletedTour = await this.factoryService.deleteUndeleteModel(
        true,
        req.params.id
      );
      return res.json(deletedTour);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  updateTour = async (req, res, next) => {
    try {
      //TODO create result obj
      const tour = await this.service.updateTour(req.body, req.param.id);
      return res.send(tour);
    } catch (e) {
      return res.send(e);
    }
  };

  createNewTour = async (req, res, next) => {
    try {
      //TODO create result obj
      const tour = await this.service.createNewTour(req.body);
      return res.send(tour);
    } catch (e) {
      return res.send(e);
    }
  };
  getTourStats = async (req, res, next) => {
    try {
      //TODO create result obj
      const tour = await this.service.getTourStats();
      return res.send(tour);
    } catch (e) {
      return res.send(e);
    }
  };

  initializesRoutes = async (app) => {
    app.get(`${this.route}/stats`, this.getTourStats);

    app.use(
      `${this.route}/`,
      this.authControllerMiddeware.protect,
      this.authControllerMiddeware.restrictTo('admin')
    );
    app.get(`${this.route}/`, this.getAllTours);
    app.post(`${this.route}/`, this.createNewTour);
    app.get(`${this.route}/:id`, this.findOneTour);
    app.put(`${this.route}/:id`, this.updateTour);
    app.delete(`${this.route}/:id`, this.deleteTour);
  };
}
export default TourController;

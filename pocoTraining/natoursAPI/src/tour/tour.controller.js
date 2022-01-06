// IMPORTS
import express from 'express';
import TourService from './tour.service.js';

class TourController {
  constructor(app) {
    this.route = `/api/v1/tour`;
    this.cmsRoute = `/api/v1/cmstour`;
    this.service = new TourService();
    this.initializesRoutes(app);
  }

  getAllTours = async (req, res, next) => {
    try {
      //TODO create result obj
      const tours = await this.service.getAllTours();
      return res.send(tours);
    } catch (e) {
      console.log(e);
      return res.send(e);
    }
  };

  getTour = async (req, res, next) => {
    return res.send(req.lang);
  };

  deleteTour = async (req, res, next) => {
    return res.send(req.lang);
  };

  patchTour = async (req, res, next) => {
    return res.send(req.lang);
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
  initializesRoutes = async (app) => {
    app.get(`${this.route}/`, this.getAllTours);
    app.post(`${this.route}/`, this.createNewTour);
    app.get(`${this.route}/:id`, this.getTour);
    app.patch(`${this.route}/:id`, this.patchTour);
    app.delete(`${this.route}/:id`, this.deleteTour);
  };
}
export default TourController;

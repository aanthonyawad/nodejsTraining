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
    return res.send(req.lang);
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

  postTour = async (req, res, next) => {
    return res.send(req.lang);
  };

  initializesRoutes = async (app) => {
    app.get(`${this.route}/`, this.getAllTours);
    app.post(`${this.route}/`, this.postTour);
    app.get(`${this.route}/:id`, this.getTour);
    app.patch(`${this.route}/:id`, this.patchTour);
    app.delete(`${this.route}/:id`, this.deleteTour);
  };
}
export default TourController;

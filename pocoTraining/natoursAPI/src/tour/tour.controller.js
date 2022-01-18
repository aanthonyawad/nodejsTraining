// IMPORTS
const TourService = require('./tour.service');

//MODEL
const Tour = require('./tour.model');

//UTIL
const AppError = require('../utils/error/appError.js');
const AuthControllerMiddleware = require('../auth/auth.controller.js');

const FactoryService = require('../utils/factory/factory.service.js');
const multer = require('multer');
const sharp = require('sharp');

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
  getToursWithin = async (req, res, next) => {
    try {
      //TODO create result obj
      const toursWithing = await this.service.getToursWithin(req.params);
      return res.send(toursWithing);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  getDistances = async (req, res, next) => {
    try {
      //TODO create result obj
      const distances = await this.service.getDistances(req.params);
      return res.json(distances);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };

  uploadTourPhoto = async (req, res, next) => {
    try {
      //TODO create result obj
      console.log(req.body);
      const tour = await this.service.uploadTourPhoto(
        req.file.filename,
        req.params.id
      );
      return res.send(tour);
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 401, req.lang);
      return next(appError);
    }
  };
  initializesRoutes = async (app) => {
    app.get(`${this.route}/stats`, this.getTourStats);

    app.use(
      `${this.route}/`,
      this.authControllerMiddeware.protect,
      this.authControllerMiddeware.restrictTo('admin', 'user')
    );
    app.get(`${this.route}/`, this.getAllTours);
    app.post(`${this.route}/`, this.createNewTour);
    app.get(`${this.route}/:id`, this.findOneTour);
    app.put(`${this.route}/:id`, this.updateTour);
    app.delete(`${this.route}/:id`, this.deleteTour);
    app.get(
      `${this.route}/tours-within/:distance/center/:latlng/unit/:unit`,
      this.getToursWithin
    );
    app.get(`${this.route}/:latlng/unit/:unit`, this.getDistances);
    app.patch(
      `${this.route}/upload-photo/:id`,
      this.upload,
      this.resizePhoto,
      this.uploadTourPhoto
    );
  };

  multerStorage = () => ({
    destination: (req, file, cb) => {
      cb(null, 'public/img/tours');
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];
      console.log(ext);
      // id = req.user._id;
      cb(null, `user-id-${Date.now()}.${ext}`);
    },
  });

  multerImageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('fail'), false);
    }
  };

  upload = multer({
    storage: multer.memoryStorage(),
    filter: this.multerImageFilter,
  }).single('photo');

  resizePhoto = async (req, res, next) => {
    if (!req.file) next();
    const ext = req.file.mimetype.split('/')[1];
    req.file.filename = `tour-id-${Date.now()}.${ext}`;
    await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.file.filename}`);
    next();
  };
}
module.exports = TourController;

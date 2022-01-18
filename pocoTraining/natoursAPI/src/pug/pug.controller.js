// CONTROLLER
const AppError = require('../utils/error/appError');
// TOUR SERVICE
const TourService = require('../tour/tour.service');

class PugController {
  constructor(app) {
    this.route = `/api/v1/user`;
    this.cmsRoute = `/api/v1/cms/user`;
    this.tourService = new TourService();
    this.initializesRoutes(app);
  }

  overeview = async (req, res, next) => {
    try {
      const tours = await this.tourService.getAllTours();
      console.log(tours);
      return res.status(200).render('overview', {
        title: 'The Forest Hiker',
        tours,
      });
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 400, req.lang);
      return next(appError);
    }
  };
  findOneTour = async (req, res, next) => {
    try {
      const tour = await this.tourService.findOneTour(req.params.id);
      return res.status(200).render('tour', {
        title: 'The Forest Hiker',
        tour,
      });
    } catch (err) {
      //IMPLEMENT LANGUAGE ERROR HANDLING
      console.log(err);
      const appError = new AppError(err.message, 400, req.lang);
      return next(appError);
    }
  };

  initializesRoutes = (app) => {
    app.get(`/`, this.overeview);
    app.get(`/tour/:id`, this.findOneTour);
  };
}
module.exports = PugController;

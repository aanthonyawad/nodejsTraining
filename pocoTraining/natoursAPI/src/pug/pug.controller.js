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
      console.log(req.lang);
      const tours = await this.tourService.getAllTours();
      return res.status(200).render('overview', {
        title: 'The Foresr Hiker',
        tours,
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
    // app.post(`/tour`, this.tour);
  };
}
module.exports = PugController;

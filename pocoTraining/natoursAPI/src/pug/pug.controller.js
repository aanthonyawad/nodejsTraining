// CONTROLLER
import AuthControllerMiddleware from '../auth/auth.controller.js';
import AppError from '../utils/error/appError.js';
// TOUR SERVICE
import TourService from '../tour/tour.service.js';

class PugController {
  constructor(app) {
    this.route = `/api/v1/user`;
    this.cmsRoute = `/api/v1/cms/user`;
    this.tourService = new TourService();
    this.authControllerMiddeware = new AuthControllerMiddleware();
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
export default PugController;

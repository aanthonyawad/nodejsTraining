// CONTROLLER
import AuthControllerMiddleware from '../auth/auth.controller.js';
import AppError from '../utils/error/appError.js';
// TOUR SERVICE
import BookingService from '../booking/booking.service.js';

class BookingController {
  constructor(app) {
    this.service = new BookingService();
    this.authControllerMiddeware = new AuthControllerMiddleware();
    this.initializesRoutes(app);
  }
  checkoutSession = async (req, res, next) => {
    try {
      const session = await this.service.checkoutSession(req);
      return res.status(200).json(session);
    } catch (err) {
      console.log(err);
      //IMPLEMENT LANGUAGE ERROR HANDLING
      const appError = new AppError(err.message, 400, req.lang);
      return next(appError);
    }
  };

  initializesRoutes = (app) => {
    app.get(
      '/checkout-session/:tourId',
      this.authControllerMiddeware.protect,
      this.checkoutSession
    );
  };
}
export default BookingController;

// IMPORTS
import stripe from 'stripe';
//MODELS

//Services
import TourService from '../tour/tour.service.js';
class BookingService {
  constructor() {
    this.tourService = new TourService();
  }
  checkoutSession = async (req) => {
    const tourId = req.params.tourId;
    const tour = await this.tourService.findOneTour(tourId);

    const session = await stripe.checkout.session.create({
      payment_method_types: ['card'],
      sucess_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/`,
      customer_email: req.user.email,
      client_reference_id: tourId,
      lineItems: [{ name: `${tour.name} Tour` }],
      currency: 'usd',
      quantity: 1,
    });
    return session;
  };
}
export default BookingService;

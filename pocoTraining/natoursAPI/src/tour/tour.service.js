import Tour from './tour.model.js';
class TourService {
  constructor() {}
  addData = (data) => {
    const tour = new Tour({ ...data });
    return tour;
  };
  createNewTour = async (data) => {
    let tour = this.addData(data);
    await tour.save();
    console.log(tour);
    return tour;
  };
}
export default TourService;

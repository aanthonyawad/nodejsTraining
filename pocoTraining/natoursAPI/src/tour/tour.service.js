import Tour from './tour.model.js';
class TourService {
  constructor() {}

  addData = (data) => {
    const tour = new Tour({
      ...data,
      createdDate: new Date(),
      updatedDate: new Date(),
    });
    return tour;
  };

  createNewTour = async (data) => {
    data.active = true;
    data.deleted = false;
    let tour = this.addData(data);
    await tour.save();
    return tour;
  };

  findOne = async (id) => {
    let tour = await Tour.findById(id);
    return tour;
  };

  getAllTours = async () => {
    return await Tour.find();
  };

  activateDeactivateTour = async (flag, id) => {
    const tour = await this.findOne(id);
    if (!tour && !tour.deleted) {
      throw new Error('error');
    }
    tour.active = flag;
    await tour.updateOne();
    return tour;
  };

  deleteUndeleteTour = async (flag, id) => {
    const tour = await this.findOne(id);
    if (!tour) {
      throw new Error('error');
    }
    tour.deleted = flag;
    await tour.updateOne();
    return tour;
  };
}
export default TourService;

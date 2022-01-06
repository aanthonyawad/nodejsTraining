import Tour from './tour.model.js';
import MongoPaginationPipeline from '../utils/MongoPagination.js';
class TourService {
  constructor() {
    this.pipeline = new MongoPaginationPipeline();
  }

  addData = (data) => {
    const tour = new Tour({
      ...data,
      updatedDate: new Date(),
    });
    return tour;
  };

  createNewTour = async (data) => {
    data.active = true;
    data.deleted = false;
    data.createdDate = new Date();
    let tour = this.addData(data);
    await tour.save();
    return tour;
  };

  updateTour = async (data, id) => {
    data._id = id;
    let tour = this.addData(data);
    await tour.updateOne(data);
    return tour;
  };

  findOneTour = async (id) => {
    let tour = await Tour.findById(id);
    return tour;
  };

  getAllTours = async (query) => {
    let pipeline = this.pipeline.serve(query);
    return await Tour.aggregate(pipeline);
  };

  getAllToursPaginated = async (query) => {
    const { id: _id, price, name } = query;
    return await Tour.find();
  };

  activateDeactivateTour = async (flag, id) => {
    const tour = await this.findOneTour(id);
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

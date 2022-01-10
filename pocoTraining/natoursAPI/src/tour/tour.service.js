// MODEL
import Tour from './tour.model.js';
//UTIL
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
    await tour.updateOne(data, {
      new: true,
      runValidators: true,
    });
    return tour;
  };

  findOneTour = async (id) => {
    let tour = await Tour.findById(id);
    return tour;
  };

  getAllTours = async () => {
    return await Tour.find();
  };

  getAllToursPaginated = async (query) => {
    let pipeline = this.pipeline.serve(
      {
        $project: {
          _id: -1,
          duration: 1,
          maxGroupSize: 1,
          price: 1,
        },
      },
      query
    );
    return await Tour.aggregate(pipeline);
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
    const tour = await this.findOneTour(id);
    if (!tour) {
      throw new Error('error');
    }
    tour.deleted = flag;
    await tour.updateOne();
    return tour;
  };
}
export default TourService;

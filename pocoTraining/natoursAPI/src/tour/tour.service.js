// MODEL
const Tour = require('./tour.model');
//UTIL
const MongoPaginationPipeline = require('../utils/MongoPagination');
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
  // /tours-within/:distance/center/:latlng/unit/:unit
  getToursWithin = async (params) => {
    const { distance, latlng, unit } = params;
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6478.1;
    const [lat, lng] = latlng;
    if (!lat || !lng) {
      throw new Error('fail');
    }

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
    });
    return tours;
  };
  getDistances = async (params) => {
    const { latlng, unit } = params;
    const [lat, lng] = latlng;
    if (!lat || !lng) {
      throw new Error('fail');
    }
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
          distanceField: 'distance',
        },
      },
      {
        $project: {
          distance: 1,
          _id: 0,
          name: 1,
        },
      },
    ]);
    return distances;
  };
}
module.exports = TourService;

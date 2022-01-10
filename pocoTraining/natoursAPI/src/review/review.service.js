// MODEL
import Review from './review.model.js';
//UTIL
import MongoPaginationPipeline from '../utils/MongoPagination.js';
class ReviewService {
  constructor() {
    this.pipeline = new MongoPaginationPipeline();
  }

  addData = (data) => {
    const review = new Review({
      ...data,
      updatedDate: new Date(),
    });
    return review;
  };

  createNewReview = async (data, user) => {
    console.log(data);
    data.active = true;
    data.deleted = false;
    data.userId = user._id;
    data.createdDate = new Date();
    let review = this.addData(data);
    await review.save();
    return review;
  };

  updateReview = async (data, id) => {
    data._id = id;
    let review = this.addData(data);
    await review.updateOne(data, {
      new: true,
      runValidators: true,
    });
    return review;
  };

  findOneReview = async (id) => {
    let review = await Review.findById(id);
    return review;
  };

  getAllReviews = async () => {
    return await Review.find();
  };

  // getAllReviewsPaginated = async (query) => {
  //   let pipeline = this.pipeline.serve(
  //     {
  //       $project: {
  //         _id: -1,
  //         duration: 1,
  //         maxGroupSize: 1,
  //         price: 1,
  //       },
  //     },
  //     query
  //   );
  //   return await Review.aggregate(pipeline);
  // };

  activateDeactivateReview = async (flag, id) => {
    const review = await this.findOneReview(id);
    if (!review && !review.deleted) {
      throw new Error('error');
    }
    review.active = flag;
    await review.updateOne();
    return review;
  };

  deleteUndeleteReview = async (flag, id) => {
    const review = await this.findOneReview(id);
    if (!review) {
      throw new Error('error');
    }
    review.deleted = flag;
    await review.updateOne();
    return review;
  };
}
export default ReviewService;

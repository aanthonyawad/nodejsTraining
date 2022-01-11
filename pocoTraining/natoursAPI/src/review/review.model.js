//Imports
import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'A Model must have a review'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'A Review must have a rating'],
      min: 1,
      max: 10,
    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    tourId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },

    active: Boolean,
    deleted: Boolean,
    createdDate: Date,
    updatedDate: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model('Review', reviewSchema);

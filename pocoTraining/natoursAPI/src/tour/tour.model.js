//Imports
import mongoose from 'mongoose';

const { Schema } = mongoose;

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, 'A Tour must have durations'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A Tour must have a group size'],
  },
  price: {
    type: Number,
    required: [true, 'A Tour must have a rating'],
  },
  priceDiscount: Number,
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  difficulty: {
    type: String,
    required: [true, 'A Tour must have a difficulty'],
  },
  Summary: {
    type: String,
    trim: true,
  },

  active: Boolean,
  deleted: Boolean,
  createdDate: Date,
  updatedDate: Date,
  __v: Number,
});
export default mongoose.model('Tour', tourSchema);

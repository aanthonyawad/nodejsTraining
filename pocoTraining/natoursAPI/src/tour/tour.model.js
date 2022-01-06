//Imports
import mongoose from 'mongoose';

const { Schema } = mongoose;

const tourSchema = new Schema({
  name: String,
  price: Number,
  rating: Number,
  active: Boolean,
  deleted: Boolean,
  createdDate: Date,
  updatedDate: Date,
  __v: Number,
});
export default mongoose.model('Tour', tourSchema);

//Imports
import mongoose from 'mongoose';

const { Schema } = mongoose;

const tourSchema = new Schema({
  name: {
    type: String,
    required: true,
  }, // String is shorthand for {type: String}
  price: Number,
});
export default mongoose.model('Tour', tourSchema);

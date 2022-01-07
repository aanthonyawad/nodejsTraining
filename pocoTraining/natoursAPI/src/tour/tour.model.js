//Imports
import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
      trim: true,
    },
    slug: String,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT Middlewar: runs before .save() and .insert but not .insertMany()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});
// tourSchema.post('save', (doc, next) => {
//   // is my object after being saved to the DB
//   next();
// });

export default mongoose.model('Tour', tourSchema);

//Imports
import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: {
      firstName: {
        type: String,
        required: [true, 'A User must have a firstName'],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, 'A User must have a lastName'],
        trim: true,
      },
    },
    required: [true, 'A User must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A User must have an email'],
    trim: true,
  },
  photo: {
    type: String,
    required: [true, 'A User must have an email'],
    trim: true,
  },
  secret: {
    type: {
      password: {
        type: String,
        required: [true, 'A User must have a password'],
        trim: true,
      },
      passwordConfirm: {
        type: String,
        required: [true, 'A User must have a password confirm'],
        trim: true,
      },
    },
    required: [true, 'A User must have an email'],
    trim: true,
  },

  active: Boolean,
  deleted: Boolean,
  createdDate: Date,
  updatedDate: Date,
});

export default mongoose.model('User', userSchema);

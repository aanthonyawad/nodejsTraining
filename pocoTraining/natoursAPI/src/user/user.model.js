//Imports
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    unique: true,
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
  passwordChangedAt: Date,
  active: Boolean,
  deleted: Boolean,
  createdDate: Date,
  updatedDate: Date,
});

userSchema.pre('save', async function (next) {
  this.secret.password = await bcrypt.hash(this.secret.password, 12);
  this.secret.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime(), 10);
    return JWTTimestamp < changedTimestamp; // 200 < 100
  }
  return false;
};

userSchema.methods.verifyPassword = async function (password) {
  if (this.secret.password) {
    const verifiedPassword = await bcrypt.compare(
      password,
      this.secret.password
    );
    return verifiedPassword;
  }
  return false;
};

export default mongoose.model('User', userSchema);

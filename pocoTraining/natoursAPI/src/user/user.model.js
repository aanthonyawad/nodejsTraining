//Imports
import crypto from 'crypto';
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

  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,
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
  console.log(password);
  console.log(this.secret.password);
  if (this.secret.password) {
    const verifiedPassword = await bcrypt.compare(
      password,
      this.secret.password
    );
    console.log(verifiedPassword);
    return verifiedPassword;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return {
    resetToken: resetToken,
    passwordResetExpires: this.passwordResetExpires,
  };
};

export default mongoose.model('User', userSchema);

import fs from 'fs';
import mongoose from 'mongoose';
import Tour from '../src/tour/tour.model.js';
import User from '../src/user/user.model.js';

//DIRNMAE ALT
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

mongoose.connect(
  'mongodb://localhost:27017/natours',
  {
    useNewUrlParser: true,
  },
  (error) => {
    if (error) console.log(error);
  }
);
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

//add Data
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users);
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

//delete Data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Tour.collection.drop();
    await User.deleteMany();
    await User.collection.drop();
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

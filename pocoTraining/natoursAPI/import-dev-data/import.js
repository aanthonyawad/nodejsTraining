import fs from 'fs';
import mongoose from 'mongoose';
import Tour from '../src/tour/tour.model.js';

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
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//add Data
const importData = async () => {
  try {
    await Tour.create(tours);
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

//delete Data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Tour.collection.drop();
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

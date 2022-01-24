/*JEST*/
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

let tourId;
function createMock() {
  return {
    name: 'New Test Tour',
    duration: 1,
    maxGroupSize: 1,
    difficulty: 'easy',
    price: 200,
    summary: 'Test tour',
    imageCover: 'tour-3-cover.jpg',
    startLocation: {
      description: 'Miami, USA',
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: '301 Biscayne Blvd, Miami, FL 33132, USA',
    },
  };
}

describe('TDD Tour Model', () => {
  beforeAll(async () => {
    mongoose
      .connect('mongodb://localhost:27017/natours', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => console.log('DB connection successful!'));
  });

  afterAll(async () => {
    await Tour.deleteOne({ name: 'New Test Tour' });
  });

  it('should insert a doc into collection', async () => {
    const mockTour = createMock();
    const insertedTour = await Tour.create(mockTour);
    tourId = insertedTour._id;
    expect(insertedTour.name).toEqual('New Test Tour');
  });

  /*negative cases*/
  it('should not insert a tour into collection with same name', async () => {
    const mockTour = createMock();
    await expect(Tour.create(mockTour)).rejects.toThrow(
      'E11000 duplicate key error'
    );
  });
  it('should not create a tour if rating avg if less than 1', async () => {
    const mockTour = createMock();
    mockTour.name += 'different';
    mockTour.ratingsAverage = 0;
    await expect(Tour.create(mockTour)).rejects.toThrow(
      'Rating must be above 1.0'
    );
  });
  it('should not create a tour if rating avg if above 5', async () => {
    const mockTour = createMock();
    mockTour.name += 'different';
    mockTour.ratingsAverage = 6;
    await expect(Tour.create(mockTour)).rejects.toThrow(
      'Rating must be below 5.0'
    );
  });

  it('should not create a tour without rating avg', async () => {
    const mockTour = createMock();
    mockTour.name += 'different';
    mockTour.ratingsAverage = null;
    await expect(Tour.create(mockTour)).rejects.toThrow(
      'Tour validation failed'
    );
  });

  it('should not create a tour without summary', async () => {
    const mockTour = createMock();
    mockTour.name += 'different';
    mockTour.summary = null;
    await expect(Tour.create(mockTour)).rejects.toThrow(
      'A controllers must have a description'
    );
  });

  it('should not create a tour without cover image', async () => {
    const mockTour = createMock();
    mockTour.name += 'different';
    mockTour.imageCover = null;
    await expect(Tour.create(mockTour)).rejects.toThrow(
      'A controllers must have a cover image'
    );
  });
});

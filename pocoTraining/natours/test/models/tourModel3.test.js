const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Tour = require('../../models/tourModel');
require('../../models/userModel');

let mongoServer; // remove this option if you use mongoose 5 and above

let tourId;
function createMock() {
  return {
    name: 'The Sea Explorer',
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

describe('DB connect', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('TOUR TDD', () => {
    beforeAll(async () => {
      const mockTour = createMock();
      const insertedTour = await Tour.create(mockTour);
      expect(insertedTour._id).toBeDefined();
      expect(insertedTour.name).toBe(mockTour.name);
      tourId = insertedTour._id;
    });
    it('should find the inserted tour', async () => {
      const tour = await Tour.findById(tourId);
      expect(tour._id).toBeDefined();
      expect(tour.name).toBe('The Sea Explorer');
    });

    it('should update the inserted tour', async () => {
      const tour = await Tour.findByIdAndUpdate(
        tourId,
        {
          duration: 3,
          maxGroupSize: 10,
          difficulty: 'medium',
        },
        {
          new: true,
          runValidators: true,
        }
      );
      expect(tour._id).toBeDefined();
      expect(tour.duration).toBe(3);
      expect(tour.maxGroupSize).toBe(10);
      expect(tour.difficulty).toBe('medium');
    });

    it('should delete the inserted tour', async () => {
      const tour = await Tour.findByIdAndDelete(tourId);
      expect(tour._id).toBeDefined();
    });
  });
});

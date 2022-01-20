const request = require('request');

describe('Tour Controller', function () {
  let server;
  beforeAll(() => {
    server = require('../server');
  });
  afterAll(() => {
    server.close();
  });

  describe('GET /api/v1/tours', function () {
    const data = {};
    beforeAll(function (done) {
      request.get('http://localhost:3000/api/v1/tours/', (err, res, body) => {
        const result = JSON.parse(body);
        data.status = result.status;
        data.statusCode = res.statusCode;
        done();
      });
    });

    it('Status 200', () => {
      expect(data.statusCode).toBe(200);
    });
    it('Body status', () => {
      expect(data.status).toBe('success');
    });
  });

  describe('POST /api/v1/tours', function () {
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZTgyMmVjZTJmY2IyNzM5YzVhZTE0NCIsImlhdCI6MTY0MjYwMzI1MCwiZXhwIjoxNjQzMzgwODUwfQ.Pgx1yV6oRAdaD6456cGU9q0zEKZR9S2EbqGmAv88mlA';
    const data = {};
    const formData = {
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
    beforeAll(function (done) {
      request.post(
        {
          url: 'http://localhost:3000/api/v1/tours',
          headers: {
            Authorization: `Bearer ${jwt}`,
            'content-type': 'application/json',
          },
          form: formData,
        },
        (err, res, body) => {
          const result = JSON.parse(body);
          data.status = result.status;
          data.statusCode = res.statusCode;
          done();
        }
      );
    });

    it('Status 201', () => {
      expect(data.statusCode).toBe(201);
    });
    it('Body status', () => {
      expect(data.status).toBe('success');
    });
  });
});

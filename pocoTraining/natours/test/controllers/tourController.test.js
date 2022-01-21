// //IMPORTS
// const express = require('express'); // (npm install --save express)
// const request = require('supertest');
// const mongoose = require('mongoose');
// const { expect } = require('chai');
// //CONTROLLER
// const tourRouter = require('../../routes/tourRoutes');
//
// function createApp() {
//   const app = express();
//
//   app.use('/api/v1/tours', tourRouter);
//
//   return app;
// }
// // Called once before any of the tests in this block begin.
// let app;
// before(function (done) {
//   //setting env variables
//   process.env.JWT_SECRET = 'natours_secret_jwt';
//   app = createApp();
//   app.listen(function (err) {
//     if (err) {
//       return done(err);
//     }
//     mongoose
//       .connect('mongodb://localhost:27017/natours', {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//       })
//       .then(() => console.log('DB connection successful!'));
//
//     done();
//   });
// });
// describe('Our server', function () {
//   it('GET /api/v1/tours', function (done) {
//     request(app)
//       .get('/api/v1/tours/')
//       .set('Content-Type', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, function (err, res) {
//         if (err) {
//           return done(err);
//         }
//
//         const { data, status } = res.body;
//         expect(data.data).to.be.instanceof(Array);
//         expect(status).to.equal('success');
//         // Done
//         done();
//       });
//   });
//
//   it('GET /api/v1/tours/:id', function (done) {
//     const id = '5c88fa8cf4afda39709c2951';
//     request(app)
//       .get(`/api/v1/tours/${id}`)
//       .set('Content-Type', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, function (err, res) {
//         if (err) {
//           return done(err);
//         }
//         const { data, status } = res.body;
//         expect(data.data).to.be.instanceof(Object);
//         expect(status).to.equal('success');
//         // Done
//         done();
//       });
//   });
//
//   it('GET /api/v1/tours/top-5-cheap', function (done) {
//     request(app)
//       .get(`/api/v1/tours/top-5-cheap`)
//       .set('Content-Type', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, function (err, res) {
//         if (err) {
//           return done(err);
//         }
//         const { data, status } = res.body;
//         expect(data.data).to.be.instanceof(Array);
//         expect(status).to.equal('success');
//         // Done
//         done();
//       });
//   });
//
//   it('GET /api/v1/tours/controllers-stats', function (done) {
//     request(app)
//       .get(`/api/v1/tours/controllers-stats`)
//       .set('Content-Type', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, function (err, res) {
//         if (err) {
//           return done(err);
//         }
//         const { data, status } = res.body;
//         expect(data).to.be.instanceof(Object);
//         expect(status).to.equal('success');
//         // Done
//         done();
//       });
//   });
//
//   it('GET /tours-within/:distance/center/:latlng/unit/:unit', function (done) {
//     request(app)
//       .get(`/api/v1/tours/tours-within/4000/center/-40,45/unit/mi`)
//       .set('Content-Type', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, function (err, res) {
//         if (err) {
//           return done(err);
//         }
//         const { data, status } = res.body;
//         expect(data.data).to.be.instanceof(Array);
//         expect(status).to.equal('success');
//         // Done
//         done();
//       });
//   });
//
//   it('GET /distances/:latlng/unit/:unit', function (done) {
//     request(app)
//       .get(`/api/v1/tours/distances/-40,45/unit/mi`)
//       .set('Content-Type', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200, function (err, res) {
//         if (err) {
//           return done(err);
//         }
//         const { data, status } = res.body;
//         expect(data.data).to.be.instanceof(Array);
//         expect(status).to.equal('success');
//         // Done
//         done();
//       });
//   });
//
//   // it('POST /api/v1/tours/', function (done) {
//   //   request(app)
//   //     .post(`/api/v1/tours/`)
//   //     .send({
//   //       name: 'New Test Tour',
//   //       duration: 1,
//   //       maxGroupSize: 1,
//   //       difficulty: 'easy',
//   //       price: 200,
//   //       summary: 'Test tour',
//   //       imageCover: 'tour-3-cover.jpg',
//   //       startLocation: {
//   //         description: 'Miami, USA',
//   //         type: 'Point',
//   //         coordinates: [-80.185942, 25.774772],
//   //         address: '301 Biscayne Blvd, Miami, FL 33132, USA',
//   //       },
//   //     })
//   //     .set('Content-Type', 'application/json')
//   //     .set(
//   //       //admin Bearer token
//   //       'Authorization',
//   //       'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZTgyMmVjZTJmY2IyNzM5YzVhZTE0NCIsImlhdCI6MTY0MjYwMzI1MCwiZXhwIjoxNjQzMzgwODUwfQ.Pgx1yV6oRAdaD6456cGU9q0zEKZR9S2EbqGmAv88mlA'
//   //     )
//   //     .set('Accept', 'application/json')
//   //     .expect('Content-Type', /json/)
//   //     .expect(201, function (err, res) {
//   //       if (err) {
//   //         return done(err);
//   //       }
//   //       const { data, status } = res.body;
//   //       expect(data.data).to.be.instanceof(Object);
//   //       expect(status).to.equal('success');
//   //       // Done
//   //       done();
//   //     });
//   // });
// });

/*JEST*/
const request = require('supertest');
const server = require('../../server');

describe('Should create app ', () => {
  let jwt;
  beforeAll(() => {
    process.env.JWT_SECRET = 'natours_secret_jwt';
    process.env.DATABASE = 'mongodb://localhost:27017/natours';
  });

  describe('should login', () => {
    it('validate login', async () => {
      const response = await request(server)
        .post(`/api/v1/users/login/`)
        .send({ email: 'anthony123@mailsac.com', password: 'pass1234' });
      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      jwt = response.token;
    });
  });

  describe('Tour Functions', () => {
    it('GET /api/v1/tours', async () => {
      const response = await request(server).get(`/api/v1/tours/`);
      expect(response.body.status).toBe('success');
      expect(response.body.data.data[0].id).toBe('5c88fa8cf4afda39709c2955');
    });
  });
});

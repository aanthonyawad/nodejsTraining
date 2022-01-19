//IMPORTS
const express = require('express'); // (npm install --save express)
const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');
//CONTROLLER
const tourRouter = require('../../routes/tourRoutes');

function createApp() {
  const app = express();

  app.use('/api/v1/tours', tourRouter);

  return app;
}
// Called once before any of the tests in this block begin.
let app;
before(function (done) {
  app = createApp();
  app.listen(function (err) {
    if (err) {
      return done(err);
    }
    mongoose
      .connect('mongodb://localhost:27017/natours', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => console.log('DB connection successful!'));

    done();
  });
});
describe('Our server', function () {
  it('Call GET TOURs API for integration testing', function (done) {
    request(app)
      .get('/api/v1/tours/')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }

        const { data, status } = res.body;
        expect(data.data).to.be.instanceof(Array);
        expect(status).to.equal('success');
        // Done
        done();
      });
  });

  it('Call Single TOUR API for integration testing', function (done) {
    const id = '5c88fa8cf4afda39709c2951';
    request(app)
      .get(`/api/v1/tours/${id}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err, res) {
        if (err) {
          return done(err);
        }
        const { data, status } = res.body;
        expect(data.data).to.be.instanceof(Object);
        expect(status).to.equal('success');
        // Done
        done();
      });
  });
});

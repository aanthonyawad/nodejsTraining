const express = require('express'); // (npm install --save express)
const request = require('supertest');
const mongoose = require('mongoose');
const { expect } = require('chai');
const assert = require('assert');

//CONTROLLERS
const Tour = require('../../models/tourModel');

before(function (done) {
  mongoose
    .connect('mongodb://localhost:27017/natours', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log('DB connection successful!'));

  done();
});
const tourName = 'testTour1234';

const feedTour = () => {
  return new Tour({
    duration: 5,
    maxGroupSize: 5,
    difficulty: 'easy',
    ratingsAverage: 1,
    price: 11243,
    summary: 'description test',
    description: 'description 2',
    image1: 'image-1.png',
    imageCover: 'image-1.png',
    startLocation: {
      description: 'Miami, USA',
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      address: '301 Biscayne Blvd, Miami, FL 33132, USA',
    },
  });
};

describe('Our Tour Model Functions', () => {
  beforeEach('Should create a sample tour', async function () {
    const tour = feedTour();
    tour.name = tourName;
    await tour.save();
  });
  afterEach('TearDown Tour', async function () {
    const tour = await Tour.findOne({ name: tourName });
    await tour.remove();
  });
  it('find the sample tour', async function () {
    const tour = await Tour.findOne({ name: tourName });
    expect(tour.name).to.equal(tourName);
  });
  it('cannot create a tour with the same name', async function () {
    const tour = feedTour();
    tour.name = tourName;
    expect(async () => {
      await tour.save();
    }).to.throw;
  });
  //.... more test validators
});

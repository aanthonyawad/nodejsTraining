/*JEST*/
const request = require('supertest');
const server = require('../../server');

let jwt;
let tourId;
describe('Should create app ', () => {
  beforeAll(() => {
    process.env.PORT = 4000;
    process.env.JWT_SECRET = 'natours_secret_jwt';
    process.env.DATABASE = 'mongodb://localhost:27017/natours';
  });

  describe('should login', () => {
    beforeAll(async function () {
      // get the token
      const response = await request(server)
        .post(`/api/v1/users/login/`)
        .send({ email: 'anthony123@mailsac.com', password: 'pass1234' });
      expect(response.body.status).toBe('success');
      expect(response.body.token).toBeDefined();
      jwt = response.body.token;
    });

    describe('Tour Functions', () => {
      it('GET /api/v1/tours', async function () {
        const response = await request(server).get(`/api/v1/tours/`);
        expect(response.body.status).toBe('success');
      });
      it('GET /api/v1/tours/top-5-cheap', async function () {
        const response = await request(server).get(`/api/v1/tours/top-5-cheap`);
        expect(response.body.status).toBe('success');
      });
      it('GET /api/v1/tours/controllers-stats', async function () {
        const response = await request(server).get(
          `/api/v1/tours/controllers-stats`
        );
        expect(response.body.status).toBe('success');
      });
      it('GET /api/v1/tours/distances/34.111745,-118.113491/unit/mi', async function () {
        const response = await request(server).get(
          `/api/v1/tours/distances/34.111745,-118.113491/unit/mi`
        );
        expect(response.body.status).toBe('success');
      });
      it('GET /api/v1/tours/monthly-plan/:year', async function () {
        const response = await request(server)
          .get(`/api/v1/tours/monthly-plan/2021`)
          .set(
            //admin Bearer token
            'Authorization',
            `Bearer ${jwt}`
          );
        expect(response.body.status).toBe('success');
      });

      describe('insert a tour', () => {
        it('POST /api/v1/tours', async function () {
          const response = await request(server)
            .post(`/api/v1/tours/`)
            .set(
              //admin Bearer token
              'Authorization',
              `Bearer ${jwt}`
            )
            .send({
              name: 'New Test Tour Integration',
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
            });
          expect(response.body.status).toBe('success');
          tourId = response.body.data.data.id;
        });

        describe('find the newly inserted tour by Id', () => {
          it('GET /api/v1/tours/id', async function () {
            const response = await request(server).get(
              `/api/v1/tours/${tourId}`
            );
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('success');
          });
        });
      });

      afterAll(async function () {
        //delete the newly created testing tour
        const response = await request(server)
          .delete(`/api/v1/tours/${tourId}`)
          .set(
            //admin Bearer token
            'Authorization',
            `Bearer ${jwt}`
          );
        expect(response.statusCode).toBe(204);
      });
    });
  });
});

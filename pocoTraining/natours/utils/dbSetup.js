const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
const dbSetup = async () => {
  if (process.env.DATABASE_ENV === 'test') {
    mongoServer = await MongoMemoryServer.create();
    mongoose
      .connect(mongoServer.getUri())
      .then(() => console.log('MEMORY DB connection successful!'));
  } else {
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );

    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      })
      .then(() => console.log('DB connection successful!'));
  }
};

const teardownMemoryDb = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

module.exports = {
  teardownMemoryDb,
  dbSetup,
};

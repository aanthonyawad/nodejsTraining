//IMPORTS
const dotenv = require('dotenv');
const express = require('express');

// VALIDATE ENV
const { validateEnv } = require('./utils/validateEnv');
//MIDDLEWARE
const Middleware = require('./middleware');

dotenv.config({ path: '.env' });

validateEnv();

const app = express();
new Middleware(app);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on Port : ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
});

process.on('uncaughtException ', (err) => {
  console.log(err.name, err.message);
});

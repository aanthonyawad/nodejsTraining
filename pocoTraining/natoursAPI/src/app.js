//IMPORTS
import dotenv from 'dotenv';
import express from 'express';

// VALIDATE ENV
import validateEnv from './utils/validateEnv.js';
//MIDDLEWARE
import Middleware from './middleware.js';

dotenv.config({ path: '.env' });

validateEnv();

const app = express();
new Middleware(app);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on Port : ${port}`);
});

const validateEnv = () => {
  if (!process.env.PREFIX) {
    throw new Error('Prefix Invalid!');
  }
  if (!process.env.PORT) {
    throw new Error('PORT Invalid!');
  }
  if (!process.env.APINAME) {
    throw new Error('APINAME Invalid!');
  }
  if (!process.env.WEBAPPNAME) {
    throw new Error('WEBAPPNAME Invalid!');
  }
  if (
    !process.env.PASSWORD &&
    !process.env.USERNAME &&
    !process.env.DATABASEURL
  ) {
    throw new Error('DB CREDENTIALS Invalid!');
  }
};
export default validateEnv;

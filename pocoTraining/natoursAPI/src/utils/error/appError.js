// LANG FILES
import appLangError from './appLangError.js';

class AppError extends Error {
  constructor(message, statusCode, lang) {
    super(message);
    this.lang = lang;
    this.statusCode = statusCode;
    this.appLangError = appLangError;
    this.data = this.getData(message, lang);
  }

  getData(message, lang) {
    console.log(message);
    console.log(lang);
    return this.appLangError[message][lang];
  }
}

export default AppError;

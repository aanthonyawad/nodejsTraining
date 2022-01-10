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
    if (message === 'invalid signature') message = 'invalidLogin';
    if (this.appLangError[message][lang]) {
      return this.appLangError[message][lang];
    }
    return this.appLangError.fail.en;
  }
}

export default AppError;

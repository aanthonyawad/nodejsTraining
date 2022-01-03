import express from 'express';
class BaseController{

    lang(req)  {
        return req.headers['accept-language'] == 'ar' ? 'ar' : 'en';
    }
}
export default BaseController
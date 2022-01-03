// IMPORTS
import express from 'express';
import BaseController from '../base/base.controller.mjs';

// SERVICE
import DashboardService from "./dashboard.service.mjs";

// UTILS
import * as routes from '../utils/routes/index.mjs';
import ErrorLanguage from "../utils/error/ErrorLanguage.mjs";
import Publisher from "../messageQueue/publisher.mjs";
import Subscriber from "../messageQueue/subscriber.mjs";

class DashboardController extends BaseController{

    constructor(app) {
        super(app)
        this.route =`${routes.baseEndpoint}/${routes.dashboard}`;
        this.cmsRoute =`${routes.baseEndpoint}/cms/${routes.dashboard}`;
        this.service = new DashboardService();
        this.intializeRoutes(app);
    }


    getAllDashboardData = async(req,res,send) =>{
        try{
            return await res.send(this.service.getAllDashboardData());
        }catch(e){
            return res.status(400).send(new ErrorLanguage(e,this.lang(req)).returnLangError());
        }

    }

    intializeRoutes = async (app) =>{
       await app.get(`${this.route}/`,this.getAllDashboardData)
    }
}
export default DashboardController
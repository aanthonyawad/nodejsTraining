// IMPORTS
import express from 'express';
import DashboardService from "./dashboard.service.mjs";
import BaseController from '../base/BaseController.mjs';
// UTILS
import * as routes from '../utils/routes/index.mjs';
// SERVICE

class DashboardController extends BaseController{
    route =`${routes.baseEndpoint}/${routes.dashboard}`;
    cmsRoute =`${routes.baseEndpoint}/cms/${routes.dashboard}`;
    service = new DashboardService();
    constructor(app) {
        super(app)
        this.intializeRoutes(app);
    }


    getAllDashboardData = (req,res,send) =>{
        try{
            this.lang(req);
            res.send(this.service.getAllDashboardData());
        }catch(e){
            res.status(400).send(e.message);
        }
    }

    intializeRoutes = (app) =>{
        app.get(`${this.route}/`,this.getAllDashboardData)
    }
}
export default DashboardController
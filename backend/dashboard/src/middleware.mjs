import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
class Middleware{

    constructor(app) {
        this.initMiddleware(app);
        this.initDb(app);
    }

    initMiddleware(app){
        app.use(express.json());
        app.use(cors());
        app.use(cookieParser());
    }

    initDb(){
        mongoose.connect('mongodb://localhost:27017/dashboard',
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            },
            ()=> console.log('Successfully connected to MongoDB')
        );
    }


}
export default Middleware
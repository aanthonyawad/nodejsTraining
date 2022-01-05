// IMPORTS
import express from 'express';
import UserService from './user.service.js';

class UserController {
  constructor(app) {
    this.route = `/api/v1/user`;
    this.cmsRoute = `/api/v1/cms/user`;
    this.service = new UserService();
    this.initializesRoutes(app);
  }

  getAllUsers = async (req, res, next) => {
    res.send('hi');
  };

  getUser = async (req, res, next) => {
    res.send('hi');
  };

  deleteUser = async (req, res, next) => {
    res.send('hi');
  };

  patchUser = async (req, res, next) => {
    res.send('hi');
  };

  postUser = async (req, res, next) => {
    res.send('hi');
  };

  initializesRoutes = async (app) => {
    app.get(`${this.route}/`, this.getAllUsers);
    app.post(`${this.route}/`, this.postUser);
    app.get(`${this.route}/:id`, this.getUser);
    app.patch(`${this.route}/:id`, this.patchUser);
    app.delete(`${this.route}/:id`, this.deleteUser);
  };
}
export default UserController;

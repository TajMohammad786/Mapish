import express from 'express';
import { googleAuth, guestLogin, getVisitorCount } from '../controllers/auth.controller.js';

const Router = express.Router();

Router.get("/google", googleAuth);
Router.post("/guest", guestLogin);
Router.get("/visitors/count", getVisitorCount);


export default Router;
import express from "express";
import { processVideos, populateLocationDB, saveChannelID,getYTChannelNamesFromDB } from "../controllers/storevideoInDB.controller.js";
import { getVideos } from "../controllers/video.controller.js";
const Router = express.Router();

Router.get("/videosProcess", processVideos);
Router.post("/addLocation", populateLocationDB);
Router.post("/addChannel", saveChannelID);
Router.post("/getYTChannel", getYTChannelNamesFromDB);
Router.post("/videos", getVideos);

export default Router;

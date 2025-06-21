import express from "express";
import { populateLocationDB, saveChannelID,getYTChannelNamesFromDB,getCountryNameFromDB } from "../controllers/getVideoFromDB.controller.js";
import { getVideos,processVideos , channelCountry,updatePlaybackId} from "../controllers/video.controller.js";
const Router = express.Router();

Router.get("/videosProcess", processVideos);
Router.post("/videos", getVideos);
Router.get("/channelCountry", channelCountry);

Router.post("/addLocation", populateLocationDB);
Router.post("/addChannel", saveChannelID);
Router.post("/getYTChannel", getYTChannelNamesFromDB);
Router.post("/getCountryNameFromDB", getCountryNameFromDB);

Router.post("/updatePlaybackId", updatePlaybackId);

export default Router;

import express from "express";
import { populateLocationDB, saveChannelID,getYTChannelNamesFromDB,getCountryNameFromDB, getAllDistinctCountries } from "../controllers/getVideoFromDB.controller.js";
import { getVideos,processVideos , channelCountry,updatePlaybackId} from "../controllers/video.controller.js";
import {refreshVideos,getRefreshStatus} from "../controllers/refreshSetting.controller.js";
const Router = express.Router();

Router.get("/videosProcess", processVideos);
Router.post("/videos", getVideos);
Router.get("/channelCountry", channelCountry);
Router.post("/refresh-videos", refreshVideos);
Router.get("/refresh-status", getRefreshStatus);

Router.post("/addLocation", populateLocationDB);
Router.post("/addChannel", saveChannelID);
Router.post("/getYTChannel", getYTChannelNamesFromDB);
// Router.post("/getCountryNameFromDB", getCountryNameFromDB);
Router.post("/getCountryNameFromDB", getAllDistinctCountries);

Router.post("/updatePlaybackId", updatePlaybackId);

export default Router;

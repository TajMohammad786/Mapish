import axios from "axios";
import dotenv from "dotenv";
import Video from "../models/videoSchema.model.js";
import { getYTChannelNamesFromDB, getUploadPlaylistIdFromDB } from "./getVideoFromDB.controller.js";
import ChannelCountry from "../models/channelCountry.model.js";
dotenv.config();

const YT_API_KEY = process.env.YT_API_KEY;

//step 1: get channel id by name
export async function getChannelIdByName(name) {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: name,
        type: "channel",
        maxResults: 1,
        key: YT_API_KEY,
      },
    });
  
    const channel = res.data.items[0];
    return channel?.id?.channelId;
}

// step 2: get playlist id by channel id
export async function getUploadPlaylistId(channelId) {
    const res = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
      params: {
        part: "contentDetails",
        id: channelId,
        key: YT_API_KEY,
      },
    });
  
    return res.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
  }

  //step 3: get videos by playlist id
  export async function getAllVideosFromPlaylist(playlistId) {
    let videos = [];
    let nextPageToken = "";
  
    do {
      const res = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
        params: {
          part: "snippet",
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: YT_API_KEY,
        },
      });
  
      videos.push(...res.data.items);
      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken);
  
    return videos;
  }

  
  export async function getLast24HrVideos(playlistId) {
    const playlistData = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
      params: {
        part: "snippet",
        playlistId,
        maxResults: 10,
        key: YT_API_KEY
      },
    });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentVideos = playlistData.data.items.filter(item =>
      new Date(item.snippet.publishedAt) > oneDayAgo
    );

    recentVideos.forEach(item => {
      const title = item.snippet.title;
      const videoId = item.snippet.resourceId.videoId;
      console.log(`${title} - https://www.youtube.com/watch?v=${videoId}`);
    });
      
    return recentVideos;
  }

  export async function getVideos(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const {startDate, endDate} = req.query;
    const { channelTitle, country } = req.body;
    const query = {};
    if (channelTitle) {
      query.channelTitle = channelTitle;
    }
    if (country) {
      query.country = country;
    }
    if (startDate && endDate) {
      query.publishedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    try {
      const videos = await Video.find(query)
        .skip(skip)
        .limit(limit + 1);
  
      const hasMore = videos.length > limit;
      const videosToSend = hasMore ? videos.slice(0, -1) : videos;
  
      res.json({
        videos: videosToSend,
        hasMore
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching videos", error });
    }
  };


  // To get all videos from a specific channel's upload playlist, from YT endpoint
  export async function processVideos(req, res) {
    try {
      const YT_CHANNEL_NAMES = await getYTChannelNamesFromDB();
      console.log('YT_CHANNEL_NAMES', YT_CHANNEL_NAMES);
      if (!YT_CHANNEL_NAMES || YT_CHANNEL_NAMES.length === 0) {
        console.error("No channel names found in the database.");
        return res.status(400).json({ message: "No channel names found in the database." });
      }
      
      let ChannelVideoData = [];
      const fetchLatestVideos =  req.query.fetch24HrVideos;
      console.log('processVideos called' , fetchLatestVideos);
      
      for(let i = 0; i<YT_CHANNEL_NAMES.length; i++){
          console.log('YT_CHANNEL_NAMES[i]', YT_CHANNEL_NAMES[i]);
          const playlistID = await getUploadPlaylistIdFromDB(YT_CHANNEL_NAMES[i]);
          const videos = fetchLatestVideos ? await getLast24HrVideos(playlistID) :await getAllVideosFromPlaylist(playlistID) ;
          let channelData = {
              channelName: YT_CHANNEL_NAMES[i],
              videos: videos
          }
          ChannelVideoData.push(channelData);
      }
     
      // res.status(200).json({
      //     message: "success",
      //     ChannelVideoData,
      // });
      return ChannelVideoData;
    } catch (error) {
      console.error("Error processing videos:", error);
    }
  }


  export async function updatePlaybackId(req, res) {
    const channelVideoData = [];
    const playlistID = await getUploadPlaylistIdFromDB('DalePhilip');
    console.log('playlistID', playlistID);
    const videos = await getAllVideosFromPlaylist(playlistID) ;
    let channelData = {
        channelName: 'DalePhilip',
        videos: videos
    }
    channelVideoData.push(channelData);
    


    if (!channelVideoData || channelVideoData.length === 0) {
      return res.status(400).json({ message: "No channel video data found." });
    }
    else{
      console.log('channelVideoData', channelVideoData.length);
    }

    for (const channel of channelVideoData) {
      let count = 0;
      for (const video of channel.videos) {
        const snippet = video?.snippet;
        if (!snippet || !snippet.resourceId || !snippet.resourceId.videoId) {
          console.warn(`Skipping video with missing resourceId: ${JSON.stringify(snippet)}`);
          continue;
        }

        const videoId = video.id;
        console.log(`Processing video ID: ${videoId}`);
        const existingVideo = await Video.findOne({ videoId: videoId });

        if (existingVideo) {
          // If the video already exists, update the playbackId
          console.log('processing count ', count);
          count++;
          existingVideo.playbackId = snippet.resourceId.videoId;
          await existingVideo.save();
        }
      }
    }
    return res.status(200).json({
      message: "Playback IDs updated successfully",
      channelVideoData
    });
  }
// This function retrieves unique channel titles and their associated countries from the Video collection,
// and saves them to the ChannelCountry collection. If a channel already exists, it updates the countries.
// {
//   channelTitle: "channelTitle",
//   countries: ["country1", "country2"]
// }
export async function channelCountry(req, res){
  const channelCountries = await Video.aggregate([
    {
      $group: {
        _id: "$channelTitle",
        countries: { $addToSet: "$country" } // get unique countries
      }
    }
  ]);
  // Filter out channels with no countries
  const filteredChannelCountries = channelCountries.filter(channel => channel.countries.length > 0);
  // Map to the desired format
  const formattedChannelCountries = filteredChannelCountries.map(channel => ({
    channelTitle: channel._id,
    countries: channel.countries
  }));
  // check if country already exist for a channeltitle
  for (const channel of formattedChannelCountries) {
    const existingChannel = await ChannelCountry.findOne({ channelTitle: channel.channelTitle });
    if (existingChannel) {
      // If it exists, update the countries
      existingChannel.countries = Array.from(new Set([...existingChannel.countries, ...channel.countries]));
      await existingChannel.save();
    } else {
      // If it doesn't exist, create a new entry
      const newChannelCountry = new ChannelCountry({
        channelTitle: channel.channelTitle,
        countries: channel.countries
      });
      await newChannelCountry.save();
    }
  }

  
  return res.status(200).json({
    message: "Channel countries populated successfully",
    channelCountries: formattedChannelCountries
  });

  
}
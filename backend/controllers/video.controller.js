import axios from "axios";
import dotenv from "dotenv";
import Video from "../models/videoSchema.model.js";
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
  
    try {
      const videos = await Video.find()
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


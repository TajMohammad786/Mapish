import { getChannelIdByName, getUploadPlaylistId, getAllVideosFromPlaylist, getLast24HrVideos } from "./video.controller.js";
import { extractLocationFromMetadata,extractLocationFromMetadataCohere } from "./ai_extractlocation.controller.js";
import Video from "../models/videoSchema.model.js"; 
import Channel from "../models/channel.model.js";

export async function saveChannelID(req, res) {
  const { channelName } = req.body;

  if (!channelName) {
    return res.status(400).json({ message: "Channel name is required." });
  }

  try {
    // Check if channel already exists
    const existing = await Channel.findOne({ channelName });
    if (existing) {
      return res.status(200).json({ message: "Channel already exists.", data: existing });
    }

    const channelId = await getChannelIdByName(channelName);
    const uploadPlaylistId = await getUploadPlaylistId(channelId);

    const newChannel = new Channel({
      channelId,
      channelName,
      uploadPlaylistId
    });

    await newChannel.save();

    return res.status(201).json({ message: "Channel saved successfully", data: newChannel });
  } catch (error) {
    console.error("Failed to save channel:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getUploadPlaylistIdFromDB(channelName) {
  if (!channelName) {
    throw new Error("channelId is required");
  }

  try {
    const channel = await Channel.findOne({ channelName });
    if (!channel) {
      throw new Error("Channel not found in database");
    }

    return channel.uploadPlaylistId;
  } catch (error) {
    console.error("Error fetching uploadPlaylistId from DB:", error.message);
    throw error;
  }
}

export async function getYTChannelNamesFromDB() {
  try {
    const channels = await Channel.find({});
    // console.log("Fetched channels from DB:", channels);
    return channels.map((c) => c.channelName);
  } catch (error) {
    console.error("Error fetching channel names from DB:", error.message);
    return [];
  }
}


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


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Processed 916/945 videos as on 17-05-2025
export async function populateLocationDB(req, res) {
  // const location = await extractLocationFromMetadataCohere("The Smooching Umbrella Couples of Galle, Sri Lanka 🇱🇰", "I was running around the walls at Galle Fort and in every gap there was a couple under an umbrella.\n\nThe funny thing is, it wasn't raining!\n\nI guess this is how they get some privacy, as they have nowhere else to go. In Sri Lanka it's super common for young adults to live with their parents until they get married.\n\nSo if you visit Sri Lanka and see umbrellas on a sunny day, you now have a good idea what's going on. 🤣👍\n\n#SriLanka #Galle #Travel #TravelAdvice #SoloTravel");
  // const location = await extractLocationFromMetadata("The Smooching Umbrella Couples of Galle, Sri Lanka 🇱🇰", "I was running around the walls at Galle Fort and in every gap there was a couple under an umbrella.\n\nThe funny thing is, it wasn't raining!\n\nI guess this is how they get some privacy, as they have nowhere else to go. In Sri Lanka it's super common for young adults to live with their parents until they get married.\n\nSo if you visit Sri Lanka and see umbrellas on a sunny day, you now have a good idea what's going on. 🤣👍\n\n#SriLanka #Galle #Travel #TravelAdvice #SoloTravel");
 

  // return res.status(200).json({
  //   message: "success",
  //   location,
  // });
  const channelVideoData = await processVideos(req, res);
  console.log("processVideos completed");

  if (!channelVideoData || channelVideoData.length === 0) {
    return res.status(400).json({ message: "No videos provided" });
  }

  try {
    const results = [];
   
    let totalVideos = 0;
    let processedVideos = 0;
    let skipCount = 0;

    // Count total videos
    channelVideoData.forEach(channel => {
      totalVideos += channel.videos.length;
    });

    console.log(`Starting to process ${totalVideos} videos. Estimated time: ${Math.ceil(totalVideos / 18)} minutes`);


    for (const channel of channelVideoData) {
      for (const video of channel.videos) {
        const snippet = video?.snippet;

        if (!snippet?.title || !snippet?.description) {
          console.warn(`Skipping video with missing title or description`);
          skipCount++;
          continue;
        }   
          
        // const locationInfo = await extractLocationFromMetadata(
        //   snippet.title,
        //   snippet.description
        // );
        let locationInfo = await extractLocationFromMetadataCohere(
          snippet.title,
          snippet.description
        );
        console.log(`Processed ${processedVideos}/${totalVideos} videos`);
        console.log("waiting for 6.5 seconds");
        await delay(6500);
        console.log("resume after 6.5 seconds");
        processedVideos++;
        if (!locationInfo?.country || !locationInfo?.location) {
          console.warn("Missing country or location, skipping video.");
          continue;
        }

        const videoData = {
          videoId: video.id,
          title: snippet.title,
          description: snippet.description,
          publishedAt: snippet.publishedAt,
          channelId: snippet.channelId,
          channelTitle: snippet.channelTitle,
          thumbnails: {
            default: snippet.thumbnails?.default?.url || "",
            medium: snippet.thumbnails?.medium?.url || "",
            high: snippet.thumbnails?.high?.url || "",
          },
          country: locationInfo?.country || null,
          location: locationInfo?.location || null,
          locality: locationInfo?.locality || null,
          coordinates: {
            type: "Point",
            coordinates: locationInfo?.latlong || [0, 0],
          },
          tags: snippet.tags || [],
          extractedFromAI: true,
          createdAt: new Date(),
        };

        const newVideo = new Video(videoData);
        try{
          await newVideo.save();
          results.push(videoData);
        }
        catch (error) {
          console.error("Skipping Error saving video to database:", error);
          skipCount++;
          //  return res.status(500).json({ message: "Error saving video to database" });
          continue;
        }
      }
    }

    console.log("Processed videos: completed", " skipped videos ->", skipCount);
    return res.status(200).json({
      message: "success",
      videos: results,
    });

  } catch (error) {
    console.error("Error processing videos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  channelName: { type: String, required: true },
  channelThumbnail: { type: String},
  uploadPlaylistId: { type: String, required: true },
}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;

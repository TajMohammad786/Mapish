// models/ChannelCountry.js
import mongoose from "mongoose";

const channelCountrySchema = new mongoose.Schema({
  channelTitle: { type: String, required: true, unique: true },
  countries: { type: [String], required: true }, // array of country names
});

const ChannelCountry = mongoose.model("ChannelCountry", channelCountrySchema);
export default ChannelCountry;

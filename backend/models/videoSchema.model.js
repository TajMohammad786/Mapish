import mongoose from 'mongoose';

// Define the schema for video data
const videoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      required: true,
      unique: true, // Ensure videoId is unique
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    channelId: {
      type: String,
      required: true,
    },
    channelTitle: {
      type: String,
      required: true,
    },
    thumbnails: {
      default: {
        type: String,
        required: true,
      },
      medium: {
        type: String,
        required: true,
      },
      high: {
        type: String,
        required: true,
      },
    },
    country: {
      type: String,
      required: true,
      default: null, // Country can be null
    },
    location: {
      type: String,
      required: true,
      default: null, // Location can be null
    },
    locality: {
      type: String,
      default: null, // Locality can be null
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'], // Use GeoJSON 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    tags: {
      type: [String], // Array of tags
      default: [],
    },
    extractedFromAI: {
      type: Boolean,
      default: false, // By default, it won't be extracted from AI
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation date
    },
  },
  { timestamps: true } // Auto add createdAt and updatedAt
);

// Create an index on coordinates for geo querying
videoSchema.index({ coordinates: '2dsphere' });

// Model based on the schema
const Video = mongoose.model('Video', videoSchema);

export default Video;

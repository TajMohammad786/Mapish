# 🌍 Mapish

**Mapish** is a web app that maps YouTube vlog videos to real-world locations on an interactive map. The goal is to make travel content easily explorable by **location** rather than just text-based search.

![image](https://github.com/user-attachments/assets/be581927-779c-4f1b-87f9-665dec489090)

---

## 🔧 Tech Stack

- **Frontend**: React.js + React-Leaflet
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with geospatial indexing)
- **AI Integration**: OpenAI (or custom AI logic) to extract locations from video titles and descriptions
- **Other Tools**: Leaflet.js, YouTube Data API, Vite

---

## 🚀 Features

- 📍 Map YouTube vlog videos based on geographic coordinates  
- 🧠 Location is derived from location info using AI from titles and descriptions  
- 🗺️ Explore vlog content visually using an interactive map  
- 🔍 Filter videos by place  
- 🎥 Watch YouTube videos directly within the app  

---

## 🧠 How It Works

1. Fetch videos from selected YouTube vlog/travel channels.
2. Extract location information using AI from video metadata.
3. Store videos in MongoDB with location as a `GeoJSON Point`.
4. Render the videos on a Leaflet map as markers.
5. Click markers to see video details and watch the embedded YouTube video.

---

## ⚙️ Getting Started

```bash
# Clone the repository
[git clone https://github.com/TajMohammad786/Mapish.git
cd backend

# Install dependencies
npm install

# Start the development server (Vite + Express setup)
npm run dev

cd frontend

npm install

npm run dev
```
---

# .env file
MONGO_URI=your_mongodb_connection_string
YOUTUBE_API_KEY=your_youtube_api_key
OPENAI_API_KEY=your_openai_key  # Optional, only if using AI location extraction

---

# Roadmap
- [ ] Add category filters (e.g., nature, food, city)
- [ ] Improve location accuracy with reverse geocoding
- [ ] Add search by region/country
- [ ] Deploy to Vercel/Render + MongoDB Atlas
- [ ] PWA/mobile version

---

# Author
**Taj Mohammad Khan**  
A software engineer passionate about maps, travel, and applying AI to real-world use cases.  
[LinkedIn](https://www.linkedin.com/in/taj-mohammad-khan/) 


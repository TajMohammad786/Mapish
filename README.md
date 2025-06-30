🌍 Mapish
Mapish is a web app that maps YouTube vlog videos to real-world locations on an interactive map. The platform aims to make travel content easily explorable by location rather than just keywords.

![image](https://github.com/user-attachments/assets/95100038-a352-46e9-bdb3-da86ca36f2dd)


🔧 Tech Stack
Tech	Purpose
React.js	Frontend framework for building UI
React-Leaflet	Interactive map rendering
Node.js + Express.js	Backend API & data handling
MongoDB	Database with geospatial indexing
OpenAI (or custom AI logic)	Extracts locations from video metadata (title + description)

🚀 Features
📍 Maps YouTube vlog videos to actual geographic coordinates

🔍 Search and filter videos by location

🧠 AI-powered location extraction from titles & descriptions

🗺️ Interactive map UI to explore content visually

📦 Fast and scalable backend with MongoDB geospatial queries

🧠 How it works
Fetch videos from travel/vlog YouTube channels.

Use AI to extract possible locations from video metadata.

Store each video in MongoDB using a GeoJSON Point.

Display the videos as markers on a Leaflet map.

Allow users to click markers and watch embedded YouTube videos.

⚙️ Getting Started
bash
Copy
Edit
# Clone the repo
git clone https://github.com/yourusername/mapish.git
cd mapish

# Install dependencies
npm install

# Start the client and server (adjust as needed)
npm run dev   # for Vite + Express concurrently
Set up environment variables (e.g. MongoDB URI, YouTube API key, OpenAI key) in .env.

🧪 Future Ideas
🗂️ Categorize videos by theme (food, nature, city, etc.)

🔔 User subscriptions or location alerts

📦 Deploy on Vercel/Render + MongoDB Atlas

📱 Responsive design / mobile PWA version

🙋‍♂️ About the Author
Hi! I'm Taj Mohammad Khan, a software engineer passionate about travel, maps, and using AI for creative solutions.
Connect with me on LinkedIn 

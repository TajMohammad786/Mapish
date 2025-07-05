import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/dbConnect.js';
import authRoutes from './routes/auth.routes.js';
import videoRoutes from './routes/video.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
let baseOrigin = 'http://localhost:5173';
if(process.env.NODE_ENV === 'production'){
    baseOrigin = 'https://mapish.onrender.com/'
}

connectDB();
app.use(cors({
  origin: baseOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/getVideos', videoRoutes);

app.use('/auth/', authRoutes);


if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    });
}


app.all('*', (req, res, next) => {
    next(new AppError(`Can't on the server`, 404));
});

app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on ${PORT}`)
})
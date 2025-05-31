import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/dbConnect.js';
import authRoutes from './routes/auth.routes.js';
import videoRoutes from './routes/video.routes.js';


const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
connectDB();
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.use('/getVideos', videoRoutes);

app.use('/auth/', authRoutes);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't on the server`, 404));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
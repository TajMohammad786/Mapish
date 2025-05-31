import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DB = process.env.DB_URL;

export const connectDB = () => {
    mongoose
        .connect(DB)
        .then(() => {
            console.log('DB connection established!!');
        })
        .catch((err) => {
            console.log('DB CONNECTION FAILED');
            console.log('ERR: ', err);
        });

}

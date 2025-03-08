import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import mainRoutes from './routes/index.js';

dotenv.config();
const app = express();



//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
}

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));
app.use("/api", mainRoutes);

app.use(cors(corsOptions));


const PORT =  1234;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
    });


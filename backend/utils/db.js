import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connection success");
        } catch (error) {
        console.log("MongoDB connection failed");
    }
};

export default connectDB;
import mongoose from "mongoose";

const connectMongoDB = async() => {
    const MONGO_URI = process.env.MONGO_URI;
    try {
        await mongoose.connect(MONGO_URI!);
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
}

export default connectMongoDB;
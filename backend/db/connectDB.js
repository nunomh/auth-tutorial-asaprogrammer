import mongoose from "mongoose";

export const connectDB = async () =>
{
    try
    {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected.");
    } catch (error)
    {
        console.log("Error connecting to database: ", error.message);
        process.exit(1); // Exit the process with failure (1)
    }
};
import mongoose, { ConnectOptions } from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error("MongoDB URL is not defined in environment variables.");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUrl as string, {
      dbName: 'Marin',
      ssl: true,
    } as ConnectOptions);

    isConnected = true;
    console.log("MongoDB connection successfully established.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("MongoDB connection failed");
  }
}

export async function disconnectDB() {
  if (!isConnected) {
    console.log("MongoDB is already disconnected.");
    return;
  }

  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
    isConnected = false;
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}

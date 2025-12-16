import mongoose, { Mongoose } from "mongoose";

// Define the shape of the cached connection object
interface Cache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Augment the global object type to include our cache structure.
// This tells TypeScript what the type of global.mongoose is.
declare global {
  var mongoose: Cache;
}

// Ensure the MONGO_URI is set in your environment variables (.env file)
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Global variable to hold the cached connection (in development) or the Promise (in production)
// TypeScript now knows the structure of global.mongoose.
let cached = global.mongoose;

if (!cached) {
  // Initialize the cache if it doesn't exist
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to the MongoDB database using Mongoose.
 * Implements a singleton pattern to reuse the connection across requests,
 * which is essential for Next.js serverless functions.
 */
async function dbConnect(): Promise<Mongoose> {
  // If a connection is already established, return the cached connection.
  if (cached.conn) {
    console.log("Using existing MongoDB connection.");
    return cached.conn;
  }

  // If there is no existing promise, create one to initiate the connection.
  if (!cached.promise) {
    const opts = {
      // Disable Mongoose buffering for better serverless performance
      bufferCommands: false,
      // useNewUrlParser and useUnifiedTopology are obsolete in Mongoose 6+
    };

    console.log("Connecting to new MongoDB instance...");

    // Create the connection promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        // Once connected, cache the instance
        return mongooseInstance;
      })
      .catch((error) => {
        // Clear the promise if connection fails to allow retries
        cached.promise = null;
        throw error;
      });
  }

  // Await the promise to get the connection object and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

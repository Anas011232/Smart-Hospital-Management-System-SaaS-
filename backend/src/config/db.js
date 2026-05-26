import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

let db;

export const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("hospitalDB");
    console.log("MongoDB Connected 🚀");
  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database not connected yet");
  }
  return db;
};
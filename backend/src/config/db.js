import { MongoClient } from "mongodb";

let db;
let client;

export const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGO_URI);

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
import express from "express";
import { getDB } from "../config/db.js"; // এখানে getDB ইমপোর্ট করুন

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const db = getDB(); // ফাংশনটি কল করে ডাটাবেস অবজেক্টটি নিন
    
    const medicines = await db.collection("medicines").find({
      $or: [
        { medicine_name: { $regex: query, $options: "i" } },
        { generic_name: { $regex: query, $options: "i" } }
      ]
    }).limit(10).toArray();

    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
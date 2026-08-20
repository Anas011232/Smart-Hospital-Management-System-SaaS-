import express from "express";
import { getDB } from "../config/db.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const db = getDB();
    
    // Aggregation pipeline ব্যবহার করছি কারণ টেস্টগুলো অ্যারে ফরম্যাটে আছে
    const results = await db.collection("tests").aggregate([
      // ১. টেস্টের অ্যারেটিকে আলাদা আলাদা ডকুমেন্টে ভেঙে ফেলবে
      { $unwind: "$tests" },
      // ২. কুয়েরি অনুযায়ী ফিল্টার করবে (case-insensitive)
      { 
        $match: { 
          tests: { $regex: query, $options: "i" } 
        } 
      },
      // ৩. শুধু টেস্টের নামগুলো প্রজেক্ট করবে
      { $project: { _id: 0, testName: "$tests" } },
      // ৪. সর্বোচ্চ ১০টি রেজাল্ট দেখাবে
      { $limit: 10 }
    ]).toArray();

    // রেজাল্টগুলোকে সিম্পল অ্যারেতে কনভার্ট করে পাঠানো হচ্ছে (যেমন: ["CBC", "ESR"])
    const finalResults = results.map(item => item.testName);
    
    res.json(finalResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
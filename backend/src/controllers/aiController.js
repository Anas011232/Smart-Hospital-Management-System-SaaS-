import OpenAI from "openai";
import { getDB } from "../config/db.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const askDoctorAI = async (req, res) => {
  try {
    const { message } = req.body;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content: `
You are a hospital triage AI.

Return ONLY one department.

Available:
Cardiology
Neurology
Orthopedics
Medicine
Dermatology
Pediatrics
            `,
          },

          {
            role: "user",
            content: message,
          },
        ],
      });

    const department =
      completion.choices[0]
        .message.content.trim();

    const db = getDB();

    const doctors =
      await db.collection("doctors")
        .find({
          department: {
            $regex: department,
            $options: "i",
          },
        })
        .toArray();

    res.json({
      success: true,
      department,
      doctors,
      reply: `Recommended ${department} doctors`,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
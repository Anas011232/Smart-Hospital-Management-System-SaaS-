import fs from "fs";
import OpenAI from "openai";
import { getMedicalCollection } from "../services/chromaService.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  const text = fs.readFileSync(
    "./src/data/medicalKnowledge.txt",
    "utf8"
  );

  const embedding =
    await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

  const collection =
    await getMedicalCollection();

  await collection.add({
    ids: ["medical-knowledge"],
    documents: [text],
    embeddings: [embedding.data[0].embedding],
  });

  console.log("Seed Complete");
}

run();
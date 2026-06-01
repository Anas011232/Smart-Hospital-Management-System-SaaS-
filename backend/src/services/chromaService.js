import { ChromaClient } from "chromadb";

const client = new ChromaClient();

export const getMedicalCollection = async () => {
  return await client.getOrCreateCollection({
    name: "hospital-medical-db",
  });
};
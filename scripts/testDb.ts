import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("✔ Neon database reachable");
    console.log("Current time from DB:", result[0].now);
  } catch (error) {
    console.error("✘ Neon database connection failed:", error);
    process.exit(1);
  }
}

testConnection();

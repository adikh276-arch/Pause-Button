import { neon } from "@neondatabase/serverless";

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || "";

const sql = neon(DATABASE_URL);

/**
 * Execute a query with parameters.
 */
export const query = async (text: string, params: any[] = []) => {
  try {
    // Calling neon client as a function for parameterized queries
    const result = await (sql as any)(text, params);
    return { rows: result };
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

/**
 * Initialize the database schema if it doesn't exist.
 */
export const initSchema = async () => {
  try {
    // We use tagged templates here to satisfy potential type constraints 
    // though the function call works too.
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS pause_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        date TIMESTAMP DEFAULT NOW(),
        emotions TEXT[],
        action TEXT,
        notes TEXT,
        trigger_context TEXT
      );
    `;

    console.log("✔ Database schema verified/initialized");
  } catch (error) {
    console.error("✘ Failed to initialize schema:", error);
  }
};

export default sql;

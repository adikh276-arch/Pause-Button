import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.TRANSLATE_API_KEY;
const SRC_FILE = path.resolve(__dirname, "../src/i18n/locales/en.json");
const OUTPUT_DIR = path.resolve(__dirname, "../src/i18n/locales");

const TARGET_LANGS = [
  "es", "fr", "pt", "de", "ar", "hi", "bn", "zh", "ja", 
  "id", "tr", "vi", "ko", "ru", "it", "pl", "th", "tl"
];

async function translateBatch(texts: string[], target: string): Promise<string[]> {
  if (!API_KEY) {
    throw new Error("TRANSLATE_API_KEY is missing in .env");
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: texts,
      target: target,
      format: "text",
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.data.translations.map((t: { translatedText: string }) => t.translatedText);
}

async function main() {
  if (!fs.existsSync(SRC_FILE)) {
    console.error("Source file not found:", SRC_FILE);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const enData = JSON.parse(fs.readFileSync(SRC_FILE, "utf-8"));
  const keys = Object.keys(enData);
  const values = Object.values(enData) as string[];

  console.log(`Found ${keys.length} keys to translate.`);

  for (const lang of TARGET_LANGS) {
    console.log(`Translating to ${lang}...`);
    const translatedData: Record<string, string> = {};

    try {
      const translatedValues = await translateBatch(values, lang);
      
      keys.forEach((key, i) => {
        translatedData[key] = translatedValues[i];
      });

      fs.writeFileSync(
        path.join(OUTPUT_DIR, `${lang}.json`),
        JSON.stringify(translatedData, null, 2)
      );
      console.log(`Generated ${lang}.json`);
    } catch (error) {
      console.error(`Failed to translate to ${lang}:`, error);
      // Create fallback if failed
      fs.writeFileSync(
        path.join(OUTPUT_DIR, `${lang}.json`),
        JSON.stringify(enData, null, 2)
      );
      console.log(`Generated fallback for ${lang}.json`);
    }
  }
}

main();

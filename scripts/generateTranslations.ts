import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.TRANSLATE_API_KEY;
const SRC_FILE = path.resolve(__dirname, "../src/i18n/locales/en.json");
const OUTPUT_DIR = path.resolve(__dirname, "../src/i18n/locales");

const TARGET_LANGS = [
  "es", "fr", "pt", "de", "ar", "hi", "bn", "zh", "ja", 
  "id", "tr", "vi", "ko", "ru", "it", "pl", "th", "tl"
];

async function translateText(text: string, target: string) {
  if (!API_KEY) {
    throw new Error("TRANSLATE_API_KEY is missing in .env");
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      q: text,
      target: target,
      format: "text",
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.data.translations[0].translatedText;
}

async function main() {
  if (!fs.existsSync(SRC_FILE)) {
    console.error("Source file not found:", SRC_FILE);
    process.exit(1);
  }

  const enData = JSON.parse(fs.readFileSync(SRC_FILE, "utf-8"));
  const keys = Object.keys(enData);
  const values = Object.values(enData) as string[];

  console.log(`Found ${keys.length} keys to translate.`);

  for (const lang of TARGET_LANGS) {
    console.log(`Translating to ${lang}...`);
    const translatedData: Record<string, string> = {};

    try {
      // Small batching could be done, but for simplicity we'll do them one by one or in one go if API allowed
      // The Google Translate API allows passing an array of strings
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
    }
  }
}

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

  return data.data.translations.map((t: any) => t.translatedText);
}

main();

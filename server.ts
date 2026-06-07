import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

import { FALLBACK_CURRICULUMS, generateFallbackKisiKisi, generateFallbackSoal, getComplexAndMatchingContent } from "./server-fallback";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

const PORT = 3000;

// Initialize multiple Gemini API clients for rotation to handle high usage and multi-user rate limits
let aiClients: GoogleGenAI[] = [];
let currentClientIndex = 0;

function getAiClientsPool(): GoogleGenAI[] {
  if (aiClients.length === 0) {
    const keys: string[] = [];
    
    // 1. Prioritize process.env.GEMINI_API_KEY (default system key in AI Studio)
    const defaultSysKey = process.env.GEMINI_API_KEY;
    if (defaultSysKey && defaultSysKey.trim() !== "" && defaultSysKey !== "MY_GEMINI_API_KEY") {
      keys.push(defaultSysKey.trim());
      console.log("[Gemini API] Prioritizing the system-provided GEMINI_API_KEY.");
    }

    // 2. Add GEMINI_API_KEYS_POOL separated by commas if not already added
    if (process.env.GEMINI_API_KEYS_POOL) {
      const pool = process.env.GEMINI_API_KEYS_POOL.split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0 && k !== "MY_GEMINI_API_KEY");
      for (const k of pool) {
        if (!keys.includes(k)) {
          keys.push(k);
        }
      }
    }
    
    // 3. Support other individual variables if not already added
    const envVars = ["GEMINI_API_KEY_2", "GEMINI_API_KEY_3", "GEMINI_API_KEY_4", "GEMINI_API_KEY_5"];
    for (const v of envVars) {
      const val = process.env[v];
      if (val && val.trim() !== "" && val !== "MY_GEMINI_API_KEY" && !keys.includes(val.trim())) {
        keys.push(val.trim());
      }
    }
    
    // 4. Fallback to default developer key if no keys are configured
    if (keys.length === 0) {
      console.log("[Gemini API] No custom system key found, falling back to developer key.");
      keys.push("AIzaSyDUqQ7LNP_3dUy4uOCjcx_hbRwLgi8bEpU");
    }
    
    // Create client instances
    aiClients = keys.map(key => new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    }));
  }
  return aiClients;
}

// Returns the current active rotated client
function getAiClient(): GoogleGenAI {
  const pool = getAiClientsPool();
  return pool[currentClientIndex % pool.length];
}

// Rotates to the next client in case of rate limits
function rotateAiClient(): void {
  const pool = getAiClientsPool();
  if (pool.length > 1) {
    currentClientIndex = (currentClientIndex + 1) % pool.length;
    console.log(`[Gemini API Rotation] Switched to API key index ${currentClientIndex}/${pool.length}`);
  }
}

// Helper to call Gemini with automatic retry and API key rotation on 429 rate limits
async function generateContentWithRetry(aiIgnored: GoogleGenAI, params: any, maxRetries = 2, userApiKey?: string, customKeys?: string[]): Promise<any> {
  let attempt = 0;
  
  // Combine all keys to try for this request in order of priority:
  // 1. Custom keys passed from the client (e.g. dynamic admin keys)
  // 2. Global system keys configured on the server
  // 3. User custom API key
  // 4. Default developer fallback key
  
  const keysToTry: string[] = [];
  if (customKeys && customKeys.length > 0) {
    keysToTry.push(...customKeys.map(k => k.trim()).filter(k => k.length > 0));
  }
  
  // Add the global server pool keys
  const defaultSysKey = process.env.GEMINI_API_KEY;
  if (defaultSysKey && defaultSysKey.trim() !== "" && defaultSysKey !== "MY_GEMINI_API_KEY" && !keysToTry.includes(defaultSysKey.trim())) {
    keysToTry.push(defaultSysKey.trim());
  }
  if (process.env.GEMINI_API_KEYS_POOL) {
    const pool = process.env.GEMINI_API_KEYS_POOL.split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0 && k !== "MY_GEMINI_API_KEY");
    for (const k of pool) {
      if (!keysToTry.includes(k)) keysToTry.push(k);
    }
  }
  const envVars = ["GEMINI_API_KEY_2", "GEMINI_API_KEY_3", "GEMINI_API_KEY_4", "GEMINI_API_KEY_5"];
  for (const v of envVars) {
    const val = process.env[v];
    if (val && val.trim() !== "" && val !== "MY_GEMINI_API_KEY" && !keysToTry.includes(val.trim())) {
      keysToTry.push(val.trim());
    }
  }
  if (userApiKey && userApiKey.trim().length > 0 && !keysToTry.includes(userApiKey.trim())) {
    keysToTry.push(userApiKey.trim());
  }
  const devDefault = "AIzaSyDUqQ7LNP_3dUy4uOCjcx_hbRwLgi8bEpU";
  if (!keysToTry.includes(devDefault)) {
    keysToTry.push(devDefault);
  }

  const poolLength = keysToTry.length;
  const totalAttempts = Math.max(maxRetries, poolLength * 2);
  let currentKeyIndex = 0;

  while (attempt <= totalAttempts) {
    const currentKey = keysToTry[currentKeyIndex % poolLength];
    try {
      const ai = new GoogleGenAI({
        apiKey: currentKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } }
      });
      return await ai.models.generateContent(params);
    } catch (err: any) {
      const errStr = (String(err) + " " + String(err.message || "") + " " + String(err.status || "")).toLowerCase();
      const isRateLimit = err.status === 429 || 
                          err.statusCode === 429 ||
                          errStr.includes("quota") || 
                          errStr.includes("resource_exhausted") ||
                          errStr.includes("rate limit") ||
                          errStr.includes("rate exceeded") ||
                          errStr.includes("429") ||
                          errStr.includes("limitexceeded");
                          
      if (isRateLimit && attempt < totalAttempts) {
        attempt++;
        if (poolLength > 1) {
          console.warn(`[Gemini API] Rate limit (429) encountered. Rotating to next key in request pool...`);
          currentKeyIndex++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          const waitTime = attempt * 3000;
          console.warn(`[Gemini API] Single key rate limit (429) encountered. Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
        continue;
      }
      throw err;
    }
  }
}

// Helper to call Google Imagen API via GenAI SDK with automatic key rotation and retry on 429
async function generateImagenImage(prompt: string, maxRetries = 1, userApiKey?: string, customKeys?: string[]): Promise<string | null> {
  if (!prompt || prompt.trim().length === 0) return null;
  
  const promptLower = prompt.toLowerCase();
  
  // Decide the subject-specific constraints and visual styles
  let subjectStyleConstraint = "";
  if (
    promptLower.includes("vector") || 
    promptLower.includes("illustration") || 
    promptLower.includes("diagram") || 
    promptLower.includes("matematika") ||
    promptLower.includes("hitung") || 
    promptLower.includes("sains") || 
    promptLower.includes("science") || 
    promptLower.includes("objek") || 
    promptLower.includes("benda") ||
    promptLower.includes("buah") ||
    promptLower.includes("apple") ||
    promptLower.includes("apel") ||
    promptLower.includes("balok") ||
    promptLower.includes("kubus") ||
    promptLower.includes("clipart") ||
    promptLower.includes("svg")
  ) {
    subjectStyleConstraint = "Style Constraint: Use ONLY '2D vector flat illustration, white background, simple clean clipart' specially tailored for primary school educational worksheet diagrams. Flat shapes, clear vibrant colors, crisp shapes, and absolutely zero realistic textures, zero shadows, and zero complex background environments.";
  } else {
    subjectStyleConstraint = "Style Constraint: Use ONLY 'Ultra realistic educational photography, neat DSLR quality' with optimal lighting. Match clean Indonesian elementary school settings: primary school children wearing polite standard tidy red-and-white school uniforms with pleasant, innocent expressions. Natural pose in a bright clean educational room, courtyard, or playground.";
  }

  const negativePromptStr = "text, words, letters, labels, spelling, font, numbers, characters, titles, overlay, watermarks, signature, captions, logos, badge, copyright, blurry, bad anatomy, bad hands, mutated fingers, out of frame, cropped, distorted object shapes, low quality, draft, extra limbs, banner, frame border, abstract colorful background, distracting details";

  let petConstraint = "";
  if (
    promptLower.includes("kucing") || 
    promptLower.includes("cat") || 
    promptLower.includes("anjing") || 
    promptLower.includes("dog") || 
    promptLower.includes("hewan") || 
    promptLower.includes("binatang") || 
    promptLower.includes("pet") || 
    promptLower.includes("animal") ||
    promptLower.includes("burung") ||
    promptLower.includes("bird") ||
    promptLower.includes("ikan") ||
    promptLower.includes("fish") ||
    promptLower.includes("kelinci") ||
    promptLower.includes("rabbit")
  ) {
    petConstraint = "\n4. LIVE PET EXCLUSION: Since a living pet/animal is requested, depict a living, healthy pet sitting naturally in its environment. Do NOT depict drawing paint, brushes, crayons, or sketch tools unless explicitly requested.";
  }

  const systemInstruction = `Strict System Instruction & Constraints:
You are an expert professional educational visual assets designer. You must adhere stringently to the following layout constraints, visual styles, and safety rules to prevent any hallucination.
1. ${subjectStyleConstraint}
2. ZERO HALLUCINATION: Render only the precise subjects and items explicitly detailed in the request description. Never introduce extraneous, unrelated items or mismatch subjects.
3. NO WRITTEN TEXT OR SYMBOLS: Absolutely never render any letters, word labels, numeric numbers, titles, banners, watermark lines, or artist signatures. The canvas must be 100% free of letters and text.${petConstraint}

Strict Avoidance (Negative Prompt): ${negativePromptStr}`;

  // Prepend strict system instructions and constraints to the prompt
  const enhancedPrompt = `${systemInstruction}\n\nUser Image Request:\n${prompt}`;
  
  // Combine all keys to try for this request in order of priority:
  const keysToTry: string[] = [];
  if (customKeys && customKeys.length > 0) {
    keysToTry.push(...customKeys.map(k => k.trim()).filter(k => k.length > 0));
  }
  const defaultSysKey = process.env.GEMINI_API_KEY;
  if (defaultSysKey && defaultSysKey.trim() !== "" && defaultSysKey !== "MY_GEMINI_API_KEY" && !keysToTry.includes(defaultSysKey.trim())) {
    keysToTry.push(defaultSysKey.trim());
  }
  if (process.env.GEMINI_API_KEYS_POOL) {
    const pool = process.env.GEMINI_API_KEYS_POOL.split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0 && k !== "MY_GEMINI_API_KEY");
    for (const k of pool) {
      if (!keysToTry.includes(k)) keysToTry.push(k);
    }
  }
  const envVars = ["GEMINI_API_KEY_2", "GEMINI_API_KEY_3", "GEMINI_API_KEY_4", "GEMINI_API_KEY_5"];
  for (const v of envVars) {
    const val = process.env[v];
    if (val && val.trim() !== "" && val !== "MY_GEMINI_API_KEY" && !keysToTry.includes(val.trim())) {
      keysToTry.push(val.trim());
    }
  }
  if (userApiKey && userApiKey.trim().length > 0 && !keysToTry.includes(userApiKey.trim())) {
    keysToTry.push(userApiKey.trim());
  }
  const devDefault = "AIzaSyDUqQ7LNP_3dUy4uOCjcx_hbRwLgi8bEpU";
  if (!keysToTry.includes(devDefault)) {
    keysToTry.push(devDefault);
  }

  let allowNegativePrompt = true;

  for (const activeKey of keysToTry) {
    console.log(`[Google Imagen] Attempting image generation with key: ${activeKey.slice(0, 10)}...`);
    const ai = new GoogleGenAI({
      apiKey: activeKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build-imagen" } }
    });

    const models = ["imagen-3.0-generate-002", "imagen-3.0-capability-001"];
    let skipKey = false;

    for (const modelId of models) {
      if (skipKey) break;
      try {
        const config: any = {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        };
        if (allowNegativePrompt) {
          config.negativePrompt = negativePromptStr;
        }

        const response = await ai.models.generateImages({
          model: modelId,
          prompt: enhancedPrompt,
          config: config,
        });
        
        if (response?.generatedImages?.[0]?.image?.imageBytes) {
          console.log(`[Google Imagen] Successfully generated image via '${modelId}'!`);
          return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
        }
      } catch (err: any) {
        console.warn(`[Google Imagen] '${modelId}' failed with key: ${activeKey.slice(0, 10)}... Error:`, err.message || err);
        const errStr = String(err.message || "").toLowerCase();
        if (errStr.includes("negativeprompt") || errStr.includes("negative_prompt")) {
          allowNegativePrompt = false;
        }
        if (err.status === 400 || err.status === 401 || err.status === 403 || err.status === 429 || 
            errStr.includes("key") || errStr.includes("api key") || errStr.includes("quota") || errStr.includes("limit") || errStr.includes("not found")) {
          console.warn(`[Google Imagen] Fatal error for key ${activeKey.slice(0, 10)}... skipping this key.`);
          skipKey = true;
        }
      }
    }
  }

  return null;
}



// Verified pool of high-quality active Unsplash image URLs to prevent broken image errors (404)
const VERIFIED_UNSPLASH_IMAGE_POOL: Record<string, string> = {
  gotongRoyong: "https://images.unsplash.com/photo-1610483178766-02e071e6be12?w=600&auto=format&fit=crop&q=80", // children with plants/garden
  indonesiaFlag: "https://images.unsplash.com/photo-1577964955725-b4618a00282b?w=600&auto=format&fit=crop&q=80", // fluttering Red and White Indonesian Flag
  classroom: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80", // clean high-contrast classroom
  reading: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80", // child happily reading a book
  playing: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80", // elementary students playing on sunny green field/courtyard
  schoolInteraction: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80", // friendly female teacher interacting with schoolchildren
  soccer: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80", // active sports/soccer field
  science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80", // science lab activity, microscope
  family: "https://images.unsplash.com/photo-1542037104857-ffbe0bb7ebb3?w=600&auto=format&fit=crop&q=80", // wholesome family smiling
  art: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80", // painting/art supplies and cups
  traditionalMarket: "https://images.unsplash.com/photo-1590224790079-66810260db97?w=600&auto=format&fit=crop&q=80", // Indonesian fruits active market
  indonesianCulture: "https://images.unsplash.com/photo-1610116306796-6ebd3051c3d8?w=600&auto=format&fit=crop&q=80", // Borobudur temple morning scene
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80", // adorable cat playing
  dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80", // friendly puppy dog
  bird: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&auto=format&fit=crop&q=80", // beautiful colorful bird
  fish: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80", // goldfishes swimming
  rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80", // cute domestic rabbit
  animals: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&auto=format&fit=crop&q=80", // default fallback deer in forest
  astronomy: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop&q=80", // celestial astronomy stars background
  healthyDiet: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80", // organic vegetables and fruits table
  bicycling: "https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=600&auto=format&fit=crop&q=80", // kids riding bicycle outdoors
  computers: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80", // digital learning computers group
  spiritual: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80", // warm sunlight study/pray window room
  indonesianGeography: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80", // tropical mountains and lake
  lushNature: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80", // green forest path
  defaultEdu: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80" // bright educational classroom environment
};

// Maps a question to a 100% working, beautiful and relevant Unsplash image based on topic context
function getRelevantVerifiedUnsplashUrl(subject: string, questionText: string, materi: string, stimulusText: string, imagenPrompt: string = ""): string {
  const textToScan = `${subject} ${questionText} ${materi} ${stimulusText} ${imagenPrompt}`.toLowerCase();
  const subjectLower = (subject || "").toLowerCase();
  const isPjokAndSports = 
    subjectLower.includes("pjok") || 
    subjectLower.includes("jasmani") || 
    subjectLower.includes("olahraga") || 
    subjectLower.includes("penjas") || 
    textToScan.includes("penjasorkes") || 
    textToScan.includes("senam") || 
    textToScan.includes("jasmani");

  // For PJOK/Sports education, NEVER show real-life animal photographs or bedroom/classroom scenes even if the question mimics animal walks (e.g., "menirukan gerakan kucing/kelinci").
  // Physical education exercises belong on playgrounds, outdoor courts, or sports fields.
  if (isPjokAndSports) {
    if (textToScan.includes("bola") || textToScan.includes("sepak") || textToScan.includes("gawang") || textToScan.includes("futsal")) {
      return VERIFIED_UNSPLASH_IMAGE_POOL.soccer;
    }
    return VERIFIED_UNSPLASH_IMAGE_POOL.playing;
  }
  
  // 0a. PRE-CHECK FOR TEACHER INTERACTIONS & GREETINGS (Prioritized highly so meeting a teacher never shows forest or empty rooms)
  if (
    textToScan.includes("bertemu") || 
    textToScan.includes("menyapa") || 
    textToScan.includes("salam") || 
    textToScan.includes("sapa") || 
    textToScan.includes("berpapasan") ||
    textToScan.includes("koridor") || 
    textToScan.includes("berbincang") ||
    (textToScan.includes("guru") && (textToScan.includes("murid") || textToScan.includes("siswa") || textToScan.includes("anak") || textToScan.includes("andi") || textToScan.includes("budi") || textToScan.includes("cici") || textToScan.includes("dedi")))
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.schoolInteraction;
  }

  // 1. SPECIFIC ANIMALS & PETS (Differentiated cleanly using regex word boundaries to prevent false positives)
  if (/\bkucing\b/i.test(textToScan) || /\bcat(s)?\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.cat;
  }
  if (/\banjing\b/i.test(textToScan) || /\bdog(s)?\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.dog;
  }
  if (/\bburung\b/i.test(textToScan) || /\bbird(s)?\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.bird;
  }
  if (/\bikan\b/i.test(textToScan) || /\bfish(es)?\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.fish;
  }
  if (/\bkelinci\b/i.test(textToScan) || /\brabbit(s)?\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.rabbit;
  }
  if (
    textToScan.includes("hewan") || 
    textToScan.includes("binatang") || 
    textToScan.includes("margasatwa") || 
    textToScan.includes("ekosistem") ||
    textToScan.includes("lingkungan")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.lushNature; // General green nature/habitat scene for ecosystems or non-specific pets
  }

  // 2. SCHOOL ROOMS, CLASSROOMS, EDUCATION (PRIORITIZED to show beautiful neat classrooms, boards, or rooms)
  if (
    textToScan.includes("kelas") || 
    textToScan.includes("papan") || 
    textToScan.includes("guru") || 
    textToScan.includes("siswa") || 
    textToScan.includes("murid") || 
    textToScan.includes("belajar") || 
    textToScan.includes("sekolah") || 
    textToScan.includes("didik") ||
    textToScan.includes("ruangan") || 
    textToScan.includes("ruang kelas") ||
    textToScan.includes("meja") ||
    textToScan.includes("bangku")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.classroom;
  }

  // 3. INDONESIAN FLAG, NATIONAL SYMBOLS & CITIZENSHIP
  if (
    textToScan.includes("bendera") || 
    textToScan.includes("upacara") || 
    textToScan.includes("proklamasi") || 
    textToScan.includes("merdeka") || 
    textToScan.includes("pancasila") || 
    textToScan.includes("garuda") || 
    textToScan.includes("negara") || 
    textToScan.includes("pahlawan") || 
    textToScan.includes("indonesia") && textToScan.includes("merah putih")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.indonesiaFlag;
  }

  // 4. INDONESIAN CULTURE & TEMPLES
  if (
    textToScan.includes("candi") || 
    textToScan.includes("sejarah") || 
    textToScan.includes("borobudur") || 
    textToScan.includes("prambanan") || 
    textToScan.includes("budaya") || 
    textToScan.includes("adat") || 
    textToScan.includes("rumah adat") || 
    textToScan.includes("tradisional") || 
    textToScan.includes("suku")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.indonesianCulture;
  }

  // 5. BEDROOMS & STUDY ROOMS (specific domestic rooms rather than classroom)
  if (
    textToScan.includes("kamar") || 
    textToScan.includes("tidur") || 
    textToScan.includes("bedroom") || 
    textToScan.includes("bed") || 
    textToScan.includes("meja belajar") || 
    textToScan.includes("study room")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.spiritual;
  }

  // 6. BOOKS, READING, WRITING
  if (
    textToScan.includes("buku") || 
    textToScan.includes("baca") || 
    textToScan.includes("perpustakaan") || 
    textToScan.includes("dongeng") || 
    textToScan.includes("cerita") || 
    textToScan.includes("menulis") || 
    textToScan.includes("puisi") || 
    textToScan.includes("pantun") || 
    textToScan.includes("dialog") || 
    textToScan.includes("percakapan") || 
    textToScan.includes("tulis") || 
    textToScan.includes("novel")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.reading;
  }

  // 7. EXPERIMENTS, SCIENCE, IPAS DIAGRAMS
  if (
    textToScan.includes("eksperimen") || 
    textToScan.includes("percobaan") || 
    textToScan.includes("sains") || 
    textToScan.includes("ipas") || 
    textToScan.includes("laboratorium") || 
    textToScan.includes("fisika") || 
    textToScan.includes("kimia") || 
    textToScan.includes("biologi") || 
    textToScan.includes("organ") || 
    textToScan.includes("pencernaan") || 
    textToScan.includes("tulang") || 
    textToScan.includes("gaya magnet")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.science;
  }

  // 8. SOCCER & SPORTS FIELDS
  if (
    textToScan.includes("sepak bola") || 
    textToScan.includes("futsal") || 
    textToScan.includes("gawang") || 
    textToScan.includes("bola") && (textToScan.includes("tendang") || textToScan.includes("lapangan"))
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.soccer;
  }

  // 9. CLEANING, GARDENING, GOTONG ROYONG
  if (
    textToScan.includes("gotong") || 
    textToScan.includes("bersih") || 
    textToScan.includes("sapu") || 
    textToScan.includes("sampah") || 
    textToScan.includes("lap") || 
    textToScan.includes("kerja bakti") || 
    textToScan.includes("piket") || 
    textToScan.includes("royong") ||
    textToScan.includes("tanam") || 
    textToScan.includes("kebun") || 
    textToScan.includes("siram") || 
    textToScan.includes("pupuk") || 
    textToScan.includes("merawat tanaman")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.gotongRoyong;
  }

  // 10. SOCIAL INTERACTION & ACTIVE OUTDOOR GAMES (walking path and park - evaluated after school classrooms/animals)
  if (
    textToScan.includes("main") || 
    textToScan.includes("bermain") || 
    textToScan.includes("kelereng") || 
    textToScan.includes("lari") || 
    textToScan.includes("lompat") || 
    textToScan.includes("tali") || 
    textToScan.includes("senam") || 
    textToScan.includes("olah raga") || 
    textToScan.includes("jasmani") ||
    textToScan.includes("salam") || 
    textToScan.includes("sapa") || 
    textToScan.includes("bertemu") || 
    textToScan.includes("pagi") || 
    textToScan.includes("siang") || 
    textToScan.includes("sore") || 
    textToScan.includes("malam") || 
    textToScan.includes("gerbang") || 
    textToScan.includes("hello") || 
    textToScan.includes("greetings") || 
    textToScan.includes("morning") || 
    textToScan.includes("afternoon")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.playing;
  }

  // 11. FAMILY & HOME SECTOR
  if (
    textToScan.includes("keluarga") || 
    textToScan.includes("ibu") || 
    textToScan.includes("bapak") || 
    textToScan.includes("ayah") || 
    textToScan.includes("ortu") || 
    textToScan.includes("kakak") || 
    textToScan.includes("dapur") || 
    textToScan.includes("mencuci") || 
    textToScan.includes("memasak") || 
    textToScan.includes("rumah") || 
    textToScan.includes("bantu") || 
    textToScan.includes("membantu")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.family;
  }

  // 12. ART & DRAWING TOOLS (Paint, Brush, Colors - evaluated AFTER Animals/Pets check)
  if (
    textToScan.includes("lukis") || 
    textToScan.includes("menggambar") || 
    textToScan.includes("mewarnai") || 
    textToScan.includes("krayon") || 
    textToScan.includes("kesenian") || 
    textToScan.includes("seni rupa") || 
    textToScan.includes("seni musik") || 
    textToScan.includes("seni tari") || 
    textToScan.includes("pahat") || 
    textToScan.includes("origami") || 
    textToScan.includes("kuas lukis") || 
    textToScan.includes("alat musik") || 
    textToScan.includes("nyanyi")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.art;
  }

  // 13. MARKETS, SHOPPING, TRADING
  if (
    textToScan.includes("pasar") || 
    textToScan.includes("toko") || 
    textToScan.includes("warung") || 
    textToScan.includes("jual") || 
    textToScan.includes("beli") || 
    textToScan.includes("pedagang") || 
    textToScan.includes("transaksi") || 
    textToScan.includes("uang") || 
    textToScan.includes("koperasi")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.traditionalMarket;
  }

  // 14. SPACE & ASTRONOMY
  if (
    textToScan.includes("planet") || 
    textToScan.includes("bintang") || 
    textToScan.includes("tatasurya") || 
    textToScan.includes("matahari") || 
    textToScan.includes("bulan") || 
    textToScan.includes("astronomi") || 
    textToScan.includes("bumi") || 
    textToScan.includes("antariksa")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.astronomy;
  }

  // 15. HEALTHY FOOD, DIET
  if (
    textToScan.includes("buah") || 
    textToScan.includes("sayur") || 
    textToScan.includes("gizi") || 
    textToScan.includes("makanan") || 
    textToScan.includes(" vitamin") || 
    textToScan.includes("sehat") || 
    textToScan.includes("susu") || 
    textToScan.includes("makan") || 
    textToScan.includes("menu sehat")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.healthyDiet;
  }

  // 16. BICYCLES
  if (
    textToScan.includes("sepeda") || 
    textToScan.includes("bersepeda") || 
    textToScan.includes("naik sepeda")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.bicycling;
  }

  // 17. COMPUTERS & DIGITAL TOOLS
  if (
    textToScan.includes("komputer") || 
    textToScan.includes("ict") || 
    textToScan.includes("internet") || 
    textToScan.includes("laptop") || 
    textToScan.includes("digital") || 
    textToScan.includes("tablet") || 
    textToScan.includes("teknologi")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.computers;
  }

  // 18. SPIRITUALS, ETHICS, TEMPLES & MOSQUES
  if (
    textToScan.includes("agama") || 
    textToScan.includes("ibadah") || 
    textToScan.includes("sholat") || 
    textToScan.includes("berdoa") || 
    textToScan.includes("doa") || 
    textToScan.includes("iman") || 
    textToScan.includes("sopan") || 
    textToScan.includes("jujur") || 
    textToScan.includes("masjid") || 
    textToScan.includes("gereja")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.spiritual;
  }

  // 19. MAPS, GEOGRAPHY
  if (
    textToScan.includes("peta") || 
    textToScan.includes("atlas") || 
    textToScan.includes("geografi") || 
    textToScan.includes("gunung") || 
    textToScan.includes("laut") || 
    textToScan.includes("pantai") || 
    textToScan.includes("sungai") || 
    textToScan.includes("pulau") || 
    textToScan.includes("pemandangan")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.indonesianGeography;
  }

  // 20. LUSH FORESTS & NATURE (Only when explicitly mentioned)
  if (
    textToScan.includes("hutan") || 
    textToScan.includes("pohon") || 
    textToScan.includes("alam") || 
    textToScan.includes("reboisasi") || 
    textToScan.includes("lingkungan hidup") || 
    textToScan.includes("daun")
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.lushNature;
  }

  // 21. DEFAULT fall back to school bag/books general edu picture
  return VERIFIED_UNSPLASH_IMAGE_POOL.defaultEdu;
}

// Compiles strict constraints and professional personas for Indonesian SD subjects:
// Highly optimized to prevent subject spillover (e.g. math entering Pancasila/Bahasa Indonesia)
function getSubjectSpecificRules(subject: string, gradeClass: string): { rules: string; systemInstruction: string } {
  const subjectLower = (subject || "").toLowerCase();
  const classLower = (gradeClass || "").toLowerCase();
  const isFaseA = classLower.includes("kelas 1") || classLower.includes("kelas 2") || classLower.includes("fase a") || classLower.includes("kelas 1-2") || classLower.includes("fase-a");
  const isFaseB = classLower.includes("kelas 3") || classLower.includes("kelas 4") || classLower.includes("fase b") || classLower.includes("kelas 3-4") || classLower.includes("fase-b");
  const isFaseC = classLower.includes("kelas 5") || classLower.includes("kelas 6") || classLower.includes("fase c") || classLower.includes("kelas 5-6") || classLower.includes("fase-c");
  
  let rules = "";
  let systemInstruction = "Anda adalah pengembang instrumen asesmen SD di Indonesia yang ahli, guru kelas profesional, psikolog perkembangan anak, desainer visual, dan prompt engineer Imagen. Anda menerjemahkan rancangan kisi-kisi ujian menjadi naskah soal asli yang utuh, mendidik, berpijak sepenuhnya pada bahasa Indonesia murni yang SANGAT SEDERHANA, lugas, ramah anak, serta bebas dari kosakata asing atau serapan rumit, disesuaikan dengan tingkat kognitif dan kemampuan realistik anak kelas terkait.";

  // Rule 1: Subject Isolation (CRITICAL)
  rules += `
    ========================================================================
    ATURAN ISOLASI MATA PELAJARAN YANG SANGAT KETAT (MANDATORI):
    Anda membuat soal untuk Mata Pelajaran: **${subject}** (Kelas: ${gradeClass}).
    SANGAT DILARANG KERAS MENCAMPURADUKKAN materi, istilah khusus, rumus, atau konsep dari mata pelajaran lain!
  `;

  // Rule 1.2: Batasan Cakupan Fase dan Elemen (MANDATORI SEJAJAR):
  rules += `
    ========================================================================
    BATASAN MUTLAK CAKUPAN MATERI & TINGKAT KESULITAN BERDASARKAN FASE (MUTLAK):
    Anda WAJIB menganalisis Fase kognitif serta elemen rujukan sebelum membuat kisi-kisi atau butir soal. JANGAN PERNAH melampaui (overshoot) kemampuan perkembangan kognitif anak sesuai Kurikulum Merdeka!

    MATEMATIKA:
    1. FASE A (Kelas 1 & 2):
       - Elemen Bilangan: Angka/nilai tempat maks adalah 100 untuk membaca/menulis/membandingkan. Operasi penjumlahan dan pengurangan HANYA boleh bernilai antara 1 sampai 20. DILARANG KERAS menggunakan bilangan ratusan atau ribuan! No hundreds/thousands allowed!
       - Elemen Aljabar: Pola gambar/bilangan beralur konkrit yang SANGAT sederhana (seperti lompat 1 atau 2, atau pola berulang berseling).
       - Elemen Pengukuran: Satuan tidak baku (depa, jengkal, langkah kaki, buku, klip kertas).
       - Elemen Geometri: Mengenal lingkaran, segitiga, segi empat sederhana, kubus, balok, bola.
    2. FASE B (Kelas 3 & 4):
       - Elemen Bilangan: Angka/nilai tempat maksimal adalah 10.000. Operasi perkalian dan pembagian puluhan/ratusan dengan angka satuan sederhana. Pecahan senilai hanya pecahan sederhana (seperti 1/2, 1/3, 1/4, dsb). DILARANG menggunakan angka puluh ribuan atau ratus ribuan!
       - Elemen Aljabar: Pola gambar membesar/mengecil sederhana, kalimat terbuka dengan simbol kotak atau variabel kosong sederhana.
       - Elemen Pengukuran: Satuan baku (m, cm, kg, g, ml, liter) dan keliling/luas persegi, persegi panjang, serta segitiga.
       - Elemen Geometri: Sifat-sifat segitiga dan segi empat, dekomposisi bangun datar sederhana.
    3. FASE C (Kelas 5 & 6):
       - Elemen Bilangan: Angka/nilai tempat maksimal adalah 1.000.000. Operasi pecahan campuran, rasio, skala, dan bilangan bulat negatif (seperti suhu termometer atau kedalaman laut).
       - Elemen Pengukuran: Menghitung volume kubus/balok, keliling/luas daerah lingkaran, luas permukaan gabungan.
       - Elemen Geometri: Sifat jaring-jaring prisma, tabung, kerucut, limas, serta koordinat Kartesius sederhana.

    PENDIDIKAN PANCASILA:
    1. FASE A (Kelas 1 & 2): Nilai-nilai gotong royong konkrit, menaati aturan harian di rumah/sekolah, menyebutkan nama simbol sila (Bintang, Rantai, dsb).
    2. FASE B (Kelas 3 & 4): Makna lambang/simbol Pancasila, kewajiban piket kelas, hak mendapat nilai, batas wilayah administrasi lokal dari tempat tinggal (Kecamatan, Kelurahan, Kabupaten).
    3. FASE C (Kelas 5 & 6): Hak dan kewajiban sebagai warga negara, struktur kelembagaan NKRI tingkat daerah/provinsi, sikap toleransi multiculturalisme secara luas.

    BAHASA INDONESIA:
    1. FASE A (Kelas 1 & 2): Ejaan K-V-K-V, membaca lancar kalimat pendek 3-5 kata, huruf kapital di awal nama/kalimat, tanda titik.
    2. FASE B (Kelas 3 & 4): Gagasan pokok, watak tokoh dongeng fabel, membedakan fakta vs opini sederhana, tanda baca koma dan tanya.
    3. FASE C (Kelas 5 & 6): Menganalisis pesan moral tersembunyi hikayat/pantun nasihat, menyusun laporan ilmiah sederhana, kalimat efektif dan komparatif.

    IPAS:
    - FASE B (Kelas 3 & 4): Panca indera, siklus hidup/metamorfosis sederhana, gaya otot/magnet/gesek harian, keragaman sosial ekonomi lokal.
    - FASE C (Kelas 5 & 6): Organ pencernaan/pernapasan manusia, rantai makanan ekosistem, sejarah kerajaan di Nusantara.
  `;

  // Rule 2: ATURAN BAHASA DAN TINGKAT KESULITAN (KHUSUS ANAK KELAS 1-2 SD / FASE A) - MUTLAK
  if (isFaseA) {
    rules += `
    ⚠️⚠️ SYARAT MUTLAK BAHASA & TINGKAT KESULITAN UNTUK ANAK KELAS 1-2 SD / FASE A (MUTLAK):
    Siswa Kelas 1-2 SD (usia 7-8 tahun) baru belajar membaca lancar dan memiliki kemampuan kognitif dasar yang konkrit. Anda HARUS mematuhi ATURAN MUTLAK berikut:
    1. Gunakan kosakata yang SANGAT SEDERHANA dan kata-kata sehari-hari yang benar-benar akrab dipahami anak kecil usia 7-8 tahun. DILARANG menggunakan istilah rumit, kata abstrak bermakna luas, kata berkognisi tinggi, atau kata serapan asing teknis (seperti: mengklasifikasikan, mengidentifikasi, komponen, struktur, simbolis, representasi, strategis, dampak, hasil, menyimpulkan, hubungan, karakteristik, efisien, dsb). Ganti dengan kata yang biasa didengar anak (misal: "mengelompokkan" diganti "memilih/memisahkan", "mengidentifikasi" diganti "menunjukkan/menemukan", "komponen" diganti "bagian", "struktur" diganti "bentuk", "dampak" diganti "akibat", "menyimpulkan" diganti "menebak/mengisi").
    2. Kalimat pada soal, stimulus, maupun pilihan jawaban HARUS SANGAT PENDEK, LUGAS, dan LANGSUNG PADA INTINYA (maksimal 1-2 kalimat pendek sederhana). DILARANG bertele-tele, menggunakan penjelasan panjang lebar, atau menggunakan kalimat majemuk bertingkat yang berbelit-belit dan membingungkan!
    3. Gunakan konteks cerita/stimulus harian anak kecil yang sangat dekat dengan dunia mereka. Contoh: budi bermain bola di halaman, cici membantu ibu mencuci piring, andi menyiram bunga di kebun, rudi merapikan mainan bersama teman sebaya. DILARANG menyajikan skenario bisnis, analisis perkantoran, ekonomi makro, atau masalah orang dewasa lainnya.
    `;
  } else {
    rules += `
    ⚠️ SYARAT BAHASA DAN TINGKAT KESULITAN (KELAS 3-6 SD / FASE B & C):
    - Bahasa sederhana, lugas, ramah anak, bebas dari istilah asing/bahasa Inggris yang membingungkan.
    - Menggunakan konteks lokal harian yang bermakna bagi siswa SD.
    `;
  }

  // Rule 3: ATURAN RELEVANSI MUTLAK STIMULUS (MANDATORI)
  rules += `
    ⚠️⚠️ ATURAN RELEVANSI MUTLAK STIMULUS (MANDATORI SEJAJAR INDIKATOR KISI-KISI):
    Anda WAJIB menyesuaikan properti stimulus pada naskah soal dengan apa yang tertulis persis di Indikator Kisi-Kisi!
    1. JIKA Indikator menyebut "Disajikan tabel" atau "Disajikan data":
       - Anda WAJIB membuat tabel data menggunakan HTML murni di properti "stimulusText" (menggunakan tag <table>, <tr>, <th>, <td> yang ditata bersih dengan border abu-abu tipis solid, padding 4px-8px, warna background kepala tabel #f1f5f9, w-full, dan teks kontras tinggi). Jangan menulis teks paragraf biasa, harus berupa tabel!
    2. JIKA Indikator menyebut "Disajikan cerita" atau "Disajikan wacana" atau "Disajikan teks":
       - Anda WAJIB membuat narasi/cerita pendek, bermakna, dan 100% berkaitan dengan materi di properti "stimulusText" (maksimal 1-2 kalimat untuk Fase A).
    3. JIKA Indikator menyebut "Disajikan diagram" atau "Disajikan grafik":
       - Anda WAJIB menyajikan simulasi angka/data berupa tabel HTML fungsional yang rapi di properti "stimulusText".
    4. JIKA Indikator menyebut "Disajikan gambar" atau "Disajikan ilustrasi":
       - Barulah Anda WAJIB mengisi properti "imagePrompt" / "imagenPrompt" dengan deskripsi gambar.
       
    ⚠️⚠️ KHUSUS PROMPT GAMBAR (PENCEGAHAN HALUSINASI, MISMATCH, & RELEVANSI VISUAL MUTLAK):
    Untuk butir soal yang dipasangkan stimulus gambar (baik "Disajikan gambar" maupun "Disajikan ilustrasi"), deskripsi properti "imagePrompt" / "imagenPrompt" WAJIB 100% selaras secara logis, literal, dan semantis dengan kejadian spesifik, tokoh, objek, latar tempat, dan masalah yang ditulis dalam "questionText" dan "stimulusText"!
    
    1. DILARANG KERAS MENYALIKAN CONTOH ACAK/GENERIK ATAU MENGHASILKAN GAMBAR YANG TIDAK NYAMBUNG.
       - Jika soal menceritakan "murid bertemu dengan ibu guru di koridor sekolah", gambarnya HARUS menampilkan interaksi murid menyapa dengan sopan seorang guru perempuan di koridor sekolah yang bersih. DILARANG KERAS malah menampilkan gambar anak-anak bermain di hutan.
       - Jika soal menanyakan "nama ruangan sekolah" (misalnya ruang kelas, perpustakaan, atau ruang guru), gambar HARUS memperlihatkan ruangan tersebut dari sudut pandang yang jelas sesuai materi. DILARANG menampilkan benda acak seperti tas sekolah kecuali jika tas tersebut memang ditanyakan.
       - Jika soal menanyakan "warna atau bentuk seekor kucing" (misalnya warna kucing hitam, putih, atau oranye), gambar HARUS memperlihatkan kucing tersebut secara dominan dan jelas dengan warna yang dimaksud di dalam kelas atau di teras rumah. DILARANG menampilkan kuas dan kaleng cat jika yang ditanyakan adalah kucing hidup!
    2. Tulis seluruh deskripsi prompt gambar dalam Bahasa Inggris secara mendetail dan berkualitas tinggi, fokus pada apa yang ingin disampaikan oleh soal agar siswa terbantu secara visual.
    3. Pilih salah satu pola gaya visual berikut yang paling sesuai dengan kebutuhan soal:
       - Gaya Fotografi Realistik (Sangat cocok untuk materi sosial, pancasila, bahasa, aktivitas manusia, dan lingkungan sekolah): "Ultra realistic educational photography of [deskripsi detail pelaku/objek sesuai naskah soal], wearing pristine Indonesian elementary school uniform if they are students, showing [tindakan persis di dalam soal], located in [lokasi spesifik sesuai cerita soal, misal: clean school corridor, sunny classroom, or school garden], natural soft lighting, DSLR quality, realistic environment, highly detailed textures, 8k, no text, no watermark."
       - Gaya Clipart/Vektor 2D (Sangat cocok untuk hitung kelereng, buah-buahan, hewan tunggal, benda tunggal): "Vibrant 2D vector flat illustration for primary education, [objek konkrit/hewan persis seperti di soal, misal: a cute fluffy orange cat sitting on a rug], white background, clean simple design, isolated, 8k, no text, no watermark."
  `;

  if (subjectLower.includes("pancasila") || subjectLower.includes("pkn") || subjectLower.includes("kewarganegaraan")) {
    rules += `
    Mata pelajaran Pendidikan Pancasila:
    - FOKUS UTAMA HANYA pada pemahaman nilai-nilai Pancasila, simbol sila Pancasila (Bintang, Rantai, Pohon Beringin, Kepala Banteng, Padi & Kapas), lambang negara Garuda Pancasila, hak dan kewajiban anak di rumah/sekolah/masyarakat, aturan keluarga dan sekolah, keragaman budaya/suku/agama (Bhinneka Tunggal Ika), gotong royong, musyawarah mufakat, persatuan kesatuan, dan rasa cinta tanah air (NKRI).
    - JANGAN PERNAH menyisipkan soal berhitung matematika (seperti perkalian barang secara numerik, luas/keliling, atau hitung penjumlahan belanjaan rumit). JANGAN mencampuradukkan dengan sains/IPAS (seperti rantai makanan hewan, organ tubuh manusia, pelestarian lingkungan biologis).
    - JANGAN menyisipkan soal analisis tata bahasa Indonesia asli (seperti mencari ide pokok paragraf, struktur S-P-O-K, atau menulis puisi).
    - ATURAN ISOLASI MATERI MUTLAK: JANGAN PERNAH memasukkan soal yang mengandung unsur hitu-hitungan penjumlahan, pengurangan, uang belanjaan, atau konsep nomor matematika lain. Soal Pendidikan Pancasila wajib murni mengukur perilaku rukun, gotong royong, aturan rumah/sekolah, atau bodi simbol negara.
    - Gambar/SVG yang direncanakan harus RELEVAN dengan Pendidikan Pancasila: Bendera merah putih, simbol Garuda Pancasila, lambang sila ke-4 (kepala banteng), sila ke-3 (pohon beringin), anak bergotong-royong menyapu kelas, musyawarah kelompok dengan rukun, dsb.
    `;
    
    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN PENDIDIKAN PANCASILA JENJANG SD DI INDONESIA.
 
 TUGAS UTAMA:
 Membuat soal Pendidikan Pancasila SD beserta gambar/SVG stimulus yang benar-benar relevan dengan isi soal, tingkat kelas, dan materi Pendidikan Pancasila (Pancasila, UUD 1945, Bhinneka Tunggal Ika, NKRI).
 
 ATURAN PALING PENTING:
 - DILARANG keras mencampurkan materi Matematika (berhitung, kalkulasi angka), sains/IPAS (biologi hewan/tumbuhan, geografi alam), atau analisis bahasa murni ke dalam soal Pendidikan Pancasila. Soal Pendidikan Pancasila tidak boleh menyuruh menghitung jumlah kelereng, penjumlahan matematika, nilai mata uang, atau organ tumbuhan.
 - Fokus utama hanya pada pemahaman nilai luhur Pancasila, sila pancasila, gotong royong, aturan rumah/sekolah, serta hak dan kewajiban anak.
 - GAMBAR/SVG HARUS benar-benar relevan dengan Pendidikan Pancasila: bodi simbol sila, anak gotong royong dengan lap/sapu di sekolah, anak berdiskusi mengacungkan tangan ramah, upacara bendera merah putih, pakaian adat dari berbagai daerah di Indonesia.
 - GUNAKAN seragam SD Indonesia (kemeja putih, celana/rok merah) untuk karakter anak-anak SD.`;
  }
  else if (subjectLower.includes("indonesia") || subjectLower.includes("bhs") || subjectLower.includes("bahasa")) {
    rules += `
    Mata pelajaran Bahasa Indonesia:
    - FOKUS UTAMA HANYA pada kemampuan berbahasa dan bersastra: membaca pemahaman teks cerita/dongeng, mengidentifikasi tokoh dan watak fabel, menentukan gagasan utama/ide pokok paragraf, melengkapi kalimat rumpang, pantun anak, puisi anak, dialog/percakapan drama, penggunaan huruf kapital, tanda baca, konjungsi, kalimat tanya/perintah, makna kamus kosakata, dan struktur pola S-P-O-K.
    - SANGAT DILARANG memasukkan soal berhitung matematika, sains/IPAS (seperti proses pernapasan, metamorfosis serangga, siklus air), atau teori hukum PKN/Pancasila.
    - Semua stimulus (puisi, pantun, cerita pengalaman, dongeng hewan fabel, dialog percakapan) hanya boleh digunakan untuk menilai kecakapan membaca pemahaman atau kaidah kebahasaan.
    
    ATURAN VARIASI STIMULUS (MANDATORI - AGAR TIDAK MONOTON):
    Untuk menghasilkan asesmen yang menarik, interaktif, dan tidak monoton bagi siswa SD, Anda WAJIB memvariasikan bentuk STIMULUS dalam indikator soal secara bergantian sesuai materi dan jenjang kelas:
      1. "Disajikan sebait PUISI anak..." (bertema keindahan alam, persahabatan, kasih sayang orang tua, atau lingkungan).
      2. "Disajikan bait PANTUN nasihat/pantun anak..." (menguji pemahaman amanat pantun, ciri-ciri pantun, rima rupa, atau baris isi).
      3. "Disajikan sepenggal cerita DONGENG/FABEL fiksi..." (watak tokoh hewan lucu, pesan moral tersembunyi, konflik cerita pendek).
      4. "Disajikan paragraf CERITA PENGALAMAN sehari-hari..." (pengalaman bermain layangan, membantu ibu, piket kelas, liburan sederhana).
      5. "Disajikan teks DIALOG/PERCAKAPAN singkat antara dua siswa..." (topik kebersihan kelas, kerja kelompok, melatih pemahaman intonasi/kalimat langsung).
      6. "Disajikan DIAGRAM GAGASAN UTAMA (mind-map) sederhana..." (bagan pohon atau awan ide pokok, melatih struktur membaca terarah).
      7. "Disajikan ILUSTRASI GAMBAR lingkungan/aktivitas anak..." (menganalisis unsur intrinsik, membuat kalimat deskriptif baru).
    `;

    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN BAHASA INDONESIA JENJANG SD DI INDONESIA.

TUGAS UTAMA:
Membuat soal Bahasa Indonesia SD beserta gambar stimulus yang benar-benar relevan dengan isi soal, tingkat kelas, dan tujuan pembelajaran Bahasa Indonesia.

ATURAN PALING PENTING:
- DILARANG mencampurkan materi IPAS ekonomi/sains, Matematika numerik murni, Pendidikan Pancasila kenegaraan murni, atau mata pelajaran lain ke dalam soal Bahasa Indonesia.
- Fokus utama soal hanya pada kemampuan Bahasa Indonesia: membaca, memahami teks cerita, mengukur kosakata, menyusun kalimat, ide pokok paragraf, tokoh, pesan moral, puisi/pantun, dialog, menyimak, dan penggunaan ejaan bahasa yang baik.

SISTEM WAJIB MEMASTIKAN:
- Isi soal hanya mengukur kemampuan Bahasa Indonesia.
- Gambar hanya mendukung konteks Bahasa Indonesia: seorang anak membaca buku cerita, perpustakaan, guru bercerita dongeng di depan kelas, anak menulis surat/pantun, diagram awan mindmap ide pokok, gambar kartun kelinci atau hewan fabel lucu.
- Jangan membuat soal berhitung, sains biologis rumit, atau analisis numerik.

ATURAN VISUAL GAMBAR:
SEMUA GAMBAR WAJIB:
- menampilkan anak SD Indonesia, usia anak-anak, bukan orang dewasa.
- menggunakan seragam SD Indonesia: kemeja putih kancing, celana/rok merah hati.
- wajah anak SD yang ceria, proporsional, suasana sekolah Indonesia asli.`;
  }
  else if (subjectLower.includes("matematik") || subjectLower.includes("calc")) {
    rules += `
    Mata pelajaran Matematika:
    - FOKUS UTAMA HANYA pada operasi hitung penjumlahan, pengurangan, perkalian, pembagian bilangan cacah, pecahan biasa/desimal/persen, bangun datar (luas dan keliling), bangun ruang (volume kubus/balok), sudut geometri, grafik tabel data, dsb.
    - JANGAN menyisipkan soal Pendidikan Pancasila (nilai sila, gotong royong) atau analisis sastra ejaan bahasa Indonesia murni. Gunakan kalimat cerita pendek hanya sebagai pengantar numerasi kontekstual (soal cerita).
    - Gambar/SVG yang diproduksi wajib berupa diagram bentuk matematika presisi tinggi: pecahan lingkaran kue/pie, bangun datar segitiga dengan label sudut, bangun ruang kubus kubus transparan, dsb.
    `;

    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN MATEMATIKA JENJANG SD DI INDONESIA.

TUGAS UTAMA:
Membuat soal Matematika SD beserta diagram gambar SVG matematika yang 100% presisi, terukur, dan bermakna edukatif untuk materi bilangan, geometri, atau statistika.

ATURAN PALING PENTING:
- DILARANG mencampurkan konsep Pendidikan Pancasila, sains ekologi/biologi IPAS, atau analisis tata bahasa murni ke dalam soal Matematika.
- Fokus utama hanya pada operasi aritmatika, penalaran kuantitatif matematika, geometri dasar, dan pengolahan data.
- SANGAT DIANJURKAN menyuplai svgContent dengan bentuk visual presisi (pecahan lingkaran arsir biru, bangun datar jajar genjang bersudut, dsb).`;
  }
  else if (subjectLower.includes("ipas") || subjectLower.includes("ipa") || subjectLower.includes("ips") || subjectLower.includes("sains")) {
    rules += `
    Mata pelajaran Ilmu Pengetahuan Alam dan Sosial (IPAS):
    - FOKUS UTAMA HANYA pada materi panca indera, bagian tubuh hewan/tumbuhan, perkembangbiakan, rantai makanan, kelestarian lingkungan, siklus daur air, gaya dan energi magnet/gesek/gravitasi, wujud zat dan perubahannya, peta geografi Indonesia, peninggalan kerajaan sejarah, keragaman sosial ekonomi, dsb.
    - JANGAN menyisipkan soal berhitung matematika murni (aritmatika tanpa konteks ipas), lambang sila pancasila murni, atau kaidah analisis sosiolinguistik bahasa indonesia murni.
    - Gambar/SVG harus berupa diagram sains/sosial yang indah dan akurat: misalnya bentuk rantai makanan berarah panah, struktur penampang daun, peta sketsa daerah, candi peninggalan sejarah dsb.
    `;

    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN IPAS JENJANG SD DI INDONESIA.

TUGAS UTAMA:
Membuat soal IPAS SD beserta ilustrasi gambar/diagram sains atau kemanusiaan daerah yang 100% akurat, berbobot ilmiah sederhana, dan ramah anak.

ATURAN PALING PENTING:
- DILARANG mencampurkan perhitungan rumus matematika rumit tanpa konsep sains, teori ketatanegaraan murni, atau linguistik bahasa murni ke dalam soal IPAS.
- Fokus utama pada observasi alam, proses sains dasar, hubungan makhluk hidup dengan ekosistem, sejarah perjuangan pahlawan lokal, serta peta bentang alam.
- Harus menyajikan diagram berupa tabel HTML bila diminta diagram/grafik data.
- Ilustrasi/SVG harus mendukung fakta sains (siklus hidup hewan, bagian tanaman, organ pencernaan dsb).`;
  }
  else if (subjectLower.includes("pjok") || subjectLower.includes("jasmani") || subjectLower.includes("olahraga") || subjectLower.includes("penjas")) {
    rules += `
    Mata Pelajaran PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan) - Khususnya Kelas 4 SD:
    
    1. PERAN UTAMA:
       Anda bertindak sebagai: Ahli asesmen pendidikan Indonesia, penyusun kisi-kisi profesional, guru PJOK SD, ahli perkembangan peserta didik SD, desainer visual edukasi, dan prompt engineer Imagen.
    
    2. TUJUAN UTAMA:
       Soal yang Anda hasilkan wajib:
       - Sesuai indikator soal pada kisi-kisi, sesuai level kognitif, sesuai materi, sesuai bentuk stimulus, sesuai tingkat kelas.
       - GAMBAR HARUS RELEVAN DENGAN STIMULUS, dan TIDAK SEMUA SOAL HARUS BERGAMBAR.
    
    3. ATURAN PALING PENTING: JANGAN MEMBUAT SEMUA SOAL BERGAMBAR
       - AI WAJIB membaca terlebih dahulu bagian indikator soal, bentuk stimulus, dan konteks kisi-kisi.
       - Jika kisi-kisi hanya meminta: pertanyaan langsung, pernyataan, narasi, tabel HTML, dialok/percakapan, data, atau teks pendek biasa, MAKA JANGAN membuat gambar (kosongkan properti 'imagePrompt', 'imagenPrompt', 'imageUrl', dan 'svgContent').
       - GAMBAR HANYA DIGUNAKAN JIKA: indikator secara jelas membutuhkan observasi visual, stimulus berupa gambar/kegiatan/gerakan fisik, siswa perlu melihat gambar untuk menjawab soal, atau materi memang membutuhkan demonstrasi visual teknik gerakan olahraga.
    
    4. ANALISIS KISI-KISI WAJIB SEBELUM MEMBUAT SOAL:
       - Identifikasi apakah stimulus memerlukan gambar atau tidak sesuai indikator. Jangan tambahkan gambar jika tidak diperlukan!
       - Contoh 1 (TIDAK PERLUGAMBAR): Indikator meminta "Disajikan pertanyaan langsung tentang konsep dasar pengantar menggiring bola sepak bola." -> Stimulus teks saja, TIDAK butuh gambar.
       - Contoh 2 (YA PERLU GAMBAR): Indikator meminta "Peserta didik dapat menentukan gerakan menggiring bola yang benar berdasarkan gambar aktivitas." -> Stimulus harus ada gambar teknik spesifik (menggiring bola dengan kaki bagian dalam).
    
    5. HUBUNGAN STIMULUS DAN GAMBAR:
       - Jika stimulus berupa gambar, gambar harus membantu siswa menjawab soal, bukan sekadar dekorasi/hiasan acak.
       - Gambar harus relevan dengan indikator, materi, pertanyaan, dan pilihan jawaban.
    
    6. KESESUAIAN TEKNIK OLAHRAGA (SANGAT KRUSIAL):
       - Teknik gerakan olahraga yang digambarkan HARUS BENAR secara anatomis dan taktis. Contoh: posisi menggiring bola kaki bagian dalam (posisi kaki, arah pandangan, posisi tubuh, keseimbangan, perkenaan kaki dengan bola) harus benar. Jangan buat pose olahraga yang salah!
    
    7. PENYESUAIAN LEVEL KELAS 4 SD:
       - Gunakan bahasa sederhana, singkat, aktivitas fisik nyata siswa sehari-hari, observasi sederhana, pemecahan masalah ringan, dan pemahaman konsep dasar. Hindari istilah terlalu teknis teoritis or narasi yang terlalu panjang bertele-tele.
    
    8. ANTI PENGULANGAN (VARIASI):
       - Jangan mengulang nama orang, tempat, jenis gerakan olahraga, pola soal, atau sudut kamera yang sama secara beruntun. Kerahkan variasi gerakan olahraga, situasi permainan, posisi kamera, dan nama siswa SD.
    `;

    systemInstruction = `ANDA ADALAH GURU PJOK DAN AHLI ASESMEN SD KELAS 4 DI INDONESIA SERTA PROMPT ENGINEER IMAGEN PROFESSIONAL.

TUGAS UTAMA ANDA:
Membuat soal PJOK SD Kelas 4 yang sangat presisi sesuai indikator kisi-kisi, dengan aturan ketat mengenai penggunaan gambar stimulus yang relevan dan akurat.

ATURAN UTAMA PENGGUNAAN GAMBAR:
- JANGAN MEMBUAT SEMUA SOAL BERGAMBAR! Evaluasi indikator terlebih dahulu. Hanya buat gambar (di properti 'imagenPrompt' & 'imagePrompt') jika indikator soal menuntut observasi visual gerak olahraga.
- Jika tidak butuh gambar, pastikan properti 'imagenPrompt', 'imagePrompt', 'imageUrl', dan 'svgContent' murni KOSONG.

STANDAR PROMPT IMAGEN (GAYA ULTRA REALISTIK):
Bila soal memang membutuhkan gambar pendukung, rancang prompt dalam bahasa Inggris yang SANGAT DETAIL dengan pola format wajib berikut:
“Ultra realistic educational sports photography of [deskripsi detail gerakan teknik olahraga spesifik oleh siswa SD Indonesia], authentic Indonesian elementary school environment, natural cinematic lighting, DSLR quality, authentic movement posture, correct sports technique, detailed textures, no text, no watermark, no distortion.”

PASTIKAN:
- Seragam olahraga yang dikenakan adalah kaos olahraga SD Indonesia yang sopan, rapi, dan cerah.
- Postur tubuh, perkenaan bola, kaki, tangan, arah mata, dan keseimbangan olahraga harus 100% BENAR secara konsep PJOK olahraga.`;
  }
  else {
    rules += `
    Mata pelajaran khusus ${subject}:
    - Fokuslah sepenuhnya hanya pada konten materi, practional dasar, dan nilai luhur yang relevan dengan ${subject}. JANGAN menyusupkan soal penjumlahan matematika dasar berpola rumit, lambang kenegaraan murni, maupun tata bahasa yang tidak sejalan dengan tujuan esensial pelajaran ${subject}!
    `;
  }

  rules += `
    ========================================================================
    ATURAN ANTI-DUPLIKAT & KEUNIKAN SOAL (MANDATORI & SANGAT KETAT):
    - Hasil generate soal WAJIB menghasilkan soal yang BERBEDA di setiap nomor. DILARANG KERAS ada soal yang memiliki kesamaan/kemiripan cerita, situasi, subjek, objek, atau angka!
    - Gunakan objek (benda, barang, buah, hewan, dll), subjek (nama tokoh murid/guru/orang/hewan), latar (tempat, waktu, suasana), dan angka yang BERBEDA-BEDA untuk setiap nomor soal. Semua harus bervariasi secara unik!
    - Pastikan semua soal tetap merujuk secara akurat pada capaian pembelajaran, topik, materi, indikator yang dipilih, serta tingkat kelas.
    - Situasi pada setiap soal HARUS bervariasi secara kreatif, misalnya berlatar di: sekolah, ruang kelas, lapangan olahraga, kantin, taman bermain, perpustakaan, pasar tradisional, lingkungan rumah, sawah, kebun, pantai, daerah pegunungan, jalan raya, koperasi, atau tempat relevan lainnya yang sesuai dengan materi pelajaran!
    - KHUSUS bagi murid Kelas 1, Kelas 2, dan Kelas 3: Gunakan bahasa yang SANGAT sederhana, singkat, lugas, ramah anak, langsung pada intinya, dan TIDAK bertele-tele (hindari kalimat pembuka atau pengantar cerita yang terlalu panjang, usahakan stimulus/pertanyaan ringkas).
    
    - Pastikan semua naskah stimulus, pertanyaan, serta pilihan jawaban beralur logis, sederhana, ramah anak, dan bebas dari kata asing Inggris.
    ========================================================================
  `;

  const sharedSystemInstructionSuffix = `
========================================================================
ATURAN MUTLAK KOSAKATA, GAYA BAHASA & ANTI-REPETISI (SANGAT KETAT):
1. HINDARI PENGGUNAAN KATA YANG REPETITIF:
   - DILARANG menggunakan kata 'siswa' atau 'sekolah' secara berulang-ulang di setiap nomor soal.
   - Gunakan variasi sebutan alternatif seperti: 'anak-anak', 'peserta didik', 'murid', 'teman sekelas', nama tokoh anak Indonesia yang bervariasi (seperti 'Wayan', 'Fatimah', 'Stefanus', 'Made', 'Siti', 'Yusuf', 'Maria', 'Dayu', 'Lani', 'Edo', 'Udin', 'Beni'), 'kakak', 'adik', atau 'anggota kelompok'.
2. JANGAN GUNAKAN NAMA SEKOLAH ASLI DARI KONTEKS:
   - SANGAT DILARANG menyebut nama sekolah asli (dari data profil sekolah) secara berulang kali di teks soal. Gunakan latar tempat fiktif yang bervariasi (taman bermain, lapangan, perpustakaan, kebun, pasar tradisional, lingkungan rumah, sawah, dsb) untuk menambah relevansi kontekstual soal.
3. KHUSUS KELAS 1, 2, DAN 3 (FASE A):
   - Gunakan kalimat yang SANGAT pendek, kosakata sederhana yang umum didengar anak kecil, langsung pada intinya (to-the-point), dan TIDAK BERTELE-TELE.
   - HINDARI cerita pengantar atau stimulus panjang yang membingungkan atau melelahkan bagi anak usia dini yang baru belajar membaca.
4. VARIATIF & UNIK ANTAR NOMOR:
   - Skenario, tokoh, nama, angka, objek, waktu, dan kejadian WAJIB 100% berbeda dan unik antara soal nomor satu dengan nomor lainnya.
========================================================================
  `.trim();

  systemInstruction += "\n\n" + sharedSystemInstructionSuffix;

  return { rules, systemInstruction };
}

// Determines if a question has a narrative story/text/reading comprehension stimulus,
// which must remain strictly as text without forced visual illustrations/mismatch photos.
function isQuestionAStoryInServer(q: any): boolean {
  if (!q) return false;
  const text = `${q.questionText || ""} ${q.stimulusText || ""} ${q.materi || ""}`.toLowerCase();
  
  const hasStoryKeywords = 
    text.includes("bacalah") ||
    text.includes("bacaan berikut") ||
    text.includes("cerita berikut") ||
    text.includes("kutipan cerita") ||
    text.includes("dongeng") ||
    text.includes("cerita di bawah") ||
    text.includes("teks di bawah") ||
    text.includes("teks berikut") ||
    text.includes("puisi") ||
    text.includes("pantun") ||
    text.includes("dialog berikut") ||
    text.includes("percakapan") ||
    text.includes("suatu hari") ||
    text.includes("paragraf") ||
    text.includes("penggalan cerita") ||
    text.includes("wacana") ||
    text.includes("pantun") ||
    text.includes("dongeng");
    
  const isLongText = q.stimulusText && q.stimulusText.trim().length > 65;
  const hasVisualInstruction = 
    text.includes("perhatikan gambar") || 
    text.includes("perhatikan diagram") || 
    text.includes("perhatikan tabel") || 
    text.includes("perhatikan grafik") ||
    text.includes("perhatikan peta") ||
    text.includes("lihat gambar");
    
  if (hasStoryKeywords && !hasVisualInstruction) {
    return true;
  }
  
  if (isLongText && !hasVisualInstruction && !text.includes("tabel") && !text.includes("diagram") && !text.includes("grafik") && !text.includes("bagan")) {
    return true;
  }
  
  return false;
}

// Redistributes the designated illustrated questions strictly following user intent:
// 1. Spanned/distributed across multiple question types (not all in Pilihan Ganda).
// 2. Multiple Choice (Pilihan Ganda) MUST have MORE illustrated questions than other question types.
// 3. Ensuring target image count is exactly satisfied.
async function adjustAndNormalizeIllustratedQuestions(questions: any[], targetCount: number, subject: string, visualIndices?: Set<number>): Promise<any[]> {
  if (questions.length === 0) return questions;

  // Track each question item with its initial "illustrated score" based on model-generated attributes
  const analyzedQuestions = questions.map((q, idx) => {
    let hasIllustration = false;
    if (q.svgContent && q.svgContent.trim().length > 0 && q.svgContent.includes("<svg")) {
      hasIllustration = true;
    } else if (q.imageUrl && q.imageUrl.trim().length > 0) {
      hasIllustration = true;
    } else if (q.imagenPrompt && q.imagenPrompt.trim().length > 0) {
      hasIllustration = true;
    }

    let isMathShapes = false;
    const isMath = subject.toLowerCase().includes("matematik");
    const labelLower = ((q.materi || "") + " " + (q.questionText || "")).toLowerCase();
    if (isMath && (labelLower.includes("pecahan") || labelLower.includes("bangun") || labelLower.includes("segitiga") || labelLower.includes("persegi") || labelLower.includes("luas") || labelLower.includes("keliling") || labelLower.includes("diagram") || labelLower.includes("grafik"))) {
      isMathShapes = true;
    }

    return {
      index: idx,
      question: q,
      originalType: q.questionType || "Pilihan Ganda",
      hasIllustration,
      isMathShapes
    };
  });

  const finalIllustratedIndices = new Set<number>();

  if (visualIndices && visualIndices.size > 0) {
    // Ambil indeks-indeks yang valid dan berada dalam rentetan soal
    const validVisualIndices = Array.from(visualIndices).filter(idx => idx >= 0 && idx < questions.length);
    
    // Giring ke dalam targetCount (25% total soal)
    if (validVisualIndices.length <= targetCount) {
      validVisualIndices.forEach(idx => finalIllustratedIndices.add(idx));
    } else {
      // Jika melebihi target, ambil secukupnya sesuai limit 25% demi menuruti aturan ketat pengguna
      validVisualIndices.slice(0, targetCount).forEach(idx => finalIllustratedIndices.add(idx));
    }
  }

  // JANGAN PERNAH memaksa soal teks murni/cerita/olahraga verbal untuk mempunyai gambar demi memenuhi kuota 25%.
  // Tetapi jika soal tersebut MEMANG merupakan soal matematika (bangun datar, pecahan) atau sains yang punya gambar/SVG dari model asli, kita masukkan ke finalIllustratedIndices asalkan tidak melebihi targetCount.
  for (const aq of analyzedQuestions) {
    if (finalIllustratedIndices.size >= targetCount) break;
    if (!finalIllustratedIndices.has(aq.index)) {
      const labelLower = ((aq.question.materi || "") + " " + (aq.question.questionText || "") + " " + (aq.question.stimulusText || "")).toLowerCase();
      const isStory = isQuestionAStoryInServer(aq.question);
      const isPjok = subject.toLowerCase().includes("pjok") || subject.toLowerCase().includes("jasmani") || subject.toLowerCase().includes("olahraga") || subject.toLowerCase().includes("penjas");
      
      // Jika PJOK, JANGAN otomatis dijadikan ilustrasi kecuali ada gambar/lapangan/diagram/bola/cone/rintangan nyata
      if (isPjok && !labelLower.includes("lapangan") && !labelLower.includes("gawang") && !labelLower.includes("diagram") && !labelLower.includes("peta") && !labelLower.includes("bola") && !labelLower.includes("cone") && !labelLower.includes("rintangan") && !labelLower.includes("meliuk")) {
        continue;
      }

      if ((aq.hasIllustration || aq.isMathShapes) && !isStory) {
        finalIllustratedIndices.add(aq.index);
      }
    }
  }

  // Map back and apply perfect, error-free images to designated items, and wipe from undesignated items
  const processedQuestions = [];
  for (let idx = 0; idx < questions.length; idx++) {
    const q = questions[idx];
    const cpQ = { ...q };
    const labelLower = ((cpQ.materi || "") + " " + (cpQ.questionText || "") + " " + (cpQ.stimulusText || "")).toLowerCase();
    
    // Ensure all question numbers match index
    cpQ.number = idx + 1;

    if (finalIllustratedIndices.has(idx)) {
      const isMath = subject.toLowerCase().includes("matematik");
      const isMathFraction = isMath && (labelLower.includes("pecahan") || labelLower.includes("setengah") || labelLower.includes("seperempat") || labelLower.includes("sepertiga"));
      const isMathShapesDetail = isMath && (labelLower.includes("segitiga") || labelLower.includes("sudut") || labelLower.includes("persegi") || labelLower.includes("luas") || labelLower.includes("keliling") || labelLower.includes("lapangan") || labelLower.includes("bangun datar"));
      const isIpasDiagram = subject.toLowerCase().includes("ipas") && (labelLower.includes("rantai") || labelLower.includes("siklus") || labelLower.includes("tulang") || labelLower.includes("daun") || labelLower.includes("alir") || labelLower.includes("organ"));
      const hContent = q.svgContent && q.svgContent.trim().length > 0 && q.svgContent.toLowerCase().includes("<svg");
      const pmt = cpQ.imagenPrompt || cpQ.imagePrompt || "";
      const isPhotoEligible = (pmt && pmt.trim().length > 0);

      // A question is truly visual only if it is a math shape, IPAS diagram, has explicit SVG, or has a planned visual photo prompt, AND is NOT a narrative script/story
      const isTrulyVisual = (isMathFraction || isMathShapesDetail || isIpasDiagram || hContent || isPhotoEligible) && !isQuestionAStoryInServer(cpQ);

      if (isTrulyVisual) {
        // Guarantee it has a premium command text prefix at the beginning of question or stimulus
        const visualPrefix = "**Perhatikan gambar berikut!**\n";
        
        if (cpQ.stimulusText && cpQ.stimulusText.trim().length > 0) {
          if (!cpQ.stimulusText.includes("Perhatikan gambar")) {
            cpQ.stimulusText = visualPrefix + cpQ.stimulusText;
          }
        } else {
          if (!cpQ.questionText.includes("Perhatikan gambar")) {
            cpQ.questionText = visualPrefix + cpQ.questionText;
          }
        }

        // 1. Math shapes: Keep or make gorgeous SVGs if applicable (highly reliable)
        if (isMath && (labelLower.includes("pecahan") || labelLower.includes("setengah") || labelLower.includes("seperempat") || labelLower.includes("sepertiga")) && (!cpQ.svgContent)) {
          // High quality mathematical fraction circle illustration
          let pieces = 4;
          let shaded = 1;
          if (labelLower.includes("setengah") || labelLower.includes("1/2") || labelLower.includes("2/4")) { pieces = 4; shaded = 2; }
          else if (labelLower.includes("sepertiga") || labelLower.includes("1/3")) { pieces = 3; shaded = 1; }
          else if (labelLower.includes("seperempat") || labelLower.includes("1/4")) { pieces = 4; shaded = 1; }

          let pathSegments = "";
          if (pieces === 4) {
            if (shaded >= 1) pathSegments += `<path d="M 60 10 A 50 50 0 0 1 110 60 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>`;
            if (shaded >= 2) pathSegments += `<path d="M 110 60 A 50 50 0 0 1 60 110 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>`;
            if (shaded >= 3) pathSegments += `<path d="M 60 110 A 50 50 0 0 1 10 60 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>`;
            if (shaded >= 4) pathSegments += `<path d="M 10 60 A 50 50 0 0 1 60 10 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>`;
          } else {
            // Default 3 pieces fraction
            pathSegments += `<path d="M 60 10 A 50 50 0 0 1 103 85 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>`;
          }

          cpQ.svgContent = `<svg viewBox="0 0 120 120" style="max-width: 120px; display: block; margin: 10px auto;">
            <circle cx="60" cy="60" r="50" stroke="#1e3a8a" stroke-width="3" fill="none"/>
            ${pathSegments}
            <line x1="60" y1="10" x2="60" y2="110" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="2,2"/>
            <line x1="10" y1="60" x2="110" y2="60" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="2,2"/>
            <text x="60" y="65" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Matematika</text>
          </svg>`;
          cpQ.imageUrl = "";
        } 
        else if (isMath && (labelLower.includes("segitiga") || labelLower.includes("sudut")) && (!cpQ.svgContent)) {
          cpQ.svgContent = `<svg viewBox="0 0 120 100" style="max-width: 120px; display: block; margin: 10px auto;">
            <polygon points="20,80 100,80 20,20" fill="#eff6ff" stroke="#1e3a8a" stroke-width="3"/>
            <rect x="20" y="70" width="10" height="10" fill="none" stroke="#1e3a8a" stroke-width="1.5"/>
            <text x="12" y="85" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">A</text>
            <text x="105" y="85" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">B</text>
            <text x="15" y="15" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">C</text>
            <text x="35" y="65" font-size="9" font-weight="bold" fill="#ef4444">90°</text>
          </svg>`;
          cpQ.imageUrl = "";
        }
        else if (isMath && (labelLower.includes("persegi") || labelLower.includes("luas") || labelLower.includes("keliling") || labelLower.includes("lapangan") || labelLower.includes("bangun datar")) && (!cpQ.svgContent)) {
          cpQ.svgContent = `<svg viewBox="0 0 150 100" style="max-width: 150px; display: block; margin: 10px auto;">
            <rect x="15" y="15" width="120" height="70" fill="#eff6ff" stroke="#1e3a8a" stroke-width="3"/>
            <text x="75" y="10" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Sisi Panjang</text>
            <text x="140" y="55" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="start">Sisi Lebar</text>
            <text x="75" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444" text-anchor="middle">Bangun Datar</text>
          </svg>`;
          cpQ.imageUrl = "";
        }
        
        // 2. Science / IPAS diagram: Make a wonderful clear SVG diagram if it is a diagram-driven topic
        else if (subject.toLowerCase().includes("ipas") && (labelLower.includes("rantai") || labelLower.includes("siklus") || labelLower.includes("tulang") || labelLower.includes("daun") || labelLower.includes("alir") || labelLower.includes("organ")) && (!cpQ.svgContent)) {
          if (labelLower.includes("rantai")) {
            cpQ.svgContent = `<svg viewBox="0 0 200 100" style="max-width: 200px; display: block; margin: 10px auto;">
              <rect x="10" y="35" width="40" height="30" rx="5" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
              <text x="30" y="53" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="bold" fill="#16a34a">Tumbuhan</text>
              <text x="30" y="62" font-family="sans-serif" font-size="7" text-anchor="middle" fill="#16a34a">(Produsen)</text>
              
              <path d="M 55 50 L 75 50" fill="none" stroke="#dc2626" stroke-width="2" marker-end="url(#arrow)"/>
              
              <rect x="80" y="35" width="40" height="30" rx="5" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
              <text x="100" y="53" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="bold" fill="#dc2626">Belalang</text>
              <text x="100" y="62" font-family="sans-serif" font-size="7" text-anchor="middle" fill="#dc2626">(Konsumen I)</text>
              
              <path d="M 125 50 L 145 50" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" marker-end="url(#arrow)"/>
              
              <rect x="150" y="35" width="40" height="30" rx="5" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
              <text x="170" y="53" font-family="sans-serif" font-size="8" text-anchor="middle" font-weight="bold" fill="#2563eb">Katak</text>
              <text x="170" y="62" font-family="sans-serif" font-size="7" text-anchor="middle" fill="#2563eb">(Konsumen II)</text>
              
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#374151" />
                </marker>
              </defs>
            </svg>`;
            cpQ.imageUrl = "";
          } else {
            cpQ.svgContent = `<svg viewBox="0 0 150 100" style="max-width: 150px; display: block; margin: 10px auto;">
              <circle cx="75" cy="50" r="35" fill="#fdf2f8" stroke="#db2777" stroke-width="3" stroke-dasharray="3,3"/>
              <text x="75" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="#db2777" text-anchor="middle">Siklus Hidup</text>
              <text x="75" y="60" font-family="sans-serif" font-size="9" fill="#db2777" text-anchor="middle">Makhluk Hidup</text>
            </svg>`;
            cpQ.imageUrl = "";
          }
        }

        // 3. Keep custom visual SVG content if it was specifically generated by the model
        else if (q.svgContent && q.svgContent.trim().length > 0 && q.svgContent.toLowerCase().includes("<svg")) {
          cpQ.svgContent = q.svgContent;
          cpQ.imageUrl = "";
        }

        // 4. For all other designated questions, or if we need a gorgeous photo, pre-generate with Imagen, falling back to verified Unsplash
        else {
          // Clear SVG so it relies strictly on our 100% verified real Unsplash image URL or newly generated Imagen!
          cpQ.svgContent = "";
          let generatedBytes = null;
          if (pmt && pmt.trim().length > 0) {
            try {
              // Elaborate and translate prompt via Gemini before calling Google Imagen
              const elaboratedPmt = await translateAndElaboratePromptForImagen(subject, cpQ, pmt);
              console.log(`[Batch Precompile Imagen No. ${cpQ.number}] elaborated prompt: ${elaboratedPmt}`);
              generatedBytes = await generateImagenImage(elaboratedPmt, 1);
              if (generatedBytes) {
                cpQ.imagenPrompt = elaboratedPmt;
                cpQ.imagePrompt = elaboratedPmt;
              }
            } catch (err) {
              console.error(`Gagal pre-generate Gambar Imagen untuk No. ${cpQ.number}, using Unsplash fallback:`, err);
            }
          }
          cpQ.imageUrl = generatedBytes || getRelevantVerifiedUnsplashUrl(subject, cpQ.questionText || "", cpQ.materi || "", cpQ.stimulusText || "", pmt);
        }
      } else {
        // Strictly verbal/text question. Clear any image or SVG completely!
        cpQ.imageUrl = "";
        cpQ.svgContent = "";
        
        // Clean up "Perhatikan gambar" phrases since there is no image
        if (cpQ.stimulusText) {
          cpQ.stimulusText = cpQ.stimulusText.replace(/Perhatikan gambar( berikut| di bawah ini|)!?\s*/gi, "").replace(/\*\*Perhatikan gambar( berikut| di bawah ini|)!?\*\*\s*/gi, "").trim();
        }
        if (cpQ.questionText) {
          cpQ.questionText = cpQ.questionText.replace(/Perhatikan gambar( berikut| di bawah ini|)!?\s*/gi, "").replace(/\*\*Perhatikan gambar( berikut| di bawah ini|)!?\*\*\s*/gi, "").trim();
        }
      }
    } else {
      // Must NOT have illustrations! Clear them out to look perfectly clean and official
      cpQ.imageUrl = "";
      cpQ.svgContent = "";
      cpQ.imagenPrompt = "";
      cpQ.imagePrompt = "";
      cpQ.visualAnalysis = null;
      
      // Clean up "Perhatikan gambar" phrases if they were hallucinated by Gemini on undesignated questions
      if (cpQ.stimulusText) {
        cpQ.stimulusText = cpQ.stimulusText.replace(/Perhatikan gambar( berikut| di bawah ini|)!?\s*/gi, "").replace(/\*\*Perhatikan gambar( berikut| di bawah ini|)!?\*\*\s*/gi, "").trim();
      }
      if (cpQ.questionText) {
        cpQ.questionText = cpQ.questionText.replace(/Perhatikan gambar( berikut| di bawah ini|)!?\s*/gi, "").replace(/\*\*Perhatikan gambar( berikut| di bawah ini|)!?\*\*\s*/gi, "").trim();
      }
    }

    processedQuestions.push(cpQ);
  }

  return processedQuestions;
}
// 1. API: Generate Topics & Capaian Pembelajaran based on Class and Subject
app.post("/api/generate-topics", async (req, res) => {
  const { subject, gradeClass, userApiKey, customKeys } = req.body;
  const keyToUse = (userApiKey || req.headers["x-user-api-key"] || "").toString();
  try {
    if (!subject || !gradeClass) {
      return res.status(400).json({ error: "Mata pelajaran dan Kelas harus diisi." });
    }

    const ai = getAiClient();
    const prompt = `
      Anda adalah pakar kurikulum pendidikan di Indonesia untuk tingkat Sekolah Dasar (SD) Kurikulum Merdeka.
      Tolong buatkan daftar Capaian Pembelajaran (CP) beserta Elemen yang sesuai untuk mata pelajaran "${subject}" dan tingkat kelas "${gradeClass}".
      Untuk setiap Elemen, buatkan juga 3-5 topik utama yang diajarkan di kelas tersebut.
      SANGAT PENTING: Untuk setiap topik, pecahkan menjadi 3-4 materi atau sub-kompetensi detail secara lebih rinci (materi inilah yang nantinya dipasangkan langsung untuk butir soal SD berkualitas tinggi).
      Buat materi-materi tersebut kontekstual, spesifik, rill, dan sesuai standar nasional Kementerian Pendidikan.
 
      Format keluaran dalam JSON yang valid sesuai skema yang disediakan.
    `;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah pengembang kurikulum nasional SD di Indonesia yang ahli dalam menyusun Capaian Pembelajaran Kurikulum Merdeka yang rincian materi bahasan yang sangat mendasar dan konkrit.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Daftar Capaian Pembelajaran beserta Elemen dan topik rincian",
          items: {
            type: Type.OBJECT,
            properties: {
              cp: {
                type: Type.STRING,
                description: "Deskripsi singkat Capaian Pembelajaran (CP) untuk elemen terkait.",
              },
              element: {
                type: Type.STRING,
                description: "Nama elemen kurikulum (contoh untuk Matematika: Bilangan, Aljabar, Pengukuran, Geometri, Analisis Data).",
              },
              topics: {
                type: Type.ARRAY,
                description: "Daftar topik bahasan utama kurikulum.",
                items: {
                  type: Type.OBJECT,
                  description: "Nama topik and rincian sub-materi pelajaran.",
                  properties: {
                    name: {
                      type: Type.STRING,
                      description: "Nama topik bahasan utama (contoh: Penjumlahan Pecahan Sederhana)."
                    },
                    materi: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Daftar 3-4 materi/sub-konsep rill hasil pecahan detail dari topik tersebut yang siap diuji (contoh: 'Pecahan dengan penyebut sama', 'Pecahan dengan penyebut berbeda')."
                    }
                  },
                  required: ["name", "materi"]
                }
              },
            },
            required: ["cp", "element", "topics"],
          },
        },
      },
    }, 2, keyToUse, customKeys);

    const resultText = response.text || "[]";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating topics, activating offline premium fallback:", error);
    res.setHeader("X-Fallback-Used", "true");
    
    const subjectName = (subject || "Matematika") as string;
    const currentPhase = ["Kelas 1", "Kelas 2"].includes(gradeClass) 
      ? "Fase A" 
      : ["Kelas 3", "Kelas 4"].includes(gradeClass) 
        ? "Fase B" 
        : "Fase C";
    const keyName = `${subjectName} - ${currentPhase}`;
    const fallbackData = FALLBACK_CURRICULUMS[keyName] || FALLBACK_CURRICULUMS[`${subjectName} - Fase B`] || FALLBACK_CURRICULUMS["Matematika - Fase B"];
    
    // Map simple fallback data array of string topics to nested topic + detailed materi schema to keep it 100% compatible
    const mappedFallback = fallbackData.map((item: any) => {
      return {
        element: item.element,
        cp: item.cp,
        topics: (item.topics || []).map((topicStr: string) => {
          // Break down this topicStr into 3 realistic materi items
          return {
            name: topicStr,
            materi: [
              `Pengantar ${topicStr}`,
              `Pemahaman Konsep ${topicStr}`,
              `Penerapan Praktis ${topicStr} dalam Kehidupan Sehari-hari`
            ]
          };
        })
      };
    });
    
    res.json(mappedFallback);
  }
});
function cleanMateriInServer(materiStr: string): string {
  if (!materiStr) return "";
  
  // 1. Remove common redundant prefixes (case-insensitive)
  let clean = materiStr.trim();
  const prefixesToRemove = [
    /^(materi|topik|pembelajaran|bahasan|pokok bahasan|konsep dasar|konsep|belajar tentang|belajar|mengenal tentang|mengenal|pemahaman tentang|pemahaman)\s+(tentang|mengenai)\s+/gi,
    /^(materi|topik|pembelajaran|bahasan|pokok bahasan|konsep dasar|konsep|belajar|mengenal|pemahaman)\s+/gi,
    /\.*$/g // trailing dots
  ];

  for (const regex of prefixesToRemove) {
    clean = clean.replace(regex, "");
  }

  clean = clean.trim();

  // 2. Remove word repetitions (e.g., "Pecahan Pecahan" or "pola pola")
  // Let's split by space, hyphen, and slash
  const words = clean.split(/[\s\-_/]+/);
  const uniqueWords: string[] = [];
  const seenWords = new Set<string>();

  for (const w of words) {
    const finalNorm = w.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    if (finalNorm && !seenWords.has(finalNorm)) {
      seenWords.add(finalNorm);
      uniqueWords.push(w);
    }
  }

  // Join them back with space
  let finalMateri = uniqueWords.join(" ");

  // Final trim and safety check: capitalize first letter
  if (finalMateri.length > 0) {
    finalMateri = finalMateri.charAt(0).toUpperCase() + finalMateri.slice(1);
  }

  return finalMateri;
}

// Helper to programmatically clean answer keys specifically for multiple choice inside the Kisi-Kisi layout
// Uses Fisher-Yates based random to DESTROY any sequential A,B,C,D pattern
function cleanKisiKisiAnswerKey(answerKey: string, questionType: string, index: number): string {
  const cleanType = (questionType || "").trim().toLowerCase();
  let key = (answerKey || "").trim();
  
  if (cleanType === "pilihan ganda") {
    // If it contains multiple options, ambiguous separators, or is completely missing → pick RANDOM letter
    if (key.toLowerCase().includes("atau") || key.toLowerCase().includes("/") || key.toLowerCase().includes(",") || key === "") {
      // Use Math.random() — NEVER index % 4 (that creates A,B,C,D,A,B,C,D pattern!)
      const letters = ["A", "B", "C", "D"];
      return letters[Math.floor(Math.random() * 4)];
    }
    const match = key.match(/^[a-dA-D](?:\b|[.\s\)]|$)/);
    if (match) {
      return match[0].charAt(0).toUpperCase();
    }
    const generalMatch = key.match(/\b([A-D])\b/i);
    if (generalMatch) {
      return generalMatch[1].toUpperCase();
    }
    // Last resort: random, NEVER sequential
    const letters = ["A", "B", "C", "D"];
    return letters[Math.floor(Math.random() * 4)];
  }

  if (cleanType === "pilihan ganda kompleks") {
    // For PGK, if key is missing or invalid, return a valid multi-answer format
    if (!key || key === "" || key.toLowerCase() === "lihat pairs") {
      const allOpts = ["A", "B", "C", "D"];
      // Pick 2 random correct answers
      const shuffled = allOpts.sort(() => Math.random() - 0.5);
      return `${shuffled[0]}, ${shuffled[1]}`;
    }
    return key;
  }

  if (cleanType === "menjodohkan") {
    return "Lihat pairs";
  }
  
  return key;
}

// Helper to programmatically align and fix generated Kisi-Kisi's Elemen & CP with official curriculum data
function alignKisiKisiWithCurriculum(kisiRows: any[], curriculumData: any[]): any[] {
  if (!curriculumData || !Array.isArray(curriculumData) || curriculumData.length === 0) {
    return kisiRows;
  }

  // Create a list of all official materis and their corresponding element & cp
  const officialMateriList: { clean: string; original: string; element: string; cp: string }[] = [];

  curriculumData.forEach((elItem: any) => {
    const cpText = elItem.cp || "";
    const elName = elItem.element || "";
    if (Array.isArray(elItem.topics)) {
      elItem.topics.forEach((topicItem: any) => {
        if (Array.isArray(topicItem.materi)) {
          topicItem.materi.forEach((m: string) => {
            if (m) {
              officialMateriList.push({
                clean: cleanMateriInServer(m).toLowerCase().replace(/[^a-z0-9]/g, ""),
                original: m,
                element: elName,
                cp: cpText
              });
            }
          });
        }
      });
    }
  });

  return kisiRows.map((row: any) => {
    if (!row) return row;
    const cleanRowMateri = cleanMateriInServer(row.materi || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Try exact match on clean materi string
    let bestMatch = officialMateriList.find(item => item.clean === cleanRowMateri);

    // 2. If no exact match, try substring match (does one contain the other?)
    if (!bestMatch) {
      bestMatch = officialMateriList.find(item => 
        item.clean.includes(cleanRowMateri) || cleanRowMateri.includes(item.clean)
      );
    }

    // 3. Fallback: if we still don't have a match, assign first element
    if (bestMatch) {
      return {
        ...row,
        element: bestMatch.element,
        cp: bestMatch.cp
      };
    } else {
      if (officialMateriList.length > 0) {
        return {
          ...row,
          element: officialMateriList[0].element,
          cp: officialMateriList[0].cp
        };
      }
    }

    return row;
  });
}

// 2. API: Generate Kisi-Kisi Soal (Matrix Sheet)
app.post("/api/generate-kisi-kisi", async (req, res) => {
  const { schoolInfo, subject, selectedTopics, questionConfigs, curriculumData, userApiKey, customKeys } = req.body;
  const keyToUse = (userApiKey || req.headers["x-user-api-key"] || "").toString();
  try {
    if (!subject || !selectedTopics || selectedTopics.length === 0 || !questionConfigs || questionConfigs.length === 0) {
      return res.status(400).json({ error: "Data input tidak lengkap untuk menjamin pembuatan kisi-kisi." });
    }

    const { rules: subjectRules, systemInstruction: systemInstructionOverride } = getSubjectSpecificRules(subject, schoolInfo?.gradeClass || "Sekolah Dasar");

    const totalQuestions = questionConfigs.reduce((sum: number, item: any) => sum + (Number(item.count) || 0), 0) || 10;
    const targetImageCount = Math.max(1, Math.floor(totalQuestions * 0.25));

    const ai = getAiClient();
    const prompt = `
      Buatkan kisi-kisi soal ujian sekolah dasar.
      Informasi Sekolah:
      - Nama Sekolah: ${schoolInfo?.schoolName || "SD Kabupaten"}
      - Kelas: ${schoolInfo?.gradeClass || "Kelas 4"}
      - Tahun Pelajaran: ${schoolInfo?.academicYear || "2025/2026"}
      - Mata Pelajaran: ${subject}
      
      Daftar Topik/Materi Terpilih:
      ${JSON.stringify(selectedTopics)}
 
      Rujukan Kurikulum Resmi (Elemen & Capaian Pembelajaran):
      ${JSON.stringify(curriculumData || [])}
 
      Konfigurasi Jumlah dan Jenis Soal:
      ${JSON.stringify(questionConfigs)}

      ${subjectRules}

      ==================================================================
      ATURAN PROPORSIONAL STIMULUS BERGAMBAR / ILUSTRASI (SANGAT KETAT):
      ==================================================================
      - Anda WAJIB MENGALOKASIKAN TEPAT ${targetImageCount} SOAL untuk dipasangkan stimulus bergambar. Gunakan ini khusus untuk soal yang benar-benar memerlukan penalaran visual, eksperimen sains, grafik matematika, siklus makhluk hidup, atau analisis gambar cerita yang kompleks.
      - Kolom Indikator Soal (indicator) untuk soal bergambar WAJIB diawali dengan: "Disajikan gambar...", "Disajikan ilustrasi...", "Perhatikan gambar...", atau "Perhatikan grafik...".
      - SISA SOAL lainnya HARUS BEBAS dari gambar fisik.
      - ISI NILAI KOLOM 'indicator' HARUS BERUPA INDIKATOR BERSIH yang langsung mendeskripsikan stimulus teks/data dan tugas siswa secara profesional. Tuliskan indikator secara langsung dan elegan!

      ==================================================================
      11 PILIHAN KOMBINASI STIMULUS TEKS/DATA KELAS TINGGI (SANGAT DIANJURKAN & MANDATORI BERVARIASI):
      ==================================================================
      Untuk menghasilkan naskah ujian yang sangat berwarna, keren, tidak monoton, dan bervariasi secara profesional walau tanpa gambar, Anda WAJIB merancang stimulus indikator Anda bergantian menggunakan kombinasi dari 11 gaya stimulus ramah-cetak berikut secara acak lintas nomor soal:
      1. Teks Bacaan Pendek/Narasi (Cerita pendek fabel, legenda nusantara, dongeng anak kreatif, informasi sains ramah anak, percakapan sehari-hari)
      2. Tabel Teks Sederhana (Tabel jadwal piket/pelajaran, tabel data tinggi/berat badan murid, tabel daftar nilai olahraga, tabel data hasil panen sayur)
      3. Diagram/Grafik Berbasis Teks Deskriptif (Representasi diagram batang sederhana menggunakan simbol karakter teks/angka, contoh data cuaca mingguan atau jumlah buku di lemari per hari)
      4. Infografis data & angka pendek (Gabungan fakta singkat, ringkasan angka statistik, dan simbol tanda baca terstruktur)
      5. Situasi Kontekstual / Studi Kasus Sederhana (Aktivitas belanja di kantin sekolah secara jujur, menabung uang kembalian di celengan, kerja bakti membersihkan selokan kelas, membagi kue pecahan dengan adil)
      6. Dialog/Percakapan Berperan (Skenario naskah komik berbasis dialog langsung antar tokoh anak)
      7. Karya Sastra Anak (Puisi keindahan alam Indonesia, pantun nasihat budi pekerti, syair ketekunan belajar)
      8. Simbol / Rambu / Lambang berbasis Deskripsi (Deskripsi rambu keselamatan di jalan, deskripsi Lambang Garuda Pancasila, deskripsi simbol prakiraan cuaca)
      9. Kumpulan Data Sederhana Terbuka (Daftar absensi kelas, daftar pengunjung perpustakaan per hari, daftar harga barang di koperasi sekolah)
      10. Prosedur / Urutan Langkah Praktik (Langkah mencuci tangan memakai sabun, langkah menanam biji tanaman, cara membuat es jeruk peras)
      11. Kutipan / Pernyataan Pendek (Kutipan nasihat bijak para guru atau tokoh teladan untuk melatih siswa menemukan ide pokok atau menyimpulkan amanat moral secara cerdas)

      PASTIKAN Anda mendistribusikan ke-11 variasi di atas secara kaya dan kreatif! Gunakan nama tokoh orang Indonesia, nama sekolah, lokasi tempat tinggal, dan objek yang SANGAT BERVARIASI, baru, dan anti-monoton di setiap baris soal. Jangan gunakan nama-nama yang sama berturut-turut!

      ==================================================================
      ATURAN KOLOM MATERI (MUTLAK BERSIH & JELAS):
      ==================================================================
      - Kolom 'materi' HANYA BOLEH diisi dengan NAMA MATERI UTAMA SAJA (misalnya: 'Pecahan Senilai', 'Gerak Manipulatif', 'Gaya Magnet', 'Simbol Pancasila').
      - SANGAT DILARANG menulis materi yang terlalu panjang, menyertakan penjelasan tambahan, mengulang-ulang kalimat, atau mengulang satu kata di dalamnya (TIDAK BOLEH ada kata ganda berulang seperti 'pola pola' atau 'pecahan pecahan').

      ==================================================================
      ATURAN ELEMEN & CAPAIAN PEMBELAJARAN (CP) - MUTLAK DARI RUJUKAN:
      ==================================================================
      - Kolom 'element' dan 'cp' WAJIB disalin atau disesuaikan persis dengan data "Rujukan Kurikulum Resmi" yang menaungi materi tersebut. DILARANG KERAS mengarang bebas, membuat istilah tersendiri, atau menerjemahkan istilah kurikulum secara acak!
      - KESESUAIAN TINGKAT KESULITAN (SANGAT KETAT): Pembuatan indikator soal WAJIB disesuaikan secara presisi dengan Capaian Pembelajaran (CP) pada elemen yang dipilih, topik, serta materi. 
      - Tingkat kesulitan pada indikator dan soal yang dibuat SANGAT DILARANG MELEWATI (overshoot) Capaian Pembelajaran di setiap elemen untuk setiap fase dan mata pelajaran. Misalnya, jika CP hanya menuntut siswa kelas 1-2 (Fase A) untuk "mengenal" atau "mengidentifikasi", maka indikator soal tidak boleh menuntut siswa melakukan analisis rumit (HOTS tingkat tinggi) atau perhitungan kompleks yang melampaui batas CP elemen tersebut. Jaga agar tetap realistis, proporsional, dan tuntas sesuai tingkat perkembangan kognitif siswa di fasenya.

      ==================================================================
      Aturan umum dalam menghasilkan Indikator Soal (Indicator) - MUTLAK:
      - Kolom Indikator Soal (indicator) WAJIB mengawali barisnya dengan penyebutan jenis stimulus secara eksplisit sesuai aturan 25% di atas.
      - Indikator soal wajib memuat STIMULUS nyata/konkrit.
      - Sesuaikan indikator soal dengan tingkat kognitif yang diminta.
      - Level Kognitif kurikulum Indonesia:
        * Level 1: Mengingat (C1) / Memahami (C2)
        * Level 2: Mengaplikasikan (C3)
        * Level 3: Menganalisis (C4) / Mengevaluasi (C5) / Mencipta (C6) - HOTS
      - WAJIB menggunakan bahasa sederhana yang ramah anak, lugas, dan sesuai tingkat kemampuan berpikir siswa kelas ${schoolInfo?.gradeClass || "Sekolah Dasar"}.
      - Stimulus tidak boleh terlalu panjang atau rumit, pastikan ringkas, pendek, dan langsung fokus pada objek pertanyaan.
      
      Rekomendasi Penamaan Pendukung Konteks Indonesia Umum:
      - Jika menyebutkan Nama Desa, gunakan variasi desa berikut: Desa Sukamaju, Desa Sari Makmur, Desa Harapan, Desa Subur.
      - Jika menyebutkan Nama Guru, gunakan nama berikut: Pak Bambang, Ibu Shinta, Pak Priyadi, Ibu Ratih, Pak Joko, Ibu Sri, Pak Hartono, Ibu Melinda.
      - Jika menyebutkan Nama Murid, gunakan variasi berikut: Andi, Budi, Cici, Dedi, Evi, Fandi, Gita, Hari, Iwan, Julia, Rian, Sari, Dian, Tono, Wati.
      - Jika menyebutkan Nama Sekolah, gunakan rekomendasi berikut: SD Negeri Nusantara, SD Merdeka, SD Harapan Bangsa, SD Bakti Luhur, SD Pancasila.

      Petunjuk Pengisian Kisi-kisi:
      - Buat urutan nomor soal yang berkesinambungan dari 1 sampai total soal yang diminta.
      - Distribusikan materi-materi secara proporsional ke dalam konfigurasi jumlah soal.
      - Tentukan "capaian pembelajaran", "elemen", "materi", "indikator soal", "level kognitif", "bentuk soal", dan "kunci jawaban" ideal untuk setiap nomor.
      - ⚠️ WAJIB IKUTI KONFIGURASI JENIS SOAL: Jumlah dan jenis soal HARUS PERSIS sesuai "Konfigurasi Jumlah dan Jenis Soal" di atas. Jika ada 'Pilihan Ganda Kompleks', WAJIB gunakan bentuk soal 'Pilihan Ganda Kompleks'. Jika ada 'Menjodohkan', WAJIB gunakan 'Menjodohkan'. JANGAN ubah jenis soal menjadi 'Pilihan Ganda' biasa!
      - ⚠️ ACAK KUNCI JAWABAN PG: Untuk soal Pilihan Ganda, kunci jawaban (A/B/C/D) WAJIB diacak total dan benar-benar tidak berpola. DILARANG KERAS pola A,B,C,D,A,B,C,D berulang!

      ==================================================================
      ATURAN ANTI-DUPLIKAT & KEUNIKAN SOAL (MANDATORI & SANGAT KETAT):
      ==================================================================
      - Hasil generate soal WAJIB menghasilkan soal yang BERBEDA di setiap nomor. DILARANG KERAS ada soal yang memiliki kesamaan/kemiripan cerita, situasi, subjek, objek, atau angka!
      - Gunakan objek (benda, barang, buah, hewan, dll), subjek (nama tokoh murid/guru/orang/hewan), latar (tempat, waktu, suasana), dan angka yang BERBEDA-BEDA untuk setiap nomor soal. Semua harus bervariasi secara unik!
      - Pastikan semua soal tetap merujuk secara akurat pada capaian pembelajaran, topik, materi, indikator yang dipilih, serta tingkat kelas.
      - Situasi pada setiap soal HARUS bervariasi secara kreatif, misalnya berlatar di: sekolah, ruang kelas, lapangan olahraga, kantin, taman bermain, perpustakaan, pasar tradisional, lingkungan rumah, sawah, kebun, pantai, daerah pegunungan, jalan raya, koperasi, atau tempat relevan lainnya yang sesuai dengan materi pelajaran!
      - KHUSUS bagi murid Kelas 1, Kelas 2, dan Kelas 3: Gunakan bahasa yang SANGAT sederhana, singkat, lugas, ramah anak, langsung pada intinya, dan TIDAK bertele-tele (hindari kalimat pembuka atau pengantar cerita yang terlalu panjang, usahakan stimulus/pertanyaan ringkas).

      Hasilkan keluaran JSON murni sesuai skema pendukung.
    `;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstructionOverride + "\n\nAnda menyusun matriks kisi-kisi ujian yang sangat detail namun sederhana, menyertakan stimulus (contoh konkrit, cerita, deskripsi gambar, puisi, pantun atau dialog) yang pendek, ringkas dan ramah anak pada indikator soal, serta mematuhi Level Kognitif secara akurat.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Daftar baris data tabel kisi-kisi soal",
          items: {
            type: Type.OBJECT,
            properties: {
              number: {
                type: Type.INTEGER,
                description: "Nomor urut soal.",
              },
              cp: {
                type: Type.STRING,
                description: "Capaian Pembelajaran (CP) terkait.",
              },
              element: {
                type: Type.STRING,
                description: "Elemen kurikulum terkait.",
              },
              materi: {
                type: Type.STRING,
                description: "NAMA MATERI UTAMA SAJA yang sangat padat, jelas (maksimal 2-4 kata), tanpa pengulangan kata sama sekali, dan HANYA berisi nama materi asli (contoh: 'Pecahan Senilai', 'Lari Estafet', 'Gaya Magnet', 'Simbol Pancasila'). Dilarang keras menulis penjelasan panjang, dilarang menyertakan kalimat 'materi tentang', dilarang keras mengulang kata-kata baik secara berurutan maupun dalam satu kalimat.",
              },
              indicator: {
                type: Type.STRING,
                description: "Indikator soal lengkap berkekhasan stimulus, ditulis detail. Harus menyebutkan stimulus spesifik (cerita/data/gambar konkrit).",
              },
              cognitiveLevel: {
                type: Type.STRING,
                description: "Tingkat kognitif (Level 1, Level 2, atau Level 3). Serta sebutkan penjelasannya (contoh: Level 3 - Menganalisis / HOTS).",
              },
              questionType: {
                type: Type.STRING,
                description: "Bentuk Soal: HARUS SAMA PERSIS dengan yang ada di Konfigurasi Jumlah dan Jenis Soal. Nilai yang diperbolehkan: 'Pilihan Ganda', 'Pilihan Ganda Kompleks', 'Menjodohkan', 'Isian Singkat', atau 'Uraian'.",
              },
              answerKey: {
                type: Type.STRING,
                description: "Kunci jawaban. Untuk 'Pilihan Ganda', wajib satu huruf saja (A, B, C, atau D) yang diacak benar-benar acak dan tidak berpola. Untuk 'Pilihan Ganda Kompleks', tulis huruf jawaban benar dipisah koma (contoh: 'A, C'). Untuk 'Menjodohkan', tulis 'Lihat pairs'. Untuk Isian/Uraian, tulis jawaban kunci singkat.",
              },
            },
            required: ["number", "cp", "element", "materi", "indicator", "cognitiveLevel", "questionType", "answerKey"],
          },
        },
      },
    }, 2, keyToUse, customKeys);

    const resultText = response.text || "[]";
    let data = JSON.parse(resultText);
    
    // Clean and sanitize columns programmatically for perfect security and formatting
    if (Array.isArray(data)) {
      data = data.map((item: any, idx: number) => {
        if (item) {
          if (item.materi) {
            item.materi = cleanMateriInServer(item.materi);
          }
          item.answerKey = cleanKisiKisiAnswerKey(item.answerKey || "", item.questionType || "", idx);
        }
        return item;
      });

      // Align elements and CP texts strictly with official curriculum data to avoid hallucinations
      data = alignKisiKisiWithCurriculum(data, curriculumData);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error generating kisi-kisi, activating offline premium fallback:", error);
    res.setHeader("X-Fallback-Used", "true");
    const fallbackData = generateFallbackKisiKisi(schoolInfo, subject, selectedTopics, questionConfigs);
    
    // Clean, sanitize, and align fallback data with curriculumData as well
    let cleanedFallback = fallbackData.map((item: any, idx: number) => {
      if (item) {
        if (item.materi) {
          item.materi = cleanMateriInServer(item.materi);
        }
        item.answerKey = cleanKisiKisiAnswerKey(item.answerKey || "", item.questionType || "", idx);
      }
      return item;
    });

    cleanedFallback = alignKisiKisiWithCurriculum(cleanedFallback, curriculumData);

    res.json(cleanedFallback);
  }
});

// 3. API: Generate Soal Ujian (Actual Test Items)
app.post("/api/generate-soal", async (req, res) => {
  const { schoolInfo, subject, kisiKisi, userApiKey, customKeys } = req.body;
  const keyToUse = (userApiKey || req.headers["x-user-api-key"] || "").toString();
  
  // Programmatically clean any incoming materi in the kisiKisi array immediately (before try block for unified catch-fallback scope)
  const sanitizedKisiKisi = (kisiKisi || []).map((item: any) => {
    if (item && item.materi) {
      return {
        ...item,
        materi: cleanMateriInServer(item.materi)
      };
    }
    return item;
  });

  try {
    if (!sanitizedKisiKisi || sanitizedKisiKisi.length === 0) {
      return res.status(400).json({ error: "Data kisi-kisi tidak boleh kosong untuk membuat soal." });
    }

    const { rules: subjectRules, systemInstruction: systemInstructionOverride } = getSubjectSpecificRules(subject, schoolInfo?.gradeClass || "Semua");

    const ai = getAiClient();
    const gradeClass = schoolInfo?.gradeClass || "Kelas 4";
    const numQuestions = sanitizedKisiKisi.length;
    const currentPhase = ["Kelas 1", "Kelas 2"].includes(gradeClass) 
      ? "Fase A" 
      : ["Kelas 3", "Kelas 4"].includes(gradeClass) 
        ? "Fase B" 
        : "Fase C";

    // Tentukan secara presisi soal mana yang harus memiliki gambar berdasarkan rancangan Kisi-kisi.
    const visualKisiKisiIndices = new Set<number>();
    sanitizedKisiKisi.forEach((item: any, idx: number) => {
      const indicatorText = (item.indicator || "").toLowerCase();
      const stimulusText = (item.stimulusText || item.stimulus || "").toLowerCase();
      
      // Exclude cases where it is clearly a narrative text or story stimulus (non-visual)
      const isStory = 
        indicatorText.includes("cerita") || indicatorText.includes("dongeng") || indicatorText.includes("puisi") || 
        indicatorText.includes("dialog") || indicatorText.includes("bacaan") || indicatorText.includes("teks") ||
        indicatorText.includes("wacana") || indicatorText.includes("pantun") || indicatorText.includes("paragraf") ||
        stimulusText.includes("bacalah") || stimulusText.includes("bacaan berikut") || stimulusText.includes("cerita berikut") ||
        stimulusText.includes("suatu hari") || stimulusText.includes("tersebut") || stimulusText.includes("dongeng");

      const isVisual = 
        (indicatorText.includes("gambar") || indicatorText.includes("ilustrasi") || indicatorText.includes("sketsa") ||
         stimulusText.includes("gambar") || stimulusText.includes("ilustrasi") || stimulusText.includes("sketsa") ||
         indicatorText.includes("peta") || indicatorText.includes("diagram") || indicatorText.includes("grafik") || indicatorText.includes("tabel")) && 
        !isStory;
      
      if (isVisual) {
        visualKisiKisiIndices.add(idx);
      }
    });

    // Clear all indices to strictly avoid any visual items
    visualKisiKisiIndices.clear();

    // SISTEM WAJIB menghitung otomatis jumlah soal bergambar berdasarkan total soal.
    // Memenuhi kuota ketat 25% soal bergambar/visual berdasarkan jumlah soal yang ada
    const targetImageCount = Math.max(1, Math.floor(numQuestions * 0.25));
    const designatedImageQuestions: number[] = [];

    const prompt = `
      Format lembar soal ujian sekolah dasar berdasarkan kisi-kisi berikut.
      Mata Pelajaran: ${subject}
      Kelas: ${schoolInfo?.gradeClass || "Semua"}
      Tahun Pelajaran: ${schoolInfo?.academicYear || "2025/2026"}
      Fase: ${currentPhase}
      
      Kisi-Kisi Sumber:
      ${JSON.stringify(sanitizedKisiKisi)}

      ${subjectRules}

      TUGAS UTAMA SISTEM:
      1. Membuat soal berkualitas tinggi yang selaras secara mutlak dengan Capaian Pembelajaran (CP) Kurikulum Merdeka. Isi pertanyaan, rincian kasus, dan kedalaman materi wajib sesuai dengan CP pada elemen, topik, dan materi terpilih.
      2. TINGKAT KESULITAN SOAL MUTLAK DILARANG MELEWATI (overshoot) batas cakupan Capaian Pembelajaran di setiap elemen untuk setiap fase dan mata pelajaran. Jika CP hanya mengamanatkan pemahaman dasar atau pengenalan konkrit, soal dilarang dipaksa naik ke tingkat analisis teoritis yang membingungkan/terlalu rumit bagi usia anak kelas tersebut.
      3. Membuat stimulus soal yang relevan (cerita, dsb) secara pendek dan ramah anak.
      4. Melakukan analisis stimulus visual secara terperinci (Tokoh, Aktivitas, Lokasi, Objek Utama, Suasana, Fokus Visual) SEBELUM merumuskan prompt gambar.
      5. Membuat prompt gambar yang sangat presisi dan sejajar, khusus untuk soal yang ditunjuk memiliki gambar.
      
      ==================================================================
      ATURAN SANGAT KETAT: 1-KE-1 SINKRONISASI & TENTANG SOAL DUPLIKAT ATAU KEMBAR!
      ==================================================================
      1. Anda WAJIB menghasilkan TEPAT ${numQuestions} butir soal, di mana soal ke-i (index ke-i) di dalam array JSON hasil harus dibuat 100% berlandaskan rincian baris kisi-kisi ke-i (index ke-i) di "Kisi-Kisi Sumber".
      2. Jumlah item dalam array JSON hasil harus SAMA EXACT dengan jumlah item di "Kisi-Kisi Sumber" (yaitu ${numQuestions} soal). Jangan kurangi, jangan tambahi!
      3. Setiap nomor soal HARUS memiliki skenario, cerita stimulus, nama tokoh, pertanyaan, pilihan jawaban, kunci jawaban, dan pembahasan yang UNIK DAN SEPENUHNYA BERBEDA satu sama lain!
      4. SANGAT DILARANG KERAS menyalin, menduplikasi, atau menggunakan teks, cerita, atau stimulus yang mirip/kembar lintas nomor soal! Setiap butir soal harus mewakili kasus pelajaran yang segar dan otentik.
      5. Contoh: Jika soal nomor 1 dan soal nomor 2 sama-sama bertopik "Gerak Manipulatif", maka buatlah soal nomor 1 dengan skenario "menggiring bola melewati rintangan cone secara zig-zag", sedangkan soal nomor 2 menggunakan skenario "melakukan servis bawah atau menangkap bola kasti yang melambung tinggi". TIDAK BOLEH ada kesamaan narasi!
      6. Gunakan nama-nama tokoh anak Indonesia yang bervariasi secara bergantian (jangan gunakan nama Andi atau Budi terus-menerus di seluruh nomor soal).
      
      ==================================================================
      ATURAN KRITIS - SENSITIVITAS AGAMA & LARANGAN KERAS TEKS KITAB SUCI (MUTLAK!):
      ==================================================================
      Berlaku untuk seluruh mata pelajaran AGAMA (Islam, Kristen, Katolik, Hindu, Buddha, Konghucu) maupun mata pelajaran umum:
      - SANGAT DILARANG KERAS menghasilkan ayat kitab suci, tulisan Arab, kutipan ayat, mantra, lafaz ritual, aksara suci, lafaz doa tertulis, kaligrafi, lafaz Allah, lafaz Muhammad, atau teks/halaman keagamaan apa pun di dalam gambar, prompt gambar, stimulus teks, pertanyan, maupun hiasan latar!
      - SANGAT DILARANG KERAS menyisipkan unsur teks ibadah dalam visual.
      - Sebagai alternatif, gunakan stimulus perilaku terpuji sehari-hari, gotong royong, persahabatan harmonis antar murid yang toleran, saling membantu, menyayangi binatang secara umum tanpa teks, bersedekah, rukun dengan tetangga, atau kegiatan ibadah non-verbal tanpa menyertakan teks apa pun!
      
      ==================================================================
      LARANGAN KERAS OBJEK RANDOM & KUCING ACAK:
      ==================================================================
      - Anda dilarang memunculkan kucing atau binatang lainnya secara acak pada visual jika stimulus soal tidak menyebutkan tentang hewan itu. Hewan hanyalah stimulus jika relevan dengan isi soal.
      - SANGAT DILARANG menggunakan objek dekoratif tambahan yang random atau latar asri secara asal-asalan yang tidak memengaruhi pengerjaan soal.
 
      ==================================================================
      ATURAN KHUSUS KARAKTER MANUSIA (WAJIB INDONESIA):
      ==================================================================
      - Semua manusia di dalam gambar wajib berciri anak SD Indonesia, usia anak-anak (7-12 tahun), wajah manis ramah khas Indonesia, dengan proporsi tubuh anak kecil yang realistis.
      - Murid wajib menggunakan seragam resmi SD Indonesia: baju kemeja putih lengan pendek rapi, celana pendek merah (untuk laki-laki) atau rok rempel panjang/pendek merah hati (untuk perempuan).
      - PENGECUALIAN: 
        * PJOK -> menggunakan pakaian seragam raga olahraga SD Indonesia yang sopan dan cerah.
        * Kegiatan di rumah -> menggunakan kaos/baju rumahan anak yang sederhana dan sopan.
        * Seni tari -> pakaian tari/pakaian adat nusantara sederhana, sopan, dan rapi sesuai budaya setempat.
      - SANGAT DILARANG: Orang dewasa, model remaja, gaya anime/fantasi, seragam luar negeri, atau ekspresi berlebihan.

      ==================================================================
      PEMBAGIAN TUGAS STIMULUS VISUAL (SANGAT PENTING):
      ==================================================================
      - PERHATIKAN: Ada TEPAT ${targetImageCount} soal yang ditunjuk wajib menggunakan stimulus visual (berdasarkan kisi-kisi). Untuk soal bergambar:
      - JIKA SOAL MATEMATIKA (Pecahan/Geometri/Pengukuran) atau SAINS (Rantai makanan/Peta/Biologi): WAJIB ISI properti "svgContent" dengan XML SVG buatan tangan yang presisi, indah, dan mendidik.
      - JIKA SOAL LINGKUNGAN/SOSIAL/OLAHRAGA (Aktivitas Manusia/Alam/Olahraga): WAJIB KOSONGKAN "svgContent", TAPI ISI "imagePrompt" dan "imagenPrompt" dengan prompt deskripsi foto yang mendalam dalam Bahasa Inggris (Ultra realistic educational photography...). "visualAnalysis" WAJIB diisi.
      - JIKA SOAL BUKAN BERGAMBAR (TEKS MURNI): Kosongkan properti 'visualAnalysis', 'imagePrompt', 'imagenPrompt', 'imageUrl', dan 'svgContent'.
      - JIKA TIPE "Pilihan Ganda Kompleks": Sediakan 4 "options" berupa pernyataan-pernyataan yang nyata, kontekstual, menarik, dan berlandaskan materi ujian. DILARANG KERAS menggunakan kata "Konsep", "Pernyataan", "Placeholder", "Pernyataan A/B/C/D", atau teks umum kosong/sementara! Setiap opsi harus berupa pernyataan konkret yang siap dinilai benar atau salah oleh siswa SD (contoh: "Matahari merupakan sumber energi terbarukan"). Kunci jawaban "answerKey" berisi huruf jawaban benar yang dipisah koma (misal: "A, C").
      - JIKA TIPE "Menjodohkan": Anda WAJIB mengisi properti "pairs" dengan 3-4 pasang { question: "...", answer: "..." } yang nyata dan kontekstual. DILARANG KERAS menggunakan kata "Konsep", "Pernyataan", "Pasangan", "Jawaban A/B/C/D", atau placeholders! Kedua kolom (kiri/kanan) harus berisi data konkret (misal: question "Diponegoro" dan answer "Jawa Tengah"). "questionText" bisa diisi instruksi seperti "Jodohkanlah pernyataan di kolom kiri dengan jawaban yang tepat di kolom kanan!". "options" dikosongkan.

      ==================================================================
      ATURAN ANTI-REDUNDANSI & DUPLIKASI STIMULUS (SANGAT KETAT):
      ==================================================================
      - SANGAT DILARANG KERAS menduplikat cerita, kalimat, kasus, atau pengantar dari 'stimulusText' di dalam 'questionText'!
      - Pemisahan tugas ideal:
        * Jika ada narasi, dialog, tabel, data, atau puisi panjang, letakkan sepenuhnya di 'stimulusText'. 'questionText' hanya berisi pertanyaan/instruksi pendek yang merujuk pada stimulus tersebut. Jangan menceritakan ulang kisah di dalam 'questionText'.
        * JIKA TIDAK ADA stimulus terpisah yang memadai (misalnya soal pertanyaan langsung sederhana), maka KOSONGKAN properti 'stimulusText' (isi dengan string kosong "") dan tuliskan seluruh kalimatnya dengan padat langsung di 'questionText'.
        * Contoh Salah:
          "stimulusText": "Andi merapikan kedereng di kotak. Ada 100 kelereng."
          "questionText": "Andi merapikan kelereng di kotak dan ternyata ada 100 kelereng. Angka ratusan pada bilangan 100 adalah ..." (Salah karena menduplikasi jalan cerita dan bilangan 100).
        * Contoh Benar (Pemisahan Bagus):
          "stimulusText": "Andi sedang merapikan kelereng miliknya di dalam kotak. Setelah dihitung, ternyata seluruh kelereng tersebut berjumlah 100 butir."
          "questionText": "Angka yang menempati nilai tempat ratusan pada bilangan jumlah kelereng Andi adalah ..."
        * Contoh Benar Lain (Langsung Tanpa Stimulus Terpisah):
          "stimulusText": ""
          "questionText": "Andi sedang merapikan kelereng miliknya. Andi menghitung kelerengnya dan ternyata ada 100 butir. Angka yang menempati nilai tempat ratusan pada bilangan 100 adalah ..."

      ==================================================================
      GAYA RENDER TEKS UNTUK 11 STIMULUS KOMBINASI (WAJIB PROFESSIONAL):
      ==================================================================
      Ketika merumuskan 'stimulusText' atau 'questionText' untuk setiap nomor soal sesuai kisi-kisi yang ditunjuk, buatlah render teks Anda sangat rapi, kokoh, dan bervariasi sesuai jenis stimulusnya:
      1. Sastra/Puisi/Pantun: Pisahkan baris puisi/pantun dengan tanda baris baru (\n) yang jelas agar terpahat rapi laksana bait karya sastra asli.
      2. Tabel Teks: Gunakan format tabel teks terstruktur sederhana berbasis karakter (gunakan garis pemisah horizontal seperti "---+---" dan pipa "|" untuk kolom, atau gunakan baris-baris ber-tab rapi). Contoh:
         | Hari | Jumlah Hasil Panen |
         | --- | --- |
         | Senin | 4 kg |
         | Selasa | 6 kg |
      3. Diagram Berbasis Karakter Teks: Gambarkan diagram batang sederhana dengan deretan simbol aksara kotak "█" atau "▉" secara estetik. Contoh:
         Kelas 1: ▉▉▉ (3 anak)
         Kelas 2: ▉▉▉▉▉ (5 anak)
      4. Dialog / Komik: Buat baris percakapan yang diawali dengan nama tokoh bertanda titik dua. Contoh:
         Dayu: "Apakah kelerengku ada di dalam laci, Edi?"
         Edi: "Iya, ada tepat di sudut kanan bawah laci meja."
      5. Urutan Langkah / Prosedur: Tuliskan bertingkat memakai nomor urutan (1, 2, 3...) yang teratur dan bersih.
      6. Skenario / Kasus: WAJIB SANGAT BERVARIASI! Jangan terus-menerus menggunakan subjek/objek yang sama. 
         * NAMA TOKOH: Acak nama dari berbagai latar belakang budaya/agama (misal: Islami seperti Ali, Fatimah, Yusuf; Kristen seperti Yohanes, Maria, Stefanus; Bali seperti Wayan, Made; Nasional seperti Budi, Siti). JANGAN menggunakan nama yang sama di soal berurutan!
         * LATAR TEMPAT: Jangan hanya di sekolah. Sesuaikan dengan materi! Gunakan lokasi seperti: pasar tradisional, terminal bus, sawah, pegunungan, bukit, laut, sungai, perpustakaan, rumah sakit, puskesmas, lapangan olahraga, museum, dsb.
         * PERAN/PROFESI: Gunakan variasi profesi dan hubungan keluarga: paman, bibi, kakek, nenek, dokter, bidan, petani, nelayan, polisi, pedagang, masinis, dsb.
         * ACAK JAWABAN: Pastikan pola kunci jawaban benar ACAK (A, B, C, D) di setiap nomor. Jangan jadikan A terus-menerus sebagai jawaban benar!
         * SETIAP NOMOR WAJIB BERBEDA: Soal dan stimulus harus benar-benar berbeda dari nomor sebelumnya. JANGAN mengulang jalan cerita atau pola kalimat!

      ==================================================================
      ATURAN DETIL KELAS & KOGNITIF (SANGAT PENTING):
      ==================================================================
      - TINGKAT KESULITAN & BAHASA: WAJIB DAN HARUS memperhitungkan dengan sangat teliti kemampuan murid berdasarkan tingkatan KELAS yang diminta! Gunakan bahasa, panjang kalimat, dan logika penalaran yang 100% cocok dengan tingkat kognitif dan umur siswa di kelas tersebut.
      - CAPAIAN PEMBELAJARAN (CP): Semua soal wajib merujuk secara akurat pada materi dan Capaian Pembelajaran dari Elemen yang ada. Jangan menyimpang dari topik!
      - SOAL ISIAN SINGKAT & URAIAN: 
        * Jangan hanya memberikan kalimat pertanyaan kering yang membosankan! 
        * WAJIB membuat STIMULUS YANG SANGAT MENARIK sebagai pengantar soal Isian Singkat dan Uraian. Gunakan pengantar seperti: percakapan pendek yang seru, kutipan dongeng/cerita fabel, puisi anak, cerita pengalaman sehari-hari, teka-teki, atau pantun.
        * Pertanyaan yang muncul di bagian "questionText" hanya langsung menanyakan inti permasalahan, TANPA titik-titik (.....) karena guru akan menyediakan kertas lembar jawaban terpisah secara manual.
      - PASTIKAN SANGAT BERVARIASI (ENTROPI TINGGI) untuk setiap hasil generate. Jauhi template monoton!
      
      ==================================================================
      ATURAN ANTI-DUPLIKAT & KEUNIKAN SOAL (MANDATORI & SANGAT KETAT):
      ==================================================================
      - Hasil generate soal WAJIB menghasilkan soal yang BERBEDA di setiap nomor. DILARANG KERAS ada soal yang memiliki kesamaan/kemiripan cerita, situasi, subjek, objek, atau angka!
      - Gunakan objek (benda, barang, buah, hewan, dll), subjek (nama tokoh murid/guru/orang/hewan), latar (tempat, waktu, suasana), dan angka yang BERBEDA-BEDA untuk setiap nomor soal. Semua harus bervariasi secara unik!
      - Pastikan semua soal tetap merujuk secara akurat pada capaian pembelajaran, topik, materi, indikator yang dipilih, serta tingkat kelas.
      - Situasi pada setiap soal HARUS bervariasi secara kreatif, misalnya berlatar di: sekolah, ruang kelas, lapangan olahraga, kantin, taman bermain, perpustakaan, pasar tradisional, lingkungan rumah, sawah, kebun, pantai, daerah pegunungan, jalan raya, koperasi, atau tempat relevan lainnya yang sesuai dengan materi pelajaran!
      - KHUSUS bagi murid Kelas 1, Kelas 2, dan Kelas 3: Gunakan bahasa yang SANGAT sederhana, singkat, lugas, ramah anak, langsung pada intinya, dan TIDAK bertele-tele (hindari kalimat pembuka atau pengantar cerita yang terlalu panjang, usahakan stimulus/pertanyaan ringkas).

      Hasilkan keluaran JSON murni terstruktur.
    `;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstructionOverride,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "Daftar naskah soal ujian lengkap beserta gambar pendukung acak jika ada",
          items: {
            type: Type.OBJECT,
            properties: {
              number: {
                type: Type.INTEGER,
                description: "Nomor soal (harus sesuai dengan kisi-kisi).",
              },
              questionType: {
                type: Type.STRING,
                description: "Bentuk Soal ('Pilihan Ganda', 'Pilihan Ganda Kompleks', 'Menjodohkan', 'Isian Singkat', atau 'Uraian'). HARUS SAMA PERSIS dengan apa yang diminta di Kisi-Kisi.",
              },
              cognitiveLevel: {
                type: Type.STRING,
                description: "Level kognitif soal (Level 1, Level 2, atau Level 3).",
              },
              materi: {
                type: Type.STRING,
                description: "Materi pokok bahasan.",
              },
              stimulusText: {
                type: Type.STRING,
                description: "Teks stimulus pendukung (cerita, penjelasan, data, dongeng, contoh konkrit, dsb). Kosongkan jika tidak ada.",
              },
              questionText: {
                type: Type.STRING,
                description: "Pertanyaan atau perintah soal.",
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Pilihan jawaban atau pernyataan. Wajib diisi (A, B, C, D) jika PG. Wajib diisi 4 pernyataan jika tipe Pilihan Ganda Kompleks (PGK). Kembalikan array kosong jika isian/uraian.",
              },
              answerKey: {
                type: Type.STRING,
                description: "Kunci jawaban definitif. Khusus untuk bentuk 'Pilihan Ganda', wajib berupa satu huruf kecil antara 'a', 'b', 'c', atau 'd'. Untuk PGK, isi dengan huruf jawaban benar dipisah koma (misal: 'A, C'). Untuk Menjodohkan tulis kuncinya/kosongkan.",
              },
              pairs: {
                type: Type.ARRAY,
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ["question", "answer"]
                },
                description: "WAJIB DIISI HANYA UNTUK SOAL MENJODOHKAN. Berisi pasangan pertanyaan/pernyataan dan jawaban/pasangannya."
              },
              alternativeAnswers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Opsi jawaban alternatif yang juga dianggap benar atau bernilai benar untuk bentuk Isian Singkat atau Uraian. Kosongkan untuk Pilihan Ganda.",
              },
              explanation: {
                type: Type.STRING,
                description: "Pembahasan singkat atau alasan jawaban untuk membantu penilaian guru.",
              },
              visualAnalysis: {
                type: Type.OBJECT,
                description: "Langkah 3: Analisis visual untuk soal yang menggunakan stimulus gambar. Kosongkan objek ini jika tidak memakai gambar.",
                properties: {
                  tokoh: { type: Type.STRING, description: "Siapa tokoh di dalam stimulus visual." },
                  aktivitas: { type: Type.STRING, description: "Aktivitas yang sedang dilakukan." },
                  lokasi: { type: Type.STRING, description: "Latar tempat kejadian visual." },
                  objekUtama: { type: Type.STRING, description: "Benda atau objek utama pendukung pelajaran." },
                  suasana: { type: Type.STRING, description: "Suasana psikologis rombongan belajar/kegiatan." },
                  fokusVisual: { type: Type.STRING, description: "Fokus visual utama kameramen." }
                }
              },
              imageUrl: {
                type: Type.STRING,
                description: "URL gambar foto/ilustrasi jika soal ini bertipe visual. Kosongkan jika tidak ada atau jika sudah menggunakan svgContent.",
              },
              svgContent: {
                type: Type.STRING,
                description: "Kode string murni XML SVG (misalnya bangun ruang, pecahan pie, diagram alir, dsb) tanpa backtick/markdown. Pastikan responsif dengan viewBox yang tepat dan kontras tinggi. Kosongkan jika tidak ada.",
              },
              imagenPrompt: {
                type: Type.STRING,
                description: "Deskripsi prompt visual Imagen detail dalam Bahasa Inggris untuk generate gambar. WAJIB 100% relevan dengan peristiwa/cerita soal & stimulus (TANPA MISMATCH!). Gunakan gaya 'Ultra realistic educational photography...' atau 'Vibrant 2D vector flat illustration...' tergantung isi soal. Kosongkan jika tidak ada.",
              },
              imagePrompt: {
                type: Type.STRING,
                description: "Sama dengan imagenPrompt (deskripsi prompt gambar detail dalam Bahasa Inggris, 100% relevan dengan peristiwa/cerita & stimulus, tanpa salah objek). Kosongkan jika tidak ada.",
              },
            },
            required: ["number", "questionType", "cognitiveLevel", "materi", "questionText", "answerKey", "explanation"],
          },
        },
      },
    }, 2, keyToUse, customKeys);

    const resultText = response.text || "[]";
    const data = JSON.parse(resultText);
    
    // Intelligent normalization pipeline for high-accuracy educational outputs
    const normalizedData = data.map((q: any) => {
      const promptStr = q.imagePrompt || q.imagenPrompt || "";
      if (q.questionType === "Pilihan Ganda Kompleks") {
        const hasStaticPlaceholder = !q.options || q.options.length < 4 || q.options.some((o: string) => {
          const lower = (o || "").toLowerCase();
          return lower.includes("pernyataan") || lower.includes("konsep") || lower.includes("placeholder");
        });
        if (hasStaticPlaceholder) {
          const generated = getComplexAndMatchingContent(
            subject,
            q.materi || "",
            q.number || 1,
            q.stimulusText || "",
            q.questionText || "",
            q.options || [],
            q.answerKey || "",
            q.explanation || "",
            schoolInfo
          );
          if (generated.finalOptions && generated.finalOptions.length > 0) {
            q.options = generated.finalOptions;
          }
          if (generated.answerKeyPGK) {
            q.answerKey = generated.answerKeyPGK;
          }
        } else {
          // Validate and normalize PGK answer key
          let pgkKey = (q.answerKey || "").trim();
          if (!pgkKey || !pgkKey.includes(",")) {
            const allOpts = ["A", "B", "C", "D"];
            const shuffledPGK = [...allOpts].sort(() => Math.random() - 0.5);
            pgkKey = `${shuffledPGK[0]}, ${shuffledPGK[1]}`;
          }
          q.answerKey = pgkKey;
        }

        // Shuffle the options and key to prevent repeating "1, 2, 3" pattern
        if (q.options && q.options.length > 0 && q.answerKey) {
          const correctLetters = q.answerKey.toUpperCase().split(/[,;]/).map((k: string) => k.trim());
          const correctTexts = correctLetters.map((letter: string) => {
            const idx = letter.charCodeAt(0) - 65;
            if (idx >= 0 && idx < q.options!.length) {
              return q.options![idx].replace(/^[A-E]\.\s*/, "").trim();
            }
            return "";
          }).filter(Boolean);

          const rawOptions = q.options.map((opt: string) => opt.replace(/^[A-E]\.\s*/, "").trim());
          
          const shuffledRaw = [...rawOptions];
          for (let i = shuffledRaw.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledRaw[i], shuffledRaw[j]] = [shuffledRaw[j], shuffledRaw[i]];
          }

          const newCorrectLetters: string[] = [];
          const newOptions = shuffledRaw.map((opt: string, idx: number) => {
            const letter = String.fromCharCode(65 + idx);
            if (correctTexts.includes(opt)) {
              newCorrectLetters.push(letter);
            }
            return `${letter}. ${opt}`;
          });

          q.options = newOptions;
          q.answerKey = newCorrectLetters.sort().join(",");
        }

        return { ...q, imagePrompt: "", imagenPrompt: "", imageUrl: "", svgContent: "", materi: cleanMateriInServer(q.materi || "") };
      }

      if (q.questionType === "Menjodohkan") {
        const hasStaticPlaceholder = !q.pairs || q.pairs.length < 3 || q.pairs.some((p: any) => {
          const ql = (p.question || "").toLowerCase();
          const al = (p.answer || "").toLowerCase();
          return ql.includes("konsep") || ql.includes("pernyataan") || ql.includes("placeholder") ||
                 al.includes("konsep") || al.includes("pernyataan") || al.includes("placeholder");
        });
        if (hasStaticPlaceholder) {
          const generated = getComplexAndMatchingContent(
            subject,
            q.materi || "",
            q.number || 1,
            q.stimulusText || "",
            q.questionText || "",
            [],
            q.answerKey || "",
            q.explanation || "",
            schoolInfo
          );
          if (generated.finalPairs && generated.finalPairs.length > 0) {
            q.pairs = generated.finalPairs;
          }
        }
        if (!q.questionText || !q.questionText.toLowerCase().includes("jodoh")) {
          q.questionText = "Jodohkanlah pernyataan di kolom kiri dengan jawaban yang tepat di kolom kanan!";
        }
        return { ...q, options: [], answerKey: "Lihat pairs", imagePrompt: "", imagenPrompt: "", imageUrl: "", svgContent: "", materi: cleanMateriInServer(q.materi || "") };
      }

      if (q.questionType !== "Pilihan Ganda") {
        return { ...q, imagePrompt: promptStr, imagenPrompt: promptStr };
      }
      
      let opts = [...q.options].slice(0, 4);
      while (opts.length < 4) {
        opts.push(`${String.fromCharCode(65 + opts.length)}. Pilihan Alternatif Baru`);
      }
      
      opts = opts.map((opt, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const cleanText = opt.replace(/^[a-dA-D][.\s)]+/, "").trim();
        return `${letter}. ${cleanText || "Pilihan Alternatif"}`;
      });

      const cleanKey = (q.answerKey || "").trim().toUpperCase();
      let correctIdx = -1;
      
      if (/^[A-D](\.|$)/.test(cleanKey)) {
        correctIdx = cleanKey.charCodeAt(0) - 65;
      } else {
        const keyLower = cleanKey.toLowerCase();
        for (let i = 0; i < opts.length; i++) {
          const optLower = opts[i].toLowerCase();
          const cleanOpt = optLower.replace(/^[a-d][.\s)]+/, "").trim();
          const cleanKeyTxt = keyLower.replace(/^[a-d][.\s)]+/, "").trim();
          if (cleanOpt === cleanKeyTxt || optLower.includes(cleanKeyTxt) || cleanOpt.includes(cleanKeyTxt)) {
            correctIdx = i;
            break;
          }
        }
      }

      if (correctIdx === -1) {
        for (let i = 0; i < opts.length; i++) {
          if (opts[i].toUpperCase().includes(cleanKey) || cleanKey.includes(opts[i].toUpperCase())) {
            correctIdx = i;
            break;
          }
        }
      }

      if (correctIdx === -1) {
        correctIdx = 0;
      }

      // Force shuffle options right after generation to destroy any LLM sequential pattern
      const originalCorrectOpt = opts[correctIdx];
      const rawOpts = opts.map(opt => opt.replace(/^[A-D][.\s)]+/, "").trim());
      const rawCorrectText = originalCorrectOpt.replace(/^[A-D][.\s)]+/, "").trim();
      
      for (let i = rawOpts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rawOpts[i], rawOpts[j]] = [rawOpts[j], rawOpts[i]];
      }
      
      let newCorrectIdx = 0;
      const shuffledOpts = rawOpts.map((opt, idx) => {
        if (opt === rawCorrectText) {
          newCorrectIdx = idx;
        }
        return `${String.fromCharCode(65 + idx)}. ${opt}`;
      });

      return {
        ...q,
        materi: cleanMateriInServer(q.materi || ""),
        options: shuffledOpts,
        answerKey: String.fromCharCode(97 + newCorrectIdx),
        imagePrompt: promptStr,
        imagenPrompt: promptStr
      };
    });

    const finalQuestions = await adjustAndNormalizeIllustratedQuestions(normalizedData, targetImageCount, subject, visualKisiKisiIndices);
    
    // Extra secure cleaning of finalQuestions materi
    const cleanedQuestions = finalQuestions.map((q: any) => {
      if (q && q.materi) {
        q.materi = cleanMateriInServer(q.materi);
      }
      return q;
    });

    res.json(cleanedQuestions);
  } catch (error: any) {
    console.error("Error generating soal, activating offline premium fallback:", error);
    res.setHeader("X-Fallback-Used", "true");
    const fallbackData = generateFallbackSoal(schoolInfo, subject, sanitizedKisiKisi);
    
    // Clean and sanitize fallback questions
    const cleanedFallback = fallbackData.map((q: any) => {
      if (q && q.materi) {
        q.materi = cleanMateriInServer(q.materi);
      }
      return q;
    });
    
    res.json(cleanedFallback);
  }
});

// 4. API: Generate or Regenerate Individual SVG/Image for a Specific Question
app.post("/api/generate-individual-image", async (req, res) => {
  const { subject, question, userApiKey, customKeys } = req.body;
  const keyToUse = (userApiKey || req.headers["x-user-api-key"] || "").toString();
  try {
    if (!question || !question.questionText) {
      return res.status(400).json({ error: "Data naskah soal tidak lengkap." });
    }

    const isPjok = (subject || "").toLowerCase().includes("pjok") || 
                    (subject || "").toLowerCase().includes("jasmani") || 
                    (subject || "").toLowerCase().includes("olahraga") ||
                    (subject || "").toLowerCase().includes("penjas") ||
                    (question.materi && question.materi.toLowerCase().includes("olahraga")) ||
                    (question.questionText && question.questionText.toLowerCase().includes("gerak"));

    if (isPjok) {
      console.log("[generate-individual-image] PJOK subject detected. Generating ultra-realistic sports photo via Imagen...");
      const promptStr = await translateAndElaboratePromptForImagen(subject, question, question.imagenPrompt || question.imagePrompt, keyToUse, customKeys);
      const imageBytes = await generateImagenImage(promptStr, 2, keyToUse, customKeys);
      if (imageBytes) {
        return res.json({
          imageUrl: imageBytes,
          svgContent: ""
        });
      }
      throw new Error("Gagal membangkitkan foto realistic olahraga via Imagen.");
    }

    const ai = getAiClient();
    const prompt = `
      Anda adalah seorang desainer grafis materi pembelajaran SD nasional (Kurikulum Merdeka) yang sangat mahir membuat ilustrasi SVG edukatif yang bersih, akurat, dan bermakna.

      Detail Soal yang memerlukan gambar:
      - Bidang Pelajaran: ${subject || "Umum"}
      - Materi Pokok: ${question.materi || "Materi Umum"}
      - Jenis Soal: ${question.questionType || "Pilihan Ganda"}
      - Teks Soal: "${question.questionText}"
      - Pilihan Jawaban (bila PG): ${JSON.stringify(question.options || [])}
      - Kunci Jawaban: "${question.answerKey || ""}"

      TUGAS UTAMA:
      Buatkan satu kode XML SVG murni yang sangat relevan, presisi, dan indah untuk membantu murid menjawab atau memahami konteks soal di atas.

      ATURAN DESAIN KARAKTER ANAK SD INDONESIA (WAJIB):
      - Jika ilustrasi menggambarkan anak sekolah dasar, Anda WAJIB menggambarkan mereka memakai seragam sekolah dasar negeri Indonesia yang otentik: Baju kemeja lengan pendek warna putih terang (gunakan fill putih #ffffff atau abu-abu sangat muda #f8fafc) dan celana (laki-laki) atau rok rempel (perempuan) berwarna merah hati (gunakan warna merah tajam/merah hati seperti #dc2626 atau #b91c1c). Kembalikan kode SVG dengan styling warna seragam yang tepat sasaran agar murid langsung mengenali identitas murid SD Indonesia secara instan dan akurat.

      Rekomendasi Konten Gambar & Nuansa Anak-Anak (Ramah Kelas 1-3):
      - Ilustrasi Kegiatan Anak: Untuk soal IPS/PKN/Bahasa Indonesia, Anda bisa melukiskan ikon/karakter anak sederhana (gaya kartun imut, wajah tersenyum khas Indonesia, memakai seragam kemeja putih lengan pendek and celana atau rok merah hati, atau siluet gotong royong anak berdua sedang menyiram bunga, memegang sapu lidi, menyapu lantai, memungut sampah, atau bermain bola/kelereng).
      - Matematika Pecahan: Gambarkan Diagram Lingkaran (misalnya semangka yang dipotong, cokelat batangan, pizza pecahan yang diarsir porsinya) dengan garis arsir tebal yang ramah anak.
      - Matematika Geometri: Gambarkan bangun datar (bidang miring, segitiga siku-siku, lingkaran) atau bangun ruang (kubus, limas, prisma, tabung) dengan garis luar (stroke) yang jelas, label huruf di sudutnya (misalkan A, B, C) berukuran besar dan terbaca jelas.
      - Sains / IPAS: Gambarkan rantai makanan sederhana bernuansa lucu (misal daun apel -> ulat bulu kartun -> burung kecil -> elang dengan panah dan ikon lucu), diagram siklus air dengan awan tersenyum ramah anak, organ tubuh sederhana dengan panah penunjuk tebal, dsb.

      PERSYARATAN TEKNIS SVG:
      1. KELUARAN HARUS berupa string XML SVG murni, diawali tag <svg> dan diakhiri tag </svg>.
      2. Responsif: Gunakan atribut viewBox (contoh: viewBox="0 0 250 200") dan abaikan atribut width / height yang bernilai tetap, atau pasang width="100%" height="auto" agar ramah responsive.
      3. Warna Ramah Cetak: Gunakan kombinasi warna hitam-putih, abu-abu, atau warna soft yang kontras tinggi dan terbaca jelas jika dicetak di kertas buram ujian atau difotokopi.
      4. Bebas Markdown: Kembalikan langsung isi tag SVG di dalam properti JSON tanpa penanda markdown "\`\`\`" atau "\`\`\`xml".

      Kembalikan data dalam JSON murni sesuai skema berikut.
    `;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah tim visual grafik PUSMENJAR/Kemendikbud yang ahli menulis kode SVG edukasi bermutu tinggi, bersih secara markup, responsif, dan mudah dipahami siswa SD.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svgContent: {
              type: Type.STRING,
              description: "String XML SVG murni (tidak mengandung markdown atau kutipan backtick) yang mewakili ilustrasi soal.",
            },
          },
          required: ["svgContent"],
        },
      },
    }, 2, keyToUse, customKeys);

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    
    // Fail-safe fallback: If generated SVG is empty, invalid, or missing, resolve to a verified gorgeous Unsplash education photograph
    if (!parsed.svgContent || parsed.svgContent.trim().length === 0 || !parsed.svgContent.includes("<svg")) {
      parsed.imageUrl = getRelevantVerifiedUnsplashUrl(subject || "Umum", question.questionText, question.materi || "", question.stimulusText || "", question.imagenPrompt || "");
      parsed.svgContent = "";
    }
    
    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating individual image, activating offline premium fallback:", error);
    res.setHeader("X-Fallback-Used", "true");

    const topic = (question.materi || "").toLowerCase();
    const qtext = (question.questionText || "").toLowerCase();

    // Default fallback circle layout
    let sc = `<svg viewBox="0 0 100 100" style="max-width: 100px; display: block; margin: 10px auto;">
      <circle cx="50" cy="50" r="40" stroke="#4f46e5" stroke-width="2.5" fill="#f1f5f9"/>
      <path d="M 50 50 L 50 10 A 40 40 0 0 1 90 50 Z" fill="#cbd5e1" stroke="#4f46e5" stroke-width="2"/>
      <text x="50" y="55" font-family="sans-serif" font-size="10" text-anchor="middle" font-weight="bold">Diagram</text>
    </svg>`;
    
    if (subject === "Matematika" && (topic.includes("segitiga") || qtext.includes("segitiga"))) {
      sc = `<svg viewBox="0 0 120 100" style="max-width: 120px; display: block; margin: 10px auto;">
        <polygon points="20,80 100,80 20,20" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
        <text x="15" y="85" font-size="10" font-family="sans-serif">A</text>
        <text x="105" y="85" font-size="10" font-family="sans-serif">B</text>
        <text x="15" y="15" font-size="10" font-family="sans-serif">C</text>
      </svg>`;
    } else if (subject === "Matematika" && (topic.includes("pecahan") || qtext.includes("pecahan"))) {
      sc = `<svg viewBox="0 0 120 120" style="max-width: 120px; display: block; margin: 10px auto;">
        <circle cx="60" cy="60" r="50" stroke="#334155" stroke-width="3" fill="none"/>
        <path d="M 60 10 A 50 50 0 0 1 110 60 A 50 50 0 0 1 60 110 L 60 60 Z" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
        <line x1="60" y1="10" x2="60" y2="110" stroke="#334155" stroke-width="2"/>
        <line x1="10" y1="60" x2="110" y2="60" stroke="#334155" stroke-width="2"/>
      </svg>`;
    } else if (subject === "IPAS") {
      sc = `<svg viewBox="0 0 100 100" style="max-width: 100px; display: block; margin: 10px auto;">
        <path d="M 50 90 C 20 60 20 30 50 10 C 80 30 80 60 50 90 Z" fill="#10b981" stroke="#047857" stroke-width="2"/>
        <line x1="50" y1="90" x2="50" y2="10" stroke="#047857" stroke-width="1.5"/>
      </svg>`;
    }

    res.json({ svgContent: sc });
  }
});

// Helper to translate and elaborate Indonesian question details into detailed English Imagen prompts
async function translateAndElaboratePromptForImagen(
  subject: string,
  q: any,
  rawPrompt?: string,
  userApiKey?: string,
  customKeys?: string[]
): Promise<string> {
  const rawTextToAnalyze = `
    Mata Pelajaran / Subject: ${subject || "Umum"}
    Materi Pokok / Topic: ${q.materi || q.topic || ""}
    Stimulus / Context: ${q.stimulusText || ""}
    Butir Soal / Question: ${q.questionText || ""}
    User Suggested Prompt: ${rawPrompt || ""}
  `.trim();

  const qtext = (q.questionText || "").toLowerCase();
  const qmat = (q.materi || "").toLowerCase();
  const qstim = (q.stimulusText || "").toLowerCase();
  const combinedText = `${qtext} ${qmat} ${qstim}`.toLowerCase();

  const isPjok = (subject || "").toLowerCase().includes("pjok") || 
                  (subject || "").toLowerCase().includes("jasmani") || 
                  (subject || "").toLowerCase().includes("olahraga") ||
                  (subject || "").toLowerCase().includes("penjas") ||
                  qmat.includes("olahraga") ||
                  qmat.includes("jasmani") ||
                  qmat.includes("bola") ||
                  qmat.includes("sepak") ||
                  qmat.includes("atletik") ||
                  combinedText.includes("olahraga") ||
                  combinedText.includes("gerak") ||
                  combinedText.includes("bola") ||
                  combinedText.includes("sepak") ||
                  combinedText.includes("futsal") ||
                  combinedText.includes("kaki bagian") ||
                  combinedText.includes("menggiring") ||
                  combinedText.includes("mengontrol") ||
                  combinedText.includes("lokomotor") ||
                  combinedText.includes("manipulatif") ||
                  combinedText.includes("voli") ||
                  combinedText.includes("kasti") ||
                  combinedText.includes("cone") ||
                  combinedText.includes("meliuk");

  let instructions = "";
  if (isPjok) {
    instructions = `
    You are an expert AI prompt engineer and a professional physical education (PJOK) curriculum photographer.
    Analyze the raw Indonesian elementary school PJOK exam question and its context below.
    Your task is to translate and expand this context into a highly descriptive English scene description optimized for Google Imagen 3.
    This image is designed for Class 4 Elementary School (SD) students, so it must depict authentic postures, movements, and techniques.

    FOLLOW THESE RULES:
    1. STYLE MUST BE HIGH-QUALITY ATHLETIC AND EDUCATIONAL PHOTOGRAPHY:
       - Style keywords: "Ultra realistic, photorealistic, educational sports photography, cinematic natural lighting, realistic Indonesian elementary school environment, authentic movement, realistic body posture, correct sports technique, DSLR quality, realistic motion, detailed texture, no watermark, no text, no distortion".
       - NEVER use cartoon, vector, anime, illustrations, 2D art, or drawing styles. It must look like a high-end textbook photo.
    2. ABSOLUTE SCIENTIFIC & TECHNICAL ACCURACY FOR SPORTS:
       - The physical execution and technique of the described sport movement must be 100% CONCEPTUALLY AND ANATOMICALLY CORRECT.
       - Example: For dribbling a soccer ball (menggiring bola) with the inside of the foot (kaki bagian dalam), the prompt must explicitly describe the side of the foot contacting the middle of the soccer ball, the player's body leaning slightly forward, arms opened for balance, head looking slightly up toward the line of travel, on a real grass school field. 
       - Specify realistic joints, feet, and ball positions. Do not design ambiguous or incorrect postures.
    3. DETAILED INDONESIAN CONTEXT & CHARACTERS:
       - Depict 1 or more Indonesian elementary school children (Grade class 4, around 9-10 years old with childlike proportions, cheerful and focused expressions).
       - Clothes: Realistic, clean, and vibrant sports uniform of an Indonesian primary school (such as a modern collared tee and sports shorts).
       - Background: An authentic Indonesian schoolyard, school gymnasium, or grass school field under warm, bright daylight.
    4. ACCURATE BALL VS VEHICLE SAFETY RULE:
       - Do NOT confuse ball control drills with bicycling, skateboarding, gymnastics, or any other unrelated sport. 
       - If the question mentions "bola" (ball), "menggiring" (dribbling/weaving), "mengontrol" (controlling), or "cone", the image MUST depict a soccer ball on a grass schoolyard. The player is a pupil using their feet to dribble a soccer ball around orange sports cones.
       - NEVER write words like "bicycle", "tricycle", "bicyclist", "riding", "bike", or "cycling" in the output prompt unless the original question explicitly asks about "sepeda" or "sepeda sepeda".
    5. STRICT SAFETY RULE: Do NOT include any written text, captions, letters, characters, numbers, watermarks, or overlays in the illustration. 
    6. Output ONLY the final elaborated English prompt string. Do not wrap the output in markdown code blocks, do not include intro/outro explanations.
    `.trim();
  } else {
    instructions = `
    You are an expert AI prompt engineer and a professional educational illustrator. 
    Analyze the raw Indonesian elementary school exam question context and visual requirements provided below.
    Your task is to translate and expand this context into a highly descriptive English scene description optimized for Google Imagen 3.

    FOLLOW THESE RULES:
    1. Translate any Indonesian concepts, subjects, and scenes into vivid, specific English terms.
       - Example: "Lingkungan hidup yang kotor, murid menganalisis penyebab kotor" -> "An educational 2D vector flat clipart illustration of an elementary schoolyard with scattered trash, crumpled paper, plastic bottles on the ground, and leaves lying untidily around. High educational value, clear details, clean outlines."
    2. Expand the visual scene details so that the resulting image directly supports the student's ability to answer the question:
       - If it is science/IPAS: describe the cycle, organism, environment, or clean/dirty nature scenario precisely.
       - If it is mathematics/geometri: describe clear shapes, angles, or fractional diagrams on a solid white surface with sharp contrast.
       - If it describes students/children: depict standard, friendly Indonesian elementary school children (wearing standard white shirt and red pants/skirts) engaged in clean and polite activities.
    3. Ensure a highly optimized educational style: "Vibrant 2D vector flat educational illustration, clean solid white background, neat scrapbook clipart, crisp lines, easy-to-read illustration". Avoid complex shadows, blurry features, or realistic photograph styles unless a realistic photo is explicitly requested.
    4. STRICT SAFETY RULE: Do NOT include any written text, captions, letters, numeric labels, words, or signs in the illustration. Detail all visual objects strictly using shapes, colors, and spatial positioning.
    5. Output ONLY the final elaborated English prompt string. Do not wrap the output in markdown code blocks, and do not include introductions or explanations. This output goes directly to the image generator API.
    `.trim();
  }

  try {
    const response = await generateContentWithRetry(
      null as any,
      {
        model: "gemini-2.5-flash",
        contents: `${instructions}\n\nInput Indonesian Context:\n${rawTextToAnalyze}`,
        config: {
          systemInstruction: "You are a professional image prompt generator. You only output the final optimized English prompt.",
          temperature: 0.7,
          maxOutputTokens: 300,
        }
      },
      2,
      userApiKey,
      customKeys
    );

    if (response && response.text) {
      const result = response.text.trim();
      return result.replace(/^["'`]|["'`]$/g, '').trim();
    }
  } catch (err: any) {
    console.error("[translateAndElaboratePromptForImagen] Failed to elaborate prompt with Gemini:", err);
  }

  // Fallback to original prompt if Gemini call fails
  return rawPrompt || q.imagenPrompt || q.imagePrompt || q.questionText || "vibrant educational vector clipart illustration";
}

// 5. API: Generate actual PNG/JPEG Image via Google Imagen
app.post("/api/generate-image", async (req, res) => {
  const { subject, question, prompt, userApiKey, customKeys } = req.body;
  const keyToUse = (userApiKey || req.headers["x-user-api-key"] || "").toString();
  try {
    const q = question || {};
    
    // Dynamically translate and elaborate the prompt using Gemini 2.5 Flash before sending it to Imagen
    console.log(`[API Generate Image] Running Gemini Translator & Elaborator on Indonesian question...`);
    const promptStr = await translateAndElaboratePromptForImagen(subject, q, prompt, keyToUse, customKeys);
    console.log(`[API Generate Image] Elaborated English Prompt for Imagen: "${promptStr}"`);

    const imageBytes = await generateImagenImage(promptStr, 2, keyToUse, customKeys);
    if (imageBytes) {
      return res.json({ imageUrl: imageBytes });
    }

    // Fallback: use Unsplash verified education stock pictures mapping
    const fallbackUrl = getRelevantVerifiedUnsplashUrl(
      subject || "Umum", 
      q.questionText || "", 
      q.materi || "", 
      q.stimulusText || "", 
      promptStr
    );
    console.log(`[API Generate Image Fallback] Imagen failed, resolving to Unsplash fallback URL: ${fallbackUrl}`);
    res.json({ imageUrl: fallbackUrl, isFallback: true });
  } catch (error: any) {
    console.error("Error generating image via /api/generate-image:", error);
    res.status(500).json({ error: error.message || "Gagal memproses gambar AI." });
  }
});

// Setup Vite & static serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: _createViteServer } = await import("vite");
    const vite = await _createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] running on http://localhost:${PORT}`);
  });
}

if (!process.env.NETLIFY && !process.env.LAMBDA_TASK_ROOT) {
  start().catch((err) => {
    console.error("Server startup failure:", err);
  });
}

// CJS export for Netlify Functions bundler (package.json type: commonjs)
(module as any).exports = app;
(module as any).exports.default = app;

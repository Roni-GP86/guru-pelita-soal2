import { QuestionItem } from "./types";

/**
 * Calculates how many questions should have images (25% rounded up).
 */
export function hitungSoalBergambar(totalCount: number): number {
  if (totalCount <= 0) return 0;
  return Math.ceil(totalCount * 0.25);
}

/**
 * Checks if a question has a narrative story/text/reading comprehension stimulus,
 * which should be kept strictly as text/story without receiving visual illustrations.
 */
export function isQuestionAStoryStimulus(q: QuestionItem): boolean {
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
    text.includes("penggalan cerita");
    
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

/**
 * Determines if a question contains keywords indicating it should have an illustration.
 */
export function isQuestionVisuallyDemanding(q: QuestionItem): boolean {
  if (isQuestionAStoryStimulus(q)) {
    return false; // Automatically protect story/text stimuli from being marked as visually demanding
  }

  if (q.imagenPrompt && q.imagenPrompt.trim().length > 0) return true;
  if (q.imagePrompt && q.imagePrompt.trim().length > 0) return true;
  if (q.svgContent && q.svgContent.trim().toLowerCase().includes("<svg")) return true;

  const text = `${q.questionText || ""} ${q.stimulusText || ""} ${q.materi || ""}`.toLowerCase();
  
  // Proteksi Khusus PJOK / Pendidikan Olahraga dari gambar acak / kucing acak
  const isPjok = text.includes("pjok") || text.includes("jasmani") || text.includes("olahraga") || text.includes("senam") || text.includes("penjas") || text.includes("penjasorkes") || text.includes("bola") || text.includes("menggiring") || text.includes("meliuk");
  if (isPjok && !text.includes("lapangan") && !text.includes("gawang") && !text.includes("diagram") && !text.includes("peta") && !text.includes("lapangan basket") && !text.includes("lapangan sepakbola") && !text.includes("bola") && !text.includes("cone") && !text.includes("rintangan") && !text.includes("meliuk")) {
    return false;
  }

  return (
    text.includes("perhatikan gambar") ||
    text.includes("gambar") ||
    text.includes("ilustrasi") ||
    text.includes("diagram") ||
    text.includes("tabel") ||
    text.includes("grafik") ||
    text.includes("peta") ||
    text.includes("siklus") ||
    text.includes("pecahan") ||
    text.includes("segitiga") ||
    text.includes("bentuk") ||
    text.includes("pancasila") ||
    text.includes("bendera")
  );
}

// Helper to get active API keys pool in priority order (User key first)
export function getApiKeysPool(): string[] {
  const keys: string[] = [];
  
  // 1. Custom User Key from Profile (Highest Priority)
  const userKey = localStorage.getItem("ttu_user_api_key") || localStorage.getItem("gemini_api_key");
  if (userKey && userKey.trim()) keys.push(userKey.trim());

  // 2. Admin System keys from Firestore (realtime synced to localStorage)
  const sys1 = localStorage.getItem("ttu_system_key_1");
  const sys2 = localStorage.getItem("ttu_system_key_2");
  const sys3 = localStorage.getItem("ttu_system_key_3");
  if (sys1 && sys1.trim()) keys.push(sys1.trim());
  if (sys2 && sys2.trim()) keys.push(sys2.trim());
  if (sys3 && sys3.trim()) keys.push(sys3.trim());

  // 3. Client-side Env key overrides
  const metaObj = (typeof import.meta !== 'undefined') ? (import.meta as any) : null;
  const env1 = metaObj?.env?.VITE_GEMINI_API_KEY;
  const env2 = metaObj?.env?.GEMINI_API_KEY;
  if (env1 && env1.trim()) keys.push(env1.trim());
  if (env2 && env2.trim()) keys.push(env2.trim());

  // 4. Default developer key as absolute fallback
  keys.push("AIzaSyDUqQ7LNP_3dUy4uOCjcx_hbRwLgi8bEpU");

  // Deduplicate keys
  return Array.from(new Set(keys)).filter(k => k.length > 0);
}

// Verified pool of high-quality active Unsplash image URLs to prevent broken image errors (404)
export const VERIFIED_UNSPLASH_IMAGE_POOL: Record<string, string> = {
  gotongRoyong: "https://images.unsplash.com/photo-1610483178766-02e071e6be12?w=600&auto=format&fit=crop&q=80",
  indonesiaFlag: "https://images.unsplash.com/photo-1577964955725-b4618a00282b?w=600&auto=format&fit=crop&q=80",
  classroom: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80",
  reading: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80",
  playing: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80",
  schoolInteraction: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80",
  soccer: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=80",
  science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
  family: "https://images.unsplash.com/photo-1542037104857-ffbe0bb7ebb3?w=600&auto=format&fit=crop&q=80",
  art: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80",
  traditionalMarket: "https://images.unsplash.com/photo-1590224790079-66810260db97?w=600&auto=format&fit=crop&q=80",
  indonesianCulture: "https://images.unsplash.com/photo-1610116306796-6ebd3051c3d8?w=600&auto=format&fit=crop&q=80",
  cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
  dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
  bird: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=600&auto=format&fit=crop&q=80",
  fish: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80",
  rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80",
  animals: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&auto=format&fit=crop&q=80",
  astronomy: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop&q=80",
  healthyDiet: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
  bicycling: "https://images.unsplash.com/photo-1485550409059-9afb054cada4?w=600&auto=format&fit=crop&q=80",
  computers: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80",
  spiritual: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
  indonesianGeography: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80",
  lushNature: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80",
  defaultEdu: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80"
};

// Maps a question to a 100% working, beautiful and relevant Unsplash image based on topic context
export function getRelevantVerifiedUnsplashUrl(
  subject: string, 
  questionText: string, 
  materi: string, 
  stimulusText: string, 
  imagenPrompt: string = ""
): string {
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

  if (isPjokAndSports) {
    if (/\bbola\b/i.test(textToScan) || /\bsepak\b/i.test(textToScan) || /\bgawang\b/i.test(textToScan) || /\bfutsal\b/i.test(textToScan)) {
      return VERIFIED_UNSPLASH_IMAGE_POOL.soccer;
    }
    return VERIFIED_UNSPLASH_IMAGE_POOL.playing;
  }
  
  if (
    /\bbertemu\b/i.test(textToScan) || 
    /\bmenyapa\b/i.test(textToScan) || 
    /\bsalam\b/i.test(textToScan) || 
    /\bsapa\b/i.test(textToScan) || 
    /\bberpapasan\b/i.test(textToScan) ||
    /\bkoridor\b/i.test(textToScan) || 
    /\bberbincang\b/i.test(textToScan) ||
    /\bteman\b/i.test(textToScan) ||
    /\bsahabat\b/i.test(textToScan) ||
    /\bkawan\b/i.test(textToScan) ||
    /\bkelas\b/i.test(textToScan) ||
    /\bsekolah\b/i.test(textToScan) ||
    /\banak\b/i.test(textToScan) ||
    /\bsiswa\b/i.test(textToScan) ||
    /\bmurid\b/i.test(textToScan) ||
    /\bfisik\b/i.test(textToScan) ||
    /\brambut\b/i.test(textToScan) ||
    /\bkulit\b/i.test(textToScan) ||
    /\btinggi\b/i.test(textToScan) ||
    /\bbadan\b/i.test(textToScan) ||
    (/\bguru\b/i.test(textToScan) && (/\bmurid\b/i.test(textToScan) || /\bsiswa\b/i.test(textToScan) || /\banak\b/i.test(textToScan) || /\bandi\b/i.test(textToScan) || /\bbudi\b/i.test(textToScan) || /\bcici\b/i.test(textToScan) || /\bdedi\b/i.test(textToScan)))
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.schoolInteraction;
  }

  // Animal matches with word boundaries to prevent false positives (like "educational" matching "cat")
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
  if (/\bhewan\b/i.test(textToScan) || /\bbinatang\b/i.test(textToScan) || /\bfauna\b/i.test(textToScan) || /\bsatwa\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.animals;
  }

  if (/\bindonesia\b/i.test(textToScan) || /\bpancasila\b/i.test(textToScan) || /\bgaruda\b/i.test(textToScan) || /\bupacara\b/i.test(textToScan) || /\bbendera\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.indonesiaFlag;
  }

  if (/\bkelas\b/i.test(textToScan) || /\bpapan tulis\b/i.test(textToScan) || /\bmeja\b/i.test(textToScan) || /\bbangku\b/i.test(textToScan) || /\bsekolah\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.classroom;
  }

  if (/\bbaca\b/i.test(textToScan) || /\bmembaca\b/i.test(textToScan) || /\bbuku\b/i.test(textToScan) || /\bperpustakaan\b/i.test(textToScan) || /\bnovel\b/i.test(textToScan) || /\bcerita\b/i.test(textToScan)) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.reading;
  }

  if (
    /\beksperimen\b/i.test(textToScan) || 
    /\bpercobaan\b/i.test(textToScan) || 
    /\bsains\b/i.test(textToScan) || 
    /\bipas\b/i.test(textToScan) || 
    /\blaboratorium\b/i.test(textToScan) || 
    /\bfisika\b/i.test(textToScan) || 
    /\bkimia\b/i.test(textToScan) || 
    /\bbiologi\b/i.test(textToScan) || 
    /\borgan\b/i.test(textToScan) || 
    /\bpencernaan\b/i.test(textToScan) || 
    /\btulang\b/i.test(textToScan) || 
    /\bgaya magnet\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.science;
  }

  if (
    /\bsepak bola\b/i.test(textToScan) || 
    /\bfutsal\b/i.test(textToScan) || 
    /\bgawang\b/i.test(textToScan) || 
    (/\bbola\b/i.test(textToScan) && (/\btendang\b/i.test(textToScan) || /\blapangan\b/i.test(textToScan)))
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.soccer;
  }

  if (
    /\bgotong\b/i.test(textToScan) || 
    /\bbersih\b/i.test(textToScan) || 
    /\bsapu\b/i.test(textToScan) || 
    /\bsampah\b/i.test(textToScan) || 
    /\blap\b/i.test(textToScan) || 
    /\bkerja bakti\b/i.test(textToScan) || 
    /\bpiket\b/i.test(textToScan) || 
    /\broyong\b/i.test(textToScan) ||
    /\btanam\b/i.test(textToScan) || 
    /\bkebun\b/i.test(textToScan) || 
    /\bsiram\b/i.test(textToScan) || 
    /\bpupuk\b/i.test(textToScan) || 
    /\bmerawat tanaman\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.gotongRoyong;
  }

  if (
    /\bmain\b/i.test(textToScan) || 
    /\bbermain\b/i.test(textToScan) || 
    /\bkelereng\b/i.test(textToScan) || 
    /\blari\b/i.test(textToScan) || 
    /\blompat\b/i.test(textToScan) || 
    /\btali\b/i.test(textToScan) || 
    /\bsenam\b/i.test(textToScan) || 
    /\bolah raga\b/i.test(textToScan) || 
    /\bjasmani\b/i.test(textToScan) ||
    /\bsalam\b/i.test(textToScan) || 
    /\bsapa\b/i.test(textToScan) || 
    /\bbertemu\b/i.test(textToScan) || 
    /\bpagi\b/i.test(textToScan) || 
    /\bsiang\b/i.test(textToScan) || 
    /\bsore\b/i.test(textToScan) || 
    /\bmalam\b/i.test(textToScan) || 
    /\bgerbang\b/i.test(textToScan) || 
    /\bhello\b/i.test(textToScan) || 
    /\bgreetings\b/i.test(textToScan) || 
    /\bmorning\b/i.test(textToScan) || 
    /\bafternoon\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.playing;
  }

  if (
    /\bkeluarga\b/i.test(textToScan) || 
    /\bibu\b/i.test(textToScan) || 
    /\bbapak\b/i.test(textToScan) || 
    /\bayah\b/i.test(textToScan) || 
    /\bortu\b/i.test(textToScan) || 
    /\bkakak\b/i.test(textToScan) || 
    /\bdapur\b/i.test(textToScan) || 
    /\bmencuci\b/i.test(textToScan) || 
    /\bmemasak\b/i.test(textToScan) || 
    /\brumah\b/i.test(textToScan) || 
    /\bbantu\b/i.test(textToScan) || 
    /\bmembantu\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.family;
  }

  if (
    /\blukis\b/i.test(textToScan) || 
    /\bmenggambar\b/i.test(textToScan) || 
    /\bmewarnai\b/i.test(textToScan) || 
    /\bkrayon\b/i.test(textToScan) || 
    /\bkesenian\b/i.test(textToScan) || 
    /\bseni rupa\b/i.test(textToScan) || 
    /\bseni musik\b/i.test(textToScan) || 
    /\bseni tari\b/i.test(textToScan) || 
    /\bpahat\b/i.test(textToScan) || 
    /\borigami\b/i.test(textToScan) || 
    /\bkuas lukis\b/i.test(textToScan) || 
    /\balat musik\b/i.test(textToScan) || 
    /\bnyanyi\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.art;
  }

  if (
    /\bpasar\b/i.test(textToScan) || 
    /\btoko\b/i.test(textToScan) || 
    /\bwarung\b/i.test(textToScan) || 
    /\bjual\b/i.test(textToScan) || 
    /\bbeli\b/i.test(textToScan) || 
    /\bpedagang\b/i.test(textToScan) || 
    /\btransaksi\b/i.test(textToScan) || 
    /\buang\b/i.test(textToScan) || 
    /\bkoperasi\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.traditionalMarket;
  }

  if (
    /\bplanet\b/i.test(textToScan) || 
    /\bbintang\b/i.test(textToScan) || 
    /\btatasurya\b/i.test(textToScan) || 
    /\bmatahari\b/i.test(textToScan) || 
    /\bbulan\b/i.test(textToScan) || 
    /\bastronomi\b/i.test(textToScan) || 
    /\bbumi\b/i.test(textToScan) || 
    /\bantariksa\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.astronomy;
  }

  if (
    /\bbuah\b/i.test(textToScan) || 
    /\bsayur\b/i.test(textToScan) || 
    /\bgizi\b/i.test(textToScan) || 
    /\bmakanan\b/i.test(textToScan) || 
    /\bvitamin\b/i.test(textToScan) || 
    /\bsehat\b/i.test(textToScan) || 
    /\bsusu\b/i.test(textToScan) || 
    /\bmakan\b/i.test(textToScan) || 
    /\bmenu sehat\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.healthyDiet;
  }

  if (
    /\bsepeda\b/i.test(textToScan) || 
    /\bbersepeda\b/i.test(textToScan) || 
    /\bnaik sepeda\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.bicycling;
  }

  if (
    /\bkomputer\b/i.test(textToScan) || 
    /\bict\b/i.test(textToScan) || 
    /\binternet\b/i.test(textToScan) || 
    /\blaptop\b/i.test(textToScan) || 
    /\bdigital\b/i.test(textToScan) || 
    /\btablet\b/i.test(textToScan) || 
    /\bteknologi\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.computers;
  }

  if (
    /\bagama\b/i.test(textToScan) || 
    /\bibadah\b/i.test(textToScan) || 
    /\bsholat\b/i.test(textToScan) || 
    /\bberdoa\b/i.test(textToScan) || 
    /\bdoa\b/i.test(textToScan) || 
    /\biman\b/i.test(textToScan) || 
    /\bsopan\b/i.test(textToScan) || 
    /\bjujur\b/i.test(textToScan) || 
    /\bmasjid\b/i.test(textToScan) || 
    /\bgereja\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.spiritual;
  }

  if (
    /\bpeta\b/i.test(textToScan) || 
    /\batlas\b/i.test(textToScan) || 
    /\bgeografi\b/i.test(textToScan) || 
    /\bgunung\b/i.test(textToScan) || 
    /\blaut\b/i.test(textToScan) || 
    /\bpantai\b/i.test(textToScan) || 
    /\bsungai\b/i.test(textToScan) || 
    /\bpulau\b/i.test(textToScan) || 
    /\bpemandangan\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.indonesianGeography;
  }

  if (
    /\bhutan\b/i.test(textToScan) || 
    /\bpohon\b/i.test(textToScan) || 
    /\balam\b/i.test(textToScan) || 
    /\breboisasi\b/i.test(textToScan) || 
    /\blingkungan hidup\b/i.test(textToScan) || 
    /\bdaun\b/i.test(textToScan)
  ) {
    return VERIFIED_UNSPLASH_IMAGE_POOL.lushNature;
  }

  return VERIFIED_UNSPLASH_IMAGE_POOL.defaultEdu;
}

/**
 * Translates and elaborates an Indonesian question detail into a detailed English Imagen prompt.
 * Runs directly on the client side using the active API key.
 */
export async function translateAndElaboratePromptForImagenClient(
  subject: string,
  question: QuestionItem,
  rawPrompt?: string,
  activeKey?: string
): Promise<string> {
  if (!activeKey) return rawPrompt || question.imagenPrompt || question.imagePrompt || question.questionText || "";

  const rawTextToAnalyze = `
    Mata Pelajaran / Subject: ${subject || "Umum"}
    Materi Pokok / Topic: ${question.materi || ""}
    Stimulus / Context: ${question.stimulusText || ""}
    Butir Soal / Question: ${question.questionText || ""}
    User Suggested Prompt: ${rawPrompt || ""}
  `.trim();

  const isPjok = (subject || "").toLowerCase().includes("pjok") || 
                  (subject || "").toLowerCase().includes("jasmani") || 
                  (subject || "").toLowerCase().includes("olahraga") ||
                  (subject || "").toLowerCase().includes("penjas") ||
                  (question.materi && question.materi.toLowerCase().includes("olahraga")) ||
                  (question.questionText && question.questionText.toLowerCase().includes("gerak"));

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
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
    const payload = {
      contents: [{ parts: [{ text: `${instructions}\n\nInput Indonesian Context:\n${rawTextToAnalyze}` }] }],
      systemInstruction: { parts: [{ text: "You are a professional image prompt generator. You only output the final optimized English prompt." }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        return text.trim();
      }
    }
  } catch (err) {
    console.error("[translateAndElaboratePromptForImagenClient] Failed client-side:", err);
  }

  return rawPrompt || question.imagenPrompt || question.imagePrompt || question.questionText || "";
}

/**
 * Direct Imagen model generation function.
 * Prioritizes client-side API Key pool rotation, using the correct REST parameters.
 */
export async function generateImage(
  imagePromptText: string,
  subject?: string,
  question?: QuestionItem
): Promise<string | null> {
  const keysPool = getApiKeysPool();

  // Helper: Panggil Imagen via REST API (Google AI Studio)
  async function tryImagenModel(
    modelId: string, 
    activeKey: string, 
    promptText: string
  ): Promise<{ success: boolean; data?: string; fatalKeyError?: boolean }> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateImages?key=${activeKey}`;
    const payload = {
      prompt: `Create an educational illustration for Indonesian elementary school (SD) students. 
${promptText}
Style: Clean 2D vector flat illustration, white background, educational clipart style, no text, no letters, suitable for exam paper.`,
      numberOfImages: 1,
      aspectRatio: "1:1",
      outputMimeType: "image/jpeg"
    };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[imageUtils] ${modelId} REST error ${res.status}:`, errText);
        // Status 400 (Bad request / invalid key), 403 (Forbidden), 429 (Quota exceeded) represent key-level issues
        const fatalKeyError = res.status === 400 || res.status === 401 || res.status === 403 || res.status === 429;
        return { success: false, fatalKeyError };
      }
      const json = await res.json();
      const bytes = json.generatedImages?.[0]?.image?.imageBytes;
      if (bytes) {
        console.log(`[imageUtils] Gambar berhasil dibuat via REST ${modelId}`);
        return { success: true, data: `data:image/jpeg;base64,${bytes}` };
      }
      return { success: false };
    } catch (e: any) {
      console.warn(`[imageUtils] ${modelId} exception:`, e.message);
      const msg = String(e.message || "").toLowerCase();
      const fatalKeyError = msg.includes("key") || msg.includes("quota") || msg.includes("limit") || msg.includes("auth");
      return { success: false, fatalKeyError };
    }
  }

  for (const activeKey of keysPool) {
    console.log(`[imageUtils] Menjalankan generateImage dengan key: ${activeKey.slice(0, 10)}...`);

    // 1. Translate and elaborate the Indonesian prompt on the client side using the active key first
    let finalPrompt = imagePromptText;
    if (subject && question) {
      try {
        finalPrompt = await translateAndElaboratePromptForImagenClient(subject, question, imagePromptText, activeKey);
        console.log(`[imageUtils] Elaborated prompt using key: "${finalPrompt}"`);
      } catch (e) {
        console.warn(`[imageUtils] Elaboration failed, using raw:`, e);
      }
    }

    const models = ["imagen-3.0-generate-002", "imagen-3.0-capability-001", "imagen-3.0-generate-001"];
    let skipKey = false;

    for (const modelId of models) {
      if (skipKey) break;
      const result = await tryImagenModel(modelId, activeKey, finalPrompt);
      if (result.success && result.data) {
        return result.data;
      }
      if (result.fatalKeyError) {
        console.warn(`[imageUtils] Fatal error for key ${activeKey.slice(0, 10)}... skipping this key for other models.`);
        skipKey = true;
      }
    }
  }

  console.warn("[imageUtils] Semua model dan semua API Key client-side gagal.");
  return null;
}

/**
 * Generates an image for a single question item.
 * Prioritizes direct Web client-side generation, otherwise falls back instantly to Unsplash.
 */
export async function generateImageForSoal(
  subject: string,
  question: QuestionItem
): Promise<QuestionItem> {
  let prompt = question.imagenPrompt || question.imagePrompt || "";
  
  if (!prompt) {
    const materiContext = question.materi ? `about ${question.materi}` : "";
    prompt = `Vibrant 2D vector flat educational illustration ${materiContext} for elementary school grade exam. Subject description or visual context: "${question.questionText}". Focus purely on the main visual elements. Absolutely white clean background, neat educational clipart style. Clean flat lines. ABSOLUTELY NO letters, labels, or written text.`;
  }

  try {
    // 1. Coba panggil direktori client-side generateImage jika kunci tersedia di Browser/Vite
    const clientGeneratedBase64 = await generateImage(prompt, subject, question);
    if (clientGeneratedBase64) {
      console.log(`[imageUtils] Client-side Image Generation succeeded for question #${question.number}`);
      return {
        ...question,
        imageUrl: clientGeneratedBase64,
        svgContent: undefined
      };
    }

    // 2. Coba panggil server-side API jika client-side gagal
    let serverGeneratedUrl = "";
    try {
      console.log(`[imageUtils] Client-side failed, trying server-side /api/generate-image for question #${question.number}...`);
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-api-key": localStorage.getItem("ttu_user_api_key") || ""
        },
        body: JSON.stringify({
          subject,
          question,
          prompt,
          userApiKey: localStorage.getItem("ttu_user_api_key") || "",
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          serverGeneratedUrl = data.imageUrl;
        }
      }
    } catch (serverErr) {
      console.warn("[imageUtils] Server-side image generation failed/timed out:", serverErr);
    }

    if (serverGeneratedUrl) {
      console.log(`[imageUtils] Server-side Image Generation succeeded for question #${question.number}`);
      return {
        ...question,
        imageUrl: serverGeneratedUrl,
        svgContent: undefined
      };
    }

    // 3. Jika gagal, langsung gunakan Unsplash fallback di client-side
    console.log(`[imageUtils] Both client and server image generation failed. Resolving to Unsplash fallback URL...`);
    const fallbackUrl = getRelevantVerifiedUnsplashUrl(
      subject || "Umum", 
      question.questionText || "", 
      question.materi || "", 
      question.stimulusText || "", 
      prompt
    );
    return {
      ...question,
      imageUrl: fallbackUrl,
      svgContent: undefined
    };
  } catch (error) {
    console.error(`[imageUtils] Failed to generate image for question #${question.number}:`, error);
    // Safe fallback to Unsplash
    const fallbackUrl = getRelevantVerifiedUnsplashUrl(
      subject || "Umum", 
      question.questionText || "", 
      question.materi || "", 
      question.stimulusText || "", 
      prompt
    );
    return {
      ...question,
      imageUrl: fallbackUrl,
      svgContent: undefined
    };
  }
}

/**
 * Generates illustrations for multiple questions up to the calculated 25% target count.
 * Progress is reported via onProgress callback.
 */
export async function generateAllImages(
  subject: string,
  questions: QuestionItem[],
  onProgress: (percent: number, current: number, total: number) => void
): Promise<QuestionItem[]> {
  const totalQuestions = questions.length;
  if (totalQuestions === 0) return questions;

  const targetCount = hitungSoalBergambar(totalQuestions);
  
  // Prioritize questions: visually demanding first, then by sequence, but exclude story stimuli
  const indexedList = questions.map((q, idx) => {
    const isStory = isQuestionAStoryStimulus(q);
    const demanding = isStory ? false : isQuestionVisuallyDemanding(q);
    return { q, idx, demanding, isStory };
  });
  
  // Filter out any story stimulus to keep them strictly verbal without artificial mismatch images
  const candidates = indexedList.filter(item => !item.isStory);

  // Sort visually demanding to the front, but keep original relative order inside groups.
  // ONLY illustrate questions that are genuinely visually demanding or explicitly marked as demanding.
  const sortedToIllustrate = candidates
    .filter(item => item.demanding)
    .sort((a, b) => (b.demanding ? 1 : 0) - (a.demanding ? 1 : 0))
    .slice(0, targetCount)
    .map(item => item.idx);

  const updatedQuestions = [...questions];
  let processedCount = 0;

  // Let UI know we are starting
  onProgress(0, 0, targetCount);

  for (let i = 0; i < totalQuestions; i++) {
    if (sortedToIllustrate.includes(i)) {
      const q = questions[i];
      try {
        const updatedQ = await generateImageForSoal(subject, q);
        updatedQuestions[i] = updatedQ;
      } catch (e) {
        console.error(`Failed during batch illustration of index ${i}:`, e);
      }
      
      processedCount++;
      const percent = Math.round((processedCount / targetCount) * 100);
      onProgress(percent, processedCount, targetCount);
    }
  }

  return updatedQuestions;
}

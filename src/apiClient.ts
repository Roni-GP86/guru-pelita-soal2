import { FALLBACK_CURRICULUMS, generateFallbackKisiKisi, generateFallbackSoal, getTopicMetadata, getComplexAndMatchingContent } from "../server-fallback";
import { getRelevantVerifiedUnsplashUrl, VERIFIED_UNSPLASH_IMAGE_POOL } from "./imageUtils";


// Developer Default API Key
const DEFAULT_GEMINI_API_KEY = "AIzaSyDUqQ7LNP_3dUy4uOCjcx_hbRwLgi8bEpU";

// Helper to get active API keys pool in priority order
export function getApiKeysPool(): string[] {
  const keys: string[] = [];
  
  // 1. Admin System keys from Firestore (realtime synced to localStorage)
  const sys1 = localStorage.getItem("ttu_system_key_1");
  const sys2 = localStorage.getItem("ttu_system_key_2");
  const sys3 = localStorage.getItem("ttu_system_key_3");
  if (sys1 && sys1.trim()) keys.push(sys1.trim());
  if (sys2 && sys2.trim()) keys.push(sys2.trim());
  if (sys3 && sys3.trim()) keys.push(sys3.trim());

  // 2. Client-side Env key overrides
  const metaObj = (typeof import.meta !== 'undefined') ? (import.meta as any) : null;
  const env1 = metaObj?.env?.VITE_GEMINI_API_KEY;
  const env2 = metaObj?.env?.GEMINI_API_KEY;
  if (env1 && env1.trim()) keys.push(env1.trim());
  if (env2 && env2.trim()) keys.push(env2.trim());

  // 3. Custom User Key from Profile
  const userKey = localStorage.getItem("ttu_user_api_key") || localStorage.getItem("gemini_api_key");
  if (userKey && userKey.trim()) keys.push(userKey.trim());

  // 4. Default developer key as absolute fallback
  keys.push(DEFAULT_GEMINI_API_KEY);

  // Deduplicate keys
  return Array.from(new Set(keys)).filter(k => k.length > 0);
}

// Helper to get active API key
function getActiveApiKey(): string {
  const pool = getApiKeysPool();
  return pool[0] || DEFAULT_GEMINI_API_KEY;
}

// Clean materi string
export function cleanMateri(materiStr: string): string {
  if (!materiStr) return "";
  
  let clean = materiStr.trim();
  const prefixesToRemove = [
    /^(materi|topik|pembelajaran|bahasan|pokok bahasan|konsep dasar|konsep|belajar tentang|belajar|mengenal tentang|mengenal|pemahaman tentang|pemahaman)\s+(tentang|mengenai)\s+/gi,
    /^(materi|topik|pembelajaran|bahasan|pokok bahasan|konsep dasar|konsep|belajar|mengenal|pemahaman)\s+/gi,
    /\.*$/g
  ];

  for (const regex of prefixesToRemove) {
    clean = clean.replace(regex, "");
  }

  clean = clean.trim();

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

  let finalMateri = uniqueWords.join(" ");
  if (finalMateri.length > 0) {
    finalMateri = finalMateri.charAt(0).toUpperCase() + finalMateri.slice(1);
  }

  return finalMateri;
}

// Clean answer key for multiple choice
export function cleanKisiKisiAnswerKey(answerKey: string, questionType: string, index: number): string {
  const cleanType = (questionType || "").trim().toLowerCase();
  let key = (answerKey || "").trim();
  
  if (cleanType === "pilihan ganda") {
    const match = key.match(/^[a-dA-D](?:\b|[.\s\)]|$)/);
    if (match) {
      return match[0].charAt(0).toUpperCase();
    }
    const generalMatch = key.match(/\b([A-D])\b/i);
    if (generalMatch) {
      return generalMatch[1].toUpperCase();
    }
    // Fallback: RANDOM — NEVER index % 4 (causes A,B,C,D,A,B,C,D pattern!)
    const letters = ["A", "B", "C", "D"];
    return letters[Math.floor(Math.random() * 4)];
  }

  if (cleanType === "pilihan ganda kompleks") {
    // Return valid multi-answer format if missing or invalid
    if (!key || key === "" || key.toLowerCase() === "lihat pairs") {
      const allOpts = ["A", "B", "C", "D"];
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

// Align elements and CP with official curriculum data
export function alignKisiKisiWithCurriculum(kisiRows: any[], curriculumData: any[]): any[] {
  if (!curriculumData || !Array.isArray(curriculumData) || curriculumData.length === 0) {
    return kisiRows;
  }

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
                clean: cleanMateri(m).toLowerCase().replace(/[^a-z0-9]/g, ""),
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
    const cleanRowMateri = cleanMateri(row.materi || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    let bestMatch = officialMateriList.find(item => item.clean === cleanRowMateri);

    if (!bestMatch) {
      bestMatch = officialMateriList.find(item => 
        item.clean.includes(cleanRowMateri) || cleanRowMateri.includes(item.clean)
      );
    }

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

// Unsplash helper imported from imageUtils above

// Subject Specific Rules compiler (client-side)
function getSubjectSpecificRules(subject: string, gradeClass: string): { rules: string; systemInstruction: string } {
  const subjectLower = (subject || "").toLowerCase();
  const classLower = (gradeClass || "").toLowerCase();
  const isFaseA = classLower.includes("kelas 1") || classLower.includes("kelas 2") || classLower.includes("fase a") || classLower.includes("kelas 1-2") || classLower.includes("fase-a");
  
  let rules = "";
  let systemInstruction = "Anda adalah pengembang instrumen asesmen SD di Indonesia yang ahli, guru kelas profesional, psikolog perkembangan anak, desainer visual, dan prompt engineer Imagen. Anda menerjemahkan rancangan kisi-kisi ujian menjadi naskah soal asli yang utuh, mendidik, berpijak sepenuhnya pada bahasa Indonesia murni yang SANGAT SEDERHANA, lugas, ramah anak, serta bebas dari kosakata asing atau serapan rumit, disesuaikan dengan tingkat kognitif dan kemampuan realistik anak kelas terkait.";

  rules += `
    ========================================================================
    ATURAN ISOLASI MATA PELAJARAN YANG SANGAT KETAT (MANDATORI):
    Anda membuat soal untuk Mata Pelajaran: **${subject}** (Kelas: ${gradeClass}).
    SANGAT DILARANG KERAS MENCAMPURADUKKAN materi, istilah khusus, rumus, atau konsep dari mata pelajaran lain!
  `;

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

  if (isFaseA) {
    rules += `
    ⚠️⚠️ SYARAT MUTLAK BAHASA & TINGKAT KESULITAN UNTUK ANAK KELAS 1-2 SD / FASE A (MUTLAK):
    Siswa Kelas 1-2 SD (usia 7-8 tahun) baru belajar membaca lancar dan memiliki kemampuan kognitif dasar yang konkrit. Anda HARUS mematuhi ATURAN MUTLAK berikut:
    1. Gunakan kosakata yang SANGAT SEDERHANA dan kata-kata sehari-hari yang benar-benar akrab dipahami anak kecil usia 7-8 tahun. DILARANG menggunakan istilah rumit, kata abstrak bermakna luas, kata berkognisi tinggi, atau kata serapan asing teknik (seperti: mengklasifikasikan, mengidentifikasi, komponen, struktur, simbolis, representasi, strategis, dampak, hasil, menyimpulkan, hubungan, karakteristik, efisien, dsb). Ganti dengan kata yang biasa didengar anak (misal: "mengelompokkan" diganti "memilih/memisahkan", "mengidentifikasi" diganti "menunjukkan/menemukan", "komponen" diganti "bagian", "struktur" diganti "bentuk", "dampak" diganti "akibat", "menyimpulkan" diganti "menebak/mengisi").
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
  `;

  if (subjectLower.includes("pancasila") || subjectLower.includes("pkn") || subjectLower.includes("kewarganegaraan")) {
    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN PENDIDIKAN PANCASILA JENJANG SD DI INDONESIA.
 TUGAS UTAMA:
 Membuat soal Pendidikan Pancasila SD beserta gambar/SVG stimulus yang benar-benar relevan dengan isi soal, tingkat kelas, dan materi Pendidikan Pancasila (Pancasila, UUD 1945, Bhinneka Tunggal Ika, NKRI).
 ATURAN PALING PENTING:
 - DILARANG keras mencampurkan materi Matematika (berhitung, kalkulasi angka), sains/IPAS (biologi hewan/tumbuhan, geografi alam), atau analisis bahasa murni ke dalam soal Pendidikan Pancasila.
 - Fokus utama hanya pada pemahaman nilai luhur Pancasila, sila pancasila, gotong royong, aturan rumah/sekolah, serta hak dan kewajiban anak.`;
  }
  else if (subjectLower.includes("indonesia") || subjectLower.includes("bhs") || subjectLower.includes("bahasa")) {
    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN BAHASA INDONESIA JENJANG SD DI INDONESIA.
TUGAS UTAMA:
Membuat soal Bahasa Indonesia SD beserta gambar stimulus yang benar-benar relevan dengan isi soal, tingkat kelas, dan tujuan pembelajaran Bahasa Indonesia.
ATURAN PALING PENTING:
- DILARANG mencampurkan materi IPAS ekonomi/sains, Matematika numerik murni, Pendidikan Pancasila kenegaraan murni, atau mata pelajaran lain ke dalam soal Bahasa Indonesia.
- Fokus utama soal hanya pada kemampuan Bahasa Indonesia: membaca, memahami teks cerita, mengukur kosakata, menyusun kalimat, ide pokok paragraf, tokoh, pesan moral, puisi/pantun, dialog, menyimak, dan penggunaan ejaan bahasa yang baik.`;
  }
  else if (subjectLower.includes("matematik") || subjectLower.includes("calc")) {
    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN MATEMATIKA JENJANG SD DI INDONESIA.
TUGAS UTAMA:
Membuat soal Matematika SD beserta diagram gambar SVG matematika yang 100% presisi, terukur, dan bermakna edukatif untuk materi bilangan, geometri, atau statistika.
ATURAN PALING PENTING:
- DILARANG mencampurkan konsep Pendidikan Pancasila, sains ekologi/biologi IPAS, atau analisis tata bahasa murni ke dalam soal Matematika.
- Fokus utama hanya pada operasi aritmatika, penalaran kuantitatif matematika, geometri dasar, dan pengolahan data.`;
  }
  else if (subjectLower.includes("ipas") || subjectLower.includes("ipa") || subjectLower.includes("ips") || subjectLower.includes("sains")) {
    systemInstruction = `ANDA ADALAH SISTEM GENERATOR SOAL DAN GAMBAR KHUSUS MATA PELAJARAN IPAS JENJANG SD DI INDONESIA.
TUGAS UTAMA:
Membuat soal IPAS SD beserta ilustrasi gambar/diagram sains atau kemanusiaan daerah yang 100% akurat, berbobot ilmiah sederhana, dan ramah anak.
ATURAN PALING PENTING:
- DILARANG mencampurkan perhitungan rumus matematika rumit tanpa konsep sains, teori ketatanegaraan murni, atau linguistik bahasa murni ke dalam soal IPAS.`;
  }
  else if (subjectLower.includes("pjok") || subjectLower.includes("jasmani") || subjectLower.includes("olahraga") || subjectLower.includes("penjas")) {
    systemInstruction = `ANDA ADALAH GURU PJOK DAN AHLI ASESMEN SD KELAS 4 DI INDONESIA SERTA PROMPT ENGINEER IMAGEN PROFESSIONAL.
TUGAS UTAMA ANDA:
Membuat soal PJOK SD Kelas 4 yang sangat presisi sesuai indikator kisi-kisi, dengan aturan ketat mengenai penggunaan gambar stimulus yang relevan dan akurat.`;
  }

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

// Helper to call direct Gemini AI REST API with key rotation pool
async function callGeminiDirect(prompt: string, systemInstruction: string, schema: any): Promise<any> {
  const keysPool = getApiKeysPool();
  let lastError: any = null;

  for (const apiKey of keysPool) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Status ${response.status} - ${errText}`);
      }

      const json = await response.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("No text returned in Gemini REST API response.");
      }
      
      return JSON.parse(text);
    } catch (err: any) {
      console.warn(`[apiClient] Direct Gemini API call failed with key: ${apiKey.slice(0, 10)}... Trying next key. Error:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`Gemini REST API Error: Seluruh API Key di pool telah dicoba dan semuanya gagal. Error terakhir: ${lastError ? lastError.message : "tidak diketahui"}`);
}

// Client-Side AI client & proxy switcher: Generate Topics
export async function apiGenerateTopics(subject: string, gradeClass: string): Promise<any> {
  try {
    // 1. Try local/backend endpoint
    const response = await fetch("/api/generate-topics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-api-key": localStorage.getItem("ttu_user_api_key") || ""
      },
      body: JSON.stringify({ 
        subject, 
        gradeClass, 
        userApiKey: localStorage.getItem("ttu_user_api_key") || "",
        customKeys: getApiKeysPool()
      })
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Backend status: ${response.status}`);
  } catch (err) {
    console.warn("Backend /api/generate-topics failed/unavailable, trying direct Gemini REST API...", err);
    
    // 2. Direct client-side call to Google Gemini REST API
    try {
      const schema = {
        type: "ARRAY",
        description: "Daftar Capaian Pembelajaran beserta Elemen dan topik rincian",
        items: {
          type: "OBJECT",
          properties: {
            cp: { type: "STRING", description: "Deskripsi singkat Capaian Pembelajaran (CP) untuk elemen terkait." },
            element: { type: "STRING", description: "Nama elemen kurikulum (contoh: Bilangan, Aljabar)." },
            topics: {
              type: "ARRAY",
              description: "Daftar topik bahasan utama kurikulum.",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING", description: "Nama topik bahasan utama." },
                  materi: {
                    type: "ARRAY",
                    items: { type: "STRING" },
                    description: "Daftar 3-4 sub-materi."
                  }
                },
                required: ["name", "materi"]
              }
            }
          },
          required: ["cp", "element", "topics"]
        }
      };

      const prompt = `
        Anda adalah pakar kurikulum pendidikan di Indonesia untuk tingkat Sekolah Dasar (SD) Kurikulum Merdeka.
        Tolong buatkan daftar Capaian Pembelajaran (CP) beserta Elemen yang sesuai untuk mata pelajaran "${subject}" dan tingkat kelas "${gradeClass}".
        Untuk setiap Elemen, buatkan juga 3-5 topik utama yang diajarkan di kelas tersebut.
        SANGAT PENTING: Untuk setiap topik, pecahkan menjadi 3-4 materi atau sub-kompetensi detail secara lebih rinci.
        Buat materi-materi tersebut kontekstual, spesifik, rill, dan sesuai standar nasional Kementerian Pendidikan.
      `;

      const result = await callGeminiDirect(prompt, "Anda adalah pengembang kurikulum nasional SD di Indonesia yang ahli.", schema);
      return result;
    } catch (apiErr) {
      console.error("Direct Gemini REST API also failed, using Offline Fallback...", apiErr);
      
      // 3. Hard Offline Fallback using server-fallback.ts
      const subjectName = subject || "Matematika";
      const currentPhase = ["Kelas 1", "Kelas 2"].includes(gradeClass) 
        ? "Fase A" 
        : ["Kelas 3", "Kelas 4"].includes(gradeClass) 
          ? "Fase B" 
          : "Fase C";
      
      const keyName = `${subjectName} - ${currentPhase}`;
      const fallbackData = FALLBACK_CURRICULUMS[keyName] || FALLBACK_CURRICULUMS[`${subjectName} - Fase B`] || FALLBACK_CURRICULUMS["Matematika - Fase B"];
      
      return fallbackData.map((item: any) => {
        return {
          element: item.element,
          cp: item.cp,
          topics: (item.topics || []).map((topicStr: string) => {
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
    }
  }
}

// Client-Side AI client & proxy switcher: Generate Kisi-Kisi
export async function apiGenerateKisiKisi(
  schoolInfo: any,
  subject: string,
  selectedTopics: string[],
  questionConfigs: any[],
  curriculumData: any[]
): Promise<any> {
  try {
    // 1. Try local/backend endpoint
    const response = await fetch("/api/generate-kisi-kisi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-api-key": localStorage.getItem("ttu_user_api_key") || ""
      },
      body: JSON.stringify({
        schoolInfo,
        subject,
        selectedTopics,
        questionConfigs,
        curriculumData,
        userApiKey: localStorage.getItem("ttu_user_api_key") || "",
        customKeys: getApiKeysPool()
      })
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Backend status: ${response.status}`);
  } catch (err) {
    console.warn("Backend /api/generate-kisi-kisi failed/unavailable, trying direct Gemini REST API...", err);
    
    // 2. Direct client-side call to Google Gemini REST API
    try {
      const { rules: subjectRules, systemInstruction: systemInstructionOverride } = getSubjectSpecificRules(subject, schoolInfo?.gradeClass || "Sekolah Dasar");
      
      const schema = {
        type: "ARRAY",
        description: "Daftar baris data tabel kisi-kisi soal",
        items: {
          type: "OBJECT",
          properties: {
            number: { type: "INTEGER", description: "Nomor urut soal." },
            cp: { type: "STRING", description: "Capaian Pembelajaran (CP) terkait." },
            element: { type: "STRING", description: "Elemen kurikulum terkait." },
            materi: { type: "STRING", description: "NAMA MATERI UTAMA SAJA (2-4 kata)." },
            indicator: { type: "STRING", description: "Indikator soal lengkap." },
            cognitiveLevel: { type: "STRING", description: "Tingkat kognitif (Level 1, Level 2, atau Level 3)." },
            questionType: { type: "STRING", description: "Bentuk Soal: 'Pilihan Ganda', 'Pilihan Ganda Kompleks', 'Menjodohkan', 'Isian Singkat', atau 'Uraian'." },
            answerKey: { type: "STRING", description: "Kunci jawaban tunggal atau jika PGK/Menjodohkan bisa koma separated." }
          },
          required: ["number", "cp", "element", "materi", "indicator", "cognitiveLevel", "questionType", "answerKey"]
        }
      };

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
        
        SANGAT PENTING:
        - Jangan pasangkan stimulus gambar apa pun.
        - Isi 'indicator' dengan indikator bersih langsung menerangkan stimulus teks/data.
        - ⚠️ WAJIB IKUTI KONFIGURASI JENIS SOAL: Jumlah dan jenis soal HARUS PERSIS sesuai Konfigurasi di atas. Jika ada 'Pilihan Ganda Kompleks', WAJIB gunakan 'Pilihan Ganda Kompleks'. Jika ada 'Menjodohkan', WAJIB gunakan 'Menjodohkan'. JANGAN ubah ke 'Pilihan Ganda' biasa!
        - ⚠️ ACAK KUNCI JAWABAN PG: Untuk soal Pilihan Ganda, kunci jawaban (A/B/C/D) WAJIB diacak total, tidak berpola. DILARANG pola A,B,C,D,A,B,C,D berulang!
        - Format keluaran JSON murni.
      `;

      const result = await callGeminiDirect(
        prompt, 
        systemInstructionOverride + "\n\nAnda menyusun matriks kisi-kisi ujian yang sangat detail namun sederhana.", 
        schema
      );

      // Clean & Align result
      if (Array.isArray(result)) {
        let cleaned = result.map((item: any, idx: number) => {
          if (item) {
            item.materi = cleanMateri(item.materi || "");
            item.answerKey = cleanKisiKisiAnswerKey(item.answerKey || "", item.questionType || "", idx);
          }
          return item;
        });
        return alignKisiKisiWithCurriculum(cleaned, curriculumData);
      }
      return result;
    } catch (apiErr) {
      console.error("Direct Gemini REST API also failed, using Offline Fallback...", apiErr);
      
      // 3. Hard Offline Fallback using server-fallback.ts
      const fallback = generateFallbackKisiKisi(schoolInfo, subject, selectedTopics, questionConfigs);
      let cleanedFallback = fallback.map((item: any, idx: number) => {
        if (item) {
          item.materi = cleanMateri(item.materi);
          item.answerKey = cleanKisiKisiAnswerKey(item.answerKey || "", item.questionType || "", idx);
        }
        return item;
      });
      return alignKisiKisiWithCurriculum(cleanedFallback, curriculumData);
    }
  }
}

// Client-Side AI client & proxy switcher: Generate Soal
export async function apiGenerateSoal(
  schoolInfo: any,
  subject: string,
  kisiKisi: any[]
): Promise<any> {
  const sanitizedKisiKisi = (kisiKisi || []).map((item: any) => {
    if (item && item.materi) {
      return {
        ...item,
        materi: cleanMateri(item.materi)
      };
    }
    return item;
  });

  try {
    // 1. Try local/backend endpoint
    const response = await fetch("/api/generate-soal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-api-key": localStorage.getItem("ttu_user_api_key") || ""
      },
      body: JSON.stringify({
        schoolInfo,
        subject,
        kisiKisi: sanitizedKisiKisi,
        userApiKey: localStorage.getItem("ttu_user_api_key") || "",
        customKeys: getApiKeysPool()
      })
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Backend status: ${response.status}`);
  } catch (err) {
    console.warn("Backend /api/generate-soal failed/unavailable, trying direct Gemini REST API...", err);
    
    // 2. Direct client-side call to Google Gemini REST API
    try {
      const { rules: subjectRules, systemInstruction: systemInstructionOverride } = getSubjectSpecificRules(subject, schoolInfo?.gradeClass || "Semua");
      
      const schema = {
        type: "ARRAY",
        description: "Daftar naskah soal ujian lengkap",
        items: {
          type: "OBJECT",
          properties: {
            number: { type: "INTEGER", description: "Nomor soal." },
            questionType: { type: "STRING", description: "Bentuk Soal ('Pilihan Ganda', 'Pilihan Ganda Kompleks', 'Menjodohkan', 'Isian Singkat', atau 'Uraian'). HARUS SAMA PERSIS dengan apa yang diminta di Kisi-Kisi." },
            cognitiveLevel: { type: "STRING", description: "Level kognitif soal." },
            materi: { type: "STRING", description: "Materi pokok." },
            stimulusText: { type: "STRING", description: "Teks stimulus pendukung." },
            questionText: { type: "STRING", description: "Pertanyaan soal." },
            options: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Pilihan jawaban atau pernyataan. Wajib diisi (A, B, C, D) jika PG. Wajib diisi 4 pernyataan jika tipe Pilihan Ganda Kompleks (PGK)."
            },
            answerKey: { type: "STRING", description: "Kunci jawaban (a, b, c, d untuk PG. Untuk PGK dipisah koma misal A,C. Untuk Menjodohkan tulis kuncinya)." },
            alternativeAnswers: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "Jawaban alternatif untuk Isian/Uraian."
            },
            pairs: {
              type: "ARRAY",
              items: { 
                type: "OBJECT",
                properties: {
                  question: { type: "STRING" },
                  answer: { type: "STRING" }
                },
                required: ["question", "answer"]
              },
              description: "WAJIB DIISI HANYA UNTUK SOAL MENJODOHKAN. Berisi pasangan pertanyaan/pernyataan dan jawaban/pasangannya."
            },
            explanation: { type: "STRING", description: "Pembahasan singkat." },
            imageUrl: { type: "STRING", description: "URL gambar jika ada." },
            svgContent: { type: "STRING", description: "String XML SVG jika ada." },
            imagenPrompt: { type: "STRING", description: "Prompt Imagen." },
            imagePrompt: { type: "STRING", description: "Prompt Imagen." }
          },
          required: ["number", "questionType", "cognitiveLevel", "materi", "questionText", "answerKey", "explanation"]
        }
      };

      const prompt = `
        Format lembar soal ujian sekolah dasar berdasarkan kisi-kisi berikut.
        Mata Pelajaran: ${subject}
        Kelas: ${schoolInfo?.gradeClass || "Semua"}
        Tahun Pelajaran: ${schoolInfo?.academicYear || "2025/2026"}
        
        Kisi-Kisi Sumber:
        ${JSON.stringify(sanitizedKisiKisi)}
  
        ${subjectRules}
        
        SANGAT PENTING:
        - Buat tepat sejumlah ${sanitizedKisiKisi.length} butir soal secara berurutan.
        - Kosongkan properti gambar (imageUrl, svgContent, imagePrompt, imagenPrompt) karena dilarang ada gambar di awal.
        - JIKA TIPE "Pilihan Ganda Kompleks": Sediakan 4 "options" berupa pernyataan-pernyataan yang nyata, kontekstual, menarik, dan berlandaskan materi ujian. DILARANG KERAS menggunakan kata "Konsep", "Pernyataan", "Placeholder", "Pernyataan A/B/C/D", atau teks umum kosong/sementara! Setiap opsi harus berupa pernyataan konkret yang siap dinilai benar atau salah oleh siswa SD (contoh: "Matahari merupakan sumber energi terbarukan"). Kunci jawaban "answerKey" berisi huruf jawaban benar yang dipisah koma (misal: "A, C").
        - JIKA TIPE "Menjodohkan": Anda WAJIB mengisi properti "pairs" dengan 3-4 pasang { question: "...", answer: "..." } yang nyata dan kontekstual. DILARANG KERAS menggunakan kata "Konsep", "Pernyataan", "Pasangan", "Jawaban A/B/C/D", atau placeholders! Kedua kolom (kiri/kanan) harus berisi data konkret (misal: question "Diponegoro" dan answer "Jawa Tengah"). "questionText" bisa diisi instruksi seperti "Jodohkanlah pernyataan di kolom kiri dengan jawaban yang tepat di kolom kanan!". "options" dikosongkan.
        
        ATURAN KEBERAGAMAN & ACAK (SANGAT KETAT):
        - TINGKAT KESULITAN & BAHASA: WAJIB memperhitungkan kemampuan murid berdasarkan KELAS yang diminta! Gunakan bahasa yang 100% cocok dengan tingkat kognitif siswa di kelas tersebut.
        - CAPAIAN PEMBELAJARAN (CP): Soal wajib merujuk akurat pada materi dan Capaian Pembelajaran.
        - SOAL ISIAN SINGKAT & URAIAN: 
          * WAJIB membuat STIMULUS YANG MENARIK (percakapan, fabel, puisi, pengalaman sehari-hari, pantun) sebagai pengantar soal.
          * Pertanyaan inti langsung ditanyakan TANPA titik-titik (.....).
        - SETIAP NOMOR WAJIB BERBEDA! Jangan mengulang cerita, nama, atau latar yang sama di soal berikutnya.
        - NAMA TOKOH: Gunakan nama beragam budaya/agama (misal: Ali, Yusuf, Yohanes, Maria, Wayan, Made, Budi, Siti). JANGAN ADA PENGULANGAN GELAR ganda seperti "Pak Guru Pak Hartono" atau "Ibu Guru Ibu Sri". Gunakan penulisan alami seperti "Pak Hartono", "Pak Guru Hartono", atau "Ibu Sri".
        - LATAR TEMPAT: Bervariasi! Bisa di pasar, sawah, pegunungan, bukit, laut, sungai, perpustakaan, rumah sakit, lapangan. Sesekali Anda BISA menggunakan nama sekolah bernuansa NTT (seperti SD Negeri Fatubai, SD Inpres Nifuboke) secara proporsional dan tidak mendominasi seluruh soal.
        - PROFESI/SUBJEK: Bervariasi! Gunakan paman, bibi, kakek, nenek, dokter, bidan, petani, nelayan, polisi, dsb.
        - ACAK KUNCI JAWABAN: Pastikan huruf kunci jawaban (A, B, C, D) di setiap nomor sangat bervariasi dan diacak dengan benar-benar acak, bukan berpola urutan.
        
        Kembalikan JSON murni.
      `;

      const result = await callGeminiDirect(prompt, systemInstructionOverride, schema);

      if (Array.isArray(result)) {
        // Normalize multiple choice options & answer key
        const normalized = result.map((q: any) => {
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

            return { ...q, imagePrompt: "", imagenPrompt: "", imageUrl: "", svgContent: "", materi: cleanMateri(q.materi || "") };
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
            return { ...q, options: [], answerKey: "Lihat pairs", imagePrompt: "", imagenPrompt: "", imageUrl: "", svgContent: "", materi: cleanMateri(q.materi || "") };
          }

          if (q.questionType !== "Pilihan Ganda") {
            return {
              ...q,
              imagePrompt: promptStr,
              imagenPrompt: promptStr,
              materi: cleanMateri(q.materi || "")
            };
          }
          
          let opts = [...q.options].slice(0, 4);
          while (opts.length < 4) {
            opts.push(`${String.fromCharCode(65 + opts.length)}. Pilihan Alternatif`);
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
            materi: cleanMateri(q.materi || ""),
            options: shuffledOpts,
            answerKey: String.fromCharCode(97 + newCorrectIdx),
            imagePrompt: promptStr,
            imagenPrompt: promptStr
          };
        });

        // Set default Unsplash fallback image URL if visual indicator is specified but image is blank
        return normalized.map((q: any) => {
          const indicatorLower = (q.indicator || "").toLowerCase();
          const qtextLower = (q.questionText || "").toLowerCase();
          const stimLower = (q.stimulusText || "").toLowerCase();
          const isVisual = indicatorLower.includes("gambar") || indicatorLower.includes("ilustrasi") || 
                           qtextLower.includes("gambar") || stimLower.includes("gambar");

          if (isVisual && !q.imageUrl && !q.svgContent) {
            q.imageUrl = getRelevantVerifiedUnsplashUrl(subject, q.questionText, q.materi, q.stimulusText, q.imagenPrompt);
          }
          return q;
        });
      }
      return result;
    } catch (apiErr) {
      console.error("Direct Gemini REST API also failed, using Offline Fallback...", apiErr);
      
      // 3. Hard Offline Fallback using server-fallback.ts
      const fallback = generateFallbackSoal(schoolInfo, subject, sanitizedKisiKisi);
      return fallback.map((q: any) => {
        if (q) {
          q.materi = cleanMateri(q.materi);
        }
        return q;
      });
    }
  }
}

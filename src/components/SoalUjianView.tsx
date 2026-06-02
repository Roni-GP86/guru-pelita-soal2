import React, { useRef, useState } from "react";
import { SchoolInfo, QuestionItem } from "../types";
import PremiumLoader from "./PremiumLoader";
import QuestionWithImage from "./QuestionWithImage";
import { generateAllImages, hitungSoalBergambar } from "../imageUtils";
import { 
  FileDown, 
  Printer, 
  FileText, 
  Check, 
  Award, 
  Eye, 
  EyeOff, 
  Pencil, 
  Sparkles, 
  RefreshCw, 
  Upload, 
  Link, 
  Image as ImageIcon, 
  Code, 
  X, 
  Trash2, 
  HelpCircle,
  CheckCircle2
} from "lucide-react";

const getLogoKabupatenUrl = (schoolInfo: SchoolInfo) => {
  if (schoolInfo.logoType === "none") return null;
  if (schoolInfo.logoCustomData) return schoolInfo.logoCustomData;
  // Default is tutwuri
  return "https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Tut_Wuri_Handayani.png";
};

const getLogoSekolahUrl = (schoolInfo: SchoolInfo) => {
  return schoolInfo.logoSchoolCustomData || null;
};

// Import html2pdf safely on clientside
const getHtml2Pdf = async () => {
  const module = await import("html2pdf.js");
  return module.default;
};

// Helper to convert oklab to rgb/rgba format
const oklabToRgb = (l: number, a: number, b: number, alpha = 1): string => {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m = l - 0.1055613458 * a - 0.0638541728 * b;
  const s = l - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m * m * m;
  const s3 = s * s * s;

  const r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  const gamma = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  const r255 = Math.max(0, Math.min(255, Math.round(gamma(r) * 255)));
  const g255 = Math.max(0, Math.min(255, Math.round(gamma(g) * 255)));
  const b255 = Math.max(0, Math.min(255, Math.round(gamma(b_) * 255)));

  if (alpha === 1) {
    return `rgb(${r255}, ${g255}, ${b255})`;
  } else {
    return `rgba(${r255}, ${g255}, ${b255}, ${alpha})`;
  }
};

const oklchToRgb = (l: number, c: number, h: number, alpha = 1): string => {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  return oklabToRgb(l, a, b, alpha);
};

const replaceOklabAndOklch = (str: string): string => {
  if (typeof str !== "string") return str;
  if (!str.includes("oklch") && !str.includes("oklab")) return str;

  // Split-regex-based mapping for oklch
  let result = str.replace(/oklch\(([^)]+)\)/gi, (match, content) => {
    try {
      const parts = content.split(/[\s,+/]+/).map((p: string) => p.trim()).filter(Boolean);
      if (parts.length >= 3) {
        const l = parseFloat(parts[0]);
        const c = parseFloat(parts[1]);
        const hString = parts[2];
        const h = hString.endsWith("deg") ? parseFloat(hString.slice(0, -3)) : parseFloat(hString);
        let alpha = 1;
        if (parts.length >= 4) {
          const aStr = parts[3];
          if (aStr.endsWith("%")) {
            alpha = parseFloat(aStr.slice(0, -1)) / 100;
          } else {
            alpha = parseFloat(aStr);
          }
        }
        return oklchToRgb(l, c, h, isNaN(alpha) ? 1 : alpha);
      }
    } catch (e) {
      console.warn("Failed to parse oklch", match, e);
    }
    return "rgba(255, 255, 255, 1)";
  });

  // Split-regex-based mapping for oklab
  result = result.replace(/oklab\(([^)]+)\)/gi, (match, content) => {
    try {
      const parts = content.split(/[\s,+/]+/).map((p: string) => p.trim()).filter(Boolean);
      if (parts.length >= 3) {
        const l = parseFloat(parts[0]);
        const a = parseFloat(parts[1]);
        const b = parseFloat(parts[2]);
        let alpha = 1;
        if (parts.length >= 4) {
          const aStr = parts[3];
          if (aStr.endsWith("%")) {
            alpha = parseFloat(aStr.slice(0, -1)) / 100;
          } else {
            alpha = parseFloat(aStr);
          }
        }
        return oklabToRgb(l, a, b, isNaN(alpha) ? 1 : alpha);
      }
    } catch (e) {
      console.warn("Failed to parse oklab", match, e);
    }
    return "rgba(255, 255, 255, 1)";
  });

  return result;
};

// Helper to patch cssRules and rules methods in CSSStyleSheet prototype to prevent html2canvas oklab/oklch parser crashes
const withPdfStylesPatch = async <T,>(callback: () => Promise<T>): Promise<T> => {
  const originalCssRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, "cssRules");
  const originalRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, "rules");
  const originalCssRuleText = Object.getOwnPropertyDescriptor(CSSRule.prototype, "cssText");
  let originalStyleRuleText: PropertyDescriptor | undefined;
  try {
    originalStyleRuleText = Object.getOwnPropertyDescriptor(CSSStyleRule.prototype, "cssText");
  } catch(e) {}

  const originalGetComputedStyle = window.getComputedStyle;

  try {
    Object.defineProperty(CSSStyleSheet.prototype, "cssRules", {
      get() {
        try {
          const rules = originalCssRules && originalCssRules.get
            ? originalCssRules.get.call(this)
            : this.rules;

          if (!rules) return rules;

          const filteredRules: CSSRule[] = [];
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            try {
              filteredRules.push(rule);
            } catch (e) {
              // skip unparseable or CORS-restricted rules
            }
          }

          const result = filteredRules as any;
          result.item = (index: number) => filteredRules[index];
          Object.defineProperty(result, "length", {
            get() { return filteredRules.length; },
            configurable: true
          });
          return result;
        } catch (err) {
          const result = [] as any;
          result.item = () => null;
          return result;
        }
      },
      configurable: true,
    });
  } catch (e) {
    console.warn("Could not patch cssRules getter", e);
  }

  try {
    Object.defineProperty(CSSStyleSheet.prototype, "rules", {
      get() {
        try {
          const rules = originalRules && originalRules.get
            ? originalRules.get.call(this)
            : this.cssRules;

          if (!rules) return rules;

          const filteredRules: CSSRule[] = [];
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            try {
              filteredRules.push(rule);
            } catch (e) {
              // skip
            }
          }

          const result = filteredRules as any;
          result.item = (index: number) => filteredRules[index];
          Object.defineProperty(result, "length", {
            get() { return filteredRules.length; },
            configurable: true
          });
          return result;
        } catch (err) {
          const result = [] as any;
          result.item = () => null;
          return result;
        }
      },
      configurable: true,
    });
  } catch (e) {
    // ignore
  }

  if (originalCssRuleText && originalCssRuleText.get) {
    try {
      Object.defineProperty(CSSRule.prototype, "cssText", {
        get() {
          const val = originalCssRuleText.get!.call(this);
          return replaceOklabAndOklch(val);
        },
        configurable: true
      });
    } catch(e) {}
  }

  if (originalStyleRuleText && originalStyleRuleText.get) {
    try {
      Object.defineProperty(CSSStyleRule.prototype, "cssText", {
        get() {
          const val = originalStyleRuleText.get!.call(this);
          return replaceOklabAndOklch(val);
        },
        configurable: true
      });
    } catch(e) {}
  }

  window.getComputedStyle = function (el: Element, pseudoElt?: string) {
    const style = originalGetComputedStyle(el, pseudoElt);
    
    return new Proxy(style, {
      get(target, prop, receiver) {
        if (prop === "getPropertyValue") {
          return function (propertyName: string) {
            const val = target.getPropertyValue(propertyName);
            return replaceOklabAndOklch(val);
          };
        }
        
        const val = Reflect.get(target, prop);
        if (typeof val === "string") {
          return replaceOklabAndOklch(val);
        }
        if (typeof val === "function") {
          return val.bind(target);
        }
        return val;
      }
    }) as any;
  };

  try {
    return await callback();
  } finally {
    try {
      if (originalCssRules) {
        Object.defineProperty(CSSStyleSheet.prototype, "cssRules", originalCssRules);
      } else {
        delete (CSSStyleSheet.prototype as any).cssRules;
      }
      if (originalRules) {
        Object.defineProperty(CSSStyleSheet.prototype, "rules", originalRules);
      } else {
        delete (CSSStyleSheet.prototype as any).rules;
      }
    } catch (e) {
      console.warn("Could not restore CSSStyleSheet properties", e);
    }

    try {
      if (originalCssRuleText) {
        Object.defineProperty(CSSRule.prototype, "cssText", originalCssRuleText);
      } else {
        delete (CSSRule.prototype as any).cssText;
      }
      if (originalStyleRuleText) {
        Object.defineProperty(CSSStyleRule.prototype, "cssText", originalStyleRuleText);
      } else {
        delete (CSSStyleRule.prototype as any).cssText;
      }
    } catch (e) {}

    window.getComputedStyle = originalGetComputedStyle;
  }
};

const QuestionIllustrationComponent = ({ q, subject }: { q: QuestionItem; subject?: string }) => {
  const [hasError, setHasError] = useState(false);
  const width = q.imageWidth || 420;
  const height = q.imageHeight || 210;

  if (q.svgContent && q.svgContent.trim()) {
    let cleanSvg = q.svgContent.trim();
    if (cleanSvg.startsWith("```")) {
      cleanSvg = cleanSvg.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
    }
    if (!cleanSvg.includes("<svg")) {
      return null;
    }
    return (
      <div 
        className="question-illustration print-avoid-break bg-white p-1 my-4 mx-auto border-2 border-black flex items-center justify-center overflow-hidden shadow-xs" 
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "100%",
        }}
      >
        <div 
          style={{ width: "100%", height: "100%" }}
          className="flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full"
          dangerouslySetInnerHTML={{ __html: cleanSvg }}
        />
      </div>
    );
  }

  if (q.imageUrl && !hasError) {
    return (
      <div 
        className="question-illustration print-avoid-break bg-white p-1 my-4 mx-auto border-2 border-black flex items-center justify-center overflow-hidden shadow-xs" 
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "100%",
        }}
      >
        <img 
          src={q.imageUrl} 
          alt={`Ilustrasi Soal ${q.number}`} 
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            borderRadius: "0px"
          }} 
          referrerPolicy="no-referrer"
          onError={() => {
            setHasError(true);
          }}
        />
      </div>
    );
  }

  // If there's an error loading the image or if imageUrl is missing/falsy, BUT it is supposed to have an image:
  // We can render a stunning, high-contrast, curriculum-aligned vector SVG fallback!
  // This prevents blank cards ("hanya menampilkan kartu putih tanpa gambar")!
  const hasIllustrationRequired = q.imageUrl || q.svgContent || q.imagenPrompt || (q.questionText && (q.questionText.includes("Perhatikan gambar") || q.questionText.includes("Perhatikan diagram")));
  if (hasIllustrationRequired) {
    // Generate a fallback SVG based on context
    const textToScan = `${subject || ""} ${q.materi || ""} ${q.questionText || ""} ${q.explanation || ""}`.toLowerCase();
    let fallbackSvg = "";

    // Math shapes fallbacks
    if (textToScan.includes("pecahan") || textToScan.includes("setengah") || textToScan.includes("seperempat") || textToScan.includes("sepertiga") || textToScan.includes("bagian")) {
      fallbackSvg = `
        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="#1e3a8a" stroke-width="3" fill="#f8fafc"/>
          <path d="M 60 10 A 50 50 0 0 1 110 60 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>
          <path d="M 110 60 A 50 50 0 0 1 60 110 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>
          <line x1="60" y1="10" x2="60" y2="110" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="2,2"/>
          <line x1="10" y1="60" x2="110" y2="60" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="2,2"/>
          <text x="60" y="65" font-family="'Times New Roman', serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">MATEMATIKA</text>
        </svg>
      `;
    } else if (textToScan.includes("segitiga") || textToScan.includes("sudut") || textToScan.includes("siku-siku")) {
      fallbackSvg = `
        <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,80 100,80 20,20" fill="#f8fafc" stroke="#1e3a8a" stroke-width="3"/>
          <rect x="20" y="70" width="10" height="10" fill="none" stroke="#1e3a8a" stroke-width="1.5"/>
          <text x="12" y="85" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">A</text>
          <text x="105" y="85" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">B</text>
          <text x="15" y="15" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">C</text>
          <text x="35" y="65" font-size="9" font-weight="bold" fill="#ef4444">90°</text>
        </svg>
      `;
    } else if (textToScan.includes("persegi") || textToScan.includes("bangun") || textToScan.includes("lebar") || textToScan.includes("panjang")) {
      fallbackSvg = `
        <svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="120" height="70" fill="#f8fafc" stroke="#1e3a8a" stroke-width="3"/>
          <text x="75" y="10" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Sisi Panjang</text>
          <text x="141" y="55" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="start">Sisi Lebar</text>
          <text x="75" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444" text-anchor="middle">BANGUN DATAR</text>
        </svg>
      `;
    }
    // Pancasila/PKN/Flag
    else if (textToScan.includes("pancasila") || textToScan.includes("bendera") || textToScan.includes("garuda") || textToScan.includes("negara") || textToScan.includes("gotong") || textToScan.includes("persatuan")) {
      fallbackSvg = `
        <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Shield outline representing Pancasila shield -->
          <path d="M 30,20 Q 80,10 130,20 L 130,55 Q 130,85 80,95 Q 30,85 30,55 Z" fill="#fffaf0" stroke="#b91c1c" stroke-width="3"/>
          <line x1="80" y1="12" x2="80" y2="95" stroke="#b91c1c" stroke-width="2"/>
          <line x1="30" y1="50" x2="130" y2="50" stroke="#b91c1c" stroke-width="2"/>
          <!-- Star emblem in center -->
          <polygon points="80,38 83,44 90,45 85,49 86,56 80,52 74,56 75,49 70,45 77,44" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
          <text x="80" y="27" font-family="sans-serif" font-size="8" font-weight="bold" fill="#b91c1c" text-anchor="middle">PANCASILA</text>
          <text x="80" y="80" font-family="sans-serif" font-size="7" font-weight="bold" fill="#4b5563" text-anchor="middle">Persatuan Indonesia</text>
        </svg>
      `;
    }
    // Reading/Buku/Indonesian
    else if (textToScan.includes("buku") || textToScan.includes("baca") || textToScan.includes("cerita") || textToScan.includes("dongeng") || textToScan.includes("bahasa") || textToScan.includes("puisi")) {
      const subL = (subject || "").toLowerCase();
      let bookLabel = "BAHASA INDONESIA";
      if (subL.includes("inggris") || textToScan.includes("inggris") || textToScan.includes("english")) {
        bookLabel = "BAHASA INGGRIS";
      } else if (subL.includes("daerah") || textToScan.includes("daerah")) {
        bookLabel = "BAHASA DAERAH";
      }
      fallbackSvg = `
        <svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Opened Book Design -->
          <path d="M 75,85 C 55,80 25,80 15,85 L 15,30 C 25,25 55,25 75,30 Z" fill="#f8fafc" stroke="#4f46e5" stroke-width="2"/>
          <path d="M 75,85 C 95,80 125,80 135,85 L 135,30 C 125,25 95,25 75,30 Z" fill="#f8fafc" stroke="#4f46e5" stroke-width="2"/>
          <!-- Page lines mimicking text -->
          <line x1="25" y1="45" x2="65" y2="45" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="25" y1="55" x2="60" y2="55" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="25" y1="65" x2="65" y2="65" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="85" y1="45" x2="125" y2="45" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="85" y1="55" x2="120" y2="55" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="85" y1="65" x2="125" y2="65" stroke="#94a3b8" stroke-width="1.5"/>
          <!-- Read Indicator tag -->
          <polygon points="75,30 79,25 71,25" fill="#4f46e5"/>
          <text x="75" y="20" font-family="'Times New Roman', serif" font-size="9" font-weight="bold" fill="#4f46e5" text-anchor="middle">${bookLabel}</text>
        </svg>
      `;
    }
    // IPAS/Sains/Flow
    else if (textToScan.includes("tumbuhan") || textToScan.includes("hewan") || textToScan.includes("makhluk") || textToScan.includes("hidup") || textToScan.includes("sains") || textToScan.includes("lingkungan") || textToScan.includes("ekosistem") || textToScan.includes("energi") || textToScan.includes("air")) {
      fallbackSvg = `
        <svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Plant / Sprout growing from soil -->
          <path d="M 40,85 Q 75,85 110,85" stroke="#78350f" stroke-width="3" fill="none"/>
          <path d="M 75,85 L 75,50" stroke="#15803d" stroke-width="3" fill="none"/>
          <!-- Left leaf -->
          <path d="M 75,65 Q 55,55 75,50" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
          <!-- Right leaf -->
          <path d="M 75,55 Q 95,45 75,40" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
          <!-- Sun ray symbol -->
          <circle cx="115" cy="30" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
          <text x="75" y="15" font-family="sans-serif" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">IPAS (SAINS)</text>
        </svg>
      `;
    }
    // Default curriculum standard fallback diagram (Edu Cap)
    else {
      fallbackSvg = `
        <svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
          <!-- Graduation Cap / Book -->
          <polygon points="75,20 120,35 75,50 30,35" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
          <line x1="75" y1="50" x2="75" y2="80" stroke="#1e293b" stroke-width="2"/>
          <rect x="65" y="70" width="20" height="10" fill="#1e293b"/>
          <path d="M 120,35 L 120,65 Q 120,70 122,70" fill="none" stroke="#d97706" stroke-width="2"/>
          <circle cx="122" cy="72" r="3" fill="#d97706"/>
          <text x="75" y="93" font-family="sans-serif" font-size="8" font-weight="bold" fill="#1e293b" text-anchor="middle">NASKAH SOAL UJIAN</text>
        </svg>
      `;
    }

    return (
      <div 
        className="question-illustration print-avoid-break bg-slate-50 p-3 my-4 mx-auto border-2 border-slate-400 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden shadow-xs" 
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "100%",
        }}
      >
        <div 
          style={{ width: "95%", height: "85%" }}
          className="flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-w-full [&_svg]:max-h-full"
          dangerouslySetInnerHTML={{ __html: fallbackSvg }}
        />
        <p className="text-[9px] text-slate-500 font-bold tracking-tight mt-1 select-none font-mono text-center no-print">
          [ILUSTRASI KURIKULUM MERDEKA]
        </p>
      </div>
    );
  }

  return null;
};

const renderQuestionIllustration = (q: QuestionItem, subject?: string) => {
  return <QuestionIllustrationComponent q={q} subject={subject} />;
};

const getCorrectOptionIdxWithOpts = (key: string, opts: string[]): number => {
  if (!opts || opts.length === 0) return -1;
  const cleanKey = key.trim().toUpperCase();
  
  if (/^[A-D](\.|$)/.test(cleanKey)) {
    const char = cleanKey.charAt(0);
    return char.charCodeAt(0) - 65;
  }
  
  const keyLower = cleanKey.toLowerCase();
  for (let i = 0; i < opts.length; i++) {
    const optLower = opts[i].toLowerCase();
    const cleanOpt = optLower.replace(/^[a-d][.\s)]+/, "").trim();
    const cleanKeyTxt = keyLower.replace(/^[a-d][.\s)]+/, "").trim();
    if (cleanOpt === cleanKeyTxt || optLower.includes(cleanKeyTxt) || cleanOpt.includes(cleanKeyTxt)) {
      return i;
    }
  }
  
  for (let i = 0; i < opts.length; i++) {
    if (opts[i].toUpperCase().includes(cleanKey) || cleanKey.includes(opts[i].toUpperCase())) {
      return i;
    }
  }
  
  return -1;
};

const cleanMateriInClient = (materiStr: string): string => {
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
};

const normalizeQuestionObj = (q: QuestionItem): QuestionItem => {
  const cleanMateriText = cleanMateriInClient(q.materi || "");

  if (q.questionType !== "Pilihan Ganda" || !q.options || q.options.length === 0) {
    return {
      ...q,
      materi: cleanMateriText
    };
  }
  
  let opts = [...q.options];
  while (opts.length < 4) {
    opts.push(`${String.fromCharCode(65 + opts.length)}. Pilihan Alternatif Baru`);
  }
  if (opts.length > 4) {
    opts = opts.slice(0, 4);
  }
  
  opts = opts.map((opt, idx) => {
    const letter = String.fromCharCode(65 + idx);
    const clean = opt.replace(/^[a-dA-D][.\s)]+/, "").trim();
    return `${letter}. ${clean || "Pilihan Alternatif"}`;
  });
  
  let correctIdx = getCorrectOptionIdxWithOpts(q.answerKey, opts);
  if (correctIdx === -1) {
    correctIdx = 0; // fallback to 'a'
  }
  
  return {
    ...q,
    materi: cleanMateriText,
    options: opts,
    answerKey: String.fromCharCode(97 + correctIdx) // 'a', 'b', 'c', or 'd'
  };
};

export const getQuestionMaxScore = (type: string, q?: QuestionItem): number => {
  const cleanType = (type || "").trim().toLowerCase();
  if (cleanType === "pilihan ganda") {
    return 1;
  } else if (cleanType === "isian singkat") {
    return 2;
  } else if (cleanType === "uraian") {
    return 5;
  } else if (cleanType.includes("kompleks")) {
    return 3; // default dynamic max score for complex multiple choice
  } else {
    if (q && q.options && q.options.length > 0) {
      return Math.min(q.options.length, 3);
    }
    return 2;
  }
};

const cleanForCompare = (s: string) => {
  if (!s) return "";
  return s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
};

const renderStimulusText = (text: string, questionText?: string) => {
  if (!text) return null;

  // Prevent redundancy if stimulusText is already repeated or contained inside questionText
  const cleanStim = cleanForCompare(text);
  const cleanQText = cleanForCompare(questionText || "");
  if (cleanStim && cleanQText && (cleanQText.includes(cleanStim) || cleanStim.includes(cleanQText))) {
    return null;
  }

  const hasHtml = /<[a-z][\s\S]*>/i.test(text);
  if (hasHtml) {
    return (
      <span 
        style={{ fontStyle: "normal", color: "#000000", display: "block", marginBottom: "6px" }}
        dangerouslySetInnerHTML={{ __html: text }} 
      />
    );
  }

  const lines = text.split("\n");
  const parsedElements: React.ReactNode[] = [];
  let currentTableRows: string[][] = [];
  let isInsideTable = false;
  let hasTableDivider = false;
  
  const flushTable = (key: number) => {
    if (currentTableRows.length === 0) return;
    
    const tableHeaders = currentTableRows[0];
    const tableBody = currentTableRows.slice(hasTableDivider ? 2 : 1);
    
    parsedElements.push(
      <table 
        key={`table-${key}`}
        style={{
          width: "auto",
          minWidth: "65%",
          maxWidth: "100%",
          margin: "12px auto",
          borderCollapse: "collapse",
          border: "2.2px solid #000000",
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "12pt",
          lineHeight: "1.5",
          color: "#000000",
          pageBreakInside: "avoid"
        }}
        className="kisi-table mb-4 dynamic-stimulus-table print:my-2"
      >
        <thead>
          <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2.2px solid #000000" }}>
            {tableHeaders.map((cell, idx) => (
              <th 
                key={`th-${idx}`} 
                style={{
                  border: "1.8px solid #000000",
                  padding: "7px 12px",
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                {cell.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableBody.map((row, rowIdx) => (
            <tr key={`tr-${rowIdx}`} style={{ borderBottom: "1.2px solid #000000" }}>
              {row.map((cell, cellIdx) => {
                const cleanCell = cell.trim();
                // Match integers, fractions, or short units (e.g. "kg", "cm", "butir") to keep columns perfectly aligned
                const isNumeric = /^[0-9\-\.,\s]+$/.test(cleanCell) || 
                                  /^\d+\/\d+$/.test(cleanCell) || 
                                  cleanCell.toLowerCase().endsWith("kg") || 
                                  cleanCell.toLowerCase().endsWith("cm") || 
                                  cleanCell.toLowerCase().endsWith("gram") || 
                                  cleanCell.toLowerCase().endsWith("butir") || 
                                  cleanCell.toLowerCase().endsWith("orang") || 
                                  cleanCell.toLowerCase().endsWith("buah");
                return (
                  <td 
                    key={`td-${cellIdx}`} 
                    style={{
                      border: "1.5px solid #000000",
                      padding: "6px 12px",
                      textAlign: isNumeric ? "center" : "left"
                    }}
                  >
                    {cleanCell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
    
    currentTableRows = [];
    isInsideTable = false;
    hasTableDivider = false;
  };
  
  let elementKey = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const origLine = lines[i];
    const trimmed = origLine.trim();
    
    if (trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2) {
      isInsideTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      const isDivider = cells.every(c => c.trim().replace(/[\-\s:]/g, "") === "");
      if (isDivider) {
        hasTableDivider = true;
      }
      currentTableRows.push(cells);
    } else {
      if (isInsideTable) {
        flushTable(elementKey++);
      }
      
      if (trimmed.length > 0) {
        parsedElements.push(
          <div 
            key={`txt-${elementKey++}`}
            style={{ 
              fontStyle: "normal", 
              color: "#000000", 
              marginBottom: "6px",
              lineHeight: "1.5",
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: "12pt"
            }}
          >
            {trimmed}
          </div>
        );
      } else {
        parsedElements.push(<div key={`sp-${elementKey++}`} className="h-1.5" />);
      }
    }
  }
  
  if (isInsideTable) {
    flushTable(elementKey++);
  }
  
  return (
    <div className="stimulus-wrapper mb-3 block print:mb-2">
      {parsedElements}
    </div>
  );
};

interface SoalUjianViewProps {
  schoolInfo: SchoolInfo;
  subject: string;
  questions: QuestionItem[];
  onUpdateQuestions?: (questions: QuestionItem[]) => void;
}

export default function SoalUjianView({ schoolInfo, subject, questions, onUpdateQuestions }: SoalUjianViewProps) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingWord, setDownloadingWord] = useState(false);
  const [activeTab, setActiveTab ] = useState<"siswa" | "kunci" | "pedoman">("siswa");
  const [studentScores, setStudentScores] = useState<Record<number, number>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [showScoringMenu, setShowScoringMenu] = useState(false);
  const [generatingBatchImages, setGeneratingBatchImages] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ percent: 0, current: 0, total: 0 });

  const leftLogo = getLogoKabupatenUrl(schoolInfo);
  const rightLogo = getLogoSekolahUrl(schoolInfo);
  const hasLeft = !!leftLogo;
  const hasRight = !!rightLogo;

  let leftWidth = "0%";
  let centerWidth = "100%";
  let rightWidth = "0%";

  if (hasLeft && hasRight) {
    leftWidth = "12%";
    centerWidth = "76%";
    rightWidth = "12%";
  } else if (hasLeft) {
    leftWidth = "12%";
    centerWidth = "88%";
  } else if (hasRight) {
    centerWidth = "88%";
    rightWidth = "12%";
  }

  const handleBatchGenerateImages = async () => {
    if (generatingBatchImages) return;
    setGeneratingBatchImages(true);
    setBatchProgress({ percent: 0, current: 0, total: 0 });
    try {
      const updated = await generateAllImages(subject, questions, (percent, current, total) => {
        setBatchProgress({ percent, current, total });
      });
      if (onUpdateQuestions) {
        onUpdateQuestions(updated);
      }
    } catch (err) {
      console.error("Batch image generation failed:", err);
    } finally {
      setGeneratingBatchImages(false);
    }
  };

  const printAreaRef = useRef<HTMLDivElement>(null);

  const renderQuestionIllustration = (q: QuestionItem, subj?: string) => {
    return (
      <QuestionWithImage
        q={q}
        subject={subj || subject}
        onUpdateQuestion={(updatedQ) => {
          if (editingQuestion && editingQuestion.number === q.number) {
            setEditingQuestion(updatedQ);
          }
          if (onUpdateQuestions) {
            const nextQuestions = questions.map(item => item.number === q.number ? updatedQ : item);
            onUpdateQuestions(nextQuestions);
          }
        }}
        disabled={isExporting}
      />
    );
  };

  const handleDownloadPedomanDirectly = async (format: "word" | "pdf") => {
    if (!questions || questions.length === 0) return;
    const prevTab = activeTab;
    setActiveTab("pedoman");
    // Wait for the DOM to render the pedoman block
    await new Promise((resolve) => setTimeout(resolve, 350));
    
    try {
      if (format === "word") {
        await handleDownloadWord();
      } else {
        await handleDownloadPdf();
      }
    } catch (err) {
      console.error("Direct download error:", err);
    } finally {
      // Revert the active tab to restore original user view context
      setActiveTab(prevTab);
    }
  };

  // Modal Editing States
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [modalTab, setModalTab] = useState<"content" | "media">("content");
  const [regeneratingImage, setRegeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const getFormattedDate = () => {
    const place = schoolInfo.documentPlace || "Fatubai";
    if (schoolInfo.documentDate) {
      return `${place}, ${schoolInfo.documentDate}`;
    }
    const today = new Date();
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${place}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  };

  const handleDownloadWord = async () => {
    if (!questions || questions.length === 0) return;

    setDownloadingWord(true);
    setIsExporting(true);
    // Smooth delay for premium circular progress presentation
    await new Promise((resolve) => setTimeout(resolve, 2200));

    const fileSuffix = activeTab === "siswa" 
      ? "Naskah_Soal" 
      : activeTab === "kunci" 
        ? "Kunci_Jawaban" 
        : "Pedoman_Penskoran";
    const headerWord = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Naskah Soal Ujian</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 595.3pt 841.9pt; /* A4 Portrait size */
            margin: 2.0cm 2.0cm 2.0cm 2.0cm;
          }
          div.Section1 { 
            page: Section1; 
          }
          body {
            font-family: "Times New Roman", "serif";
            font-size: 12pt;
            line-height: 1.5;
            color: #000000;
          }
          p { margin: 0px 0px 5px 0px; }
          .kop {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 3.5px double black;
            padding-bottom: 10px;
          }
          .kop-b1 { font-size: 14pt; font-weight: bold; text-transform: uppercase; }
          .kop-b2 { font-size: 12pt; font-weight: bold; text-transform: uppercase; }
          .kop-b3 { font-size: 15pt; font-weight: bold; text-transform: uppercase; }
          .kop-b4 { font-size: 10pt; font-style: italic; }
          .document-title {
            text-align: center;
            font-weight: bold;
            font-size: 12.0pt;
            text-transform: uppercase;
            margin-top: 10px;
            margin-bottom: 20px;
            text-decoration: underline;
          }
          .identitas-table {
            border: 1px solid black;
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
          }
          .identitas-table td {
            border: 1px solid black;
            padding: 6px;
            font-size: 12pt;
            line-height: 1.5;
          }
          .stimulus {
            background-color: #ffffff;
            border-left: 3px solid #000000;
            padding: 8px 12px;
            margin: 10px 0px;
            font-style: normal;
            font-size: 12pt;
            line-height: 1.5;
          }
          .question-block {
            margin-bottom: 18px;
            page-break-inside: avoid;
          }
          .options-grid {
            margin-left: 20px;
            margin-top: 4px;
            margin-bottom: 10px;
          }
          .options-grid td {
            padding: 2px 0px;
            font-size: 12pt;
            line-height: 1.5;
          }
          .key-block {
            background-color: #f0fdf4;
            border: 1px dashed #16a34a;
            padding: 6px 10px;
            margin-top: 5px;
            font-size: 10pt;
            color: #14532d;
          }
          .signature-table {
            width: 100%;
            margin-top: 35px;
            border-collapse: collapse;
          }
          .signature-table td {
            padding: 4px;
            width: 50%;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
    `;

    const footerWord = `
        </div>
      </body>
      </html>
    `;

    const payloadId = activeTab === "siswa" 
      ? "soal-siswa-payload" 
      : activeTab === "kunci" 
        ? "soal-kunci-payload" 
        : "soal-pedoman-payload";
    const contentsElement = document.getElementById(payloadId);
    if (!contentsElement) {
      setIsExporting(false);
      return;
    }

    // ===== HAPUS ELEMEN UI YANG TIDAK BOLEH MASUK KE WORD =====
    // Clone DOM agar tidak merusak tampilan asli
    const clonedElement = contentsElement.cloneNode(true) as HTMLElement;
    // Hapus semua elemen: button, elemen no-print, no-export
    const uiSelectors = 'button, .no-print, [data-no-export], .no-export, svg';
    clonedElement.querySelectorAll(uiSelectors).forEach(el => el.remove());

    // ===== KONVERSI SEMUA GAMBAR KE BASE64 =====
    // Agar gambar muncul di semua versi Word/Windows tanpa bergantung internet
    const convertImagesToBase64 = async (htmlString: string): Promise<string> => {
      // Cari semua src="..." pada tag <img>
      const imgRegex = /(<img[^>]+src=")([^"]+)("[^>]*>)/gi;
      const matches = [...htmlString.matchAll(imgRegex)];
      
      let result = htmlString;
      
      for (const match of matches) {
        const fullTag = match[0];
        const prefix = match[1];
        const srcUrl = match[2];
        const suffix = match[3];
        
        // Lewati jika sudah base64
        if (srcUrl.startsWith("data:")) continue;
        // Lewati SVG inline
        if (srcUrl.startsWith("blob:")) continue;
        
        try {
          // Fetch gambar dengan mode no-cors fallback
          const response = await fetch(srcUrl, { 
            mode: "cors",
            cache: "force-cache"
          });
          
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          
          // Ganti URL dengan base64 di HTML string
          const newTag = `${prefix}${base64}${suffix}`;
          result = result.replace(fullTag, newTag);
          console.log(`[Word Export] Berhasil konversi gambar: ${srcUrl.substring(0, 60)}...`);
        } catch (err) {
          console.warn(`[Word Export] Gagal konversi gambar ke base64: ${srcUrl}`, err);
          // Biarkan URL asli jika konversi gagal
        }
      }
      
      return result;
    };

    let bodyContent = clonedElement.innerHTML;
    
    // Konversi semua gambar (logo & ilustrasi soal) ke base64
    try {
      bodyContent = await convertImagesToBase64(bodyContent);
    } catch (err) {
      console.warn("[Word Export] Konversi gambar ke base64 gagal, melanjutkan dengan HTML asli:", err);
    }

    const finalHTML = headerWord + bodyContent + footerWord;

    const blob = new Blob(["\ufeff" + finalHTML], {
      type: "application/msword;charset=utf-8"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileSuffix}_${subject.replace(/\s+/g, '_')}_${schoolInfo.gradeClass.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExporting(false);
    setDownloadingWord(false);
  };

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;
    setDownloadingPdf(true);
    setIsExporting(true);

    // Smooth delay for premium circular progress presentation
    await new Promise((resolve) => setTimeout(resolve, 2200));

    try {
      const html2pdf = await getHtml2Pdf();
      const fileSuffix = activeTab === "siswa" 
        ? "Naskah_Soal" 
        : activeTab === "kunci" 
          ? "Kunci_Jawaban" 
          : "Pedoman_Penskoran";
      const filename = `${fileSuffix}_${subject.replace(/\s+/g, "_")}_${schoolInfo.gradeClass.replace(/\s+/g, "_")}.pdf`;
      const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number], // specify [top, left, bottom, right] explicitly to ensure clean upper and lower page boundaries
        filename: filename,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
        pagebreak: { 
          mode: ["css", "legacy"], 
          avoid: [".signature-table", "tr", ".key-block", ".question-block", "h4", "table", ".formula-block", ".identitas-table"] 
        }
      };

      await withPdfStylesPatch(async () => {
        await html2pdf().set(opt).from(printAreaRef.current).save();
      });
    } catch (err: any) {
      console.error("Gagal mendownload PDF:", err);
    } finally {
      setIsExporting(false);
      setDownloadingPdf(false);
    }
  };

  // Helper inside click-to-edit
  const handleStartEdit = (q: QuestionItem) => {
    setEditingQuestion({ ...q });
    setModalTab("content");
    setImageError(null);
  };

  const updateSingleQuestion = (questionNumber: number, updatedQ: QuestionItem) => {
    if (onUpdateQuestions) {
      const newQuestions = questions.map((q) => q.number === questionNumber ? updatedQ : q);
      onUpdateQuestions(newQuestions);
    }
  };

  // Click-to-regenerate AI image
  const handleRegenerateImageAI = async () => {
    if (!editingQuestion) return;
    setRegeneratingImage(true);
    setImageError(null);
    try {
      const res = await fetch("/api/generate-individual-image", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-api-key": localStorage.getItem("ttu_user_api_key") || ""
        },
        body: JSON.stringify({
          subject,
          question: editingQuestion,
          userApiKey: localStorage.getItem("ttu_user_api_key") || "",
        })
      });

      if (!res.ok) {
        let errMsg = "Gagal membangkitkan ilustrasi cerdas dari server.";
        try {
          const errText = await res.text();
          if (errText.includes("Rate exceeded") || errText.includes("rate limit") || res.status === 429) {
            errMsg = "Silakan klik regenerasi gambar kembali dalam beberapa detik. Batas limit kuota gambar AI (Rate Limit) terlampaui saat ini.";
          } else {
            try {
              const errJson = JSON.parse(errText);
              errMsg = errJson.error || errMsg;
            } catch {
              if (errText && errText.trim().length > 0) {
                errMsg = errText.trim();
              }
            }
          }
        } catch (e) {
          // ignore
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      if (data.svgContent && data.svgContent.trim()) {
        setEditingQuestion({
          ...editingQuestion,
          svgContent: data.svgContent,
          imageUrl: "" // reset direct image url when SVG is adopted
        });
      } else if (data.imageUrl) {
        setEditingQuestion({
          ...editingQuestion,
          imageUrl: data.imageUrl,
          svgContent: "" // reset SVG when image is adopted
        });
      } else {
        throw new Error("Sistem AI tidak melahirkan kode gambar atau SVG pembelajaran yang valid.");
      }
    } catch (err: any) {
      console.error("Regen error:", err);
      setImageError(err.message || "Gagal merumuskan gambar AI.");
    } finally {
      setRegeneratingImage(false);
    }
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingQuestion) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Ukuran berkas melebihi batas 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingQuestion({
          ...editingQuestion,
          imageUrl: event.target?.result as string,
          svgContent: undefined // reset SVG content when direct image loaded
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (!editingQuestion) return;
    setEditingQuestion({
      ...editingQuestion,
      svgContent: undefined,
      imageUrl: undefined
    });
  };

  const handleSaveModal = () => {
    if (!editingQuestion) return;
    const normalized = normalizeQuestionObj(editingQuestion);
    updateSingleQuestion(editingQuestion.number, normalized);
    setEditingQuestion(null);
  };

  // Group questions by type to follow formal exam layout sections:
  // Bagian I: Pilihan Ganda, Bagian II: Isian Singkat, Bagian III: Uraian
  const pgQuestions = questions.filter((q) => q.questionType === "Pilihan Ganda");
  const isianQuestions = questions.filter((q) => q.questionType === "Isian Singkat");
  const uraianQuestions = questions.filter((q) => q.questionType === "Uraian");

  return (
    <div id="soal-ujian-view-root" className="space-y-6">
      {/* PREMIUM GAME-STYLE EXPORT LOADER */}
      <PremiumLoader
        active={downloadingWord}
        title={
          activeTab === "siswa"
            ? "Mengekspor Lembar Soal ke Word"
            : activeTab === "kunci"
              ? "Mengekspor Kunci Jawaban ke Word"
              : "Mengekspor Pedoman Penskoran ke Word"
        }
        subtitle="Memetakan susunan naskah ke format dokumen Microsoft Word (.doc)..."
        type="download"
      />
      <PremiumLoader
        active={downloadingPdf}
        title={
          activeTab === "siswa"
            ? "Mengekspor Lembar Soal ke PDF"
            : activeTab === "kunci"
              ? "Mengekspor Kunci Jawaban ke PDF"
              : "Mengekspor Pedoman Penskoran ke PDF"
        }
        subtitle="Memformat dokumen siap cetak A4 Portrait, menyusun lampiran tanda tangan, dan memindai dokumen ke PDF..."
        type="download"
      />
      <PremiumLoader
        active={generatingBatchImages}
        title="AI Menulis Gambar & Ilustrasi Soal"
        subtitle={`Menggunakan Google Imagen 3 untuk merancang ilustrasi kurikulum merdeka pada 25% butir soal. Memproses gambar ${batchProgress.current} dari ${batchProgress.total} (${batchProgress.percent}%)...`}
        type="generate"
      />

      {/* Kontrol & Menu Unduhan */}
      <div className="bingkai-emas-premium p-6 flex flex-col xl:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-4.5 z-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-600 via-yellow-550 to-amber-700 text-slate-950 rounded-2xl shadow-md flex items-center justify-center text-xl shrink-0 animate-pulse">
            ✨
          </div>
          <div>
            <h3 className="font-extrabold text-amber-500 text-sm flex items-center gap-1.5 uppercase">
              <span>📝</span> Naskah Soal &amp; Kunci Jawaban Siap!
            </h3>
            <p className="text-xs text-slate-450 mt-1 font-semibold leading-relaxed">
              Anda kini dapat <b>mengedit butir soal secara visual</b> dengan mengeklik langsung pada soal sebelum mengunduh.
            </p>
            {questions.some(q => q.imageUrl || q.svgContent) && (
              <p className="text-[11px] text-amber-305 font-bold mt-1.5 flex items-center gap-1">
                <span>🎨</span> Ilustrasi Gambar Terlakon: <strong className="text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md font-black">{questions.filter(q => q.imageUrl || q.svgContent).length} dari {hitungSoalBergambar(questions.length)} soal (Sasaran 25%)</strong>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end relative z-10">
          {questions.some(q => q.imageUrl || q.svgContent) && (
            <button
              id="btn-batch-generate-images"
              type="button"
              onClick={handleBatchGenerateImages}
              disabled={generatingBatchImages || downloadingPdf || isExporting}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-[11px] rounded-xl inline-flex items-center gap-1.5 transition-all duration-305 shadow-md hover:shadow-amber-500/15 cursor-pointer disabled:opacity-50"
            >
              <span className="text-sm">✨</span> Buat Gambar AI
            </button>
          )}

          <div className="flex flex-wrap items-center bg-slate-950 border border-slate-850 p-1 rounded-2xl text-xs shadow-xs gap-0.5">
            <button
              type="button"
              onClick={() => setActiveTab("siswa")}
              className={`px-3.5 py-2 rounded-xl font-black text-xs cursor-pointer transition-all ${
                activeTab === "siswa" ? "bg-gradient-to-r from-blue-600 to-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📝 Naskah Soal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("kunci")}
              className={`px-3.5 py-2 rounded-xl font-black text-xs cursor-pointer transition-all ${
                activeTab === "kunci" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🔑 Kunci Jawaban
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pedoman")}
              className={`px-3.5 py-2 rounded-xl font-black text-xs cursor-pointer transition-all ${
                activeTab === "pedoman" ? "bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              📊 Penskoran
            </button>
          </div>

          <button
            id="btn-download-soal-word"
            type="button"
            onClick={handleDownloadWord}
            disabled={downloadingPdf || isExporting}
            className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 font-extrabold text-[11px] rounded-xl inline-flex items-center gap-1.5 hover:bg-slate-900 transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <span className="text-sm">📥</span> Unduh Word
          </button>

          <button
            id="btn-download-soal-pdf"
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || isExporting}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-black text-white font-extrabold text-[11px] rounded-xl inline-flex items-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-blue-500/10 cursor-pointer disabled:opacity-50"
          >
            <span className="text-sm">📄</span>
            {downloadingPdf ? "Memproses..." : "Unduh PDF"}
          </button>

          {/* MEN DOWNLOAD DOKUMEN PENSKORAN & RUMUS NILAI AKHIR */}
          <div className="relative" id="menu-download-pedoman-root">
            <button
              id="btn-menu-download-pedoman"
              type="button"
              onClick={() => setShowScoringMenu(!showScoringMenu)}
              disabled={downloadingPdf || isExporting}
              className="px-3.5 py-2.5 bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl inline-flex items-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              <span className="text-sm">📊</span> Unduh Penskoran <span className="text-[9px] opacity-80">▼</span>
            </button>
            {showScoringMenu && (
              <div 
                id="scoring-dropdown-menu" 
                className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl z-50 p-4 space-y-3 text-left animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div>
                  <h4 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                    <span>📊</span> Dokumen Penskoran &amp; Nilai
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Unduh format resmi bobot soal dan standardisasi rumus Nilai Akhir (NA) lengkap dengan tanda tangan pengesahan resmi.
                  </p>
                </div>
                <div className="border-t border-slate-800 pt-2 space-y-2">
                  <button
                    id="btn-download-pedoman-word-direct"
                    type="button"
                    onClick={async () => {
                      setShowScoringMenu(false);
                      await handleDownloadPedomanDirectly("word");
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-slate-205 bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:text-white rounded-xl transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>📥 Unduh Word (.doc)</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">Word</span>
                  </button>
                  <button
                    id="btn-download-pedoman-pdf-direct"
                    type="button"
                    onClick={async () => {
                      setShowScoringMenu(false);
                      await handleDownloadPedomanDirectly("pdf");
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>📄 Unduh PDF (Portrait)</span>
                    <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 rounded font-bold">PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout containing Document Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: The actual printable examination paper */}
        <div className="lg:col-span-4 bingkai-emas-premium overflow-hidden p-6 md:p-10 relative">
          

          <div
            ref={printAreaRef}
            id="soal-ujian-print-area"
            className="max-w-[700px] mx-auto bg-white p-10 md:p-12"
            style={{ fontFamily: '"Times New Roman", Times, serif', color: "#000000", fontSize: "12pt", lineHeight: "1.5" }}
          >
            {/* Global Printable PDF & Page Break Styles to protect top/bottom page boundaries */}
            <style dangerouslySetInnerHTML={{ __html: `
              @page {
                size: A4 portrait;
                margin: 20mm 20mm 20mm 20mm;
              }
              body, table, div, p, span, h4, tr, td, img {
                max-width: 100% !important;
                box-sizing: border-box !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
              }
              @media print {
                tr, .signature-table, .key-block, .question-block, .formula-block, .identitas-table {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                }
                table {
                  page-break-inside: auto;
                }
              }
              /* Define CSS break classes for both native browser prints and html2pdf renderer */
              .page-break-avoid, tr, .signature-table, .key-block, .question-block, .formula-block, .identitas-table {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              table {
                page-break-inside: auto;
              }
            `}} />
            {/* SAKLAR TAMPILAN SISWA */}
            {activeTab === "siswa" && (
              <div id="soal-siswa-payload">
                {/* Kop Resmi Dinamis */}
                <div className="kop" style={{ borderBottom: "3.5px double black", paddingBottom: "10px", marginBottom: "15px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", border: "none" }}>
                    <tbody>
                      <tr style={{ border: "none" }}>
                        {/* Sisi Kiri: Logo Kabupaten */}
                        {hasLeft && (
                          <td style={{ border: "none", width: leftWidth, textAlign: "center", verticalAlign: "middle", paddingRight: "10px" }}>
                            <img 
                              src={leftLogo!} 
                              alt="Logo Kabupaten" 
                              style={{ height: "75px", width: "75px", display: "inline-block", objectFit: "contain" }} 
                              referrerPolicy="no-referrer"
                            />
                          </td>
                        )}
                        
                        {/* Tengah: Identitas Lembaga */}
                        <td style={{ border: "none", width: centerWidth, textAlign: "center", verticalAlign: "middle" }}>
                          <p className="kop-b1" style={{ margin: "0px", fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", lineHeight: "1.2" }}>
                            {schoolInfo.governmentName || "Pemerintah Kabupaten / Kota"}
                          </p>
                          <p className="kop-b2" style={{ margin: "2px 0px", fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.2" }}>
                            {schoolInfo.educationDepartment || "Dinas Pendidikan dan Kebudayaan"}
                          </p>
                          <p className="kop-b3" style={{ margin: "2px 0px", fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.2" }}>
                            {schoolInfo.schoolName || "SD NEGERI KABUPATEN"}
                          </p>
                          <p className="kop-b4" style={{ margin: "2px 0px 0px 0px", fontSize: "9.5pt", fontStyle: "italic", lineHeight: "1.2", fontWeight: "normal" }}>
                            Alamat: {schoolInfo.schoolAddress || "Alamat Lengkap Lembaga Pendidikan"}
                          </p>
                        </td>

                        {/* Sisi Kanan: Logo Sekolah */}
                        {hasRight && (
                          <td style={{ border: "none", width: rightWidth, textAlign: "center", verticalAlign: "middle", paddingLeft: "10px" }}>
                            <img 
                              src={rightLogo!} 
                              alt="Logo Sekolah" 
                              style={{ height: "75px", width: "75px", display: "inline-block", objectFit: "contain" }} 
                              referrerPolicy="no-referrer"
                            />
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Judul Lembar Asesmen */}
                <div className="document-title" style={{ textAlign: "center", fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", margin: "10px 0px 20px 0px", textDecoration: "underline" }}>
                  NASKAH SOAL ASESMEN SUMATIF KELAS
                </div>

                {/* Tabel Identitas Pengisian Siswa */}
                <table className="identitas-table" style={{ border: "1px solid black", width: "100%", marginBottom: "25px", borderCollapse: "collapse", fontSize: "12pt", fontFamily: '"Times New Roman", Times, serif', lineHeight: "1.5" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "6px", width: "15%", fontWeight: "bold" }}>Mata Pelajaran</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "35%" }}>{subject}</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "15%", fontWeight: "bold" }}>Nama Siswa</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "35%", color: "#94a3b8" }}>..................................................</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Kelas / Semester</td>
                      <td style={{ border: "1px solid black", padding: "6px" }}>{schoolInfo.gradeClass} / {schoolInfo.semester === 'II' ? 'Genap (II)' : 'Ganjil (I)'}</td>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Nomor Absen</td>
                      <td style={{ border: "1px solid black", padding: "6px", color: "#94a3b8" }}>..................................................</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Tahun Pelajaran</td>
                      <td style={{ border: "1px solid black", padding: "6px" }}>{schoolInfo.academicYear}</td>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Hari / Tanggal</td>
                      <td style={{ border: "1px solid black", padding: "6px", color: "#94a3b8" }}>..................................................</td>
                    </tr>
                  </tbody>
                </table>

                {/* BAGIAN I: PILIHAN GANDA */}
                {pgQuestions.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h4 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ddd", paddingBottom: "3px", marginBottom: "12px" }}>
                      PETUNJUK A: Pilihlah satu jawaban yang paling benar (A, B, C, atau D) di bawah ini!
                    </h4>
                    {pgQuestions.map((q, qIdx) => (
                      <div key={q.number} className="question-block group relative" style={{ marginBottom: "24px", pageBreakInside: "avoid" }}>
                        
                        {/* Inline Edit Button (Only visible on screen hover) */}
                        {!isExporting && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(q)}
                            className="absolute -left-3 -top-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 cursor-pointer text-xs flex items-center gap-1 font-bold no-print"
                            title="Edit Soal & Gambar"
                          >
                            <Pencil size={11} className="shrink-0" /> Edit Soal
                          </button>
                        )}

                        <p style={{ fontWeight: "normal", fontSize: "12pt", margin: "0px", lineHeight: "1.5" }}>
                          <strong>{qIdx + 1}.</strong> {renderStimulusText(q.stimulusText, q.questionText)}
                          {q.questionText}
                        </p>
                        {renderQuestionIllustration(q, subject)}
                        
                        {q.options && q.options.length > 0 && (
                          <table className="options-grid" style={{ fontFamily: '"Times New Roman", Times, serif', width: "100%", marginLeft: "20px", marginTop: "4px" }}>
                            <tbody>
                              <tr>
                                <td style={{ width: "50%", border: "none", padding: "1px 0px", fontSize: "12pt", lineHeight: "1.5" }}>{q.options[0]}</td>
                                <td style={{ width: "50%", border: "none", padding: "1px 0px", fontSize: "12pt", lineHeight: "1.5" }}>{q.options[1]}</td>
                              </tr>
                              <tr>
                                <td style={{ width: "50%", border: "none", padding: "1px 0px", fontSize: "12pt", lineHeight: "1.5" }}>{q.options[2]}</td>
                                <td style={{ width: "50%", border: "none", padding: "1px 0px", fontSize: "12pt", lineHeight: "1.5" }}>{q.options[3]}</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* BAGIAN II: ISIAN SINGKAT */}
                {isianQuestions.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h4 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ddd", paddingBottom: "3px", marginBottom: "12px" }}>
                      PETUNJUK B: Isilah titik-titik di bawah ini dengan jawaban yang tepat dan ringkas!
                    </h4>
                    {isianQuestions.map((q, qIdx) => (
                      <div key={q.number} className="question-block group relative" style={{ marginBottom: "24px", pageBreakInside: "avoid" }}>
                        {!isExporting && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(q)}
                            className="absolute -left-3 -top-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 cursor-pointer text-xs flex items-center gap-1 font-bold no-print"
                          >
                            <Pencil size={11} className="shrink-0" /> Edit Soal
                          </button>
                        )}

                        <p style={{ fontSize: "12pt", margin: "0px", lineHeight: "1.5" }}>
                          <strong>{pgQuestions.length + qIdx + 1}.</strong> {renderStimulusText(q.stimulusText, q.questionText)}
                          {q.questionText}
                        </p>
                        {renderQuestionIllustration(q, subject)}
                        <div style={{ marginTop: "6px", color: "#000000", fontSize: "12pt", marginLeft: "20px", lineHeight: "1.5" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                            <span style={{ whiteSpace: "nowrap", fontFamily: '"Times New Roman", Times, serif' }}>Jawaban:</span>
                            <div style={{ flex: 1, borderBottom: "1px solid #000000", minHeight: "18px" }}></div>
                          </div>
                          <div style={{ borderBottom: "1px solid #000000", minHeight: "18px", marginBottom: "6px", width: "100%" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* BAGIAN III: URAIAN */}
                {uraianQuestions.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <h4 style={{ fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", borderBottom: "1px solid #ddd", paddingBottom: "3px", marginBottom: "12px" }}>
                      PETUNJUK C: Jawablah pertanyaan-pertanyaan berikut dengan menguraikan langkah penyelesaian dan analisis Anda!
                    </h4>
                    {uraianQuestions.map((q, qIdx) => (
                      <div key={q.number} className="question-block group relative" style={{ marginBottom: "24px", pageBreakInside: "avoid" }}>
                        {!isExporting && (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(q)}
                            className="absolute -left-3 -top-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 cursor-pointer text-xs flex items-center gap-1 font-bold no-print"
                          >
                            <Pencil size={11} className="shrink-0" /> Edit Soal
                          </button>
                        )}

                        <p style={{ fontSize: "12pt", margin: "0px", lineHeight: "1.5" }}>
                          <strong>{pgQuestions.length + isianQuestions.length + qIdx + 1}.</strong> {renderStimulusText(q.stimulusText, q.questionText)}
                          {q.questionText}
                        </p>
                        {renderQuestionIllustration(q, subject)}
                        <div style={{ marginTop: "8px", color: "#000000", fontSize: "12pt", marginLeft: "20px", lineHeight: "1.5" }}>
                          <div style={{ borderBottom: "1px solid #000000", minHeight: "22px", marginBottom: "10px", width: "100%" }}></div>
                          <div style={{ borderBottom: "1px solid #000000", minHeight: "22px", marginBottom: "10px", width: "100%" }}></div>
                          <div style={{ borderBottom: "1px solid #000000", minHeight: "22px", marginBottom: "10px", width: "100%" }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAKLAR TAMPILAN GURU / KUNCI JAWABAN */}
            {activeTab === "kunci" && (
              <div id="soal-kunci-payload">
                {/* Kop Resmi Dinamis */}
                <div className="kop" style={{ borderBottom: "3.5px double black", paddingBottom: "10px", marginBottom: "15px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", border: "none" }}>
                    <tbody>
                      <tr style={{ border: "none" }}>
                        {/* Sisi Kiri: Logo Kabupaten */}
                        {hasLeft && (
                          <td style={{ border: "none", width: leftWidth, textAlign: "center", verticalAlign: "middle", paddingRight: "10px" }}>
                            <img 
                              src={leftLogo!} 
                              alt="Logo Kabupaten" 
                              style={{ height: "75px", width: "75px", display: "inline-block", objectFit: "contain" }} 
                              referrerPolicy="no-referrer"
                            />
                          </td>
                        )}
                        
                        {/* Tengah: Identitas Lembaga */}
                        <td style={{ border: "none", width: centerWidth, textAlign: "center", verticalAlign: "middle" }}>
                          <p className="kop-b1" style={{ margin: "0px", fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.2" }}>
                            {schoolInfo.governmentName || "Pemerintah Kabupaten / Kota"}
                          </p>
                          <p className="kop-b2" style={{ margin: "2px 0px", fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.2" }}>
                            {schoolInfo.educationDepartment || "Dinas Pendidikan dan Kebudayaan"}
                          </p>
                          <p className="kop-b3" style={{ margin: "2px 0px", fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.2" }}>
                            {schoolInfo.schoolName || "SD NEGERI KABUPATEN"}
                          </p>
                          <p className="kop-b4" style={{ margin: "2px 0px 0px 0px", fontSize: "9.5pt", fontStyle: "italic", lineHeight: "1.2", fontWeight: "normal" }}>
                            Alamat: {schoolInfo.schoolAddress || "Alamat Lengkap Lembaga Pendidikan"}
                          </p>
                        </td>

                        {/* Sisi Kanan: Logo Sekolah */}
                        {hasRight && (
                          <td style={{ border: "none", width: rightWidth, textAlign: "center", verticalAlign: "middle", paddingLeft: "10px" }}>
                            <img 
                              src={rightLogo!} 
                              alt="Logo Sekolah" 
                              style={{ height: "75px", width: "75px", display: "inline-block", objectFit: "contain" }} 
                              referrerPolicy="no-referrer"
                            />
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Judul Lembar Asesmen */}
                <div className="document-title" style={{ textAlign: "center", fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", margin: "10px 0px 20px 0px", textDecoration: "underline" }}>
                  KUNCI JAWABAN &AMP; PEDOMAN PENILAIAN GURU
                </div>

                {/* Pembatas Meta */}
                <table className="identitas-table" style={{ border: "1px solid black", width: "100%", marginBottom: "25px", borderCollapse: "collapse", fontSize: "10pt" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "6px", width: "15%", fontWeight: "bold" }}>Mata Pelajaran</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "35%" }}>{subject}</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "15%", fontWeight: "bold" }}>Kelas / Semester</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "35%" }}>{schoolInfo.gradeClass} / {schoolInfo.semester === 'II' ? 'Genap (II)' : 'Ganjil (I)'}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Tahun Pelajaran</td>
                      <td style={{ border: "1px solid black", padding: "6px" }}>{schoolInfo.academicYear}</td>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Aspek/Asesmen</td>
                      <td style={{ border: "1px solid black", padding: "6px" }}>Kunci Guru Resmi</td>
                    </tr>
                  </tbody>
                </table>

                {/* Loop Kunci Pertanyaan Sederhana - Full screen & Bersih */}
                <div style={{ marginTop: "15px", marginBottom: "30px", color: "#000000" }}>
                  {(() => {
                    const pgQuestions = questions.filter(q => q.questionType === "Pilihan Ganda");
                    const isianQuestions = questions.filter(q => q.questionType === "Isian Singkat");
                    const uraianQuestions = questions.filter(q => q.questionType === "Uraian");

                    return (
                      <div className="space-y-8" style={{ color: "#000000" }}>
                        {/* Pilihan Ganda */}
                        {pgQuestions.length > 0 && (
                          <div style={{ marginBottom: "30px" }}>
                            <h4 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1.5px solid #000000", paddingBottom: "3px", marginBottom: "15px", textTransform: "uppercase", color: "#000000" }}>
                              I. KUKU/Kunci Jawaban Soal Pilihan Ganda (PG)
                            </h4>
                            <p style={{ fontSize: "9.5pt", fontStyle: "italic", color: "#000000", marginBottom: "10px" }}>Format kunci singkat PG: nomor dan pilihan yang benar.</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "11pt" }}>
                              {pgQuestions.map((q) => (
                                <div key={q.number} style={{ padding: "8px 12px", border: "1.5px solid #000000", borderRadius: "6px", backgroundColor: "#ffffff", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span style={{ fontWeight: "bold", color: "#000000" }}>PG {q.number}:</span>
                                  <span style={{ textTransform: "uppercase", fontWeight: "900", color: "#000000", fontSize: "12.5pt" }}>{q.answerKey.trim().toUpperCase()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Isian Singkat */}
                        {isianQuestions.length > 0 && (
                          <div style={{ marginBottom: "30px" }}>
                            <h4 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1.5px solid #000000", paddingBottom: "3px", marginBottom: "15px", textTransform: "uppercase", color: "#000000" }}>
                              II. Kunci Jawaban Soal Isian Singkat
                            </h4>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: '"Times New Roman", Times, serif', fontSize: "10.5pt", color: "#000000" }}>
                              <thead>
                                <tr style={{ backgroundColor: "#e2e8f0", border: "1.5px solid #000000" }}>
                                  <th style={{ border: "1.5px solid #000000", padding: "8px 6px", width: "10%", textAlign: "center", fontWeight: "bold", color: "#000000" }}>No.</th>
                                  <th style={{ border: "1.5px solid #000000", padding: "8px 6px", width: "40%", textAlign: "left", fontWeight: "bold", color: "#000000" }}>Jawaban Utama (Definitif)</th>
                                  <th style={{ border: "1.5px solid #000000", padding: "8px 6px", width: "50%", textAlign: "left", fontWeight: "bold", color: "#000000" }}>Jawaban Alternatif yang Dianggap Benar</th>
                                </tr>
                              </thead>
                              <tbody>
                                {isianQuestions.map((q) => (
                                  <tr key={q.number} style={{ pageBreakInside: "avoid" }}>
                                    <td style={{ border: "1px solid #000000", padding: "8px 6px", textAlign: "center", fontWeight: "bold", color: "#000000" }}>{q.number}</td>
                                    <td style={{ border: "1px solid #000000", padding: "8px 10px", fontWeight: "bold", color: "#000000" }}>{q.answerKey}</td>
                                    <td style={{ border: "1px solid #000000", padding: "8px 10px", color: "#000000", backgroundColor: "#ffffff" }}>
                                      {q.alternativeAnswers && q.alternativeAnswers.length > 0 
                                        ? q.alternativeAnswers.join(" ; ") 
                                        : <span style={{ color: "#000000", fontStyle: "italic" }}>Sama dengan Kunci Utama (Hanya toleransi huruf besar/kecil)</span>
                                      }
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Uraian */}
                        {uraianQuestions.length > 0 && (
                          <div style={{ marginBottom: "30px" }}>
                            <h4 style={{ fontSize: "12pt", fontWeight: "bold", borderBottom: "1.5px solid #000000", paddingBottom: "3px", marginBottom: "15px", textTransform: "uppercase", color: "#000000" }}>
                              III. Kunci Jawaban & Rubrik Penilaian Soal Uraian (Essay)
                            </h4>
                            <div className="space-y-4" style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: "11pt", color: "#000000" }}>
                              {uraianQuestions.map((q) => (
                                <div key={q.number} style={{ padding: "12px", border: "1.5px solid #000000", borderRadius: "8px", backgroundColor: "#ffffff", pageBreakInside: "avoid" }}>
                                  <p style={{ margin: "0px 0px 8px 0px", fontWeight: "bold", fontSize: "11pt", color: "#000000" }}>
                                    Nomor Uraian {q.number}:
                                  </p>
                                  <div style={{ marginLeft: "10px" }}>
                                    <div style={{ marginBottom: "6px" }}>
                                      <strong style={{ color: "#000000", fontSize: "9.5pt" }}>Contoh Solusi / Jawaban Utama:</strong>
                                      <p style={{ margin: "2px 0px 0px 0px", color: "#000000", fontWeight: "500", fontSize: "10.5pt", whiteSpace: "pre-wrap" }}>{q.answerKey}</p>
                                    </div>
                                    
                                    {q.alternativeAnswers && q.alternativeAnswers.length > 0 && (
                                      <div style={{ backgroundColor: "#ffffff", border: "1px solid #000000", padding: "8px 12px", borderRadius: "6px", marginTop: "8px" }}>
                                        <strong style={{ color: "#000000", fontSize: "9.5pt" }}>Jawaban Alternatif / Poin Penilaian Relevan (Kebenaran Parsial):</strong>
                                        <ul style={{ listStyleType: "disc", paddingLeft: "18px", margin: "4px 0px 0px 0px", color: "#000000", fontSize: "10pt" }}>
                                          {q.alternativeAnswers.map((alt, ai) => (
                                            <li key={ai} style={{ marginTop: "2px" }}>{alt}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    <div style={{ fontStyle: "italic", fontSize: "9.5pt", color: "#000000", marginTop: "8px", borderTop: "1px dashed #000000", paddingTop: "6px" }}>
                                      <strong>Pembahasan &amp; Rubrik Guru:</strong> {q.explanation}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Tanda Tangan */}
                <table className="signature-table" style={{ width: "100%", marginTop: "35px", borderCollapse: "collapse", fontFamily: '"Times New Roman", Times, serif', fontSize: "12pt", lineHeight: "1.5" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "50%" }}></td>
                      <td style={{ width: "50%", textAlign: "center", fontSize: "12pt" }}>
                        {getFormattedDate()}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%", textAlign: "center", fontSize: "12pt", verticalAlign: "top" }}>
                        Mengetahui,<br />
                        <strong>Kepala Sekolah</strong>
                        <br /><br /><br /><br />
                        <span style={{ textDecoration: "underline", fontWeight: "bold" }}>{schoolInfo.principalName || "......................................................."}</span><br />
                        <span>NIP. {schoolInfo.principalNip || "......................................................."}</span>
                      </td>
                      <td style={{ width: "50%", textAlign: "center", fontSize: "12pt", verticalAlign: "top" }}>
                        Penyusun,<br />
                        <strong>{schoolInfo.teacherTitle || "Guru Kelas"}</strong>
                        <br /><br /><br /><br />
                        <span style={{ textDecoration: "underline", fontWeight: "bold" }}>{schoolInfo.teacherName || "......................................................."}</span><br />
                        <span>NIP. {schoolInfo.teacherNip || "......................................................."}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "pedoman" && (
              <div id="soal-pedoman-payload" className="animate-in fade-in duration-300">
                {/* Kop Resmi Dinamis */}
                <div className="kop" style={{ borderBottom: "3.5px double black", paddingBottom: "10px", marginBottom: "15px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", border: "none" }}>
                    <tbody>
                      <tr style={{ border: "none" }}>
                        {/* Sisi Kiri: Logo Kabupaten */}
                        {hasLeft && (
                          <td style={{ border: "none", width: leftWidth, textAlign: "center", verticalAlign: "middle", paddingRight: "10px" }}>
                            <img 
                              src={leftLogo!} 
                              alt="Logo Kabupaten" 
                              style={{ height: "75px", width: "75px", display: "inline-block", objectFit: "contain" }} 
                              referrerPolicy="no-referrer"
                            />
                          </td>
                        )}
                        
                        {/* Tengah: Identitas Lembaga */}
                        <td style={{ border: "none", width: centerWidth, textAlign: "center", verticalAlign: "middle" }}>
                          <p className="kop-b1" style={{ margin: "0px", fontSize: "14pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px", lineHeight: "1.2" }}>
                            {schoolInfo.governmentName || "Pemerintah Kabupaten / Kota"}
                          </p>
                          <p className="kop-b2" style={{ margin: "2px 0px", fontSize: "11pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.2" }}>
                            {schoolInfo.educationDepartment || "Dinas Pendidikan dan Kebudayaan"}
                          </p>
                          <p className="kop-b3" style={{ margin: "2px 0px", fontSize: "15pt", fontWeight: "bold", textTransform: "uppercase", lineHeight: "1.2" }}>
                            {schoolInfo.schoolName || "SD NEGERI KABUPATEN"}
                          </p>
                          <p className="kop-b4" style={{ margin: "2px 0px 0px 0px", fontSize: "9.5pt", fontStyle: "italic", lineHeight: "1.2", fontWeight: "normal" }}>
                            Alamat: {schoolInfo.schoolAddress || "Alamat Lengkap Lembaga Pendidikan"}
                          </p>
                        </td>

                        {/* Sisi Kanan: Logo Sekolah */}
                        {hasRight && (
                          <td style={{ border: "none", width: rightWidth, textAlign: "center", verticalAlign: "middle", paddingLeft: "10px" }}>
                            <img 
                              src={rightLogo!} 
                              alt="Logo Sekolah" 
                              style={{ height: "75px", width: "75px", display: "inline-block", objectFit: "contain" }} 
                              referrerPolicy="no-referrer"
                            />
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Judul Lembar Pedoman */}
                <div className="document-title" style={{ textAlign: "center", fontSize: "12pt", fontWeight: "bold", textTransform: "uppercase", margin: "10px 0px 20px 0px", textDecoration: "underline" }}>
                  PEDOMAN PENSKORAN &amp; RUBRIK EVALUASI NILAI AKHIR
                </div>

                {/* Pembatas Meta */}
                <table className="identitas-table" style={{ border: "1px solid black", width: "100%", marginBottom: "20px", borderCollapse: "collapse", fontSize: "10pt" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "6px", width: "15%", fontWeight: "bold" }}>Mata Pelajaran</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "35%" }}>{subject}</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "15%", fontWeight: "bold" }}>Kelas / Semester</td>
                      <td style={{ border: "1px solid black", padding: "6px", width: "35%" }}>{schoolInfo.gradeClass} / {schoolInfo.semester === 'II' ? 'Genap (II)' : 'Ganjil (I)'}</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Tahun Pelajaran</td>
                      <td style={{ border: "1px solid black", padding: "6px" }}>{schoolInfo.academicYear}</td>
                      <td style={{ border: "1px solid black", padding: "6px", fontWeight: "bold" }}>Kriteria Evaluasi</td>
                      <td style={{ border: "1px solid black", padding: "6px" }}>Standar Bobot Kelulusan SD</td>
                    </tr>
                  </tbody>
                </table>

                {/* Ringkasan Konfigurasi Bobot & Penskoran */}
                <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "15px 0px 8px 0px", textTransform: "uppercase", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  I. Kriteria Bobot Nilai Berdasarkan Bentuk Soal
                </h4>
                <table className="page-break-avoid" style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black", marginBottom: "20px", fontSize: "10pt", pageBreakInside: "avoid" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f2f2f2", pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <th style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: "bold", width: "5%" }}>No</th>
                      <th style={{ border: "1px solid black", padding: "8px", textAlign: "left", fontWeight: "bold", width: "25%" }}>Bentuk Soal</th>
                      <th style={{ border: "1px solid black", padding: "8px", textAlign: "left", fontWeight: "bold", width: "50%" }}>Kriteria Rubrik &amp; Pedoman Penskoran</th>
                      <th style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: "bold", width: "20%" }}>Skor / Bobot Maksimal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>1</td>
                      <td style={{ border: "1px solid black", padding: "8px", fontWeight: "bold" }}>Pilihan Ganda</td>
                      <td style={{ border: "1px solid black", padding: "8px", lineHeight: "1.4" }}>
                        Jawaban benar mendapat skor <b>1</b>, sedangkan jawaban salah mendapat skor <b>0</b>.
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: "bold" }}>1 Poin Utama</td>
                    </tr>
                    <tr style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>2</td>
                      <td style={{ border: "1px solid black", padding: "8px", fontWeight: "bold" }}>Isian Singkat</td>
                      <td style={{ border: "1px solid black", padding: "8px", lineHeight: "1.4" }}>
                        Menyediakan rentang skor <b>0 s.d 2</b>:<br />
                        • <b>Skor 2:</b> Jawaban benar, tepat dan lengkap sesuai kunci jawaban.<br />
                        • <b>Skor 1:</b> Jawaban mendekati benar / kurang lengkap.<br />
                        • <b>Skor 0:</b> Jawaban salah total atau kosong.
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: "bold" }}>Rentang 0 - 2 Poin</td>
                    </tr>
                    <tr style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>3</td>
                      <td style={{ border: "1px solid black", padding: "8px", fontWeight: "bold" }}>Uraian</td>
                      <td style={{ border: "1px solid black", padding: "8px", lineHeight: "1.4" }}>
                        Menyediakan rentang skor <b>0 s.d 5</b>:<br />
                        • <b>Skor 5:</b> Jawaban sangat lengkap, analisis mendalam, runut, dan tepat.<br />
                        • <b>Skor 4:</b> Jawaban tepat, analisis benar, tetapi ada bagian kecil yang belum diuraikan.<br />
                        • <b>Skor 3:</b> Jawaban sebagian besar tepat, penjelasan sederhana.<br />
                        • <b>Skor 2:</b> Jawaban kurang tepat, tetapi masih mengandung konsep/langkah yang relevan.<br />
                        • <b>Skor 1:</b> Menuliskan respon seadanya/hanya menyalin soal, tidak tepat.<br />
                        • <b>Skor 0:</b> Jawaban salah total atau kosong.
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontWeight: "bold" }}>Rentang 0 - 5 Poin</td>
                    </tr>
                    <tr style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center" }}>4</td>
                      <td style={{ border: "1px solid black", padding: "8px", fontWeight: "bold" }}>Kompleks &amp; Lainnya</td>
                      <td style={{ border: "1px solid black", padding: "8px", lineHeight: "1.4" }}>
                        Untuk Pilihan Ganda Kompleks / Menjodohkan / lainnya, jika jawaban dipilih benar, diberi <b>1 poin per opsi benar</b> (jumlah poin total disesuaikan jumlah pasangan atau pilihan berstatus benar).
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontStyle: "italic", fontWeight: "bold" }}>Sesuai Opsi Benar (1 Poin/Benar)</td>
                    </tr>
                  </tbody>
                </table>

                {/* Tabel Distribusi Bobot per Soal */}
                <h4 style={{ fontSize: "11pt", fontWeight: "bold", margin: "20px 0px 8px 0px", textTransform: "uppercase", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  II. Tabel Distribusi Bobot dan Skor Maksimal Butir Soal ({questions.length} Butir)
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black", marginBottom: "20px", fontSize: "10pt" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f2f2f2", pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <th style={{ border: "1px solid black", padding: "6px", textAlign: "center", fontWeight: "bold", width: "8%" }}>Butir No</th>
                      <th style={{ border: "1px solid black", padding: "6px", textAlign: "left", fontWeight: "bold", width: "22%" }}>Bentuk Soal</th>
                      <th style={{ border: "1px solid black", padding: "6px", textAlign: "left", fontWeight: "bold", width: "18%" }}>Level Kognitif</th>
                      <th style={{ border: "1px solid black", padding: "6px", textAlign: "left", fontWeight: "bold", width: "37%" }}>Materi Pokok</th>
                      <th style={{ border: "1px solid black", padding: "6px", textAlign: "center", fontWeight: "bold", width: "15%" }}>Skor Maksimal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q) => {
                      const maxScore = getQuestionMaxScore(q.questionType, q);
                      return (
                        <tr key={q.number} style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                          <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{q.number}</td>
                          <td style={{ border: "1px solid black", padding: "6px" }}>{q.questionType}</td>
                          <td style={{ border: "1px solid black", padding: "6px" }}>{q.cognitiveLevel}</td>
                          <td style={{ border: "1px solid black", padding: "6px" }}>{q.materi}</td>
                          <td style={{ border: "1px solid black", padding: "6px", textAlign: "center", fontWeight: "bold" }}>{maxScore}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ backgroundColor: "#f9f9f9", fontWeight: "bold", pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <td colSpan={4} style={{ border: "1px solid black", padding: "8px", textAlign: "right" }}>
                        TOTAL SKOR MAKSIMAL INTRUMEN UJIAN (∑ Skor):
                      </td>
                      <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", fontSize: "11pt", color: "#111" }}>
                        {questions.reduce((sum, q) => sum + getQuestionMaxScore(q.questionType, q), 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Perhitungan Rumus Nilai Akhir */}
                <div className="formula-block page-break-avoid" style={{ border: "1px solid black", padding: "12px", backgroundColor: "#fcfcfc", marginBottom: "25px", fontSize: "10.5pt", lineHeight: "1.4", pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <p style={{ margin: "0px 0px 8px 0px", fontWeight: "bold", textTransform: "uppercase", fontSize: "10pt", color: "#1e293b" }}>
                    III. Rumusan Standardisasi Nilai Akhir (NA)
                  </p>
                  <p style={{ margin: "0px 0px 8px 0px" }}>
                    Nilai Akhir diperoleh secara proporsional dengan membandingkan total skor perolehan murid terhadap total skor maksimal soal ujian, dikalikan 100.
                  </p>
                  <div style={{ textAlign: "center", margin: "12px 10px", padding: "10px", border: "1px dashed #ccc", backgroundColor: "#fff" }}>
                    <p style={{ margin: "0px", fontSize: "11.5pt", fontWeight: "bold", fontFamily: "Courier New, monospace" }}>
                      Nilai Akhir (NA) = (Total Skor Perolehan Siswa / Total Skor Maksimal) x 100
                    </p>
                  </div>
                  <p style={{ margin: "0px", fontSize: "9.5pt", fontStyle: "italic", color: "#64748b" }}>
                    * Catatan: Nilai Akhir dibulatkan hingga 2 angka di belakang koma untuk akurasi pelaporan rapor hasil belajar siswa.
                  </p>
                </div>

                {/* Tanda Tangan */}
                <table className="signature-table page-break-avoid" style={{ width: "100%", marginTop: "35px", borderCollapse: "collapse", pageBreakInside: "avoid", breakInside: "avoid", fontFamily: '"Times New Roman", Times, serif', fontSize: "12pt", lineHeight: "1.5" }}>
                  <tbody>
                    <tr style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <td style={{ width: "50%" }}></td>
                      <td style={{ width: "50%", textAlign: "center", fontSize: "12pt" }}>
                        {getFormattedDate()}
                      </td>
                    </tr>
                    <tr style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
                      <td style={{ width: "50%", textAlign: "center", fontSize: "12pt", verticalAlign: "top" }}>
                        Mengetahui,<br />
                        <strong>Kepala Sekolah</strong>
                        <br /><br /><br /><br />
                        <span style={{ textDecoration: "underline", fontWeight: "bold" }}>{schoolInfo.principalName || "......................................................."}</span><br />
                        <span>NIP. {schoolInfo.principalNip || "......................................................."}</span>
                      </td>
                      <td style={{ width: "50%", textAlign: "center", fontSize: "12pt", verticalAlign: "top" }}>
                        Penyusun,<br />
                        <strong>{schoolInfo.teacherTitle || "Guru Kelas"}</strong>
                        <br /><br /><br /><br />
                        <span style={{ textDecoration: "underline", fontWeight: "bold" }}>{schoolInfo.teacherName || "......................................................."}</span><br />
                        <span>NIP. {schoolInfo.teacherNip || "......................................................."}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAILED QUESTION & SVG IMAGE REGENERATOR MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto scroll-smooth transition-all duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-[94vw] max-w-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] border border-slate-100 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-center text-lg shadow-inner">
                  ✏️
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">
                    Sunting Butir Soal Nomor #{editingQuestion.number}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-medium">
                    Atur konten pertanyaan, opsi pilihan, kunci, hingga visualisasi gambar SVG edukasi.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 pt-2 flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setModalTab("content")}
                className={`pb-2.5 text-xs font-bold transition-all relative ${
                  modalTab === "content" ? "text-indigo-650" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                📝 Konten &amp; Kunci Jawaban
                {modalTab === "content" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setModalTab("media")}
                className={`pb-2.5 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                  modalTab === "media" ? "text-indigo-650" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                🎨 Gambar Pendukung Soal Soal
                {(editingQuestion.svgContent || editingQuestion.imageUrl) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-ping" />
                )}
                {modalTab === "media" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[calc(95vh-190px)] sm:max-h-[calc(90vh-190px)] space-y-4 scroll-smooth pr-5">
              
              {modalTab === "content" && (
                <div className="space-y-4">
                  {/* Row 1: Pokok Bahasan */}
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Materi / Pokok Bahasan
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.materi}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, materi: e.target.value })}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-150 transition-colors"
                    />
                  </div>

                  {/* Stimulus */}
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Teks Stimulus (Cerita / Deskripsi Konteks) <span className="text-slate-400 italic font-medium">(Opsional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={editingQuestion.stimulusText || ""}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, stimulusText: e.target.value })}
                      placeholder="Contoh: Roni membawa 3 keranjang mangga hasil panen ke pasar..."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-150 transition-colors"
                    />
                  </div>

                  {/* Teks Pertanyaan */}
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Kalimat Pertanyaan Utama
                    </label>
                    <textarea
                      rows={3}
                      value={editingQuestion.questionText}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-150 transition-colors"
                    />
                  </div>

                  {/* Opsi Pilihan Ganda */}
                  {editingQuestion.questionType === "Pilihan Ganda" && editingQuestion.options && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          Pilihan Alternatif Jawaban (A, B, C, D)
                        </label>
                        <span className="text-[9.5px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-md select-none">
                          Prefix Diatur Otomatis ✨
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {editingQuestion.options.map((opt, oIdx) => {
                          const letter = String.fromCharCode(65 + oIdx);
                          const cleanVal = opt.replace(/^[a-dA-D][.\s)]+/, "");
                          return (
                            <div key={oIdx} className="flex items-center bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-200 overflow-hidden pr-2 transition-colors">
                              <span className="bg-slate-200 text-slate-700 text-xs font-black px-3 py-2.5 shrink-0 select-none">
                                {letter}
                              </span>
                              <input
                                type="text"
                                value={cleanVal}
                                placeholder={`Opsi ${letter}...`}
                                onChange={(e) => {
                                  const newOpts = [...(editingQuestion.options || [])];
                                  newOpts[oIdx] = `${letter}. ${e.target.value}`;
                                  setEditingQuestion({ ...editingQuestion, options: newOpts });
                                }}
                                className="w-full text-xs font-bold p-2 bg-transparent outline-hidden text-slate-800"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Kunci Jawaban & Pembahasan */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                    <div className="md:col-span-1">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                        Kunci Jawaban Definitif
                      </label>
                      {editingQuestion.questionType === "Pilihan Ganda" ? (
                        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-2xl gap-1">
                          {["A", "B", "C", "D"].map((letter) => {
                            const isSelected = editingQuestion.answerKey.toUpperCase().trim() === letter || 
                              editingQuestion.answerKey.toUpperCase().trim().startsWith(letter + ".");
                            return (
                              <button
                                key={letter}
                                type="button"
                                onClick={() => setEditingQuestion({ ...editingQuestion, answerKey: letter.toLowerCase() })}
                                className={`flex-1 py-1.5 font-black text-xs rounded-xl cursor-pointer transition-all ${
                                  isSelected 
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-300" 
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                                }`}
                              >
                                {letter}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={editingQuestion.answerKey}
                          onChange={(e) => setEditingQuestion({ ...editingQuestion, answerKey: e.target.value })}
                          className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-150 transition-colors"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                        Pedoman Penilaian / Penjelasan Pembahasan
                      </label>
                      <textarea
                        rows={2}
                        value={editingQuestion.explanation}
                        onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                        className="w-full text-xs font-medium p-2 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-150 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalTab === "media" && (
                <div className="space-y-4">
                  {/* Status & Visual Image Preview Sheet */}
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-2">
                      Pratinjau Visual Gambar Saat Ini
                    </span>
                    <div className="min-h-[160px] bg-slate-50 rounded-2xl border border-slate-200/60 p-4 flex flex-col items-center justify-center relative overflow-hidden">
                      {editingQuestion.svgContent || editingQuestion.imageUrl ? (
                        <>
                          {renderQuestionIllustration(editingQuestion, subject)}
                          <div className="mt-2 flex gap-2">
                            <span className="text-[10px] uppercase font-extrabold bg-indigo-50 border border-indigo-150 text-indigo-700 px-2 py-0.5 rounded-md">
                              {editingQuestion.svgContent ? "Tipe SVG Pembelajaran" : "Tipe Foto / Link"}
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="text-[10px] text-red-500 font-bold hover:underline"
                            >
                              Hapus Gambar
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-1.5 p-4 text-slate-400">
                          <ImageIcon size={32} className="mx-auto block stroke-1" />
                          <p className="text-xs font-bold text-slate-500">Soal ini belum bersenjatakan gambar ilustrasi</p>
                          <p className="text-[10px] text-slate-400">Anda dapat menyusun gambar baru menggunakan kecerdasan buas AI atau mengunggah manual.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* WORD-STYLE SIZING PANEL */}
                  {(editingQuestion.svgContent || editingQuestion.imageUrl) && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3.5">
                      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                        <span className="text-xs">📏</span>
                        <h4 className="text-xs font-extrabold text-slate-800">Atur Ukuran Gambar (Gaya Microsoft Word)</h4>
                      </div>

                      {/* Presets Row */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 block mb-1.5">Pilih Ukuran Cepat:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingQuestion({ ...editingQuestion, imageWidth: 120, imageHeight: 80 })}
                            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              (editingQuestion.imageWidth === 120 && editingQuestion.imageHeight === 80)
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            🔎 Kecil (120×80)
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingQuestion({ ...editingQuestion, imageWidth: 240, imageHeight: 140 })}
                            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              (!editingQuestion.imageWidth || (editingQuestion.imageWidth === 240 && editingQuestion.imageHeight === 140))
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            ⚖️ Sedang (240×140)
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingQuestion({ ...editingQuestion, imageWidth: 360, imageHeight: 200 })}
                            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              (editingQuestion.imageWidth === 360 && editingQuestion.imageHeight === 200)
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            🖼️ Besar (360×200)
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingQuestion({ ...editingQuestion, imageWidth: 500, imageHeight: 280 })}
                            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                              (editingQuestion.imageWidth === 500 && editingQuestion.imageHeight === 280)
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            🖥️ Luas (500×280)
                          </button>
                        </div>
                      </div>

                      {/* Custom Sliders for Fine-Tuning */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5">
                        {/* Width Slider (Panjang) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                            <span>↔️ Lebar (Panjang):</span>
                            <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                              {editingQuestion.imageWidth || 240}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="60"
                            max="600"
                            step="10"
                            value={editingQuestion.imageWidth || 240}
                            onChange={(e) => setEditingQuestion({
                              ...editingQuestion,
                              imageWidth: parseInt(e.target.value)
                            })}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <p className="text-[9px] text-slate-400">Tarik slider untuk menambah/mengurangi lebar</p>
                        </div>

                        {/* Height Slider (Tinggi) */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                            <span>↕️ Tinggi Gambar:</span>
                            <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                              {editingQuestion.imageHeight || 140}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="40"
                            max="400"
                            step="10"
                            value={editingQuestion.imageHeight || 140}
                            onChange={(e) => setEditingQuestion({
                              ...editingQuestion,
                              imageHeight: parseInt(e.target.value)
                            })}
                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <p className="text-[9px] text-slate-400">Tarik slider untuk menambah/mengurangi tinggi</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ERROR REPORT BOX */}
                  {imageError && (
                    <div className="p-3 bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <span>⚠️</span>
                      <p className="font-semibold">{imageError}</p>
                    </div>
                  )}

                  {/* STEP 1: AI AUTO_GENERATION */}
                  <div className="p-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-indigo-600 animate-pulse" />
                      <h4 className="text-xs font-extrabold text-slate-800">🪄 Opsi Pintar: Hasilkan Gambar / Diagram Relevan dengan AI</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Gemini AI akan secara otomatis membedah isi teks naskah pertanyaan di atas dan merekonstruksi 
                      kode XML SVG yang akurat (seperti pecahan pie, jaring jaring kubus, bagan sains, dsb) secara khusus.
                    </p>
                    <button
                      type="button"
                      disabled={regeneratingImage}
                      onClick={handleRegenerateImageAI}
                      className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-xs rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer select-none"
                    >
                      {regeneratingImage ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" /> Merumuskan SVG Presisi...
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} />
                          Hasilkan Gambar Baru (AI)
                        </>
                      )}
                    </button>
                  </div>

                  {/* IMAGEN PHOTO PROMPT EDITOR SECTION */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-amber-500 shrink-0" />
                      <h4 className="text-xs font-extrabold text-amber-900 select-none">📸 Prompt Foto Realistis (Imagen)</h4>
                    </div>
                    <p className="text-[11px] text-slate-650 leading-normal font-medium">
                      Gunakan prompt ini dengan model Imagen untuk melahirkan visualisasi pendidikan Indonesia yang autentik dan ultra-realistis.
                    </p>
                    <textarea
                      rows={3}
                      value={editingQuestion.imagenPrompt || ""}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, imagenPrompt: e.target.value })}
                      placeholder="Prompt Imagen kosong untuk nomor ini. Klik 'Gen Standar Prompt' di bawah ini untuk merumuskannya secara otomatis berdasarkan soal ini."
                      className="w-full text-[11px] font-mono p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden text-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-200 leading-relaxed"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const standardPrompt = `Ultra realistic educational photography of elementary school children in Indonesia, showing ${editingQuestion.questionType === "Pilihan Ganda" ? "answering questions about " + editingQuestion.materi : "observing realistic objects of " + editingQuestion.materi}, authentic Indonesian school environment, natural lighting, realistic environment, natural human pose, DSLR quality, highly detailed textures, realistic shadows, natural smiles, documentary style photography, depth of field, 8k detail, no text, no watermark, no distortion.`;
                          setEditingQuestion({ ...editingQuestion, imagenPrompt: standardPrompt });
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 cursor-pointer shadow-2xs"
                      >
                        ⚡ Gen Standar Prompt
                      </button>
                      {editingQuestion.imagenPrompt && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(editingQuestion.imagenPrompt || "");
                          }}
                          className="px-3 py-1.5 bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-lg text-[10px] font-bold cursor-pointer active:scale-95 transition-transform"
                        >
                          ✔ Tersalin ke Clipboard
                        </button>
                      )}
                    </div>
                  </div>

                  {/* STEP 2: MANUAL SOURCE INPUT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    {/* Method A: File Upload */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-slate-700 block select-none">
                        Option A: Unggah Gambar Mandiri (.png, .jpg / maks 2MB)
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLocalImageUpload}
                          className="block w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Method B: URL input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-700 block select-none">
                        Option B: Tempel Link / URL Gambar Online
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={editingQuestion.imageUrl || ""}
                        onChange={(e) => setEditingQuestion({
                          ...editingQuestion,
                          imageUrl: e.target.value,
                          svgContent: undefined // clear SVG
                        })}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 outline-hidden focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  {/* SVG Code direct input (Advanced) */}
                  <div className="pt-2 border-t border-slate-100">
                    <details className="group">
                      <summary className="text-[11px] text-slate-400 hover:text-indigo-600 font-bold cursor-pointer select-none outline-hidden">
                        ⚙️ Opsi Lanjutan: Sunting Markup XML SVG Langsung
                      </summary>
                      <div className="mt-2">
                        <textarea
                          rows={4}
                          value={editingQuestion.svgContent || ""}
                          onChange={(e) => setEditingQuestion({
                            ...editingQuestion,
                            svgContent: e.target.value,
                            imageUrl: undefined
                          })}
                          placeholder="<svg viewBox='0 0 100 100'>...</svg>"
                          className="w-full text-[10px] font-mono p-2.5 bg-slate-900 text-emerald-400 rounded-xl outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                        />
                      </div>
                    </details>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400 font-light hidden sm:inline">
                *Tinggi visual SVG otomatis menyesuaikan cetakan kertas dokumen ujian.
              </span>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs rounded-xl transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

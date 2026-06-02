import React, { useState } from "react";
import { QuestionItem } from "../types";
import { 
  Maximize2, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  X, 
  Sparkles,
  Trash2
} from "lucide-react";

interface QuestionWithImageProps {
  q: QuestionItem;
  subject: string;
  onUpdateQuestion?: (updatedQ: QuestionItem) => void;
  disabled?: boolean;
}

export default function QuestionWithImage({ q, subject, onUpdateQuestion, disabled = false }: QuestionWithImageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(false);

  const imageWidth = q.imageWidth || 380;
  const imageHeight = q.imageHeight || 190;

  // Decide the fallback SVG if needed
  const getFallbackSvg = () => {
    const textToScan = `${subject || ""} ${q.materi || ""} ${q.questionText || ""} ${q.explanation || ""}`.toLowerCase();
    
    if (textToScan.includes("pecahan") || textToScan.includes("bagian")) {
      return `
        <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" stroke="#1e3a8a" stroke-width="3" fill="#f8fafc"/>
          <path d="M 60 10 A 50 50 0 0 1 110 60 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>
          <path d="M 110 60 A 50 50 0 0 1 60 110 L 60 60 Z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>
          <line x1="60" y1="10" x2="60" y2="110" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="2,2"/>
          <line x1="10" y1="60" x2="110" y2="60" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="2,2"/>
          <text x="60" y="65" font-family="'Times New Roman', serif" font-size="9" font-weight="bold" fill="#1e3a8a" text-anchor="middle">PECAHAN</text>
        </svg>
      `;
    } else if (textToScan.includes("segitiga") || textToScan.includes("sudut")) {
      return `
        <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,80 100,80 20,20" fill="#f8fafc" stroke="#1e3a8a" stroke-width="3"/>
          <rect x="20" y="70" width="10" height="10" fill="none" stroke="#1e3a8a" stroke-width="1.5"/>
          <text x="12" y="85" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">A</text>
          <text x="105" y="85" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">B</text>
          <text x="15" y="15" font-size="10" font-family="sans-serif" font-weight="bold" fill="#1e3a8a">C</text>
        </svg>
      `;
    } else if (textToScan.includes("pancasila") || textToScan.includes("garuda") || textToScan.includes("bendera")) {
      return `
        <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 30,20 Q 80,10 130,20 L 130,55 Q 130,85 80,95 Q 30,85 30,55 Z" fill="#fffaf0" stroke="#b91c1c" stroke-width="3"/>
          <line x1="80" y1="12" x2="80" y2="95" stroke="#b91c1c" stroke-width="2"/>
          <line x1="30" y1="50" x2="130" y2="50" stroke="#b91c1c" stroke-width="2"/>
          <polygon points="80,3 Star Assembly" fill="#fbbf24" stroke="#d97706" stroke-width="1.5"/>
          <text x="80" y="75" font-family="sans-serif" font-size="9" font-weight="bold" fill="#b91c1c" text-anchor="middle">PANCASILA</text>
        </svg>
      `;
    }
    
    // Generic fallback
    return `
      <svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="140" height="90" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>
        <polygon points="75,20 115,35 75,50 35,35" fill="#334155" stroke="#1e293b" stroke-width="1"/>
        <line x1="75" y1="50" x2="75" y2="75" stroke="#334155" stroke-width="1.5"/>
        <text x="75" y="90" font-family="sans-serif" font-size="8" font-weight="bold" fill="#64748b" text-anchor="middle">PREVIEW EDUKATIF</text>
      </svg>
    `;
  };

  const handleRegenerateFromAI = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (disabled || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-user-api-key": localStorage.getItem("ttu_user_api_key") || ""
        },
        body: JSON.stringify({
          subject,
          question: q,
          prompt: customPrompt.trim() || undefined,
          userApiKey: localStorage.getItem("ttu_user_api_key") || "",
        })
      });

      if (!response.ok) {
        throw new Error(`Gagal memanggil API (${response.status})`);
      }

      const data = await response.json();
      if (data.imageUrl && onUpdateQuestion) {
        onUpdateQuestion({
          ...q,
          imageUrl: data.imageUrl,
          svgContent: undefined,
          imagenPrompt: customPrompt.trim() || q.imagenPrompt
        });
        setShowPromptInput(false);
      } else {
        throw new Error("Respons gambar tidak mengandung data URL yang valid.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal membangkitkan gambar AI.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateQuestion) {
      onUpdateQuestion({
        ...q,
        imageUrl: undefined,
        svgContent: undefined
      });
    }
  };

  if (!q.imageUrl && !q.svgContent) {
    return null;
  }

  return (
    <div 
      className="question-illustration print-avoid-break group relative my-5 mx-auto bg-slate-50 border-2 border-slate-300 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:border-blue-500 hover:bg-blue-50/10"
      style={{
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        maxWidth: "100%",
      }}
    >
      {/* 1. Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-30 text-center p-4">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[11px] font-black tracking-wider text-amber-500 mt-3 uppercase animate-pulse">
            ✨ Seniman AI Merumuskan Gambar...
          </p>
          <p className="text-[9px] text-slate-400 mt-1">Menggunakan Google Imagen 3</p>
        </div>
      )}

      {/* 2. Error Overlay */}
      {error && (
        <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-xs flex flex-col items-center justify-center z-30 p-4 text-center">
          <AlertTriangle className="text-rose-400 w-7 h-7 mb-2 animate-bounce" />
          <p className="text-xs font-bold text-rose-200">Batas Limit Gambar Terlampaui</p>
          <p className="text-[10px] text-rose-300/80 max-w-[280px] mt-1 leading-snug">{error}</p>
          <div className="flex gap-2 mt-3.5 no-print">
            <button
              onClick={handleRegenerateFromAI}
              className="px-2.5 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} /> Coba Lagi
            </button>
            <button
              onClick={() => setError(null)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Illustration Canvas */}
      {q.imageUrl ? (
        <div className="w-full h-full relative flex items-center justify-center">
          <img 
            src={q.imageUrl} 
            alt={`Ilustrasi Soal ${q.number}`} 
            className="w-full h-full object-cover transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : q.svgContent ? (
        <div 
          className="w-full h-full p-2 flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-full [&_svg]:h-full"
          dangerouslySetInnerHTML={{ __html: q.svgContent }}
        />
      ) : (
        <div 
          className="w-full h-full p-3 flex flex-col items-center justify-center text-center opacity-70 group-hover:opacity-100 transition-all"
        >
          <div 
            className="w-[90%] h-[85%] flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full"
            dangerouslySetInnerHTML={{ __html: getFallbackSvg() }}
          />
        </div>
      )}

      {/* Flag to mark it's an AI or Educational illustration in print */}
      <div 
        className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-bold select-none no-print group-hover:hidden transition-all pointer-events-none"
      >
        {q.imageUrl ? "✦ Gambar AI" : "✦ Sketsa Vektor"}
      </div>

      {/* 4. Overlay Controls (Visible on hover; completely hidden in print) */}
      {!disabled && !loading && (
        <div 
          className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 text-center p-3 no-print"
        >
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {q.imageUrl && (
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="p-1.5 bg-slate-900 border border-slate-700 text-white rounded-lg hover:bg-black transition-colors tooltip flex items-center gap-1 text-[9px] font-black cursor-pointer"
                title="Perbesar Tampilan"
              >
                <Maximize2 size={11} /> Zoom
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPromptInput(!showPromptInput)}
              className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1 text-[9px] font-black cursor-pointer"
              title="Minta Imagen 3 Gambar Ulang"
            >
              <Sparkles size={11} /> AI Regenerate
            </button>

            {(q.imageUrl || q.svgContent) && (
              <button
                type="button"
                onClick={clearImage}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-1 text-[9px] font-black cursor-pointer"
                title="Hapus Gambar"
              >
                <Trash2 size={11} /> Hapus
              </button>
            )}
          </div>

          {showPromptInput && (
            <div 
              className="w-full max-w-[90%] mt-2 bg-slate-900 border border-slate-700 p-1.5 rounded-lg flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Sesuaikan prompt (Opsional, B. Inggris/Indo)..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full text-[9px] px-2 py-1 bg-black text-slate-100 border border-slate-850 rounded-md focus:outline-none"
              />
              <div className="flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setShowPromptInput(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[8px] hover:text-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleRegenerateFromAI()}
                  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded text-[8px] flex items-center gap-0.5 cursor-pointer"
                >
                  Proses
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Lightbox Modal Zoom (Portal inline for pure responsive UX) */}
      {zoomOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 no-print"
          onClick={() => setZoomOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col bg-slate-950 border border-slate-800 rounded-3xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
              <div className="text-left">
                <h4 className="text-sm font-black text-white uppercase tracking-tight">🔎 Pratinjau Detil Ilustrasi Soal #{q.number}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{q.questionText}</p>
              </div>
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body Canvas */}
            <div className="h-[55vh] w-full flex items-center justify-center overflow-auto bg-slate-900 border border-slate-850 rounded-2xl relative">
              <div 
                style={{ transform: `scale(${zoomScale})` }}
                className="transition-transform duration-200"
              >
                <img 
                  src={q.imageUrl} 
                  alt="Ilustrasi Detil" 
                  className="max-h-[50vh] max-w-[80vw] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Float scale display */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-mono text-amber-500 tracking-wider">
                Skala: {Math.round(zoomScale * 100)}%
              </div>
            </div>

            {/* Modal Controls footer */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoomScale(p => Math.max(0.5, p - 0.25))}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 rounded-xl flex items-center justify-center cursor-pointer"
                  title="Perkecil"
                >
                  <ZoomOut size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-105 rounded-xl text-xs font-mono cursor-pointer"
                  title="Ukur Semestinya"
                >
                  1:1
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(p => Math.min(3.0, p + 0.25))}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-355 rounded-xl flex items-center justify-center cursor-pointer"
                  title="Perbesar"
                >
                  <ZoomIn size={15} />
                </button>
              </div>

              <div className="text-[10px] font-semibold text-slate-400">
                Gunakan kursor klik/tarik gambar atau cubit layar untuk berinteraksi.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PlayCircle, Plus, Trash, ExternalLink, AlertTriangle } from "lucide-react";

interface TutorialLink {
  id: string;
  title: string;
  url: string;
  timestamp: string;
}

interface TutorialViewProps {
  isAdmin: boolean;
  onShowToast: (msg: string) => void;
}

export default function TutorialView({ isAdmin, onShowToast }: TutorialViewProps) {
  const [links, setLinks] = useState<TutorialLink[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tutorials"), (snapshot) => {
      const data: TutorialLink[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as TutorialLink);
      });
      // Sort by timestamp descending (newest first)
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Default initial video if empty and is admin
      if (data.length === 0 && isAdmin) {
        setDoc(doc(db, "tutorials", "default-tutorial"), {
          title: "Tutorial Penggunaan Aplikasi Pelita Soal",
          url: "https://youtu.be/aflcqVYaYf8?si=d7nscaF6VBENDPzc",
          timestamp: new Date().toISOString()
        });
      }
      
      setLinks(data);
    });
    return () => unsub();
  }, [isAdmin]);

  const handleSave = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    try {
      const id = "link_" + Date.now();
      await setDoc(doc(db, "tutorials", id), {
        title: newTitle.trim(),
        url: newUrl.trim(),
        timestamp: new Date().toISOString()
      });
      setNewTitle("");
      setNewUrl("");
      setIsAdding(false);
      onShowToast("✅ Tautan informasi berhasil disimpan!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tautan ini?")) return;
    try {
      await deleteDoc(doc(db, "tutorials", id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="bingkai-emas-premium p-6 md:p-8 bg-slate-900/80">
        <div className="flex flex-col mb-8 border-b border-slate-800 pb-5">
          <h2 className="text-2xl md:text-3xl font-black text-slate-100 flex items-center gap-3">
            <PlayCircle className="text-rose-500" size={36} />
            Tutorial & Panduan Aplikasi
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-semibold">
            Daftar video panduan resmi untuk membantu Anda menggunakan aplikasi secara maksimal.
          </p>
        </div>

        {/* IMPORTANT INFORMATION CARD */}
        <div className="mb-8 p-5 md:p-6 bg-gradient-to-br from-rose-950/80 to-rose-900/40 border-l-4 border-l-rose-500 border-y border-r border-rose-500/20 rounded-2xl shadow-lg shadow-rose-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <AlertTriangle size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start">
            <div className="w-12 h-12 bg-rose-500/20 rounded-2xl border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
              <AlertTriangle size={24} className="animate-pulse" />
            </div>
            <div className="text-left space-y-2">
              <h3 className="font-black text-rose-400 uppercase tracking-widest text-sm md:text-base">
                INFORMASI PENTING!
              </h3>
              <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-semibold">
                Jika laptop Anda mengalami <strong className="text-white font-black bg-rose-950 px-2 py-0.5 rounded">CRASH (Layar Putih)</strong>, silakan tekan kombinasi tombol <kbd className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded-md font-mono border border-slate-700 shadow-sm mx-1">CTRL</kbd> + <kbd className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded-md font-mono border border-slate-700 shadow-sm mx-1">R</kbd> di keyboard Anda, atau klik tombol <strong>Restart/Refresh</strong> pada peramban (browser) halaman Anda. 
              </p>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed pt-1">
                Ikuti petunjuk dan panduan lebih lanjut dengan mengklik atau membuka pilihan video tutorial dan tautan informasi yang sudah tersedia di bawah ini!
              </p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-8 p-5 bg-slate-800/30 border border-amber-500/20 rounded-xl space-y-4 shadow-inner shadow-amber-500/5">
            <h3 className="font-black text-amber-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <span>⭐</span> Panel Admin: Kelola Tautan Video
            </h3>
            {isAdding ? (
              <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <input 
                  type="text" 
                  placeholder="Judul Video / Tautan (Contoh: Cara Membuat Kisi-kisi)" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-amber-500"
                />
                <input 
                  type="text" 
                  placeholder="URL Tautan (https://...)" 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider">
                    Simpan Tautan
                  </button>
                  <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-lg transition-all active:scale-95 text-sm uppercase tracking-wider">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAdding(true)} 
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all shadow-md shadow-blue-500/20 active:scale-95 text-sm uppercase tracking-wider"
              >
                <Plus size={18} /> Tambah Tautan Baru
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.length === 0 ? (
            <p className="text-slate-500 italic col-span-full py-10 text-center font-semibold">Belum ada video tutorial yang tersedia saat ini.</p>
          ) : (
            links.map(link => (
              <div key={link.id} className="group relative p-5 bg-gradient-to-br from-slate-800/40 to-slate-900/60 hover:from-slate-800 hover:to-slate-900 border border-slate-700/60 hover:border-rose-500/60 rounded-2xl transition-all duration-300 flex flex-col justify-between min-h-[140px] shadow-sm hover:shadow-rose-500/10">
                <div>
                  <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                    <PlayCircle size={26} className="fill-rose-500/20" />
                  </div>
                  <h4 className="font-bold text-slate-200 line-clamp-2 text-base leading-snug group-hover:text-white transition-colors">
                    {link.title}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                  <button 
                    onClick={() => window.open(link.url, "_blank")}
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Buka Video <ExternalLink size={14} className="stroke-[2.5]" />
                  </button>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(link.id)}
                      className="w-8 h-8 rounded-lg bg-rose-950/30 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-rose-500/30"
                      title="Hapus Tautan"
                    >
                      <Trash size={14} className="stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

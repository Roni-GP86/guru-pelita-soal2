import React, { useState, useEffect } from "react";
import { Folder, FileText, Trash2, ArrowLeft, Eye, Calendar, BookOpen, Layers } from "lucide-react";
import { SchoolInfo, QuestionItem, KisiKisiRow } from "../types";

interface BankSoalItem {
  id: string;
  subject: string;
  gradeClass: string;
  academicYear: string;
  semester: string;
  schoolInfo: SchoolInfo;
  kisiKisi: KisiKisiRow[];
  questions: QuestionItem[];
  savedAt: string;
}

interface BankSoalViewProps {
  activeCode: string;
  isCodeActive: boolean;
  isAdmin: boolean;
  onLoadExam: (
    schoolInfo: SchoolInfo,
    subject: string,
    kisiKisi: KisiKisiRow[],
    questions: QuestionItem[]
  ) => void;
  onShowToast: (message: string) => void;
}

export default function BankSoalView({ activeCode, isCodeActive, isAdmin, onLoadExam, onShowToast }: BankSoalViewProps) {
  const [items, setItems] = useState<BankSoalItem[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Load items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ttu_bank_soal");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse ttu_bank_soal", e);
      }
    }
  }, []);

  const saveItems = (newItems: BankSoalItem[]) => {
    setItems(newItems);
    localStorage.setItem("ttu_bank_soal", JSON.stringify(newItems));
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if the current user has their code activated by the admin
    if (!isCodeActive) {
      alert("Akses Ditolak: Hak akses Anda terkunci. Hanya pengguna dengan Kode Aktivasi aktif yang disetujui Admin yang dapat menghapus paket soal dari Bank Soal!");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus paket soal ini dari Bank Soal?")) {
      const updated = items.filter((item) => item.id !== id);
      saveItems(updated);
      onShowToast("🗑️ Paket soal berhasil dihapus!");
      
      // Check if the current subject has any visible items left
      const subjectHasItems = updated.some((item) => {
        const itemCode = (item as any).savedByCode || "TRIAL";
        const currentCode = activeCode || "TRIAL";
        const matchesCode = isAdmin || itemCode.trim().toUpperCase() === currentCode.trim().toUpperCase();
        return matchesCode && item.subject === selectedSubject;
      });
      
      if (!subjectHasItems) {
        setSelectedSubject(null);
      }
    }
  };

  // Filter items based on activeCode and admin rights
  const visibleItems = items.filter(item => {
    if (isAdmin) return true; // Admin has full access to see all
    const itemCode = (item as any).savedByCode || "TRIAL";
    const currentCode = activeCode || "TRIAL";
    return itemCode.trim().toUpperCase() === currentCode.trim().toUpperCase();
  });

  // Group filtered items by subject
  const subjectsMap: Record<string, BankSoalItem[]> = {};
  visibleItems.forEach((item) => {
    if (!subjectsMap[item.subject]) {
      subjectsMap[item.subject] = [];
    }
    subjectsMap[item.subject].push(item);
  });

  const subjectFolders = Object.keys(subjectsMap).sort();

  return (
    <div id="bank-soal-view-root" className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-amber-500/10 pointer-events-none">
          <Folder size={120} className="stroke-[1.5]" />
        </div>
        <div className="relative z-10 text-left">
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black rounded-lg uppercase tracking-wider block w-fit mb-3">
            📂 BANK SOAL PELITA
          </span>
          <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
            Arsip Paket Soal &amp; Kisi-Kisi
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Simpan naskah soal hasil generate Anda ke dalam Bank Soal. Soal tersimpan dikelompokkan otomatis berdasarkan mata pelajaran agar mempermudah pencarian, pencetakan ulang, atau pengacakan ulang paket di masa mendatang.
          </p>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mx-auto mb-4">
            <Folder size={32} />
          </div>
          <h3 className="text-sm font-bold text-slate-350">Bank Soal Masih Kosong</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Anda belum memiliki paket soal tersimpan. Silakan rancang kisi-kisi dan hasilkan soal ujian terlebih dahulu, kemudian klik tombol <strong>"Simpan Soal"</strong> di bagian atas lembar soal.
          </p>
        </div>
      ) : selectedSubject === null ? (
        /* Folder Grid View */
        <div className="space-y-4">
          <h3 className="text-xs font-black tracking-widest text-[#93c5fd] uppercase text-left">
            DAFTAR FOLDER MATA PELAJARAN ({subjectFolders.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {subjectFolders.map((subj) => {
              const count = subjectsMap[subj].length;
              return (
                <div
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className="bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-amber-500/40 rounded-2xl p-5 cursor-pointer transition-all duration-300 group shadow-md text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden"
                >
                  {/* Glowing folder top tab decoration */}
                  <div className="absolute top-0 left-0 w-12 h-1 bg-amber-500 group-hover:w-full transition-all duration-350"></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="text-amber-500 group-hover:scale-105 transition-transform duration-300">
                      <Folder size={36} className="fill-amber-500/10 stroke-[2]" />
                    </div>
                    <span className="px-2.5 py-1 bg-slate-950/80 border border-slate-800 text-slate-400 font-extrabold text-[10px] rounded-lg">
                      {count} Paket
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-extrabold text-slate-200 text-sm group-hover:text-amber-400 transition-colors truncate">
                      {subj}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                      Klik untuk melihat arsip soal
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Inside Folder View */
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className="p-2 border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all cursor-pointer"
              title="Kembali ke Folder"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="text-left">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">FOLDER / MATA PELAJARAN</span>
              <h3 className="text-sm font-black text-amber-500 uppercase tracking-tight">
                {selectedSubject}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {subjectsMap[selectedSubject].map((item) => {
              // Extract unique materi list
              const uniqueMateri = Array.from(
                new Set(item.kisiKisi.map((k) => k.materi).filter(Boolean))
              );

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-850 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all duration-300 text-left"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-slate-950 text-slate-350 border border-slate-800 text-[10px] font-black rounded-lg uppercase tracking-wider">
                        {item.schoolInfo.gradeClass} &bull; Semester {item.schoolInfo.semester}
                      </span>
                      <span className="px-2.5 py-1 bg-blue-950/45 text-blue-400 border border-blue-900/40 text-[10px] font-black rounded-lg">
                        TA {item.schoolInfo.academicYear}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold font-mono flex items-center gap-1">
                        <Calendar size={12} /> {item.savedAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6 text-xs font-semibold">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Sekolah:</span>
                        <span className="font-bold text-slate-300">{item.schoolInfo.schoolName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Guru:</span>
                        <span className="font-bold text-slate-300">{item.schoolInfo.teacherName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider mb-0.5">Jumlah Soal:</span>
                        <span className="font-black text-amber-400">{item.questions.length} Butir Soal</span>
                      </div>
                    </div>

                    {uniqueMateri.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Topik / Materi Pokok:</span>
                        <div className="flex flex-wrap gap-1">
                          {uniqueMateri.map((m, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-950/50 border border-slate-850 rounded text-[9.5px] font-medium text-slate-400"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-36 justify-end">
                    <button
                      type="button"
                      onClick={() => onLoadExam(item.schoolInfo, item.subject, item.kisiKisi, item.questions)}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-650 to-blue-500 hover:from-blue-750 hover:to-blue-600 text-white text-[11px] font-black rounded-xl uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <Eye size={12} className="stroke-[2.5]" />
                      <span>Buka Soal</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="py-2 px-3 bg-rose-950/30 hover:bg-rose-600 border border-rose-900/40 text-rose-400 hover:text-white text-[11px] font-black rounded-xl uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    >
                      <Trash2 size={12} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

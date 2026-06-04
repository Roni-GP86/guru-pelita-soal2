import React, { useEffect, useState } from "react";
import { Sparkles, BrainCircuit, Hexagon, Cpu } from "lucide-react";

export default function OpeningSplash({ onFinish }: { onFinish: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 5-Second Cinematic timing sequence
    const t1 = setTimeout(() => setStage(1), 600);   // Reveal Neural Orbs & Background
    const t2 = setTimeout(() => setStage(2), 1600);  // Central Core AI Engine
    const t3 = setTimeout(() => setStage(3), 2800);  // Premium Text Reveal
    const t4 = setTimeout(() => setStage(4), 4500);  // Fast scan out (Fade out)
    const t5 = setTimeout(() => onFinish(), 5000);   // Unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030712] overflow-hidden transition-all duration-1000 ease-in-out ${stage === 4 ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* 1. ULTRA PREMIUM CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.15),transparent_70%)]"></div>
      
      {/* Dynamic Glowing Dust / Orbs */}
      <div className={`absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] transition-all duration-3000 ease-out transform ${stage >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-20'}`}></div>
      <div className={`absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] transition-all duration-3000 delay-500 ease-out transform ${stage >= 1 ? 'scale-100 opacity-100 translate-x-0' : 'scale-50 opacity-0 translate-x-20'}`}></div>

      {/* Cyberpunk Grid / Neural Net subtle lines */}
      <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgTCA0MCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] transition-opacity duration-2000 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Scanning Laser Beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-48 w-full animate-[bounce_6s_infinite] opacity-60 blur-xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6">
        
        {/* 2. CORE AI ENGINE ANIMATION */}
        <div className={`relative flex items-center justify-center transition-all duration-[1500ms] ease-out transform ${stage >= 2 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-75'}`}>
          
          {/* Outer Rotating Halo */}
          <div className="absolute w-48 h-48 border border-slate-800 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute w-56 h-56 border border-dashed border-slate-700/50 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
          
          {/* Glowing Aura Ring */}
          <div className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500/20 to-blue-500/20 blur-xl animate-pulse duration-3000"></div>

          {/* Central Glassmorphism Hexagon */}
          <div className="relative w-32 h-32 bg-slate-950/80 backdrop-blur-xl border-2 border-slate-800/80 rounded-[32px] flex items-center justify-center shadow-[0_0_80px_rgba(37,99,235,0.15)] overflow-hidden group">
            
            {/* Inner rotating gradient slice */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(59,130,246,0.3)_360deg)] animate-[spin_3s_linear_infinite]"></div>
            
            {/* Core Element */}
            <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-slate-950 rounded-2xl border border-slate-800/50 shadow-inner">
              <BrainCircuit size={46} className="text-blue-500 stroke-[1.5] absolute" />
              <Cpu size={24} className="text-amber-400 stroke-[2] absolute opacity-80 animate-pulse duration-2000" />
            </div>
          </div>
        </div>

        {/* 3. ELEGANT TEXT REVEAL */}
        <div className={`mt-10 flex flex-col items-center text-center transition-all duration-[1200ms] ease-out transform ${stage >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Main Title with Cinematic Tracking */}
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-400 tracking-[0.1em] drop-shadow-2xl uppercase mb-1">
            PELITA SOAL
          </h1>
          
          {/* Premium Subtitle Plate */}
          <div className="flex items-center justify-center gap-4 mt-6 w-full max-w-sm">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-blue-600/50"></div>
            <div className="px-4 py-1.5 bg-slate-900/50 border border-slate-700/50 rounded-full flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase">
                VERSE 3.0
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-blue-600/50"></div>
          </div>
        </div>

        {/* 4. HIGH-TECH LOADING INDICATOR */}
        <div className={`mt-16 flex flex-col items-center transition-all duration-1000 delay-300 ${stage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          {/* Scanning Progress Bar */}
          <div className="w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden relative mb-4">
            <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[bg-pan_2s_ease-in-out_infinite]"></div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase flex gap-1">
              <span className="animate-pulse delay-75">I</span>
              <span className="animate-pulse delay-100">N</span>
              <span className="animate-pulse delay-150">I</span>
              <span className="animate-pulse delay-200">T</span>
              <span className="animate-pulse delay-300">I</span>
              <span className="animate-pulse delay-400">A</span>
              <span className="animate-pulse delay-500">L</span>
              <span className="animate-pulse delay-600">I</span>
              <span className="animate-pulse delay-700">Z</span>
              <span className="animate-pulse delay-800">I</span>
              <span className="animate-pulse delay-900">N</span>
              <span className="animate-pulse delay-1000">G</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

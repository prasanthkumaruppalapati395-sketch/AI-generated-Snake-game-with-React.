import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Music, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative" id="app-root">
      
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        
        {/* Scanning Line Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] h-1 bg-[length:100%_4px] pointer-events-none opacity-20" />
      </div>

      {/* Main Layout */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 gap-8 overflow-hidden" id="main-content">
        
        {/* Header Decor */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-6 mb-8"
          id="header-section"
        >
          <div className="flex items-center gap-3 px-6 py-2 bg-black/40 border border-white/20 rounded-full backdrop-blur-xl">
            <Zap size={14} className="text-cyan-400 fill-cyan-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/70">Arcade Protocol 0.1</span>
          </div>
          
          <div className="w-[380px] h-[72px] bg-gradient-to-b from-white/95 via-white/80 to-stone-400/50 rounded-sm shadow-[0_0_40px_rgba(255,255,255,0.1)] relative overflow-hidden" id="title-block">
             <div className="absolute inset-0 flex items-center justify-center">
                 <h1 className="text-4xl font-black italic tracking-tighter text-black mix-blend-overlay opacity-80 uppercase">
                   Neon Rhythm
                 </h1>
             </div>
             {/* Gloss effect */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20" />
          </div>
        </motion.div>

        {/* Center Stage: Snake Game */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="w-full max-w-[464px]"
           id="game-stage"
        >
          <SnakeGame />
        </motion.div>

        {/* Footer: Music Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-2xl flex flex-col items-center gap-6"
          id="footer-section"
        >
          <div className="flex items-center gap-2 text-white/20 uppercase tracking-[0.2em] text-[10px] font-bold" id="music-indicator">
            <Music size={12} />
            Background Audio Engine
          </div>
          <MusicPlayer />
        </motion.div>

        {/* Decorative Grid Sidebars for desktop */}
        <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 space-y-12 opacity-20" id="sidebar-left">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col items-start gap-4">
               <div className="w-8 h-[1px] bg-white" />
               <p className="writing-vertical-rl rotate-180 text-[10px] font-mono tracking-widest text-cyan-400 uppercase">Aux_System_{i}</p>
             </div>
           ))}
        </div>

        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 space-y-12 opacity-20 text-right" id="sidebar-right">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col items-end gap-4">
               <div className="w-8 h-[1px] bg-white" />
               <p className="writing-vertical-rl text-[10px] font-mono tracking-widest text-pink-400 uppercase">Buffer_Node_{i}</p>
             </div>
           ))}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .writing-vertical-rl { writing-mode: vertical-rl; }
      `}} />
    </div>
  );
}

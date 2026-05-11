import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Sword, BookOpen, Settings, LogOut, Award, Shield, User } from 'lucide-react';

interface LobbyProps {
  user: UserProfile;
  onStartTutorial: () => void;
  onSelectBot: () => void;
  onLogout: () => void;
}

export default function Lobby({ user, onStartTutorial, onSelectBot, onLogout }: LobbyProps) {
  return (
    <div className="relative h-full w-full min-h-screen p-4 flex flex-col items-center overflow-x-hidden overflow-y-auto sm:overflow-hidden bg-deep-black">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549221542-f8796d849312?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center brightness-[0.1] fixed" />
      
      {/* Header Profile Area - Optimized for small screens */}
      <div className="relative z-10 w-full max-w-5xl flex flex-wrap justify-between items-center gap-4 mb-6 sm:mb-10 pt-2 px-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded border border-gold/40 flex items-center justify-center bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-gold-light" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-2xl gold-gradient-text font-bold uppercase tracking-widest leading-none mb-1">{user.name}</h2>
            <div className="flex items-center gap-2 sm:gap-3">
               <div className="flex flex-col">
                 <span className="text-[10px] sm:text-xs text-gold-dark/80 font-serif uppercase tracking-widest">Nível {user.level}</span>
                 <div className="w-20 sm:w-24 h-1 bg-stone-800 rounded-full mt-0.5 overflow-hidden">
                    <div className="h-full bg-gold w-1/3 shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                 </div>
               </div>
               <span className="text-[10px] sm:text-xs text-ice border border-gold/10 bg-gold/5 px-2 py-0.5 rounded italic whitespace-nowrap">Elo: {user.elo}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 sm:p-2.5 border border-gold/10 rounded bg-stone-900/40 text-gold/50 hover:text-gold hover:bg-gold/10 transition-all active:scale-95 shadow-lg">
            <Settings size={18} />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 sm:p-2.5 border border-blood/10 rounded bg-blood/5 text-blood/60 hover:text-red-500 hover:bg-blood/10 transition-all active:scale-95 shadow-lg"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Actions - Flexible grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl flex-1 items-center">
        {/* Play Offline */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectBot}
          className="medieval-panel p-6 sm:p-10 cursor-pointer group flex flex-col items-center justify-center text-center overflow-hidden relative shadow-2xl h-full border-gold/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sword className="w-12 h-12 sm:w-16 sm:h-16 text-gold mb-4 sm:mb-6 glow-gold group-hover:rotate-6 transition-transform" />
          <h3 className="font-serif text-2xl sm:text-4xl font-black gold-gradient-text uppercase mb-1 tracking-wider">Jogar Offline</h3>
          <p className="text-ice/40 italic text-[11px] sm:text-sm mb-6 sm:mb-8 max-w-[250px]">"Desafie a inteligência do reino em combate singular."</p>
          <div className="btn-medieval w-full py-3 sm:py-4 text-sm sm:text-lg">Entrar na Arena</div>
        </motion.div>

        {/* Tutorial */}
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartTutorial}
          className="medieval-panel p-6 sm:p-10 cursor-pointer group flex flex-col items-center justify-center text-center h-full border-white/5"
        >
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-stone-500 mb-4 sm:mb-6 group-hover:text-gold/60 transition-colors" />
          <h3 className="font-serif text-2xl sm:text-4xl font-black text-ice/80 uppercase mb-1 tracking-wider">Codex Militar</h3>
          <p className="text-ice/40 italic text-[11px] sm:text-sm mb-6 sm:mb-8 max-w-[250px]">"Revise as artes da guerra e estratégias ancestrais."</p>
          <div className="px-8 py-3 border border-gold/20 text-gold-dark text-xs sm:text-sm font-serif uppercase tracking-[0.2em] hover:bg-gold/5 hover:text-gold transition-all rounded w-full bg-stone-900/20">Ver Tutorial</div>
        </motion.div>
      </div>

      {/* Secondary Actions - More compact */}
      <div className="relative z-10 mt-6 sm:mt-10 flex flex-wrap justify-center gap-2 sm:gap-4 w-full max-w-4xl pb-4">
         <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/5 bg-white/5 rounded font-serif text-[10px] sm:text-xs uppercase tracking-widest text-ice/30 hover:text-gold-light hover:border-gold/30 hover:bg-white/10 transition-all active:scale-95 shadow-sm">
            <User size={14} className="sm:size-[16px]" />
            Perfil Real
         </button>
         <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/5 bg-white/5 rounded font-serif text-[10px] sm:text-xs uppercase tracking-widest text-ice/30 hover:text-gold-light hover:border-gold/30 hover:bg-white/10 transition-all active:scale-95 shadow-sm">
            <Settings size={14} className="sm:size-[16px]" />
            Ajustes
         </button>
         <button 
           onClick={onLogout}
           className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-blood/10 bg-blood/5 rounded font-serif text-[10px] sm:text-xs uppercase tracking-widest text-blood/60 hover:text-red-500 hover:border-blood/30 hover:bg-blood/10 transition-all active:scale-95 shadow-sm"
         >
            <LogOut size={14} className="sm:size-[16px]" />
            Retirada
         </button>
      </div>

      {/* Footer Info - Subliminal */}
      <div className="mt-auto relative z-10 p-6 flex flex-col items-center gap-3 opacity-30 select-none hidden sm:flex">
        <div className="flex gap-4">
           <Shield className="w-3 h-3 text-gold-dark" />
           <Shield className="w-3 h-3 text-gold-dark" />
           <Shield className="w-3 h-3 text-gold-dark" />
        </div>
        <p className="text-[9px] font-serif text-gold-dark tracking-[0.4em] uppercase">Batalha de Reis 6.0 • Glória e Honra</p>
      </div>
    </div>
  );
}

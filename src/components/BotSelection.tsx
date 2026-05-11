import { motion } from 'motion/react';
import { BotDifficulty } from '../types';
import { Sword, Shield, Crown, Zap, ChevronLeft } from 'lucide-react';

interface BotSelectionProps {
  onSelect: (diff: BotDifficulty) => void;
  onBack: () => void;
}

const DIFFICULTIES: { id: BotDifficulty; name: string; desc: string; icon: any; color: string }[] = [
  { 
    id: 'beginner', 
    name: 'Fácil', 
    desc: 'O escudeiro ainda está aprendendo a segurar a espada. Comete erros frequentes.',
    icon: Shield,
    color: 'text-stone-400'
  },
  { 
    id: 'casual', 
    name: 'Médio', 
    desc: 'Um cavaleiro treinado. Joga de forma sólida mas previsível.',
    icon: Sword,
    color: 'text-blue-400'
  },
  { 
    id: 'strategic', 
    name: 'Difícil', 
    desc: 'Um capitão de guerra experiente. Planeja ataques duplos e defesas robustas.',
    icon: Zap,
    color: 'text-amber-500'
  },
  { 
    id: 'master', 
    name: 'Mestre', 
    desc: 'O próprio General Imperial. Calculista e implacável em cada lance.',
    icon: Crown,
    color: 'text-gold'
  }
];

export default function BotSelection({ onSelect, onBack }: BotSelectionProps) {
  return (
    <div className="relative h-full w-full min-h-screen p-4 flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-deep-black">
      <div className="absolute inset-0 bg-deep-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-blood)_0%,_transparent_70%)] opacity-10" />

      <div className="relative z-10 w-full max-w-4xl px-2">
        <button 
          onClick={onBack}
          className="mb-4 sm:mb-8 flex items-center gap-2 text-gold-dark hover:text-gold transition-colors font-serif uppercase text-[10px] sm:text-xs tracking-[0.3em] active:scale-95"
        >
          <ChevronLeft size={16} />
          Retornar ao Salão
        </button>

        <h1 className="font-serif text-3xl sm:text-5xl font-black gold-gradient-text uppercase tracking-tighter mb-2 text-center">
          Desafio de Guerra
        </h1>
        <p className="text-ice/40 text-center mb-8 sm:mb-12 font-serif uppercase tracking-[0.4em] text-[9px] sm:text-[10px]">Selecione o oponente adequado à sua coroa</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 pb-8">
          {DIFFICULTIES.map((diff, index) => (
            <motion.div
              key={diff.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(diff.id)}
              className="medieval-panel p-4 sm:p-6 cursor-pointer flex gap-4 sm:gap-6 items-center group relative overflow-hidden backdrop-blur-md"
            >
              <div className="absolute -right-6 -bottom-6 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity">
                 <diff.icon size={120} />
              </div>

              <div className={`p-3 sm:p-4 rounded border border-white/5 bg-white/5 ${diff.color} shadow-inner`}>
                <diff.icon size={24} className="sm:size-[32px]" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-ice group-hover:text-gold transition-colors">
                   {diff.name}
                </h3>
                <p className="text-ice/40 text-[10px] sm:text-xs italic mt-0.5 leading-tight sm:leading-relaxed line-clamp-2">{diff.desc}</p>
              </div>

              <Sword size={20} className="text-gold/60 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden sm:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TUTORIAL_STEPS } from '../constants';
import ChessBoard from './ChessBoard';
import { Piece, Position } from '../types';
import { ChevronRight, ChevronLeft, ShieldCheck, Sword, Trophy, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Tutorial({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [completed, setCompleted] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);

  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  const speak = useCallback((text: string) => {
    if (!narrationEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  }, [narrationEnabled]);

  useEffect(() => {
    setPieces(currentStep.boardState);
    if (!loading && !completed) {
      speak(`${currentStep.title}. ${currentStep.description}`);
    }
  }, [currentStepIndex, loading, completed, speak]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setShowInstruction(false);
    } else {
      setCompleted(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#8B0000', '#F0F8FF']
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleMove = (pieceId: string, to: Position) => {
    if (currentStep.targetAction && currentStep.targetAction.pieceId === pieceId) {
       if (currentStep.targetAction.targetPos.x === to.x && currentStep.targetAction.targetPos.y === to.y) {
          setPieces(prev => prev.map(p => p.id === pieceId ? { ...p, position: to } : p));
          setSelectedPieceId(null);
          // Success feedback
          if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
          setTimeout(() => handleNext(), 1000);
          return true;
       }
    }
    return false;
  };

  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const onSquareClick = (pos: Position) => {
    const pieceAt = pieces.find(p => p.position.x === pos.x && p.position.y === pos.y);
    
    if (selectedPieceId) {
      if (handleMove(selectedPieceId, pos)) return;
    }

    if (pieceAt && pieceAt.side === 'white') {
      setSelectedPieceId(pieceAt.id);
    } else {
      setSelectedPieceId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-deep-black z-[100] fixed inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 border-b-2 border-gold rounded-full animate-spin mb-8" />
          <h1 className="font-serif text-2xl md:text-4xl gold-gradient-text tracking-[0.5em] uppercase text-center">
            Batalha de Reis
          </h1>
          <p className="text-gold-dark text-[8px] mt-4 tracking-widest uppercase animate-pulse">Preparando campo de batalha...</p>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <div className="h-full w-full min-h-screen flex flex-col items-center justify-center bg-deep-black overflow-hidden relative select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-blood)_0%,_transparent_70%)] opacity-10" />

      {/* Tap Zones for Navigation */}
      {!completed && (
        <>
          <div 
            className="fixed inset-y-0 left-0 w-8 sm:w-16 z-40 cursor-w-resize flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity"
            onClick={handlePrev}
          >
            <ChevronLeft className="text-gold" size={24} />
          </div>
          <div 
            className="fixed inset-y-0 right-0 w-8 sm:w-16 z-40 cursor-e-resize flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity"
            onClick={handleNext}
          >
            <ChevronRight className="text-gold" size={24} />
          </div>
        </>
      )}

      {/* Top Bar */}
      <header className="fixed top-0 left-0 w-full h-14 sm:h-16 p-2 sm:p-4 flex justify-between items-center z-[60] bg-gradient-to-b from-deep-black to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-0">
           <button 
             onClick={() => setNarrationEnabled(!narrationEnabled)}
             className="p-1.5 sm:p-2 border border-gold/20 rounded-md bg-stone-900/50 text-gold hover:bg-gold/10 transition-colors"
           >
             {narrationEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
           </button>
           <h3 className="hidden sm:block font-serif text-gold-dark text-[9px] tracking-widest uppercase font-bold">Codex Militar</h3>
        </div>
        {!completed && (
          <button 
            onClick={() => onComplete()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blood/10 border border-gold/20 text-gold-light text-[9px] font-serif uppercase tracking-widest rounded hover:bg-blood/20 transition-all font-bold active:scale-95 mr-2 sm:mr-0"
          >
            Pular
          </button>
        )}
      </header>

      <main className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-8 p-1 sm:p-4 pt-14 sm:pt-20 lg:p-12 z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="w-full h-full max-w-6xl grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 sm:gap-12 items-center justify-items-center"
            >
              {/* Content Section */}
              <div className="medieval-panel p-4 sm:p-8 flex flex-col w-full max-w-xl max-h-[40vh] sm:max-h-full overflow-hidden order-2 lg:order-1 relative border-gold/10">
                {currentStepIndex === 0 && showInstruction && (
                   <motion.div 
                     animate={{ y: [0, 3, 0] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute -top-8 left-0 right-0 flex justify-center gap-6 pointer-events-none text-gold/30 hidden sm:flex"
                   >
                     <ChevronLeft size={16} />
                     <span className="text-[7px] font-serif uppercase tracking-[0.4em]">Toque nas laterais</span>
                     <ChevronRight size={16} />
                   </motion.div>
                )}

                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                  <div className="p-2 sm:p-3 border border-gold/20 rounded bg-blood/5">
                     <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
                  </div>
                  <div>
                    <span className="text-[7px] sm:text-[8px] text-gold-dark font-serif uppercase tracking-[0.4em] block">Módulo {currentStepIndex + 1}</span>
                    <h2 className="font-serif text-lg sm:text-2xl font-black gold-gradient-text uppercase leading-none truncate">
                      {currentStep.title}
                    </h2>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 sm:space-y-4 pr-1">
                  <p className="text-ice/70 text-xs sm:text-base leading-relaxed font-serif">
                    {currentStep.description}
                  </p>

                  {currentStep.message && (
                    <motion.div 
                      key={currentStep.id + "-msg"}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gold/5 border-l border-gold/40 p-2 sm:p-4"
                    >
                      <p className="text-gold-dark italic text-[10px] sm:text-xs font-serif leading-relaxed">{currentStep.message}</p>
                    </motion.div>
                  )}
                </div>

                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-4 flex-shrink-0">
                  <div className="w-full bg-stone-900 border border-gold/10 h-1 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.3)]"
                    />
                  </div>
                  <div className="flex justify-center">
                    <span className="font-serif text-gold-dark font-bold text-[8px] sm:text-[9px] tracking-[0.4em] uppercase opacity-40">
                       {currentStepIndex + 1} / {TUTORIAL_STEPS.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Board Section */}
              <div className="w-full h-full max-h-[50vh] sm:max-h-[60vh] lg:max-h-[85vh] flex justify-center order-1 lg:order-2">
                <div className="w-full h-full">
                  <ChessBoard 
                    pieces={pieces} 
                    highlightSquares={currentStep.highlightSquares}
                    selectedSquare={pieces.find(p => p.id === selectedPieceId)?.position}
                    targetAction={currentStep.targetAction}
                    onSquareClick={onSquareClick}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="medieval-panel p-6 sm:p-12 text-center max-w-sm sm:max-w-lg w-full shadow-2xl relative border-gold/20"
            >
              <div className="absolute inset-0 bg-gold/5 animate-pulse" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-4 sm:p-6 rounded-full border border-gold/10 mb-6 sm:mb-8 bg-gold/5">
                  <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gold glow-gold" />
                </div>
                <h1 className="font-serif text-2xl sm:text-4xl font-black gold-gradient-text mb-2 sm:mb-4 uppercase tracking-tighter">
                  Mestre Combatente
                </h1>
                <p className="text-ice/50 text-[11px] sm:text-base mb-8 sm:mb-10 font-serif italic px-4">
                  "O conhecimento é a espada mais afiada. Você agora está pronto para reivindicar seu trono."
                </p>
                <button 
                  className="btn-medieval w-full py-3 sm:py-4 text-base sm:text-xl active:scale-95"
                  onClick={() => onComplete()}
                >
                  ASSUMIR O TRONO
                </button>
                
                <div className="mt-8 sm:mt-10 flex gap-3 sm:gap-4 w-full">
                   <div className="flex-1 p-2 sm:p-3 border border-gold/10 bg-stone-900/40 rounded flex flex-col items-center">
                      <span className="text-gold text-lg sm:text-2xl font-serif font-black">150</span>
                      <span className="text-[7px] sm:text-[8px] text-gold-dark uppercase tracking-widest font-bold">EXP</span>
                   </div>
                   <div className="flex-1 p-2 sm:p-3 border border-gold/10 bg-stone-900/40 rounded flex flex-col items-center">
                      <span className="text-gold text-lg sm:text-2xl font-serif font-black">100</span>
                      <span className="text-[7px] sm:text-[8px] text-gold-dark uppercase tracking-widest font-bold">OURO</span>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

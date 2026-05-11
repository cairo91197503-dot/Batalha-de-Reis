import { useState, useCallback, useEffect, useMemo } from 'react';
import { Chess, Move } from 'chess.js';
import ChessBoard from './ChessBoard';
import ChessPiece from './ChessPiece';
import { Piece, Position as ChessPosition, PieceType, Side, BotDifficulty } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RotateCcw, Shield, Swords, Trophy, AlertTriangle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameProps {
  difficulty: BotDifficulty;
  onBack: () => void;
}

export default function Game({ difficulty, onBack }: GameProps) {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<ChessPosition | null>(null);
  const [status, setStatus] = useState<'playing' | 'checkmate' | 'draw'>('playing');
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);

  // Map chess.js board to our Piece[] structure
  const pieces = useMemo(() => {
    const p: Piece[] = [];
    game.board().forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          p.push({
            id: `${cell.type}-${cell.color}-${x}-${y}`,
            type: mapType(cell.type),
            side: cell.color === 'w' ? 'white' : 'black',
            position: { x, y }
          });
        }
      });
    });
    return p;
  }, [game]);

  function mapType(t: string): PieceType {
    const map: Record<string, PieceType> = {
      p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king'
    };
    return map[t];
  }

  const isPlayerTurn = game.turn() === 'w';

  // Bot Logic
  useEffect(() => {
    if (!isPlayerTurn && status === 'playing' && !pendingPromotion) {
      const timer = setTimeout(() => makeBotMove(), 800 + Math.random() * 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, status, pendingPromotion]);

  const makeBotMove = () => {
    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return;

    let move: Move;

    if (difficulty === 'beginner') {
      move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else if (difficulty === 'casual') {
      // Prefer captures
      const captures = possibleMoves.filter(m => m.flags.includes('c'));
      move = captures.length > 0 ? captures[Math.floor(Math.random() * captures.length)] : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else {
      // For Strategic/Master, let's do a simple material-based one-move-lookahead or random the better ones
      const scoredMoves = possibleMoves.map(m => {
        const gameCopy = new Chess(game.fen());
        gameCopy.move(m);
        return { move: m, score: evaluateBoard(gameCopy) };
      });
      scoredMoves.sort((a, b) => a.score - b.score); // Black wants to minimize score (since evaluateBoard is white-centric)
      move = scoredMoves[0].move;
    }

    const result = game.move(move);
    if (result) {
      setGame(new Chess(game.fen()));
      setLastMove(result);
      checkGameEnd();
    }
  };

  const evaluateBoard = (g: Chess) => {
    const weights: Record<string, number> = { p: 10, r: 50, n: 30, b: 30, q: 90, k: 900 };
    let score = 0;
    g.board().forEach(row => {
      row.forEach(cell => {
        if (cell) {
          const val = weights[cell.type];
          score += cell.color === 'w' ? val : -val;
        }
      });
    });
    return score;
  };

  const checkGameEnd = () => {
    if (game.isCheckmate()) {
      setStatus('checkmate');
      if (game.turn() === 'b') { // White won
        confetti({ particleCount: 150, spread: 70, colors: ['#D4AF37', '#F0F8FF'] });
      }
    } else if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
      setStatus('draw');
    }
  };

  const onSquareClick = (pos: ChessPosition) => {
    if (!isPlayerTurn || status !== 'playing' || pendingPromotion) return;

    const currentSquare = `${String.fromCharCode(97 + pos.x)}${8 - pos.y}`;
    const piece = game.get(currentSquare as any);

    if (selectedSquare) {
      const fromSquare = `${String.fromCharCode(97 + selectedSquare.x)}${8 - selectedSquare.y}`;
      
      // If clicking the same square, deselect
      if (selectedSquare.x === pos.x && selectedSquare.y === pos.y) {
        setSelectedSquare(null);
        return;
      }

      // Try to move
      try {
        const toSquare = currentSquare;
        const moves = game.moves({ square: fromSquare as any, verbose: true });
        const move = moves.find(m => m.to === toSquare);
        
        if (move && move.flags.includes('p')) {
          setPendingPromotion({ from: fromSquare, to: toSquare });
          return;
        }

        const result = game.move({
          from: fromSquare,
          to: toSquare,
          promotion: 'q' // default for sanity, but flag check covers it
        });
        
        if (result) {
          setGame(new Chess(game.fen()));
          setLastMove(result);
          setSelectedSquare(null);
          checkGameEnd();
          if ('vibrate' in navigator) navigator.vibrate(20);
          return;
        }
      } catch (e) {
        // Continue to check if another piece should be selected
      }
    }

    // New selection logic
    if (piece && piece.color === 'w') {
      setSelectedSquare(pos);
      if ('vibrate' in navigator) navigator.vibrate(10);
    } else {
      setSelectedSquare(null);
    }
  };

  const handlePromotion = (promotionPiece: 'q' | 'r' | 'b' | 'n') => {
    if (!pendingPromotion) return;

    const result = game.move({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion: promotionPiece
    });

    if (result) {
      setGame(new Chess(game.fen()));
      setLastMove(result);
      setPendingPromotion(null);
      setSelectedSquare(null);
      checkGameEnd();
      if ('vibrate' in navigator) navigator.vibrate(30);
    }
  };

  const resetGame = () => {
    setGame(new Chess());
    setStatus('playing');
    setLastMove(null);
    setSelectedSquare(null);
    setPendingPromotion(null);
  };

  const highlightSquares = selectedSquare ? game.moves({ 
    square: `${String.fromCharCode(97 + selectedSquare.x)}${8 - selectedSquare.y}` as any, 
    verbose: true 
  }).map(m => ({
    x: m.to.charCodeAt(0) - 97,
    y: 8 - parseInt(m.to[1])
  })) : [];

  return (
    <div className="h-full w-full min-h-screen flex flex-col items-center bg-deep-black overflow-hidden select-none">
      {/* HUD Bar - Optimized for mobile */}
      <header className="w-full h-14 sm:h-16 px-3 sm:px-4 flex justify-between items-center bg-stone-900/90 border-b border-gold/10 backdrop-blur-md z-50 flex-shrink-0 relative">
        <button 
          onClick={onBack}
          className="p-1.5 sm:p-2 border border-gold/10 rounded-md text-gold/60 hover:text-gold hover:bg-gold/10 transition-all flex items-center gap-2 active:scale-95"
        >
          <ChevronLeft size={18} className="sm:size-[20px]" />
          <span className="hidden sm:inline font-serif uppercase text-[9px] tracking-[0.2em]">Retirada</span>
        </button>

        <div className="flex flex-col items-center">
           <div className="flex items-center gap-3 sm:gap-4">
              <span className={`text-[9px] sm:text-xs font-serif uppercase tracking-widest transition-opacity ${game.turn() === 'b' ? 'text-ice glow-red animate-pulse font-black' : 'text-stone-600'}`}>Pretas</span>
              <div className="w-1 h-1 rounded-full bg-gold/30" />
              <span className={`text-[9px] sm:text-xs font-serif uppercase tracking-widest transition-opacity ${game.turn() === 'w' ? 'text-ice glow-gold animate-pulse font-black' : 'text-stone-600'}`}>Brancas</span>
           </div>
           <div className="text-[7px] sm:text-[9px] text-gold-dark font-serif uppercase tracking-[0.3em] mt-0.5 opacity-50">{difficulty}</div>
        </div>

        <button 
          onClick={resetGame}
          className="p-1.5 sm:p-2 border border-gold/10 rounded-md text-gold/60 hover:text-gold hover:bg-gold/10 transition-all active:scale-95"
        >
          <RotateCcw size={18} className="sm:size-[20px]" />
        </button>
      </header>

      <main className="flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 overflow-hidden relative">
        {/* Game Board Container - Robust scaling */}
        <div className="relative flex-1 flex flex-col items-center justify-center w-full h-full max-w-4xl">
           <div className="w-full h-full max-h-[75vh] lg:max-h-[85vh] flex items-center justify-center">
             <ChessBoard 
                pieces={pieces}
                selectedSquare={selectedSquare}
                highlightSquares={highlightSquares}
                lastMove={lastMove}
                onSquareClick={onSquareClick}
             />
           </div>
           
           <AnimatePresence>
             {pendingPromotion && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
               >
                 <div className="medieval-panel p-8 border-gold flex flex-col items-center gap-6 max-w-sm w-full text-center">
                   <Sparkles className="w-10 h-10 text-gold glow-gold" />
                   <h2 className="font-serif text-2xl font-black gold-gradient-text uppercase">Ascensão Nobre</h2>
                   <p className="text-ice/40 italic text-[10px] tracking-widest uppercase">Escolha a nova forma de sua guarda</p>
                   
                   <div className="grid grid-cols-2 gap-4 w-full mt-2">
                      {[
                        { type: 'queen', id: 'q', label: 'Rainha' },
                        { type: 'rook', id: 'r', label: 'Torre' },
                        { type: 'bishop', id: 'b', label: 'Bispo' },
                        { type: 'knight', id: 'n', label: 'Cavaleiro' }
                      ].map((option) => (
                        <button 
                           key={option.id}
                           onClick={() => handlePromotion(option.id as any)}
                           className="flex flex-col items-center gap-2 p-4 border border-gold/20 bg-gold/5 rounded hover:bg-gold/10 hover:border-gold/40 transition-all group active:scale-95"
                        >
                           <div className="w-12 h-12">
                              <ChessPiece type={option.type as PieceType} side="white" />
                           </div>
                           <span className="font-serif text-[10px] text-gold-dark uppercase tracking-widest group-hover:text-gold">{option.label}</span>
                        </button>
                      ))}
                   </div>
                 </div>
               </motion.div>
             )}

             {status !== 'playing' && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
               >
                 <div className="medieval-panel p-8 border-gold flex flex-col items-center gap-4 max-w-sm w-full text-center">
                   <Trophy className="w-12 h-12 text-gold glow-gold" />
                   <h2 className="font-serif text-2xl font-black gold-gradient-text uppercase">
                      {status === 'checkmate' ? (game.turn() === 'b' ? 'Vitória Imperial' : 'Derrota Honrosa') : 'Empate Diplomático'}
                   </h2>
                   <p className="text-ice/60 italic uppercase text-[10px] tracking-widest leading-relaxed">
                      O rei {game.turn() === 'b' ? 'Preto' : 'Branco'} caiu sob sua estratégia superior.
                   </p>
                   <button onClick={resetGame} className="btn-medieval w-full py-3 mt-2">Nova Batalha</button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Desktop Side Panel */}
        <aside className="hidden lg:flex flex-col gap-4 w-[320px] h-full max-h-[600px] flex-shrink-0">
           <div className="medieval-panel p-4 flex-1 flex flex-col bg-stone-900/40 overflow-hidden">
              <div className="flex items-center gap-2 mb-3 border-b border-gold/10 pb-2">
                 <Swords size={16} className="text-gold" />
                 <h3 className="font-serif text-xs font-bold gold-gradient-text uppercase">Crônicas de Guerra</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                 {game.history().map((m, i) => (
                   <div key={i} className="flex gap-4 text-[11px] font-serif border-b border-white/5 pb-1 last:border-0 opacity-80">
                      <span className="text-gold-dark w-6 opacity-40">{Math.floor(i/2) + 1}.</span>
                      <span className="text-ice w-12">{m}</span>
                   </div>
                 ))}
                 {game.history().length === 0 && (
                   <div className="h-full flex items-center justify-center">
                     <p className="text-stone-600 italic text-[10px] text-center px-4">O destino do reino aguarda o seu primeiro lance, comandante.</p>
                   </div>
                 )}
              </div>

              {game.isCheck() && (
                 <div className="mt-4 flex items-center gap-3 bg-red-950/30 border border-blood p-3 rounded animate-pulse">
                    <AlertTriangle size={14} className="text-blood" />
                    <span className="text-[9px] text-blood-light font-serif font-black uppercase tracking-widest">Rei Sob Ataque!</span>
                 </div>
              )}
           </div>

           <div className="medieval-panel p-4 bg-stone-900/40">
              <div className="flex items-center gap-2 mb-2">
                 <Shield size={14} className="text-gold" />
                 <h4 className="font-serif text-[9px] font-bold text-gold-dark uppercase tracking-widest">Manual do General</h4>
              </div>
              <p className="text-[9px] text-ice/30 italic leading-relaxed">
                 Um sábio general nunca ataca sem plano. Capture as peças inimigas para enfraquecer o exército do usurpador.
              </p>
           </div>
        </aside>
      </main>
    </div>
  );
}

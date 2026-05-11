import { Piece, Position } from '../types';
import ChessPiece from './ChessPiece';
import { motion, AnimatePresence } from 'motion/react';
import { Move } from 'chess.js';
import { useState, useRef, useEffect } from 'react';

interface ChessBoardProps {
  pieces: Piece[];
  highlightSquares?: Position[];
  selectedSquare?: Position | null;
  lastMove?: Move | null;
  onSquareClick?: (pos: Position) => void;
  targetAction?: { pieceId: string; targetPos: Position };
}

export default function ChessBoard({ 
  pieces, 
  highlightSquares = [], 
  selectedSquare,
  lastMove,
  onSquareClick, 
  targetAction 
}: ChessBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const size = Math.min(width, height);
        setBoardSize(size);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isHighlighted = (x: number, y: number) => {
    return highlightSquares.some(pos => pos.x === x && pos.y === y);
  };

  const isLastMove = (x: number, y: number) => {
    if (!lastMove) return false;
    const fromX = lastMove.from.charCodeAt(0) - 97;
    const fromY = 8 - parseInt(lastMove.from[1]);
    const toX = lastMove.to.charCodeAt(0) - 97;
    const toY = 8 - parseInt(lastMove.to[1]);
    return (x === fromX && y === fromY) || (x === toX && y === toY);
  };

  const isTarget = (x: number, y: number) => {
    return targetAction?.targetPos.x === x && targetAction?.targetPos.y === y;
  };

  const isSelected = (x: number, y: number) => {
    return selectedSquare?.x === x && selectedSquare?.y === y;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100svh-100px)] lg:h-[calc(100svh-110px)] flex items-center justify-center overflow-hidden"
    >
      <div 
        style={{ 
          width: boardSize || '100%', 
          height: boardSize || '100%',
          maxWidth: 'min(98vw, 88vh)' 
        }}
        className="relative bg-stone-900 border-[3px] border-gold-dark/30 shadow-[0_0_80px_rgba(0,0,0,1)] rounded-sm transition-all duration-700 ease-out p-3 sm:p-5"
      >
        {/* Coordinates */}
        <div className="absolute top-0 left-5 right-5 h-5 flex items-center justify-around text-[7px] md:text-[9px] text-gold-dark/60 font-serif uppercase tracking-widest pointer-events-none">
          {'abcdefgh'.split('').map(l => <span key={l}>{l}</span>)}
        </div>
        <div className="absolute bottom-0 left-5 right-5 h-5 flex items-center justify-around text-[7px] md:text-[9px] text-gold-dark/60 font-serif uppercase tracking-widest pointer-events-none">
          {'abcdefgh'.split('').map(l => <span key={l}>{l}</span>)}
        </div>
        <div className="absolute left-0 top-5 bottom-5 w-5 flex flex-col items-center justify-around text-[7px] md:text-[9px] text-gold-dark/60 font-serif uppercase tracking-widest pointer-events-none">
          {'87654321'.split('').map(n => <span key={n}>{n}</span>)}
        </div>
        <div className="absolute right-0 top-5 bottom-5 w-5 flex flex-col items-center justify-around text-[7px] md:text-[9px] text-gold-dark/60 font-serif uppercase tracking-widest pointer-events-none">
          {'87654321'.split('').map(n => <span key={n}>{n}</span>)}
        </div>

        <div className="grid grid-cols-8 grid-rows-8 w-full h-full border border-gold/30 relative">
          {(() => {
            const pieceMap = new Map<string, Piece>();
            pieces.forEach(p => pieceMap.set(`${p.position.x}-${p.position.y}`, p));
            
            return Array.from({ length: 64 }).map((_, i) => {
              const x = i % 8;
              const y = Math.floor(i / 8);
              const isDark = (x + y) % 2 === 1;
              const highlighted = isHighlighted(x, y);
              const last = isLastMove(x, y);
              const target = isTarget(x, y);
              const selected = isSelected(x, y);
              const piece = pieceMap.get(`${x}-${y}`);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`interactive-square ${isDark ? 'bg-stone-800' : 'bg-stone-100'}`}
                  onClick={() => onSquareClick?.({ x, y })}
                >
                  {last && (
                    <div className="absolute inset-0 bg-gold/15 z-0" />
                  )}
                  {highlighted && (
                    <div className="absolute inset-0 bg-yellow-400/20 shadow-inner z-0" />
                  )}
                  {selected && (
                    <div className="absolute inset-0 bg-gold/30 z-0 border-[3px] border-gold" />
                  )}
                  {target && (
                    <div className="absolute inset-0 border-4 border-gold-light/60 animate-pulse z-20" />
                  )}
                  
                  {piece && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-[4%]">
                      <ChessPiece
                        type={piece.type}
                        side={piece.side}
                      />
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
        
        {/* Decorative corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-gold" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-gold" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-gold" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-gold" />
      </div>
    </div>
  );
}

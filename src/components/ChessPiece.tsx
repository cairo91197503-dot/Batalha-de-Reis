import { PieceType, Side } from '../types';
import { motion } from 'motion/react';

interface ChessPieceProps {
  type: PieceType;
  side: Side;
}

export default function ChessPiece({ type, side }: ChessPieceProps) {
  const isWhite = side === 'white';
  
  // Cores premium: Branco marfim vs Preto ônix com detalhes em ouro/sangue
  const baseColor = isWhite ? '#F0F0F0' : '#1A1A1A';
  const detailColor = isWhite ? '#D4AF37' : '#8B0000';
  const shadowColor = isWhite ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)';

  const renderPiece = () => {
    const scale = 1.05;
    const strokeWidth = 1.2;

    switch (type) {
      case 'pawn':
        return (
          <g transform={`scale(${scale})`}>
            <ellipse cx="12" cy="19" rx="7" ry="2.5" fill={shadowColor} />
            <path d="M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M9 11c0-1.5 1-2.5 3-2.5s3 1 3 2.5v2H9v-2.5z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M6 20c0-2.5 2.5-4.5 6-4.5s6 2 6 4.5v1H6v-1z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
          </g>
        );
      case 'rook':
        return (
          <g transform={`scale(${scale})`}>
            <ellipse cx="12" cy="20" rx="8" ry="2.5" fill={shadowColor} />
            <path d="M5 4h3v3h2V4h4v3h2V4h3v6H5V4z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M8 10h8v8H8v-8z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M5 18h14v3H5v-3z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
          </g>
        );
      case 'knight':
        return (
          <g transform={`scale(${scale})`}>
            <ellipse cx="12" cy="20" rx="8" ry="2.5" fill={shadowColor} />
            <path d="M19 19c0-6-4-10-10-10H7l2-4V2h4c4 0 7 3 7 7v10h-2z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M9 9c-3 0-6 3-6 6v4h6v-4h6c0-3-3-6-6-6z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <circle cx="15" cy="6" r="1.2" fill={detailColor} />
          </g>
        );
      case 'bishop':
        return (
          <g transform={`scale(${scale})`}>
            <ellipse cx="12" cy="20" rx="8" ry="2.5" fill={shadowColor} />
            <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 2.5 1.5 5 4.5 9 3-4 4.5-6.5 4.5-9a4.5 4.5 0 0 0-4.5-4.5z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M9 16h6v5H9v-5z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <line x1="12" y1="3" x2="12" y2="8" stroke={detailColor} strokeWidth={1.5} />
          </g>
        );
      case 'queen':
        return (
          <g transform={`scale(${scale})`}>
            <ellipse cx="12" cy="21" rx="9" ry="3" fill={shadowColor} />
            <path d="M12 2l-3.5 5-5-1.5 2.5 6-4 1.5 4 4-1 4h14l-1-4 4-4-4-1.5 2.5-6-5 1.5L12 2z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <circle cx="12" cy="11.5" r="2.5" fill={detailColor} fillOpacity="0.1" />
          </g>
        );
      case 'king':
        return (
          <g transform={`scale(${scale})`}>
            <ellipse cx="12" cy="21" rx="9" ry="3" fill={shadowColor} />
            <path d="M11 1h2v4h4v2h-4v4h-2V7H7V5h4V1z" fill={detailColor} />
            <path d="M5 8l7-3 7 3v3H5V8z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M6 11h12l1 9H5l1-9z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
            <path d="M4 20h16v2H4v-2z" fill={baseColor} stroke={detailColor} strokeWidth={strokeWidth} />
          </g>
        );
    }
  };

  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={`w-full h-full p-1 drop-shadow-lg ${side === 'white' ? 'glow-gold' : 'glow-red'}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {renderPiece()}
    </motion.svg>
  );
}

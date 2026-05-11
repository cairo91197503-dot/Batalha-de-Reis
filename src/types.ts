export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type Side = 'white' | 'black';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  id: string;
  type: PieceType;
  side: Side;
  position: Position;
}

export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  message?: string;
  boardState: Piece[];
  targetAction?: {
    pieceId: string;
    targetPos: Position;
  };
  highlightSquares?: Position[];
  isFinal?: boolean;
  reward?: boolean;
}

export type AppView = 'login' | 'lobby' | 'tutorial' | 'bot-selection' | 'game';
export type BotDifficulty = 'beginner' | 'casual' | 'strategic' | 'master';

export interface UserProfile {
  name: string;
  level: number;
  elo: number;
  avatar?: string;
  isGuest?: boolean;
}

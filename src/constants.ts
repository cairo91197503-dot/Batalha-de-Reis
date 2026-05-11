import { TutorialStep } from './types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: "Bem-vindo ao Batalha de Reis",
    description: "O xadrez é uma guerra de inteligência. Proteja seu Rei. Derrube o inimigo.",
    boardState: [
      { id: 'white-king', type: 'king', side: 'white', position: { x: 4, y: 7 } },
      { id: 'black-king', type: 'king', side: 'black', position: { x: 4, y: 0 } },
    ],
  },
  {
    id: 2,
    title: "Objetivo do Jogo",
    description: "O objetivo é dar Xeque-Mate: capturar o Rei inimigo sem que ele tenha saída.",
    message: "Você vence quando o Rei inimigo não possui saída.",
    boardState: [
      { id: 'white-rook-1', type: 'rook', side: 'white', position: { x: 0, y: 0 } },
      { id: 'white-rook-2', type: 'rook', side: 'white', position: { x: 1, y: 1 } },
      { id: 'black-king', type: 'king', side: 'black', position: { x: 7, y: 0 } },
    ],
    highlightSquares: [{ x: 7, y: 0 }],
  },
  {
    id: 3,
    title: "O Tabuleiro",
    description: "São 64 casas dispostas em 8 linhas e 8 colunas. Cada movimento é uma decisão tática.",
    boardState: [],
    highlightSquares: [
      { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }
    ],
  },
  {
    id: 4,
    title: "Posição Inicial",
    description: "As peças são organizadas em duas linhas. A Rainha sempre começa na casa da sua própria cor.",
    message: "A Rainha começa na casa da própria cor.",
    boardState: [
      { id: 'wr1', type: 'rook', side: 'white', position: { x: 0, y: 7 } },
      { id: 'wn1', type: 'knight', side: 'white', position: { x: 1, y: 7 } },
      { id: 'wb1', type: 'bishop', side: 'white', position: { x: 2, y: 7 } },
      { id: 'wq', type: 'queen', side: 'white', position: { x: 3, y: 7 } },
      { id: 'wk', type: 'king', side: 'white', position: { x: 4, y: 7 } },
      { id: 'wb2', type: 'bishop', side: 'white', position: { x: 5, y: 7 } },
      { id: 'wn2', type: 'knight', side: 'white', position: { x: 6, y: 7 } },
      { id: 'wr2', type: 'rook', side: 'white', position: { x: 7, y: 7 } },
      { id: 'wp1', type: 'pawn', side: 'white', position: { x: 0, y: 6 } },
      { id: 'wp2', type: 'pawn', side: 'white', position: { x: 1, y: 6 } },
      { id: 'wp3', type: 'pawn', side: 'white', position: { x: 2, y: 6 } },
      { id: 'wp4', type: 'pawn', side: 'white', position: { x: 3, y: 6 } },
      { id: 'wp5', type: 'pawn', side: 'white', position: { x: 4, y: 6 } },
      { id: 'wp6', type: 'pawn', side: 'white', position: { x: 5, y: 6 } },
      { id: 'wp7', type: 'pawn', side: 'white', position: { x: 6, y: 6 } },
      { id: 'wp8', type: 'pawn', side: 'white', position: { x: 7, y: 6 } },
    ],
  },
  {
    id: 5,
    title: "O Peão",
    description: "Soldados da linha de frente. Movem-se uma casa à frente, mas podem mover duas no primeiro lance.",
    message: "Desafio: Mova o peão duas casas à frente.",
    boardState: [
      { id: 'pawn-1', type: 'pawn', side: 'white', position: { x: 3, y: 6 } },
    ],
    targetAction: {
      pieceId: 'pawn-1',
      targetPos: { x: 3, y: 4 },
    }
  },
  {
    id: 6,
    title: "A Torre",
    description: "Poderosas fortalezas. Movem-se em linha reta, horizontal ou vertical, sem limite de casas.",
    boardState: [
      { id: 'rook-1', type: 'rook', side: 'white', position: { x: 3, y: 3 } },
    ],
    highlightSquares: [
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }, { x: 3, y: 7 },
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 }
    ]
  },
  {
    id: 7,
    title: "O Cavalo",
    description: "A única peça que pode pular outras. Move-se em 'L' (duas casas numa direção e uma perpendicular).",
    boardState: [
      { id: 'knight-1', type: 'knight', side: 'white', position: { x: 4, y: 4 } },
    ],
    highlightSquares: [
      { x: 3, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 3 }, { x: 6, y: 3 },
      { x: 2, y: 5 }, { x: 6, y: 5 }, { x: 3, y: 6 }, { x: 5, y: 6 }
    ]
  },
  {
    id: 8,
    title: "O Bispo",
    description: "Conselheiros reais. Movem-se apenas em diagonais. Cada bispo permanece em casas da mesma cor.",
    boardState: [
      { id: 'bishop-1', type: 'bishop', side: 'white', position: { x: 4, y: 4 } },
    ],
    highlightSquares: [
      { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 },
      { x: 7, y: 1 }, { x: 6, y: 2 }, { x: 5, y: 3 }, { x: 3, y: 5 }, { x: 2, y: 6 }, { x: 1, y: 7 }
    ]
  },
  {
    id: 9,
    title: "A Rainha",
    description: "A peça mais poderosa. Combina os movimentos da Torre e do Bispo.",
    message: "A peça mais poderosa do tabuleiro.",
    boardState: [
      { id: 'queen-1', type: 'queen', side: 'white', position: { x: 4, y: 4 } },
    ],
    highlightSquares: [
      { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 },
      { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
      { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 5, y: 5 }, { x: 6, y: 6 }, { x: 7, y: 7 },
      { x: 7, y: 1 }, { x: 6, y: 2 }, { x: 5, y: 3 }, { x: 3, y: 5 }, { x: 2, y: 6 }, { x: 1, y: 7 }
    ]
  },
  {
    id: 10,
    title: "O Rei",
    description: "Sua sobrevivência é tudo. Move-se apenas uma casa em qualquer direção.",
    message: "O Rei deve ser protegido a todo custo.",
    boardState: [
      { id: 'king-1', type: 'king', side: 'white', position: { x: 4, y: 4 } },
    ],
    highlightSquares: [
      { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
      { x: 3, y: 4 }, { x: 5, y: 4 },
      { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }
    ]
  },
  {
    id: 11,
    title: "O Xeque",
    description: "Quando o Rei é atacado diretamente. Você deve fugir, bloquear ou capturar o atacante.",
    boardState: [
      { id: 'bk', type: 'king', side: 'black', position: { x: 4, y: 0 } },
      { id: 'wr', type: 'rook', side: 'white', position: { x: 4, y: 7 } },
    ],
    highlightSquares: [{ x: 4, y: 0 }],
  },
  {
    id: 12,
    title: "Xeque-Mate",
    description: "A vitória final. O Rei está em xeque e não tem escapatória.",
    boardState: [
      { id: 'bk', type: 'king', side: 'black', position: { x: 7, y: 0 } },
      { id: 'wr1', type: 'rook', side: 'white', position: { x: 0, y: 0 } },
      { id: 'wr2', type: 'rook', side: 'white', position: { x: 0, y: 1 } },
    ],
    highlightSquares: [{ x: 7, y: 0 }],
  },
  {
    id: 13,
    title: "O Roque",
    description: "Um lance especial que protege o Rei e traz a Torre para o jogo. O Rei move duas casas rumo à Torre.",
    boardState: [
      { id: 'wk', type: 'king', side: 'white', position: { x: 4, y: 7 } },
      { id: 'wr', type: 'rook', side: 'white', position: { x: 7, y: 7 } },
    ],
    targetAction: {
       pieceId: 'wk',
       targetPos: { x: 6, y: 7 }
    }
  },
  {
    id: 14,
    title: "Empate",
    description: "Ocorre quando nenhum jogador pode vencer por falta de peças, repetição de lances ou afogamento.",
    boardState: [
      { id: 'bk', type: 'king', side: 'black', position: { x: 0, y: 0 } },
      { id: 'wk', type: 'king', side: 'white', position: { x: 2, y: 1 } },
      { id: 'wq', type: 'queen', side: 'white', position: { x: 1, y: 2 } },
    ],
  },
  {
    id: 15,
    title: "Estratégia: O Centro",
    description: "Controle o centro do tabuleiro com Peões e Cavalos. Isso lhe dará maior mobilidade.",
    boardState: [
      { id: 'p1', type: 'pawn', side: 'white', position: { x: 3, y: 4 } },
      { id: 'p2', type: 'pawn', side: 'white', position: { x: 4, y: 4 } },
    ],
    highlightSquares: [{ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }],
  },
  {
    id: 16,
    title: "Tática: O Garfo",
    description: "Um ataque duplo onde uma peça ameaça duas peças inimigas simultaneamente.",
    boardState: [
      { id: 'nk', type: 'knight', side: 'white', position: { x: 3, y: 3 } },
      { id: 'bq', type: 'queen', side: 'black', position: { x: 1, y: 2 } },
      { id: 'br', type: 'rook', side: 'black', position: { x: 5, y: 2 } },
    ],
  },
  {
    id: 17,
    title: "Sua Jornada Começa",
    description: "O xadrez é um estudo infinito. Pratique puzzles, analise suas perdas e evolua como mestre.",
    boardState: [],
  },
  {
    id: 18,
    title: "Pronto para a Batalha",
    description: "Agora prove sua inteligência no campo de batalha. A coroa aguarda o verdadeiro rei.",
    message: "Prove sua inteligência no campo de batalha.",
    boardState: [],
    isFinal: true,
    reward: true,
  }
];

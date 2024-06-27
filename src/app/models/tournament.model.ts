// tournament.model.ts
export interface Tournament {
    id: number;
    name: string;
    type: 'group' | 'double-elimination';
    participants: number[];
    matches: Match[];
  }
  
  export interface Match {
    id: number;
    player1: number;
    player2: number;
    winner: number;
    loser: number;
    // Información adicional del partido
  }
  
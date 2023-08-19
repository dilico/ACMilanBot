export type Player = {
  name: string;
  nmbr: string;
};

export type LineupResponse = {
  formation: string;
  players: number[];
  playersMap: Record<number, Player>;
  substitutes: number[];
  unused: number[];
  team: {
    displayName: string;
    homeAway: string;
  };
};

export type Lineup = {
  hasLineup: boolean;
  formation: string;
  players: Player[];
  substitutes: Player[];
};

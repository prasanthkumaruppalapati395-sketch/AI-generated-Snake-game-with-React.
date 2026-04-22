export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
}

export type Point = { x: number; y: number };

export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
}

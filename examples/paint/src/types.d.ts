declare type Point = [number, number];

declare interface Bristle {
  distance: number;
  thickness: number;
  colour: string;
}
declare type Brush = Bristle[];

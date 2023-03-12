interface Point2D {
  x: number;
  y: number;
}
interface HandStatus {
  card: number | null;
  lastCard: number | null;
  gesture: string | null;
  zoomPosition: Point2D | null;
}

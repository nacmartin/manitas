const WIDTH = 1280;
const HEIGHT = 960;

export function normalizedToPixelCoords([x, y]: [number, number]): Point {
  return [x * WIDTH, y * HEIGHT];
}

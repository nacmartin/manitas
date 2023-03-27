import tinycolor from "tinycolor2";

export function varyColour(sourceColour: string, varyBrightness: number) {
  const amount = Math.round(Math.random() * varyBrightness);
  const alpha = 0.8 - Math.random() / 4;
  const colour = tinycolor(sourceColour);
  const varied = colour.darken(amount - varyBrightness / 2).setAlpha(alpha);
  return varied.toPercentageRgbString();
}

export const rotatePoint = (
  distance: number,
  angle: number,
  origin: Point
): Point => [
  origin[0] + distance * Math.cos(angle),
  origin[1] + distance * Math.sin(angle),
];

export const getBearing = (origin: Point, destination: Point) =>
  (Math.atan2(destination[1] - origin[1], destination[0] - origin[0]) -
    Math.PI / 2) %
  (Math.PI * 2);

export const getNewAngle = (
  origin: Point,
  destination: Point,
  oldAngle: number | null
) => {
  const bearing = getBearing(origin, destination);
  if (oldAngle === null) {
    return bearing;
  }
  return oldAngle - angleDiff(oldAngle, bearing);
};

export const angleDiff = (angleA: number, angleB: number) => {
  const twoPi = Math.PI * 2;
  const diff =
    ((angleA - (angleB > 0 ? angleB : angleB + twoPi) + Math.PI) % twoPi) -
    Math.PI;
  return diff < -Math.PI ? diff + twoPi : diff;
};

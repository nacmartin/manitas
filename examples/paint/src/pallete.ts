import tinycolor from "tinycolor2";
import { normalizedToPixelCoords } from "./geometry";

const offsetX = 10;
const offsetY = 30;
const width = 150;
const height = 100;
const separation = 20;

export function setupPallete(
  canvasCtx: CanvasRenderingContext2D,
  colorIdx: number
) {
  canvasCtx.save();
  canvasCtx.clearRect(5, 15, 160, 480);
  colors.forEach((color, idx) => {
    const colorPallete = tinycolor(color);
    canvasCtx.fillStyle =
      idx === colorIdx
        ? colorPallete.setAlpha(0.9).toString()
        : colorPallete.setAlpha(0.5).toString();
    canvasCtx.fillRect(10, 120 * idx + 30, 150, 100);
  });
  canvasCtx.restore();
}

export function maybeSelectColor([xOrig, yOrig]: Point): number | false {
  const [x, y] = normalizedToPixelCoords([xOrig, yOrig]);
  let found: false | number = false;
  colors.forEach((color, idx) => {
    if (
      x > offsetX &&
      x < width + offsetX &&
      y > offsetY + idx * (height + separation) &&
      y < offsetY + idx * (height + separation) + height
    ) {
      found = idx;
    }
  });

  return found;
}

export const colors = [
  "rgb(0, 161, 157, 0.5)",
  "rgb(255, 248, 229, 0.5)",
  "rgb(255, 179, 68,0.5)",
  "rgb(224, 93, 93,0.5)",
];

import { init, AirfingerEvent } from "manitas";
import tinycolor from "tinycolor2";
import { continueStroke, startStroke } from "./brush";

const WIDTH = 1280;
const HEIGHT = 960;

export function setupPaint(canvasElement: HTMLCanvasElement | null) {
  if (!canvasElement) {
    console.warn("Unable to find canvas element");
    return;
  }
  init({ delegate: "GPU" });
  const canvasCtx = canvasElement.getContext("2d");
  if (!canvasCtx) {
    console.warn("Unable to get canvas context");
  }
  const document: Document = window.document;
  document.addEventListener("airfingerstart", airfingerStart);
  document.addEventListener("airfingermove", airfingerMove(canvasCtx));
  document.addEventListener("airfingerend", airfingerEnd);
  setupPallete(canvasCtx as CanvasRenderingContext2D);
}

function airfingerStart(event: Event) {
  const detail = (event as AirfingerEvent).detail;
  const { x, y } = detail.airpoint;
  startStroke([x * WIDTH, y * HEIGHT], colors[colorIdx]);
}

function airfingerMove(canvasCtx: CanvasRenderingContext2D) {
  return function (event: Event) {
    const detail = (event as AirfingerEvent).detail;
    const { x, y } = detail.airpoint;
    continueStroke([x * WIDTH, y * HEIGHT], canvasCtx);
  };
}

function airfingerEnd(event: Event) {
  const detail = (event as AirfingerEvent).detail;
  //console.log(detail);
}

let colorIdx = 0;

function setupPallete(canvasCtx: CanvasRenderingContext2D) {
  canvasCtx.clearRect(5, 15, 160, 480);
  colors.forEach((color, idx) => {
    console.log(idx);
    const colorPallete = tinycolor(color);
    canvasCtx.fillStyle =
      idx === colorIdx
        ? colorPallete.setAlpha(0.9).toString()
        : colorPallete.setAlpha(0.5).toString();
    console.log(canvasCtx.fillStyle);
    canvasCtx.fillRect(10, 120 * idx + 30, 150, 100);
  });
}

const colors = [
  "rgb(0, 161, 157, 0.5)",
  "rgb(255, 248, 229, 0.5)",
  "rgb(255, 179, 68,0.5)",
  "rgb(224, 93, 93,0.5)",
];

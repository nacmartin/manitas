import { init, AirfingerEvent } from "manitas";
import { continueStroke, startStroke } from "./brush";
import { normalizedToPixelCoords } from "./geometry";
import { colors, maybeSelectColor, setupPallete } from "./pallete";

let colorIdx = 0;

export function setupPaint(canvasElement: HTMLCanvasElement | null) {
  if (!canvasElement) {
    console.warn("Unable to find canvas element");
    return;
  }
  init({ delegate: "GPU" });
  const canvasCtx = canvasElement.getContext("2d");
  if (canvasCtx === null) {
    console.warn("Unable to get canvas context");
  }
  const document: Document = window.document;
  document.addEventListener(
    "airfingerstart",
    airfingerStart(canvasCtx as CanvasRenderingContext2D)
  );
  document.addEventListener(
    "airfingermove",
    airfingerMove(canvasCtx as CanvasRenderingContext2D)
  );
  document.addEventListener("airfingerend", airfingerEnd);
  setupPallete(canvasCtx as CanvasRenderingContext2D, colorIdx);
}

function airfingerStart(canvasCtx: CanvasRenderingContext2D) {
  return function (event: Event) {
    const detail = (event as AirfingerEvent).detail;
    const hand = detail.hand;
    const { x, y } = detail.airpoint;
    if (hand === "left") {
      const colorSelected = maybeSelectColor([x, y]);
      if (colorSelected !== false) {
        colorIdx = colorSelected;
        setupPallete(canvasCtx, colorIdx);
      }
    } else {
      const point = normalizedToPixelCoords([x, y]);
      startStroke(point, colors[colorIdx]);
    }
  };
}

function airfingerMove(canvasCtx: CanvasRenderingContext2D) {
  return function (event: Event) {
    const detail = (event as AirfingerEvent).detail;
    const { hand } = detail;
    const { x, y } = detail.airpoint;
    if (hand === "right") {
      canvasCtx.save();
      continueStroke(normalizedToPixelCoords([x, y]), canvasCtx);
      canvasCtx.restore();
    }
    if (hand === "left") {
      const colorSelected = maybeSelectColor([x, y]);
      if (colorSelected !== false) {
        colorIdx = colorSelected;
        setupPallete(canvasCtx, colorIdx);
      }
    } else {
    }
  };
}

function airfingerEnd(event: Event) {
  const detail = (event as AirfingerEvent).detail;
  //console.log(detail);
}

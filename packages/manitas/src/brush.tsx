import { getNewAngle, rotatePoint, varyColour } from "./brushHelpers";

let currentAngle = null;
let lastPoint = null;
let strokeWidth = 25;
let varyBrightness = 5;
let brush = null;

function startStroke(point, color) {
  currentAngle = undefined;
  brush = makeBrush(strokeWidth, color, varyBrightness);
  lastPoint = point;
}

function continueStroke(newPoint, context) {
  if (!lastPoint) {
    lastPoint = newPoint;
    return;
  }
  const newAngle = getNewAngle(lastPoint, newPoint, currentAngle);
  if (typeof currentAngle === "undefined") {
    currentAngle = newAngle % (Math.PI * 2);
  }
  drawStroke(
    brush,
    lastPoint,
    newPoint,
    currentAngle,
    newAngle,
    strokeWidth,
    context
  );
  currentAngle = newAngle % (Math.PI * 2);
  lastPoint = newPoint;
}

function makeBrush(strokeWidth, colour, varyBrightness) {
  const brush = [];
  const bristleCount = Math.round(strokeWidth / 3);
  const gap = strokeWidth / bristleCount;
  for (let i = 0; i < bristleCount; i++) {
    const distance =
      i === 0 ? 0 : gap * i + (Math.random() * gap) / 2 - gap / 2;
    brush.push({
      distance,
      thickness: Math.random() * 2 + 2,
      colour: varyColour(colour, varyBrightness),
    });
  }
  return brush;
}

const strokeBristle = (origin, destination, bristle, controlPoint, context) => {
  context.beginPath();
  context.moveTo(origin[0], origin[1]);
  context.strokeStyle = bristle.colour;
  context.lineWidth = bristle.thickness;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = bristle.colour;
  context.shadowBlur = bristle.thickness / 2;
  context.quadraticCurveTo(
    controlPoint[0],
    controlPoint[1],
    destination[0],
    destination[1]
  );
  context.lineTo(destination[0], destination[1]);
  context.stroke();
};

const drawStroke = (
  bristles,
  origin,
  destination,
  oldAngle,
  newAngle,
  strokeWidth,
  context
) => {
  bristles.forEach((bristle) => {
    context.beginPath();
    const bristleOrigin = rotatePoint(
      bristle.distance - strokeWidth / 2,
      oldAngle,
      origin
    );

    const bristleDestination = rotatePoint(
      bristle.distance - strokeWidth / 2,
      newAngle,
      destination
    );
    const controlPoint = rotatePoint(
      bristle.distance - strokeWidth / 2,
      newAngle,
      origin
    );

    strokeBristle(
      bristleOrigin,
      bristleDestination,
      bristle,
      controlPoint,
      context
    );
  });
};

export { startStroke, continueStroke };

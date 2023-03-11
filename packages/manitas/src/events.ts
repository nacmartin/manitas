import type {
  Hand,
  HandState,
  Point3D,
  AirfingerEventParams,
  GestureEventParams,
} from "./types";
export function emitGestures(
  prevState: HandState | null,
  nextState: HandState | null,
  hand: Hand
) {
  if (
    (!prevState || !prevState.present || !prevState.gesture) &&
    nextState &&
    nextState.present &&
    nextState.gesture
  ) {
    const event = new CustomEvent<GestureEventParams>("gesturestart", {
      detail: {
        gesture: nextState.gesture,
        hand,
        airpoint: nextState.position,
      },
    });
    document.dispatchEvent(event);
  }
  if (
    prevState &&
    prevState.present &&
    prevState.gesture &&
    nextState &&
    nextState.present &&
    nextState.gesture
  ) {
    const event = new CustomEvent<GestureEventParams>("gesturemove", {
      detail: {
        gesture: nextState.gesture,
        hand,
        airpoint: nextState.position,
      },
    });
    document.dispatchEvent(event);
  }
  if (
    (!nextState || !nextState.present || !nextState.gesture) &&
    prevState &&
    prevState.present &&
    prevState.gesture
  ) {
    const event = new CustomEvent("gestureend", {
      detail: {
        gesture: prevState.gesture,
        hand,
        airpoint: prevState.position,
      },
    });
    document.dispatchEvent(event);
  }
}

export function emitAirfingers(
  prevState: HandState | null,
  nextState: HandState | null,
  hand: Hand
) {
  if (
    (!prevState || !prevState.present || !prevState.active) &&
    nextState &&
    nextState.present &&
    nextState.active
  ) {
    const event = new CustomEvent<AirfingerEventParams>("airfingerstart", {
      detail: { airpoint: flipX(nextState.position), hand },
    });
    document.dispatchEvent(event);
  } else if (
    (!nextState || !nextState.present || !nextState.active) &&
    prevState &&
    prevState.present &&
    prevState.active
  ) {
    const event = new CustomEvent<AirfingerEventParams>("airfingerend", {
      detail: { airpoint: flipX(prevState.position), hand },
    });
    document.dispatchEvent(event);
  } else if (
    prevState &&
    prevState.present &&
    prevState.active &&
    nextState &&
    nextState.present &&
    nextState.active
  ) {
    const event = new CustomEvent<AirfingerEventParams>("airfingermove", {
      detail: { airpoint: flipX(prevState.position), hand },
    });
    document.dispatchEvent(event);
  }
}

function flipX(p: Point3D) {
  return { ...p, x: 1 - p.x };
}

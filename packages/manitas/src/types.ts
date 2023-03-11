export type HandState = HandStateActive | HandStateInactive;
export interface Point3D {
  x: number;
  y: number;
  z: number;
}
export interface HandStateInactive {
  gesture: string | null;
  active: false;
}
export interface HandStateActive {
  gesture: string | null;
  active: true;
  position: Point3D;
}
export interface HandsState {
  leftHand: HandState | null;
  rightHand: HandState | null;
}
export type Hand = "left" | "right";

export interface GestureEvent {
  detail: GestureEventParams;
}

export interface AirfingerEvent {
  detail: AirfingerEventParams;
}

export interface AirfingerEventParams {
  airpoint: Point3D;
  hand: Hand;
}

export interface GestureEventParams {
  gesture: string;
  hand: Hand;
}

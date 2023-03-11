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
  gesture: string;
  hand: Hand;
}

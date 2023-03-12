export type HandState = HandStateActive | HandStateInactive | HandStateAbsent;
export interface Point3D {
  x: number;
  y: number;
  z: number;
}
export interface HandStateAbsent {
  present: false;
}
export interface HandStateInactive {
  gesture: string | null;
  present: true;
  active: false;
  position: Point3D;
}
export interface HandStateActive {
  gesture: string | null;
  present: true;
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
  airpoint: Point3D;
}

export interface ManitasConfig {
  gestureThreshold: number;
  handednessThreshold: number;
  activeThreshold: number;
  videoHeight: string;
  videoWidth: string;
  videoId: string;
  delegate: "GPU" | "CPU";
  modelAssetPath: string;
  mediapipeWasmPath: string;
}

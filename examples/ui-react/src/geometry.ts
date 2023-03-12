import { Point3D } from "manitas";
export function inScreen(point: Point3D) {
  return {
    x: point.x * 1280,
    y: point.y * 960,
    z: point.z,
  };
}

export function contains(rect: DOMRect, point: Point3D) {
  return (
    rect.left < point.x &&
    rect.right > point.x &&
    rect.top < point.y &&
    rect.bottom > point.y
  );
}

export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p2.y - p2.y, 2));
}
export function center(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  return { x: p1.x + (p1.x - p2.x) / 2, y: p1.y + (p1.y - p2.y) / 2 };
}

export function rectRelativeToParent(rect: DOMRect, rectParent: DOMRect) {
  return {
    x: rect.x - rectParent.x,
    y: rect.y - rectParent.y,
    width: rect.width,
    left: rect.left - rectParent.left,
    top: rect.top - rectParent.top,
    right: rect.width + rect.left - rectParent.left,
    bottom: rect.height + rect.top - rectParent.top,
  } as DOMRect;
}

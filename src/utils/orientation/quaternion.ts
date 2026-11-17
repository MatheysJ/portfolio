import { Matrix, Quaternion } from "./types";

export const toQuaternion = (m: Matrix): Quaternion => {
  const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = m;
  const trace = m00 + m11 + m22;

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1);
    return [(m21 - m12) * s, (m02 - m20) * s, (m10 - m01) * s, 0.25 / s];
  }
  if (m00 > m11 && m00 > m22) {
    const s = 2 * Math.sqrt(1 + m00 - m11 - m22);
    return [0.25 * s, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s];
  }
  if (m11 > m22) {
    const s = 2 * Math.sqrt(1 + m11 - m00 - m22);
    return [(m01 + m10) / s, 0.25 * s, (m12 + m21) / s, (m02 - m20) / s];
  }
  const s = 2 * Math.sqrt(1 + m22 - m00 - m11);
  return [(m02 + m20) / s, (m12 + m21) / s, 0.25 * s, (m10 - m01) / s];
};

export const fromQuaternion = ([x, y, z, w]: Quaternion): Matrix => [
  1 - 2 * (y * y + z * z),
  2 * (x * y - z * w),
  2 * (x * z + y * w),
  2 * (x * y + z * w),
  1 - 2 * (x * x + z * z),
  2 * (y * z - x * w),
  2 * (x * z - y * w),
  2 * (y * z + x * w),
  1 - 2 * (x * x + y * y),
];

const asQuaternion = (values: number[]) => values as unknown as Quaternion;

export const slerp = (a: Quaternion, b: Quaternion, t: number): Quaternion => {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const target = dot < 0 ? asQuaternion(b.map((v) => -v)) : b;
  dot = Math.abs(dot);

  if (dot > 0.9995) {
    const mixed = a.map((v, i) => v + (target[i] - v) * t);
    const length = Math.hypot(...mixed);
    return asQuaternion(mixed.map((v) => v / length));
  }

  const theta = Math.acos(Math.min(dot, 1));
  const sinTheta = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / sinTheta;
  const wb = Math.sin(t * theta) / sinTheta;
  return asQuaternion(a.map((v, i) => v * wa + target[i] * wb));
};

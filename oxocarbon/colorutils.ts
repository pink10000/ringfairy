// Color utilities - HSLuv color space conversion and manipulation
// Converted from Lua to TypeScript

const HEX_CHARS = '0123456789abcdef';
const EPSILON = 0.0088564516;
const KAPPA = 903.2962962;
const REF_Y = 1;
const REF_U = 0.19783000664283;
const REF_V = 0.46831999493879;

// RGB to XYZ transformation matrix
const M = [
  [3.2409699419045, -1.5373831775701, -0.498610760293],
  [-0.96924363628087, 1.8759675015077, 0.041555057407175],
  [0.055630079696993, -0.20397695888897, 1.0569715142429],
];

// XYZ to RGB transformation matrix (inverse of M)
const M_INV = [
  [0.41239079926595, 0.35758433938387, 0.18048078840183],
  [0.21263900587151, 0.71516867876775, 0.072192315360733],
  [0.019330818715591, 0.11919477979462, 0.95053215224966],
];

interface Line {
  slope: number;
  intercept: number;
}

type Tuple3 = [number, number, number];

function getBounds(l: number): Line[] {
  const result: Line[] = [];
  const sub1 = Math.pow((l + 16) / 116, 3);
  const sub2 = sub1 > EPSILON ? sub1 : l / KAPPA;

  for (let i = 0; i < 3; i++) {
    const m1 = M[i][0];
    const m2 = M[i][1];
    const m3 = M[i][2];

    for (let t = 0; t <= 1; t++) {
      const top1 = (284517 * m1 - 94839 * m3) * sub2;
      const top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * l * sub2 - 769860 * t * l;
      const bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
      result.push({
        slope: top1 / bottom,
        intercept: top2 / bottom,
      });
    }
  }

  return result;
}

function lengthOfRayUntilIntersect(theta: number, line: Line): number {
  return line.intercept / (Math.sin(theta) - line.slope * Math.cos(theta));
}

function maxSafeChromaForLH(l: number, h: number): number {
  const hrad = (h / 360) * Math.PI * 2;
  const bounds = getBounds(l);
  let min = Number.MAX_VALUE;

  for (const bound of bounds) {
    const distance = lengthOfRayUntilIntersect(hrad, bound);
    if (distance >= 0) {
      min = Math.min(min, distance);
    }
  }

  return min;
}

function yToL(Y: number): number {
  if (Y <= EPSILON) {
    return (Y / REF_Y) * KAPPA;
  } else {
    return 116 * Math.pow(Y / REF_Y, 1 / 3) - 16;
  }
}

function lToY(L: number): number {
  if (L <= 8) {
    return (REF_Y * L) / KAPPA;
  } else {
    return REF_Y * Math.pow((L + 16) / 116, 3);
  }
}

function fromLinear(c: number): number {
  if (c <= 0.0031308) {
    return 12.92 * c;
  } else {
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }
}

function toLinear(c: number): number {
  if (c > 0.04045) {
    return Math.pow((c + 0.055) / 1.055, 2.4);
  } else {
    return c / 12.92;
  }
}

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function luvToLch(tuple: Tuple3): Tuple3 {
  const [L, U, V] = tuple;
  const C = Math.sqrt(U * U + V * V);
  let H: number;

  if (C < 1e-8) {
    H = 0;
  } else {
    H = (Math.atan2(V, U) * 180) / Math.PI;
    if (H < 0) {
      H = 360 + H;
    }
  }

  return [L, C, H];
}

function lchToLuv(tuple: Tuple3): Tuple3 {
  const [L, C, H] = tuple;
  const Hrad = (H / 360) * 2 * Math.PI;
  return [L, Math.cos(Hrad) * C, Math.sin(Hrad) * C];
}

function xyzToLuv(tuple: Tuple3): Tuple3 {
  const [X, Y, Z] = tuple;
  const divider = X + 15 * Y + 3 * Z;
  let varU = 4 * X;
  let varV = 9 * Y;

  if (divider !== 0) {
    varU = varU / divider;
    varV = varV / divider;
  } else {
    varU = 0;
    varV = 0;
  }

  const L = yToL(Y);
  if (L === 0) {
    return [0, 0, 0];
  }

  return [L, 13 * L * (varU - REF_U), 13 * L * (varV - REF_V)];
}

function luvToXyz(tuple: Tuple3): Tuple3 {
  const [L, U, V] = tuple;

  if (L === 0) {
    return [0, 0, 0];
  }

  const varU = U / (13 * L) + REF_U;
  const varV = V / (13 * L) + REF_V;
  const Y = lToY(L);
  const X = -(9 * Y * varU) / ((varU - 4) * varV - varU * varV);
  const Z = (9 * Y - 15 * varV * Y - varV * X) / (3 * varV);

  return [X, Y, Z];
}

function xyzToRgb(tuple: Tuple3): Tuple3 {
  return [
    fromLinear(dotProduct(M[0], tuple)),
    fromLinear(dotProduct(M[1], tuple)),
    fromLinear(dotProduct(M[2], tuple)),
  ];
}

function rgbToXyz(tuple: Tuple3): Tuple3 {
  const rgbl: Tuple3 = [toLinear(tuple[0]), toLinear(tuple[1]), toLinear(tuple[2])];
  return [dotProduct(M_INV[0], rgbl), dotProduct(M_INV[1], rgbl), dotProduct(M_INV[2], rgbl)];
}

function hexToRgb(hex: string): Tuple3 {
  const hex0 = hex.toLowerCase();
  const ret: Tuple3 = [0, 0, 0];

  for (let i = 0; i < 3; i++) {
    const char1 = hex0.charAt(i * 2 + 1);
    const char2 = hex0.charAt(i * 2 + 2);
    const digit1 = HEX_CHARS.indexOf(char1);
    const digit2 = HEX_CHARS.indexOf(char2);
    ret[i] = (digit1 * 16 + digit2) / 255;
  }

  return ret;
}

function rgbToHex(tuple: Tuple3): string {
  let h = '#';

  for (let i = 0; i < 3; i++) {
    const c = Math.floor(tuple[i] * 255 + 0.5);
    const digit2 = c % 16;
    const digit1 = Math.floor((c - digit2) / 16);
    h += HEX_CHARS.charAt(digit1);
    h += HEX_CHARS.charAt(digit2);
  }

  return h;
}

function lchToHsluv(tuple: Tuple3): Tuple3 {
  const [L, C, H] = tuple;
  const maxChroma = maxSafeChromaForLH(L, H);

  if (L > 99.9999999) {
    return [H, 0, 100];
  }

  if (L < 1e-8) {
    return [H, 0, 0];
  }

  return [H, (C / maxChroma) * 100, L];
}

function hsluvToLch(tuple: Tuple3): Tuple3 {
  const [H, S, L] = tuple;

  if (L > 99.9999999) {
    return [100, 0, H];
  }

  if (L < 1e-8) {
    return [0, 0, H];
  }

  return [L, (maxSafeChromaForLH(L, H) / 100) * S, H];
}

function rgbToLch(tuple: Tuple3): Tuple3 {
  return luvToLch(xyzToLuv(rgbToXyz(tuple)));
}

function lchToRgb(tuple: Tuple3): Tuple3 {
  return xyzToRgb(luvToXyz(lchToLuv(tuple)));
}

function rgbToHsluv(tuple: Tuple3): Tuple3 {
  return lchToHsluv(rgbToLch(tuple));
}

function hsluvToRgb(tuple: Tuple3): Tuple3 {
  return lchToRgb(hsluvToLch(tuple));
}

function hexToHsluv(s: string): Tuple3 {
  return rgbToHsluv(hexToRgb(s));
}

function hsluvToHex(tuple: Tuple3): string {
  return rgbToHex(hsluvToRgb(tuple));
}

// Color manipulation functions

function linearTween(start: number, stop: number): (i: number) => number {
  return (i: number) => start + i * (stop - start);
}

function radialTween(x: number, y: number): (i: number) => number {
  const start = (x * Math.PI) / 180;
  const stop = (y * Math.PI) / 180;
  const delta = Math.atan2(Math.sin(stop - start), Math.cos(stop - start));

  return (i: number) => {
    const result = start + delta * i;
    return ((360 + (result * 180) / Math.PI) % 360);
  };
}

function blendHsluv(start: Tuple3, stop: Tuple3, ratio: number = 0.5): Tuple3 {
  const h = radialTween(start[0], stop[0]);
  const s = linearTween(start[1], stop[1]);
  const l = linearTween(start[2], stop[2]);
  return [h(ratio), s(ratio), l(ratio)];
}

export function lighten(c: Tuple3, n: number): Tuple3 {
  const l = linearTween(c[2], 100);
  return [c[0], c[1], l(n)];
}

export function darken(c: Tuple3, n: number): Tuple3 {
  const l = linearTween(c[2], 0);
  return [c[0], c[1], l(n)];
}

export function saturate(c: Tuple3, n: number): Tuple3 {
  const s = linearTween(c[1], 100);
  return [c[0], s(n), c[2]];
}

export function desaturate(c: Tuple3, n: number): Tuple3 {
  const s = linearTween(c[1], 0);
  return [c[0], s(n), c[2]];
}

export function rotate(c: Tuple3, n: number): Tuple3 {
  return [(n + c[0]) % 360, c[1], c[2]];
}

// Hex manipulation functions

export function blendHex(c1: string, c2: string, r: number = 0.5): string {
  return hsluvToHex(blendHsluv(hexToHsluv(c1), hexToHsluv(c2), r));
}

export function lightenHex(c: string, n: number): string {
  return hsluvToHex(lighten(hexToHsluv(c), n));
}

export function darkenHex(c: string, n: number): string {
  return hsluvToHex(darken(hexToHsluv(c), n));
}

export function saturateHex(c: string, n: number): string {
  return hsluvToHex(saturate(hexToHsluv(c), n));
}

export function desaturateHex(c: string, n: number): string {
  return hsluvToHex(desaturate(hexToHsluv(c), n));
}

export function rotateHex(c: string, n: number): string {
  return hsluvToHex(rotate(hexToHsluv(c), n));
}

export function gradient(c1: string, c2: string): string[] {
  const ls: string[] = [];
  for (let i = 0; i <= 1.01; i += 0.02) {
    ls.push(blendHex(c1, c2, i));
  }
  return ls;
}

export function gradientN(c1: string, c2: string, n: number): string[] {
  const ls: string[] = [];
  const step = 1 / (n + 1);
  
  for (let i = 1; i <= n; i++) {
    ls.push(blendHex(c1, c2, i * step));
  }

  return [c1, ...ls, c2];
}

function randomColor(
  redRange: [number, number],
  greenRange: [number, number],
  blueRange: [number, number]
): string {
  const r = Math.floor(Math.random() * (redRange[1] - redRange[0] + 1)) + redRange[0];
  const g = Math.floor(Math.random() * (greenRange[1] - greenRange[0] + 1)) + greenRange[0];
  const b = Math.floor(Math.random() * (blueRange[1] - blueRange[0] + 1)) + blueRange[0];
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export interface Base16Palette {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08?: string;
  base09?: string;
  base0A?: string;
  base0B?: string;
  base0C?: string;
  base0D?: string;
  base0E?: string;
  base0F?: string;
}

export function generatePalette(): Base16Palette {
  const bghex = randomColor([0, 63], [0, 63], [0, 63]);
  const fghex = randomColor([240, 255], [240, 255], [240, 255]);

  const palette = [
    bghex,
    blendHex(bghex, fghex, 0.085),
    blendHex(bghex, fghex, 0.18),
    blendHex(bghex, fghex, 0.3),
    blendHex(bghex, fghex, 0.7),
    blendHex(bghex, fghex, 0.82),
    blendHex(bghex, fghex, 0.95),
    fghex,
  ];

  const base16Names = [
    'base00',
    'base01',
    'base02',
    'base03',
    'base04',
    'base05',
    'base06',
    'base07',
    'base08',
    'base09',
    'base0A',
    'base0B',
    'base0C',
    'base0D',
    'base0E',
    'base0F',
  ] as const;

  const base16Palette: Base16Palette = {
    base00: palette[0],
    base01: palette[1],
    base02: palette[2],
    base03: palette[3],
    base04: palette[4],
    base05: palette[5],
    base06: palette[6],
    base07: palette[7],
  };

  return base16Palette;
}

// Oxocarbon color scheme
// Converted from Lua to TypeScript
// Note: This is a simplified version without Neovim-specific API calls

import { blendHex } from './colorutils';

export interface OxocarbonPalette {
  base00: string;
  base01: string;
  base02: string;
  base03: string;
  base04: string;
  base05: string;
  base06: string;
  base07: string;
  base08: string;
  base09: string;
  base10: string;
  base11: string;
  base12: string;
  base13: string;
  base14: string;
  base15: string;
  blend: string;
  none: string;
}

const BASE00 = '#161616';
const BASE06 = '#ffffff';
const BASE09 = '#78a9ff';

export function getOxocarbonDark(): OxocarbonPalette {
  return {
    base00: BASE00,
    base01: blendHex(BASE00, BASE06, 0.085),
    base02: blendHex(BASE00, BASE06, 0.18),
    base03: blendHex(BASE00, BASE06, 0.3),
    base04: blendHex(BASE00, BASE06, 0.82),
    base05: blendHex(BASE00, BASE06, 0.95),
    base06: BASE06,
    base07: '#08bdba',
    base08: '#3ddbd9',
    base09: BASE09,
    base10: '#ee5396',
    base11: '#33b1ff',
    base12: '#ff7eb6',
    base13: '#42be65',
    base14: '#be95ff',
    base15: '#82cfff',
    blend: '#131313',
    none: 'NONE',
  };
}

export function getOxocarbonLight(): OxocarbonPalette {
  return {
    base00: BASE06,
    base01: blendHex(BASE00, BASE06, 0.95),
    base02: blendHex(BASE00, BASE06, 0.82),
    base03: BASE00,
    base04: '#37474F',
    base05: '#90A4AE',
    base06: '#525252',
    base07: '#08bdba',
    base08: '#ff7eb6',
    base09: '#ee5396',
    base10: '#FF6F00',
    base11: '#0f62fe',
    base12: '#673AB7',
    base13: '#42be65',
    base14: '#be95ff',
    base15: '#FFAB91',
    blend: '#FAFAFA',
    none: 'NONE',
  };
}

export function getOxocarbon(isDark: boolean = true): OxocarbonPalette {
  return isDark ? getOxocarbonDark() : getOxocarbonLight();
}

// Terminal colors mapping
export interface TerminalColors {
  color0: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  color10: string;
  color11: string;
  color12: string;
  color13: string;
  color14: string;
  color15: string;
}

export function getTerminalColors(oxocarbon: OxocarbonPalette): TerminalColors {
  return {
    color0: oxocarbon.base01,
    color1: oxocarbon.base11,
    color2: oxocarbon.base14,
    color3: oxocarbon.base13,
    color4: oxocarbon.base09,
    color5: oxocarbon.base15,
    color6: oxocarbon.base08,
    color7: oxocarbon.base05,
    color8: oxocarbon.base03,
    color9: oxocarbon.base11,
    color10: oxocarbon.base14,
    color11: oxocarbon.base13,
    color12: oxocarbon.base09,
    color13: oxocarbon.base15,
    color14: oxocarbon.base07,
    color15: oxocarbon.base06,
  };
}

// Export default dark theme
export default getOxocarbonDark();

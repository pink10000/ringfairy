# Oxocarbon Color Utilities

This directory contains color manipulation utilities converted from Lua to TypeScript, originally from the [oxocarbon.nvim](https://github.com/nyoom-engineering/oxocarbon.nvim/) project.

## Files

- **colorutils.ts** - Core color utilities for HSLuv color space conversion and manipulation
- **index.ts** - Oxocarbon color scheme definitions (dark and light variants)
- **test.js** - Simple tests to verify the conversion works correctly

### Legacy Lua Files

- **colorutils.lua** - Original Lua implementation (kept for reference)
- **init.lua** - Original Neovim-specific implementation (kept for reference)

## Usage

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Features

The TypeScript conversion provides:

- **Color space conversions**: RGB ↔ HSLuv ↔ Hex
- **Color manipulation**: blend, lighten, darken, saturate, desaturate, rotate
- **Gradient generation**: Create smooth color gradients
- **Palette generation**: Generate random color palettes
- **Oxocarbon themes**: Pre-defined dark and light color schemes

## Example

```typescript
import { blendHex, lightenHex, darkenHex } from './colorutils';
import { getOxocarbon } from './index';

// Blend two colors
const blended = blendHex('#161616', '#ffffff', 0.5);

// Lighten a color by 30%
const lightened = lightenHex('#ff0000', 0.3);

// Get oxocarbon dark theme
const theme = getOxocarbon(true);
console.log(theme.base00); // Background color
```

## License

See the LICENSE file in this directory for the original oxocarbon.nvim license.

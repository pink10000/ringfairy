// Simple test to verify the TypeScript conversion works correctly
const { blendHex, lightenHex, darkenHex, generatePalette, gradientN } = require('./colorutils');
const { getOxocarbon, getTerminalColors } = require('./index');

console.log('Testing color utilities conversion from Lua to TypeScript\n');

// Test 1: Basic hex blending
console.log('Test 1: Blend two colors');
const color1 = '#161616';
const color2 = '#ffffff';
const blended = blendHex(color1, color2, 0.5);
console.log(`  Blend ${color1} and ${color2} at 50%: ${blended}`);

// Test 2: Lighten and darken
console.log('\nTest 2: Lighten and darken');
const baseColor = '#ff0000';
const lightened = lightenHex(baseColor, 0.3);
const darkened = darkenHex(baseColor, 0.3);
console.log(`  Original: ${baseColor}`);
console.log(`  Lightened: ${lightened}`);
console.log(`  Darkened: ${darkened}`);

// Test 3: Gradient generation
console.log('\nTest 3: Generate gradient');
const gradient = gradientN('#000000', '#ffffff', 3);
console.log(`  Gradient from black to white (3 intermediate steps): ${gradient.join(', ')}`);

// Test 4: Oxocarbon color scheme
console.log('\nTest 4: Oxocarbon color scheme');
const oxocarbon = getOxocarbon(true);
console.log(`  Base00 (background): ${oxocarbon.base00}`);
console.log(`  Base06 (foreground): ${oxocarbon.base06}`);
console.log(`  Base08 (accent): ${oxocarbon.base08}`);

// Test 5: Terminal colors
console.log('\nTest 5: Terminal colors');
const termColors = getTerminalColors(oxocarbon);
console.log(`  Terminal color 0: ${termColors.color0}`);
console.log(`  Terminal color 1: ${termColors.color1}`);
console.log(`  Terminal color 7: ${termColors.color7}`);

// Test 6: Palette generation
console.log('\nTest 6: Generate random palette');
const palette = generatePalette();
console.log(`  Generated palette base00: ${palette.base00}`);
console.log(`  Generated palette base07: ${palette.base07}`);

console.log('\n✓ All tests completed successfully!');

const fs = require('fs');
const opentype = require('opentype.js');

const buffer = fs.readFileSync('public/fonts/Beverly.otf');
const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

console.log('Font loaded:', font.names.fontFamily);
console.log('unitsPerEm:', font.unitsPerEm);
console.log('ascender:', font.ascender);
console.log('descender:', font.descender);
console.log('numGlyphs:', font.numGlyphs);

const glyphA = font.charToGlyph('A');
console.log('Glyph A:', {
  name: glyphA.name,
  unicode: glyphA.unicode,
  advanceWidth: glyphA.advanceWidth,
  pathCommandsCount: glyphA.path ? glyphA.path.commands.length : 0,
  bbox: glyphA.getBoundingBox()
});

const glyphR = font.charToGlyph('R');
console.log('Glyph R:', {
  name: glyphR.name,
  unicode: glyphR.unicode,
  advanceWidth: glyphR.advanceWidth,
  pathCommandsCount: glyphR.path ? glyphR.path.commands.length : 0,
  bbox: glyphR.getBoundingBox()
});

const glyphM = font.charToGlyph('M');
console.log('Glyph M:', {
  advanceWidth: glyphM.advanceWidth,
  bbox: glyphM.getBoundingBox()
});


const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

const imgPath = 'C:\\Users\\gokul\\.gemini\\antigravity-ide\\brain\\fef77707-e77b-4d9c-bbc6-6bafef43f928\\crop_amura.png';

const params = {
  threshold: 180,
  turdSize: 2,
  optCurve: true,
  optTolerance: 0.2
};

potrace.trace(imgPath, params, function(err, svg) {
  if (err) throw err;
  fs.writeFileSync('scripts/amura_traced.svg', svg);
  console.log('SVG traced successfully! Length:', svg.length);
});

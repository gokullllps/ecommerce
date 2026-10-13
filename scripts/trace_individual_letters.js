const potrace = require('potrace');
const fs = require('fs');

const params = {
  threshold: 180,
  turdSize: 1,
  optCurve: true,
  optTolerance: 0.1
};

potrace.trace('scripts/crop_letter_A.png', params, (err, svgA) => {
  if (err) throw err;
  fs.writeFileSync('scripts/letter_A.svg', svgA);
  console.log('Letter A traced successfully! Length:', svgA.length);
});

potrace.trace('scripts/crop_letter_R.png', params, (err, svgR) => {
  if (err) throw err;
  fs.writeFileSync('scripts/letter_R.svg', svgR);
  console.log('Letter R traced successfully! Length:', svgR.length);
});

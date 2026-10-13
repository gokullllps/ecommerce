const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'sections', 'HeroSection.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Update -ml-[10vw] sm:-ml-[14vw] lg:-ml-[15vw] to -ml-[12.5vw] sm:-ml-[16.5vw] lg:-ml-[17.5vw]
content = content.replaceAll(
  '-ml-[10vw] sm:-ml-[14vw] lg:-ml-[15vw]',
  '-ml-[12.5vw] sm:-ml-[16.5vw] lg:-ml-[17.5vw]'
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated model positioning slightly to the left!');

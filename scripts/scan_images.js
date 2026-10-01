const fs = require('fs');
const path = require('path');

const matchedFiles = [];
function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', '.system_generated', 'brain'].includes(e.name)) continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) scan(f);
    else if (/\.(json|ts|tsx|js|jsx|css|scss|html|md)$/i.test(e.name)) {
      const content = fs.readFileSync(f, 'utf8');
      if (/(\/images\/|\/uploads\/|['"][^'"]+\.(png|jpg|jpeg))/i.test(content)) {
        matchedFiles.push(f);
      }
    }
  }
}
scan('.');
console.log('Total files containing image references:', matchedFiles.length);
console.log(matchedFiles);

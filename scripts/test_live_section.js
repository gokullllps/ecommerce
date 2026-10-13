const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const svgA = fs.readFileSync('scripts/letter_A.svg', 'utf8');
const svgR = fs.readFileSync('scripts/letter_R.svg', 'utf8');

const pathA = svgA.match(/d="([^"]+)"/)[1];
const pathR = svgR.match(/d="([^"]+)"/)[1];

function buildNewArrivalsSvg() {
  return `
<svg viewBox="0 0 1340 170" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" class="editorial-heading-svg" style="display: block; width: auto; height: 100%; max-width: 100%; overflow: visible;" aria-hidden="true">
  <!-- "NEW" -->
  <g class="word-new" transform="translate(0, 0)">
    <!-- N -->
    <g transform="translate(0, 0)">
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <rect x="8" y="151" width="28" height="2" stroke="none" />
      <line x1="31.5" y1="32" x2="88" y2="153" stroke-width="1.8" />
      <rect x="88" y="32" width="13.5" height="121" stroke="none" />
      <rect x="78" y="32" width="28" height="2" stroke="none" />
      <rect x="78" y="151" width="28" height="2" stroke="none" />
    </g>

    <!-- E -->
    <g transform="translate(122, 0)">
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <rect x="8" y="151" width="28" height="2" stroke="none" />
      <line x1="31.5" y1="33" x2="82" y2="33" stroke-width="1.8" />
      <polygon points="79,33 82,33 82,46 79.5,46" stroke="none" />
      <line x1="31.5" y1="92" x2="70" y2="92" stroke-width="1.8" />
      <line x1="31.5" y1="152" x2="84" y2="152" stroke-width="1.8" />
      <polygon points="81,152 84,152 84,139 81.5,139" stroke="none" />
    </g>

    <!-- W -->
    <g transform="translate(224, 0)">
      <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
      <rect x="6" y="32" width="26" height="2" stroke="none" />
      <line x1="48" y1="153" x2="72" y2="32" stroke-width="1.8" />
      <polygon points="68,32 82,32 106,153 92,153" stroke="none" />
      <line x1="104" y1="153" x2="128" y2="32" stroke-width="1.8" />
      <rect x="120" y="32" width="22" height="2" stroke="none" />
    </g>
  </g>

  <!-- "ARRIVALS" -->
  <g class="word-arrivals" transform="translate(425, 0)">
    <!-- A1 -->
    <g transform="translate(0, 0)">
      <path d="${pathA}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- R1 -->
    <g transform="translate(170, 0)">
      <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- R2 -->
    <g transform="translate(286, 0)">
      <path d="${pathR}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- I -->
    <g transform="translate(406, 0)">
      <rect x="16" y="32" width="13.5" height="121" stroke="none" />
      <rect x="6" y="32" width="33.5" height="2" stroke="none" />
      <rect x="6" y="151" width="33.5" height="2" stroke="none" />
    </g>

    <!-- V -->
    <g transform="translate(458, 0)">
      <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
      <rect x="6" y="32" width="26" height="2" stroke="none" />
      <line x1="48" y1="153" x2="76" y2="32" stroke-width="1.8" />
      <rect x="68" y="32" width="22" height="2" stroke="none" />
    </g>

    <!-- A2 -->
    <g transform="translate(556, 0)">
      <path d="${pathA}" stroke="none" fill="currentColor" fill-rule="evenodd" />
    </g>

    <!-- L -->
    <g transform="translate(726, 0)">
      <rect x="18" y="32" width="13.5" height="121" stroke="none" />
      <rect x="8" y="32" width="28" height="2" stroke="none" />
      <line x1="31.5" y1="152" x2="70" y2="152" stroke-width="1.8" />
      <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
    </g>

    <!-- S -->
    <g transform="translate(806, 0)">
      <path d="
        M 62 48
        C 56 38, 45 32, 34 32
        C 20 32, 8 40, 8 54
        C 8 68, 20 76, 36 82
        C 54 88, 66 96, 66 112
        C 66 128, 50 138, 32 138
        C 18 138, 6 128, 2 116
        L 6 112
        C 10 123, 20 133, 33 133
        C 46 133, 58 125, 58 112
        C 58 98, 44 91, 26 85
        C 12 79, 2 69, 2 54
        C 2 38, 16 27, 34 27
        C 48 27, 60 35, 64 45 Z
      " stroke="none" />
      <circle cx="63" cy="47" r="3.2" stroke="none" />
      <circle cx="4" cy="114" r="3.2" stroke="none" />
    </g>
  </g>
</svg>
`;
}

// Export the SVG string for use in React components
fs.writeFileSync('scripts/new_arrivals_svg.raw.html', buildNewArrivalsSvg());
console.log('Saved raw SVG');

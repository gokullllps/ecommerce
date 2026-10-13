const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// We will use standard coordinates:
// Cap Height = 100 (from Y=20 to Y=120)
// Baseline = Y=120
// Stem thickness = 14
// Hairline stroke-width = 1.6
// Flat serif height = 1.6

function getLetterA(xOffset = 0) {
  // Directly modeled from crop_amura.png
  // Apex at x=45, y=20
  // Left hairline goes down to (32, 72)
  // Swash loops left to (18, 72), down to (4, 100), loops under baseline to (12, 138), sweeps up-left to (-16, 110)
  // with leaf finial at (-26, 92)
  // Crossbar at y=76
  // Right stem: thick polygon from (45, 20) to (76, 120), thickness 14
  // Base serif at (52, 120) to (96, 120)
  // Top apex serif at (24, 20) to (50, 20)
  return `
    <g transform="translate(${xOffset}, 0)">
      <!-- Top apex serif -->
      <line x1="22" y1="20" x2="48" y2="20" stroke-width="1.6" />
      
      <!-- Right Thick Stem -->
      <polygon points="40,20 54,20 84,120 70,120" stroke="none" />
      <!-- Base serif -->
      <line x1="56" y1="120" x2="98" y2="120" stroke-width="1.8" />

      <!-- Hairline upper-left stem -->
      <line x1="40" y1="20" x2="26" y2="72" stroke-width="1.6" />

      <!-- Signature AMURA Swan-Neck Swash Loop (exact curve matching crop_amura.png) -->
      <!-- Curves horizontally left, arcs down through baseline, swoops up-left into tapering sharp tip -->
      <path d="
        M 26 72
        C 20 72, 14 74, 10 82
        C 5 92, 5 106, 10 120
        C 16 134, 28 140, 42 136
        C 52 133, 56 122, 54 114
        C 52 106, 44 102, 36 104
        C 30 106, 28 112, 32 116
        C 34 118, 38 118, 40 115
        C 40 113, 38 112, 36 113
        C 34 114, 33 112, 34 110
        C 37 106, 46 108, 46 116
        C 45 126, 36 133, 26 131
        C 14 129, 6 118, 4 106
        C 2 92, 8 78, 18 72
        C 22 70, 26 71, 26 72 Z
      " stroke="none" />

      <!-- Horizontal Hairline Crossbar -->
      <line x1="16" y1="74" x2="68" y2="74" stroke-width="1.6" />
    </g>
  `;
}

// Let's refine the A swash path to make it a pure single-stroke tapering contour matching crop_amura.png!

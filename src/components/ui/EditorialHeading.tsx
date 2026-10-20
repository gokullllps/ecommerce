import React from "react";

// Path definitions directly extracted and calibrated from Image 2 reference (AMURA by ravine.brand)
const PATH_A = "M 87.483 31.973 C 87.832 32.538, 91.016 33, 94.559 33 C 98.102 33, 100.998 33.337, 100.995 33.750 C 100.992 34.163, 99.390 38.775, 97.434 44 C 95.479 49.225, 93.063 55.750, 92.066 58.500 C 91.069 61.250, 86.822 72.854, 82.627 84.287 C 75.560 103.549, 73.575 110.049, 76.069 105.769 C 77.835 102.739, 85.655 98.891, 91.203 98.323 C 99.164 97.507, 104.706 99.420, 110.150 104.865 C 113.661 108.375, 115.226 110.969, 116.521 115.423 C 117.733 119.593, 118.047 122.943, 117.590 126.830 C 116.351 137.377, 108.693 147.213, 99.205 150.446 C 92.374 152.773, 83.492 152.444, 77.500 149.642 C 71.707 146.932, 65.218 140.245, 62.807 134.500 C 55.268 116.533, 52.229 110.141, 49.541 106.597 C 45.264 100.958, 38.232 96.441, 32.510 95.656 C 27.704 94.998, 19.998 95.750, 20.002 96.878 C 20.003 97.220, 21.457 97.603, 23.234 97.728 C 30.096 98.212, 34.386 104.115, 41.001 122.174 C 43.282 128.403, 46.237 135.375, 47.567 137.666 C 50.822 143.272, 57.152 148.511, 63.921 151.202 C 68.689 153.097, 71.463 153.425, 83 153.460 C 94.734 153.495, 97.105 153.220, 101.122 151.363 C 107.427 148.448, 113.080 143.119, 116.011 137.330 C 117.809 133.776, 118.556 130.436, 118.836 124.692 C 119.185 117.548, 118.949 116.338, 116.063 110.477 C 112.671 103.586, 108.277 99.311, 101.031 95.851 C 97.616 94.220, 94.590 93.680, 88.750 93.659 C 84.487 93.644, 81 93.523, 81 93.391 C 81 92.698, 100.954 38.905, 101.716 37.544 C 102.374 36.368, 108.586 50.967, 124.939 92.114 C 137.217 123.011, 147.481 149.125, 147.748 150.145 C 148.187 151.824, 147.554 152, 141.058 152 C 136.528 152, 134.110 152.369, 134.500 153 C 135.311 154.312, 177.662 154.356, 178.471 153.046 C 178.817 152.487, 176.256 151.970, 172.280 151.796 L 165.500 151.500 165.255 95 C 165.095 58.095, 165.348 39.020, 165.984 40 C 166.519 40.825, 170.454 49.354, 174.728 58.953 L 182.500 76.405 182.774 59.031 C 183.027 43.029, 182.874 41.235, 180.840 36.328 L 178.632 31 164.066 31.199 C 156.055 31.308, 152.762 31.553, 156.750 31.743 L 164 32.088 164 91.210 C 164 123.728, 163.807 150.140, 163.571 149.904 C 163.335 149.668, 154.596 127.881, 144.151 101.488 C 133.705 75.094, 123.164 48.550, 120.726 42.500 L 116.293 31.500 101.571 31.223 C 91.684 31.037, 87.057 31.283, 87.483 31.973";

const PATH_R = "M 11.471 31.952 C 11.827 32.529, 15.066 33, 18.669 33 L 25.220 33 24.720 69.250 C 24.174 108.860, 23.584 113.881, 18.104 125.592 C 14.911 132.416, 8.706 139.783, 3.379 143.075 C 0.233 145.019, -1.229 148, 0.963 148 C 2.962 148, 14.714 135.942, 17.242 131.297 C 18.691 128.635, 21.118 122.416, 22.635 117.478 L 25.394 108.500 25.767 70.500 L 26.139 32.500 33.070 32.832 L 40 33.164 40 92.582 L 40 152 34 152 C 30.667 152, 28 152.444, 28 153 C 28 153.633, 35.333 154, 48 154 C 60.667 154, 68 153.633, 68 153 C 68 152.436, 65.167 152, 61.500 152 L 55 152 55 138.182 C 55 128.829, 55.483 122.736, 56.495 119.328 C 59.407 109.522, 68.638 102.078, 82.202 98.598 C 89.629 96.692, 93.881 97.820, 97.976 102.785 C 99.662 104.828, 102.857 111.225, 105.077 117 C 107.297 122.775, 110.078 129.975, 111.256 133 C 112.656 136.593, 115.188 140.258, 118.561 143.571 C 123.634 148.555, 129.426 151.907, 130.723 150.611 C 131.085 150.248, 131.348 147.760, 131.308 145.080 C 131.258 141.773, 129.876 136.895, 127.007 129.898 C 120.451 113.911, 118.100 109.395, 113.769 104.475 C 109.593 99.731, 103.549 96, 100.040 96 C 97.092 96, 97.533 94.334, 100.691 93.541 C 106.063 92.193, 115.596 86.788, 119.745 82.738 C 125.795 76.832, 127.276 72.250, 126.850 60.763 C 126.538 52.352, 126.177 50.816, 123.500 46.515 C 119.646 40.322, 114.925 36.563, 107.467 33.750 C 101.648 31.556, 100.377 31.493, 56.162 31.202 C 24.743 30.996, 11.022 31.226, 11.471 31.952 M 55.750 32.562 C 55.337 32.986, 55.024 52.046, 55.052 74.917 C 55.102 114.351, 55.193 116.371, 56.802 114.009 C 62.686 105.375, 69.766 100.456, 82 96.500 C 95.477 92.142, 104.367 85.594, 108.175 77.218 C 111.038 70.921, 111.635 60.696, 109.556 53.546 C 108.198 48.873, 106.713 46.554, 102.178 42.024 C 94.291 34.145, 90.296 32.875, 71.500 32.272 C 63.250 32.008, 56.163 32.138, 55.750 32.562 M 0.079 146.583 C 0.127 147.748, 0.364 147.985, 0.683 147.188 C 0.972 146.466, 0.936 145.603, 0.604 145.271 C 0.272 144.939, 0.036 145.529, 0.079 146.583";

interface EditorialHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
}

export function EditorialHeading({
  text,
  as: Component = "h2",
  className = "h-8 sm:h-10 md:h-12 text-[#111111]",
  style,
}: EditorialHeadingProps) {
  const normalized = text.trim().toUpperCase();

  // 1. NEW ARRIVALS — Full Bespoke Sculptural Editorial Artwork
  if (normalized === "NEW ARRIVALS") {
    return (
      <div className={`relative inline-flex items-center select-none ${className}`} style={style}>
        <Component className="sr-only">NEW ARRIVALS</Component>
        <svg
          viewBox="0 0 1340 170"
          fill="currentColor"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto max-w-full overflow-visible"
          aria-hidden="true"
        >
          {/* "NEW" */}
          <g className="word-new" transform="translate(0, 0)">
            {/* N */}
            <g transform="translate(0, 0)">
              <rect x="18" y="32" width="13.5" height="121" stroke="none" />
              <rect x="8" y="32" width="28" height="2" stroke="none" />
              <rect x="8" y="151" width="28" height="2" stroke="none" />
              <line x1="31.5" y1="32" x2="88" y2="153" strokeWidth="1.8" />
              <rect x="88" y="32" width="13.5" height="121" stroke="none" />
              <rect x="78" y="32" width="28" height="2" stroke="none" />
              <rect x="78" y="151" width="28" height="2" stroke="none" />
            </g>

            {/* E */}
            <g transform="translate(122, 0)">
              <rect x="18" y="32" width="13.5" height="121" stroke="none" />
              <rect x="8" y="32" width="28" height="2" stroke="none" />
              <rect x="8" y="151" width="28" height="2" stroke="none" />
              <line x1="31.5" y1="33" x2="82" y2="33" strokeWidth="1.8" />
              <polygon points="79,33 82,33 82,46 79.5,46" stroke="none" />
              <line x1="31.5" y1="92" x2="70" y2="92" strokeWidth="1.8" />
              <line x1="31.5" y1="152" x2="84" y2="152" strokeWidth="1.8" />
              <polygon points="81,152 84,152 84,139 81.5,139" stroke="none" />
            </g>

            {/* W */}
            <g transform="translate(224, 0)">
              <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
              <rect x="6" y="32" width="26" height="2" stroke="none" />
              <line x1="48" y1="153" x2="72" y2="32" strokeWidth="1.8" />
              <polygon points="68,32 82,32 106,153 92,153" stroke="none" />
              <line x1="104" y1="153" x2="128" y2="32" strokeWidth="1.8" />
              <rect x="120" y="32" width="22" height="2" stroke="none" />
            </g>
          </g>

          {/* "ARRIVALS" */}
          <g className="word-arrivals" transform="translate(425, 0)">
            {/* A1 (Signature AMURA Swan-Neck Swash) */}
            <g transform="translate(0, 0)">
              <path d={PATH_A} stroke="none" fill="currentColor" fillRule="evenodd" />
            </g>

            {/* R1 (Signature AMURA Organic Wave Ribbon Leg) */}
            <g transform="translate(170, 0)">
              <path d={PATH_R} stroke="none" fill="currentColor" fillRule="evenodd" />
            </g>

            {/* R2 (Signature AMURA Organic Wave Ribbon Leg) */}
            <g transform="translate(286, 0)">
              <path d={PATH_R} stroke="none" fill="currentColor" fillRule="evenodd" />
            </g>

            {/* I */}
            <g transform="translate(406, 0)">
              <rect x="16" y="32" width="13.5" height="121" stroke="none" />
              <rect x="6" y="32" width="33.5" height="2" stroke="none" />
              <rect x="6" y="151" width="33.5" height="2" stroke="none" />
            </g>

            {/* V */}
            <g transform="translate(458, 0)">
              <polygon points="12,32 26,32 50,153 36,153" stroke="none" />
              <rect x="6" y="32" width="26" height="2" stroke="none" />
              <line x1="48" y1="153" x2="76" y2="32" strokeWidth="1.8" />
              <rect x="68" y="32" width="22" height="2" stroke="none" />
            </g>

            {/* A2 (Signature AMURA Swan-Neck Swash) */}
            <g transform="translate(556, 0)">
              <path d={PATH_A} stroke="none" fill="currentColor" fillRule="evenodd" />
            </g>

            {/* L */}
            <g transform="translate(726, 0)">
              <rect x="18" y="32" width="13.5" height="121" stroke="none" />
              <rect x="8" y="32" width="28" height="2" stroke="none" />
              <line x1="31.5" y1="152" x2="70" y2="152" strokeWidth="1.8" />
              <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
            </g>

            {/* S */}
            <g transform="translate(806, 0)">
              <path
                d="
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
                "
                stroke="none"
              />
              <circle cx="63" cy="47" r="3.2" stroke="none" />
              <circle cx="4" cy="114" r="3.2" stroke="none" />
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // 2. BESTSELLERS
  if (normalized === "BESTSELLERS") {
    return (
      <div className={`relative inline-flex items-center select-none ${className}`} style={style}>
        <Component className="sr-only">BESTSELLERS</Component>
        <svg
          viewBox="0 0 1150 170"
          fill="currentColor"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto max-w-full overflow-visible"
          aria-hidden="true"
        >
          {/* B */}
          <g transform="translate(0, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <rect x="8" y="151" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="33" x2="62" y2="33" strokeWidth="1.8" />
            <path d="M 62 33 C 78 33, 86 42, 86 56 C 86 68, 76 77, 60 77 L 31.5 77 L 31.5 75 L 60 75 C 74 75, 83 67, 83 56 C 83 44, 76 35, 62 35 Z" stroke="none" />
            <line x1="31.5" y1="77" x2="64" y2="77" strokeWidth="1.8" />
            <path d="M 64 77 C 82 77, 92 88, 92 106 C 92 126, 80 152, 60 152 L 31.5 152 L 31.5 150 L 60 150 C 78 150, 89 125, 89 106 C 89 90, 80 79, 64 79 Z" stroke="none" />
            <line x1="31.5" y1="152" x2="60" y2="152" strokeWidth="1.8" />
          </g>
          {/* E */}
          <g transform="translate(108, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <rect x="8" y="151" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="33" x2="80" y2="33" strokeWidth="1.8" />
            <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
            <line x1="31.5" y1="92" x2="68" y2="92" strokeWidth="1.8" />
            <line x1="31.5" y1="152" x2="82" y2="152" strokeWidth="1.8" />
            <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
          </g>
          {/* S */}
          <g transform="translate(204, 0)">
            <path d="M 58 48 C 52 38, 42 32, 32 32 C 18 32, 8 40, 8 54 C 8 68, 20 76, 34 82 C 52 88, 62 96, 62 112 C 62 128, 48 138, 30 138 C 16 138, 6 128, 2 116 L 6 112 C 10 123, 19 133, 31 133 C 44 133, 54 125, 54 112 C 54 98, 42 91, 24 85 C 10 79, 2 69, 2 54 C 2 38, 15 27, 32 27 C 46 27, 56 35, 60 45 Z" stroke="none" />
            <circle cx="59" cy="47" r="3" stroke="none" />
            <circle cx="4" cy="114" r="3" stroke="none" />
          </g>
          {/* T */}
          <g transform="translate(278, 0)">
            <rect x="36" y="32" width="13.5" height="121" stroke="none" />
            <rect x="26" y="151" width="33.5" height="2" stroke="none" />
            <line x1="4" y1="33" x2="82" y2="33" strokeWidth="1.8" />
            <polygon points="4,33 4,45 6.5,45 6.5,33" stroke="none" />
            <polygon points="79.5,33 79.5,45 82,45 82,33" stroke="none" />
          </g>
          {/* S */}
          <g transform="translate(372, 0)">
            <path d="M 58 48 C 52 38, 42 32, 32 32 C 18 32, 8 40, 8 54 C 8 68, 20 76, 34 82 C 52 88, 62 96, 62 112 C 62 128, 48 138, 30 138 C 16 138, 6 128, 2 116 L 6 112 C 10 123, 19 133, 31 133 C 44 133, 54 125, 54 112 C 54 98, 42 91, 24 85 C 10 79, 2 69, 2 54 C 2 38, 15 27, 32 27 C 46 27, 56 35, 60 45 Z" stroke="none" />
            <circle cx="59" cy="47" r="3" stroke="none" />
            <circle cx="4" cy="114" r="3" stroke="none" />
          </g>
          {/* E */}
          <g transform="translate(444, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <rect x="8" y="151" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="33" x2="80" y2="33" strokeWidth="1.8" />
            <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
            <line x1="31.5" y1="92" x2="68" y2="92" strokeWidth="1.8" />
            <line x1="31.5" y1="152" x2="82" y2="152" strokeWidth="1.8" />
            <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
          </g>
          {/* L */}
          <g transform="translate(540, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="152" x2="70" y2="152" strokeWidth="1.8" />
            <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
          </g>
          {/* L */}
          <g transform="translate(615, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="152" x2="70" y2="152" strokeWidth="1.8" />
            <polygon points="67,152 70,152 70,139 67.5,139" stroke="none" />
          </g>
          {/* E */}
          <g transform="translate(690, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <rect x="8" y="151" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="33" x2="80" y2="33" strokeWidth="1.8" />
            <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
            <line x1="31.5" y1="92" x2="68" y2="92" strokeWidth="1.8" />
            <line x1="31.5" y1="152" x2="82" y2="152" strokeWidth="1.8" />
            <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
          </g>
          {/* R (Signature AMURA Wave Ribbon Leg) */}
          <g transform="translate(775, 0)">
            <path d={PATH_R} stroke="none" fill="currentColor" fillRule="evenodd" />
          </g>
          {/* S */}
          <g transform="translate(900, 0)">
            <path d="M 58 48 C 52 38, 42 32, 32 32 C 18 32, 8 40, 8 54 C 8 68, 20 76, 34 82 C 52 88, 62 96, 62 112 C 62 128, 48 138, 30 138 C 16 138, 6 128, 2 116 L 6 112 C 10 123, 19 133, 31 133 C 44 133, 54 125, 54 112 C 54 98, 42 91, 24 85 C 10 79, 2 69, 2 54 C 2 38, 15 27, 32 27 C 46 27, 56 35, 60 45 Z" stroke="none" />
            <circle cx="59" cy="47" r="3" stroke="none" />
            <circle cx="4" cy="114" r="3" stroke="none" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. CATEGORIES
  if (normalized === "CATEGORIES") {
    return (
      <div className={`relative inline-flex items-center select-none ${className}`} style={style}>
        <Component className="sr-only">CATEGORIES</Component>
        <svg
          viewBox="0 0 1080 170"
          fill="currentColor"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto max-w-full overflow-visible"
          aria-hidden="true"
        >
          {/* C */}
          <g transform="translate(0, 0)">
            <path d="M 80 48 C 72 36, 60 30, 46 30 C 22 30, 6 48, 6 92 C 6 136, 22 154, 46 154 C 60 154, 72 148, 80 136 L 76 132 C 68 142, 58 148, 46 148 C 28 148, 14 130, 14 92 C 14 54, 28 36, 46 36 C 58 36, 68 42, 76 52 Z" stroke="none" />
            <circle cx="80" cy="46" r="3.2" stroke="none" />
            <circle cx="80" cy="138" r="3.2" stroke="none" />
          </g>
          {/* A (Signature AMURA) */}
          <g transform="translate(70, 0)">
            <path d={PATH_A} stroke="none" fill="currentColor" fillRule="evenodd" />
          </g>
          {/* T */}
          <g transform="translate(230, 0)">
            <rect x="36" y="32" width="13.5" height="121" stroke="none" />
            <rect x="26" y="151" width="33.5" height="2" stroke="none" />
            <line x1="4" y1="33" x2="82" y2="33" strokeWidth="1.8" />
            <polygon points="4,33 4,45 6.5,45 6.5,33" stroke="none" />
            <polygon points="79.5,33 79.5,45 82,45 82,33" stroke="none" />
          </g>
          {/* E */}
          <g transform="translate(320, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <rect x="8" y="151" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="33" x2="80" y2="33" strokeWidth="1.8" />
            <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
            <line x1="31.5" y1="92" x2="68" y2="92" strokeWidth="1.8" />
            <line x1="31.5" y1="152" x2="82" y2="152" strokeWidth="1.8" />
            <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
          </g>
          {/* G */}
          <g transform="translate(416, 0)">
            <path d="M 82 48 C 74 36, 62 30, 48 30 C 22 30, 6 48, 6 92 C 6 136, 22 154, 48 154 C 64 154, 76 146, 82 134 L 82 96 L 46 96 L 46 98 L 76 98 L 76 132 C 70 142, 60 148, 48 148 C 28 148, 14 130, 14 92 C 14 54, 28 36, 48 36 C 60 36, 70 42, 78 52 Z" stroke="none" />
            <circle cx="82" cy="46" r="3.2" stroke="none" />
          </g>
          {/* O */}
          <g transform="translate(516, 0)">
            <path d="M 48 30 C 22 30, 6 48, 6 92 C 6 136, 22 154, 48 154 C 74 154, 90 136, 90 92 C 90 48, 74 30, 48 30 Z M 48 36 C 64 36, 80 52, 80 92 C 80 132, 64 148, 48 148 C 32 148, 16 132, 16 92 C 16 52, 32 36, 48 36 Z" stroke="none" />
          </g>
          {/* R (Signature AMURA Wave Ribbon Leg) */}
          <g transform="translate(620, 0)">
            <path d={PATH_R} stroke="none" fill="currentColor" fillRule="evenodd" />
          </g>
          {/* I */}
          <g transform="translate(745, 0)">
            <rect x="16" y="32" width="13.5" height="121" stroke="none" />
            <rect x="6" y="32" width="33.5" height="2" stroke="none" />
            <rect x="6" y="151" width="33.5" height="2" stroke="none" />
          </g>
          {/* E */}
          <g transform="translate(795, 0)">
            <rect x="18" y="32" width="13.5" height="121" stroke="none" />
            <rect x="8" y="32" width="28" height="2" stroke="none" />
            <rect x="8" y="151" width="28" height="2" stroke="none" />
            <line x1="31.5" y1="33" x2="80" y2="33" strokeWidth="1.8" />
            <polygon points="77,33 80,33 80,46 77.5,46" stroke="none" />
            <line x1="31.5" y1="92" x2="68" y2="92" strokeWidth="1.8" />
            <line x1="31.5" y1="152" x2="82" y2="152" strokeWidth="1.8" />
            <polygon points="79,152 82,152 82,139 79.5,139" stroke="none" />
          </g>
          {/* S */}
          <g transform="translate(890, 0)">
            <path d="M 58 48 C 52 38, 42 32, 32 32 C 18 32, 8 40, 8 54 C 8 68, 20 76, 34 82 C 52 88, 62 96, 62 112 C 62 128, 48 138, 30 138 C 16 138, 6 128, 2 116 L 6 112 C 10 123, 19 133, 31 133 C 44 133, 54 125, 54 112 C 54 98, 42 91, 24 85 C 10 79, 2 69, 2 54 C 2 38, 15 27, 32 27 C 46 27, 56 35, 60 45 Z" stroke="none" />
            <circle cx="59" cy="47" r="3" stroke="none" />
            <circle cx="4" cy="114" r="3" stroke="none" />
          </g>
        </svg>
      </div>
    );
  }

  // Fallback for general editorial headings
  return (
    <Component
      className={`font-normal uppercase tracking-[0.03em] ${className}`}
      style={{
        fontFamily: "'Orborn', sans-serif",
        fontKerning: "normal",
        ...style,
      }}
    >
      {text}
    </Component>
  );
}

export default EditorialHeading;

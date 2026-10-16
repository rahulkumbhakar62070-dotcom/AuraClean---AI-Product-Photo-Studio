import { ProductSample } from '../types';

function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

// 1. Luxury Perfume Bottle with cluttered marble/bathroom background
const perfumeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Background cluttered marble & ambient light -->
    <linearGradient id="p-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2d9d0"/>
      <stop offset="40%" stop-color="#c9beaf"/>
      <stop offset="70%" stop-color="#b0a394"/>
      <stop offset="100%" stop-color="#8c7e6d"/>
    </linearGradient>
    <radialGradient id="p-light" cx="30%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
    </radialGradient>
    <!-- Bottle glass gradient -->
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="15%" stop-color="#fdfbf7" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#eddac2" stop-opacity="0.75"/>
      <stop offset="85%" stop-color="#fdfbf7" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#c29a6e" stop-opacity="0.85"/>
    </linearGradient>
    <!-- Fragrance fluid -->
    <linearGradient id="amber-fluid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <!-- Gold Cap -->
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="25%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="75%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <!-- Filter for realistic blur and shadow -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#2d2218" flood-opacity="0.45"/>
    </filter>
    <filter id="bg-blur">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>

  <!-- Cluttered background elements (to be removed) -->
  <rect width="800" height="800" fill="url(#p-bg)"/>
  <rect width="800" height="800" fill="url(#p-light)"/>
  
  <!-- Background blur objects (soap dish, mirror frame, wall tiles) -->
  <g filter="url(#bg-blur)" opacity="0.45">
    <circle cx="150" cy="200" r="120" fill="#9a8c7b"/>
    <rect x="580" y="80" width="160" height="300" rx="20" fill="#786c5e"/>
    <ellipse cx="680" cy="550" rx="90" ry="40" fill="#524639"/>
    <path d="M 0,550 Q 400,530 800,560 L 800,800 L 0,800 Z" fill="#695c4d"/>
  </g>

  <!-- Table surface divide -->
  <rect x="0" y="580" width="800" height="220" fill="#5a4c3e" opacity="0.4"/>

  <!-- Dust specks & background noise to clean -->
  <circle cx="280" cy="480" r="2.5" fill="#ffffff" opacity="0.7"/>
  <circle cx="520" cy="440" r="3" fill="#ffffff" opacity="0.5"/>
  <circle cx="340" cy="380" r="1.5" fill="#453222" opacity="0.6"/>
  <circle cx="490" cy="520" r="2" fill="#ffffff" opacity="0.8"/>

  <!-- Cast Shadow -->
  <ellipse cx="400" cy="625" rx="140" ry="24" fill="#1b120c" opacity="0.65" filter="url(#bg-blur)"/>

  <!-- Bottle Body -->
  <g id="product-subject">
    <!-- Fluid inside -->
    <rect x="290" y="360" width="220" height="230" rx="24" fill="url(#amber-fluid)" opacity="0.85"/>
    <ellipse cx="400" cy="360" rx="110" ry="14" fill="#fde68a" opacity="0.4"/>

    <!-- Outer Glass Flacon -->
    <rect x="270" y="320" width="260" height="290" rx="36" fill="url(#glass)" stroke="#ffffff" stroke-width="2" filter="url(#shadow)"/>
    
    <!-- Glass Reflections & Facets -->
    <path d="M 285,340 L 305,340 L 305,585 L 285,575 Z" fill="#ffffff" opacity="0.7"/>
    <path d="M 505,340 L 515,340 L 515,575 L 505,585 Z" fill="#ffffff" opacity="0.5"/>

    <!-- Minimalist Label -->
    <rect x="325" y="420" width="150" height="90" rx="6" fill="#fefdfb" stroke="#e7e5e4" stroke-width="1.5"/>
    <text x="400" y="455" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" letter-spacing="3" fill="#1c1917" text-anchor="middle">L'AURA</text>
    <text x="400" y="475" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="500" letter-spacing="2" fill="#78716c" text-anchor="middle">EAU DE PARFUM</text>
    <text x="400" y="492" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="400" fill="#a8a29e" text-anchor="middle">100 ML · 3.4 FL.OZ</text>

    <!-- Spray Collar & Neck -->
    <rect x="370" y="275" width="60" height="50" rx="4" fill="url(#gold)" stroke="#b45309" stroke-width="1"/>
    
    <!-- Golden Cap -->
    <rect x="350" y="195" width="100" height="85" rx="8" fill="url(#gold)" stroke="#d97706" stroke-width="1.5" filter="url(#shadow)"/>
    <!-- Cap Sheen Highlight -->
    <rect x="365" y="200" width="14" height="75" rx="3" fill="#ffffff" opacity="0.6"/>
    <rect x="420" y="200" width="6" height="75" rx="2" fill="#ffffff" opacity="0.3"/>
  </g>
</svg>
`;

// 2. Modern Retro Sneaker on Street Asphalt
const sneakerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Asphalt & street pavement background -->
    <linearGradient id="street" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="40%" stop-color="#334155"/>
      <stop offset="70%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="sole" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="70%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
    <linearGradient id="leather" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="neon-teal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <filter id="street-blur">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>

  <!-- Cluttered asphalt background with pavement lines -->
  <rect width="800" height="800" fill="url(#street)"/>
  
  <!-- Asphalt texture dots and clutter -->
  <g opacity="0.3" filter="url(#street-blur)">
    <circle cx="120" cy="180" r="80" fill="#64748b"/>
    <circle cx="680" cy="220" r="110" fill="#475569"/>
    <line x1="0" y1="580" x2="800" y2="580" stroke="#facc15" stroke-width="8" stroke-dasharray="30 20"/>
    <ellipse cx="620" cy="650" rx="40" ry="15" fill="#334155"/>
  </g>

  <!-- Pavement pebble speckles to be cleaned -->
  <circle cx="210" cy="620" r="4" fill="#94a3b8"/>
  <circle cx="560" cy="590" r="3" fill="#cbd5e1"/>
  <circle cx="640" cy="610" r="5" fill="#64748b"/>
  <circle cx="170" cy="540" r="2" fill="#cbd5e1"/>

  <!-- Contact ground shadow -->
  <ellipse cx="400" cy="600" rx="260" ry="32" fill="#020617" opacity="0.8" filter="url(#street-blur)"/>

  <!-- Sneaker Graphic -->
  <g id="sneaker-product">
    <!-- Outsole Cushion Platform -->
    <path d="M 170,540 C 220,535 320,545 420,545 C 530,545 610,510 650,470 C 655,500 645,550 635,575 C 600,595 480,600 370,600 C 260,600 180,585 155,570 C 145,550 155,542 170,540 Z" fill="url(#sole)" stroke="#94a3b8" stroke-width="2"/>
    
    <!-- Neon accent wave -->
    <path d="M 230,540 Q 360,510 470,535 Q 580,510 635,480 L 640,505 Q 560,535 460,545 Q 340,545 225,555 Z" fill="url(#neon-teal)"/>

    <!-- Midsole & Upper Body -->
    <path d="M 180,540 C 160,490 200,410 240,360 C 260,335 310,310 370,300 C 400,295 440,340 470,380 C 510,405 570,430 630,460 C 645,470 640,490 620,510 C 530,520 300,535 180,540 Z" fill="url(#leather)" stroke="#334155" stroke-width="2"/>

    <!-- Heel counter & collar padding -->
    <path d="M 240,360 C 230,340 245,300 280,290 C 315,280 340,300 370,300 C 340,330 300,350 240,360 Z" fill="#f43f5e"/>

    <!-- Laces and Eyelets -->
    <path d="M 360,330 Q 390,345 420,330" stroke="#f8fafc" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 380,360 Q 410,375 445,360" stroke="#f8fafc" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 405,395 Q 435,410 475,395" stroke="#f8fafc" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M 435,430 Q 465,445 505,430" stroke="#f8fafc" stroke-width="5" stroke-linecap="round" fill="none"/>

    <!-- Dynamic Swoosh / Brand Streak -->
    <path d="M 270,460 C 340,480 430,470 540,430 C 480,470 380,510 280,485 Z" fill="#ffffff" opacity="0.95"/>

    <!-- Mesh Texture Overlay on Toe -->
    <ellipse cx="560" cy="455" rx="55" ry="30" fill="#0f172a" stroke="#1e293b" stroke-dasharray="3 3"/>
  </g>
</svg>
`;

// 3. Artisanal Ceramic Coffee Mug on Wooden Cafe Table
const ceramicMugSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Warm wood table & cafe background -->
    <linearGradient id="cafe-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451a03"/>
      <stop offset="50%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#291205"/>
    </linearGradient>
    <linearGradient id="ceramic" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fdf4ff"/>
      <stop offset="30%" stop-color="#f5e0c3"/>
      <stop offset="70%" stop-color="#e2af7b"/>
      <stop offset="100%" stop-color="#9a5b28"/>
    </linearGradient>
    <linearGradient id="coffee" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef3c7"/>
      <stop offset="35%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#78350f"/>
    </linearGradient>
    <filter id="cafe-blur">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
  </defs>

  <!-- Cafe background with bokeh lights -->
  <rect width="800" height="800" fill="url(#cafe-bg)"/>
  <g opacity="0.4" filter="url(#cafe-blur)">
    <circle cx="180" cy="180" r="70" fill="#fef08a"/>
    <circle cx="640" cy="140" r="90" fill="#fde047"/>
    <rect x="520" y="380" width="240" height="180" rx="12" fill="#522b10"/> <!-- book -->
    <line x1="0" y1="480" x2="800" y2="480" stroke="#1c0a02" stroke-width="4"/>
  </g>

  <!-- Table crumbs & smudges to clean -->
  <circle cx="210" cy="580" r="3" fill="#fef3c7" opacity="0.8"/>
  <circle cx="240" cy="610" r="2" fill="#fef3c7" opacity="0.7"/>
  <circle cx="560" cy="620" r="4" fill="#f59e0b" opacity="0.6"/>
  <ellipse cx="260" cy="540" rx="20" ry="8" fill="#1c0a02" opacity="0.3"/> <!-- coffee ring -->

  <!-- Shadow under mug -->
  <ellipse cx="400" cy="620" rx="170" ry="26" fill="#1c0a02" opacity="0.85" filter="url(#cafe-blur)"/>

  <!-- Ceramic Mug Object -->
  <g id="mug-product">
    <!-- Mug Handle -->
    <path d="M 500,380 C 590,380 610,510 500,530 C 580,500 560,400 490,400 Z" fill="#e2af7b" stroke="#78350f" stroke-width="2"/>

    <!-- Ceramic Cylindrical Vessel -->
    <path d="M 270,340 C 270,340 280,580 300,590 C 330,605 470,605 500,590 C 520,580 530,340 530,340 Z" fill="url(#ceramic)" stroke="#78350f" stroke-width="1.5"/>

    <!-- Speckled Glaze Dots (artisanal texture) -->
    <circle cx="340" cy="440" r="2" fill="#5c2c0e"/>
    <circle cx="370" cy="490" r="1.5" fill="#5c2c0e"/>
    <circle cx="450" cy="470" r="2.5" fill="#5c2c0e"/>
    <circle cx="420" cy="530" r="1.8" fill="#5c2c0e"/>

    <!-- Rim Top Opening -->
    <ellipse cx="400" cy="340" rx="130" ry="32" fill="#fef3c7" stroke="#9a5b28" stroke-width="2"/>
    
    <!-- Coffee Surface with Latte Art Heart -->
    <ellipse cx="400" cy="344" rx="120" ry="26" fill="url(#coffee)"/>
    <path d="M 400,358 C 385,340 370,345 375,338 C 385,330 400,337 400,342 C 400,337 415,330 425,338 C 430,345 415,340 400,358 Z" fill="#ffffff" opacity="0.95"/>

    <!-- Glaze highlight curve -->
    <path d="M 305,370 Q 310,480 325,570" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6"/>
  </g>
</svg>
`;

// 4. Titanium Smartwatch with Illuminated OLED
const smartwatchSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Desk clutter background -->
    <linearGradient id="desk" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="titanium" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="30%" stop-color="#cbd5e1"/>
      <stop offset="70%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="strap" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <filter id="desk-blur">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
  </defs>

  <!-- Background with keyboard/cables/mousepad blur -->
  <rect width="800" height="800" fill="url(#desk)"/>
  <g opacity="0.4" filter="url(#desk-blur)">
    <rect x="80" y="80" width="280" height="160" rx="8" fill="#475569"/> <!-- keyboard -->
    <path d="M 550,100 Q 620,300 700,400" stroke="#000000" stroke-width="8" fill="none"/> <!-- cable -->
    <circle cx="640" cy="580" r="120" fill="#1e293b"/>
  </g>

  <!-- Dust and fingerprint marks to clean -->
  <circle cx="430" cy="380" r="1.5" fill="#94a3b8" opacity="0.6"/>
  <circle cx="360" cy="420" r="2" fill="#cbd5e1" opacity="0.7"/>
  <path d="M 450,420 Q 460,430 455,445" stroke="#94a3b8" stroke-width="1.5" opacity="0.3" fill="none"/> <!-- smudge -->

  <!-- Watch Shadow -->
  <ellipse cx="400" cy="590" rx="180" ry="28" fill="#000000" opacity="0.7" filter="url(#desk-blur)"/>

  <!-- Watch Subject -->
  <g id="watch-product">
    <!-- Top Strap -->
    <path d="M 330,120 L 470,120 L 450,280 L 350,280 Z" fill="url(#strap)" stroke="#0284c7" stroke-width="2"/>
    <!-- Bottom Strap -->
    <path d="M 350,520 L 450,520 L 470,680 L 330,680 Z" fill="url(#strap)" stroke="#0284c7" stroke-width="2"/>

    <!-- Titanium Case Outer Ring -->
    <circle cx="400" cy="400" r="160" fill="url(#titanium)" stroke="#94a3b8" stroke-width="3"/>
    
    <!-- Crown Dial Button -->
    <rect x="555" y="360" width="22" height="40" rx="5" fill="url(#titanium)" stroke="#475569" stroke-width="1.5"/>
    <line x1="562" y1="365" x2="562" y2="395" stroke="#334155" stroke-width="1.5"/>

    <!-- Inner Bezel -->
    <circle cx="400" cy="400" r="135" fill="#020617" stroke="#1e293b" stroke-width="2"/>

    <!-- Watch UI Display -->
    <text x="400" y="375" font-family="'JetBrains Mono', monospace" font-size="44" font-weight="700" fill="#38bdf8" text-anchor="middle" letter-spacing="1">10:42</text>
    <text x="400" y="415" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">OCTOBER 16 · MON</text>
    
    <!-- Heart Rate & Activity Rings -->
    <circle cx="350" cy="460" r="22" fill="none" stroke="#334155" stroke-width="5"/>
    <circle cx="350" cy="460" r="22" fill="none" stroke="#ef4444" stroke-width="5" stroke-dasharray="100" stroke-dashoffset="30"/>
    <text x="350" y="465" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#ef4444" text-anchor="middle">72</text>

    <circle cx="450" cy="460" r="22" fill="none" stroke="#334155" stroke-width="5"/>
    <circle cx="450" cy="460" r="22" fill="none" stroke="#10b981" stroke-width="5" stroke-dasharray="100" stroke-dashoffset="15"/>
    <text x="450" y="465" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="#10b981" text-anchor="middle">8.4k</text>

    <!-- Glass Sapphire Sheen -->
    <path d="M 285,340 C 310,290 380,260 440,265 C 380,280 320,320 285,340 Z" fill="#ffffff" opacity="0.35"/>
  </g>
</svg>
`;

export const SAMPLE_PRODUCTS: ProductSample[] = [
  {
    id: 'perfume-luxury',
    name: "L'Aura Eau De Parfum",
    category: 'Luxury Fragrance',
    description: 'Amber glass flacon with golden cap on cluttered bathroom marble',
    samplePrompt: 'Remove bathroom background and place on pure white seamless backdrop with soft contact shadow for e-commerce',
    thumbnailSvg: perfumeSvg,
    dataUrl: createSvgDataUrl(perfumeSvg),
  },
  {
    id: 'sneaker-retro',
    name: 'Kinetics Carbon Sneaker',
    category: 'Footwear & Athletic',
    description: 'Designer running shoe on asphalt road with street clutter',
    samplePrompt: 'Clean street background, remove asphalt debris, export isolated product with transparent background',
    thumbnailSvg: sneakerSvg,
    dataUrl: createSvgDataUrl(sneakerSvg),
  },
  {
    id: 'ceramic-latte',
    name: 'Nordic Clay Mug',
    category: 'Ceramic Tableware',
    description: 'Handcrafted latte cup on cafe table with crumbs and blur',
    samplePrompt: 'Remove crumbs, clean coffee rings, place on luxury travertine stone slab with warm studio lighting',
    thumbnailSvg: ceramicMugSvg,
    dataUrl: createSvgDataUrl(ceramicMugSvg),
  },
  {
    id: 'titanium-chrono',
    name: 'Apex Chrono Titanium',
    category: 'Wearable Tech',
    description: 'Smartwatch on cluttered workstation desk with cables and smudges',
    samplePrompt: 'Clean fingerprints and dust, isolate smartwatch on dark charcoal podium with crisp rim light',
    thumbnailSvg: smartwatchSvg,
    dataUrl: createSvgDataUrl(smartwatchSvg),
  },
];

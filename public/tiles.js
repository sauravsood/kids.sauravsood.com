// The home page: four categories, each with its apps in order.
// To add an app, add an entry to its category. While it's being built, set
// `soon: true` and leave out `href`; the tile shows as "Coming soon" and
// can't be tapped. When it ships, drop `soon`, add `href`, and put its
// landing page at public/<slug>/index.html.
//
// Fields: name, line (one short sentence), age, tint (tile colour),
// art (inline SVG, 200×160 viewBox), href or soon.

const ART = {
  trace: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <circle cx="78" cy="82" r="46" fill="none" stroke="#b4bbc8" stroke-width="5" stroke-dasharray="2 11" stroke-linecap="round"/>
    <circle cx="62" cy="72" r="5" fill="#3a3f4b"/><circle cx="94" cy="72" r="5" fill="#3a3f4b"/>
    <path d="M62 96 Q78 108 94 96" fill="none" stroke="#ff4d6d" stroke-width="5" stroke-linecap="round"/>
    <path d="M40 50 L32 28 L56 40 M116 50 L124 28 L100 40" fill="none" stroke="#ff9f1c" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(118 26) rotate(35)">
      <rect x="0" y="0" width="22" height="92" rx="5" fill="#ff9f1c"/>
      <rect x="0" y="0" width="22" height="16" rx="5" fill="#ff4d6d"/>
      <path d="M0 92 L11 118 L22 92 Z" fill="#f1e6d6"/><path d="M7 108 L11 118 L15 108 Z" fill="#3a3f4b"/>
    </g>
  </svg>`,
  alive: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <rect x="30" y="20" width="96" height="120" rx="8" fill="#fff" stroke="#e6d8c4" stroke-width="4"/>
    <circle cx="78" cy="52" r="14" fill="none" stroke="#3a3f4b" stroke-width="4"/>
    <path d="M78 66 V100 M78 76 L60 90 M78 76 L104 64 M78 100 L64 124 M78 100 L94 124" fill="none" stroke="#3a3f4b" stroke-width="4" stroke-linecap="round"/>
    <path d="M140 52 q12 10 0 20 M152 44 q20 18 0 36" fill="none" stroke="#ff9f1c" stroke-width="5" stroke-linecap="round"/>
    <path d="M112 128 l8 -6 M120 136 l10 -2" stroke="#ff4d6d" stroke-width="4" stroke-linecap="round"/>
  </svg>`,
  pixel: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <g fill="#ff4d6d">
      <rect x="64" y="40" width="16" height="16"/><rect x="80" y="40" width="16" height="16"/><rect x="112" y="40" width="16" height="16"/><rect x="128" y="40" width="16" height="16"/>
      <rect x="48" y="56" width="16" height="16"/><rect x="64" y="56" width="16" height="16"/><rect x="80" y="56" width="16" height="16"/><rect x="96" y="56" width="16" height="16"/><rect x="112" y="56" width="16" height="16"/><rect x="128" y="56" width="16" height="16"/><rect x="144" y="56" width="16" height="16"/>
      <rect x="64" y="72" width="16" height="16"/><rect x="80" y="72" width="16" height="16"/><rect x="96" y="72" width="16" height="16"/><rect x="112" y="72" width="16" height="16"/><rect x="128" y="72" width="16" height="16"/>
      <rect x="80" y="88" width="16" height="16"/><rect x="96" y="88" width="16" height="16"/><rect x="112" y="88" width="16" height="16"/>
      <rect x="96" y="104" width="16" height="16"/>
    </g>
    <rect x="64" y="56" width="16" height="16" fill="#fff" opacity="0.6"/>
  </svg>`,
  music: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <g fill="#7b6cf6"><rect x="30" y="100" width="22" height="22" rx="5"/><rect x="58" y="78" width="22" height="22" rx="5"/><rect x="86" y="100" width="22" height="22" rx="5"/></g>
    <g fill="#ff9f1c"><rect x="114" y="56" width="22" height="22" rx="5"/><rect x="142" y="78" width="22" height="22" rx="5"/></g>
    <path d="M150 20 V50" stroke="#3a3f4b" stroke-width="5" stroke-linecap="round"/><ellipse cx="141" cy="52" rx="11" ry="8" fill="#3a3f4b"/>
    <path d="M150 20 q14 4 16 18" fill="none" stroke="#3a3f4b" stroke-width="5" stroke-linecap="round"/>
  </svg>`,
  sky: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <path d="M118 30 A44 44 0 1 0 160 92 A36 36 0 1 1 118 30 Z" fill="#ffd166"/>
    <g fill="#fff">
      <path d="M40 34 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z"/>
      <circle cx="70" cy="22" r="3"/><circle cx="28" cy="96" r="3.5"/><circle cx="62" cy="128" r="2.5"/>
      <circle cx="168" cy="36" r="3"/><circle cx="180" cy="128" r="2.5"/><circle cx="92" cy="70" r="2.5"/>
    </g>
    <path d="M28 96 L62 128 L92 70" fill="none" stroke="#9fb4ff" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  dino: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <path d="M30 128 C30 96 52 80 84 80 L118 80 C130 80 136 70 136 56 L136 40 C136 28 146 22 158 22 C172 22 182 30 182 42 C182 52 174 56 164 56 L156 56 L156 86 C156 110 140 128 112 128 Z" fill="#6bbf59"/>
    <path d="M60 80 l8 -16 8 16 M84 80 l8 -18 8 18 M108 80 l7 -14 7 14" fill="#ff9f1c"/>
    <path d="M30 128 C18 128 10 120 6 108 C20 114 26 112 34 106" fill="#6bbf59"/>
    <rect x="64" y="118" width="14" height="24" rx="6" fill="#4e9a40"/><rect x="110" y="118" width="14" height="24" rx="6" fill="#4e9a40"/>
    <circle cx="164" cy="36" r="4" fill="#3a3f4b"/>
    <path d="M168 48 Q174 50 178 46" fill="none" stroke="#3a3f4b" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  sand: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <path d="M20 140 C50 104 80 96 100 112 C124 92 160 100 180 140 Z" fill="#e9b872"/>
    <path d="M60 140 C76 124 92 122 104 132 C118 120 136 124 150 140 Z" fill="#7ab8e6"/>
    <g fill="#e9b872"><circle cx="96" cy="30" r="5"/><circle cx="104" cy="48" r="5"/><circle cx="94" cy="64" r="5"/><circle cx="102" cy="82" r="5"/></g>
    <g fill="#7ab8e6"><circle cx="134" cy="40" r="4"/><circle cx="130" cy="60" r="4"/></g>
  </svg>`,
  trust: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <circle cx="62" cy="62" r="26" fill="#ffd166"/><circle cx="138" cy="62" r="26" fill="#9fd8c4"/>
    <circle cx="54" cy="58" r="3.5" fill="#3a3f4b"/><circle cx="70" cy="58" r="3.5" fill="#3a3f4b"/><path d="M54 70 q8 6 16 0" fill="none" stroke="#3a3f4b" stroke-width="3" stroke-linecap="round"/>
    <circle cx="130" cy="58" r="3.5" fill="#3a3f4b"/><circle cx="146" cy="58" r="3.5" fill="#3a3f4b"/><path d="M130 70 q8 6 16 0" fill="none" stroke="#3a3f4b" stroke-width="3" stroke-linecap="round"/>
    <path d="M62 96 V122 M138 96 V122" stroke="#3a3f4b" stroke-width="5" stroke-linecap="round"/>
    <path d="M62 106 Q100 128 138 106" fill="none" stroke="#ff4d6d" stroke-width="5" stroke-linecap="round"/>
  </svg>`,
  chess: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <g fill="#e6d8c4"><rect x="30" y="110" width="28" height="28"/><rect x="86" y="110" width="28" height="28"/><rect x="142" y="110" width="28" height="28"/></g>
    <g fill="#b98f5e"><rect x="58" y="110" width="28" height="28"/><rect x="114" y="110" width="28" height="28"/></g>
    <path d="M84 104 h32 l-4 -10 h-24 z M92 94 c-2 -14 4 -24 6 -30 c-10 -2 -14 -12 -8 -20 c6 -8 20 -6 26 2 c6 10 4 30 -2 48 z" fill="#3a3f4b"/>
    <circle cx="101" cy="48" r="2.5" fill="#fff"/>
  </svg>`,
  money: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <rect x="60" y="34" width="80" height="12" rx="4" fill="#b98f5e"/>
    <path d="M64 46 H136 C150 60 152 120 140 136 H60 C48 120 50 60 64 46 Z" fill="#d8f0ff" stroke="#9cc9e6" stroke-width="4"/>
    <g fill="#ffd166" stroke="#e0a832" stroke-width="3"><ellipse cx="84" cy="124" rx="14" ry="6"/><ellipse cx="114" cy="124" rx="14" ry="6"/><ellipse cx="99" cy="114" rx="14" ry="6"/><ellipse cx="92" cy="104" rx="14" ry="6"/></g>
    <path d="M150 22 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#ff9f1c"/>
  </svg>`,
  routines: `<svg viewBox="0 0 200 160" aria-hidden="true">
    <g fill="#fff" stroke="#e6d8c4" stroke-width="4"><rect x="30" y="30" width="60" height="60" rx="14"/><rect x="110" y="30" width="60" height="60" rx="14"/></g>
    <path d="M44 74 L76 46 M46 50 h12" stroke="#7ab8e6" stroke-width="6" stroke-linecap="round"/>
    <rect x="124" y="44" width="32" height="34" rx="3" fill="#ff9f1c"/><path d="M140 44 V78" stroke="#fff" stroke-width="3"/>
    <circle cx="100" cy="124" r="18" fill="#6bbf59"/><path d="M91 124 l6 6 12 -12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
};

export const CATEGORIES = [
  {
    id: "creativity",
    name: "Creativity",
    apps: [
      { name: "Trace", href: "/trace/", age: "3+", tint: "#ffe3b8", art: ART.trace,
        line: "Pick an animal and trace it in your favourite colours." },
      { name: "Drawings Come Alive", soon: true, age: "4+", tint: "#ffe0e6", art: ART.alive,
        line: "Draw a friend on paper and watch it move." },
      { name: "Pixel Art", href: "/pixel/", age: "6+", tint: "#fde2ec", art: ART.pixel,
        line: "Make little pictures one square at a time." },
      { name: "Music Lab", soon: true, age: "4+", tint: "#e6e3ff", art: ART.music,
        line: "Make tunes and beats by tapping squares." },
    ],
  },
  {
    id: "explore",
    name: "Explore",
    apps: [
      { name: "Planetarium", href: "/sky/", age: "4+", tint: "#1d2b57", art: ART.sky,
        line: "Explore the night sky: stars, planets and star pictures." },
      { name: "3D Dino", href: "/dino/", age: "2+", tint: "#cfe8c4", art: ART.dino,
        line: "Meet prehistoric animals in 3D. Turn them round and zoom in." },
      { name: "Sand Lab", href: "/sand/", age: "5+", tint: "#fbe9cf", art: ART.sand,
        line: "Pour sand and water and see what happens." },
    ],
  },
  {
    id: "puzzles",
    name: "Puzzles & Thinking",
    apps: [
      { name: "Trust Game", href: "/trust/", age: "10+", tint: "#e3f4ec", art: ART.trust,
        line: "A story game about why people trust each other." },
      { name: "Chess", soon: true, age: "6+", tint: "#f1e6d6", art: ART.chess,
        line: "Learn how the pieces move and play a gentle game." },
    ],
  },
  {
    id: "life",
    name: "Life Skills",
    apps: [
      { name: "Pocket Money", soon: true, age: "5+", tint: "#e3f2fb", art: ART.money,
        line: "Fill your Save, Spend and Share jars." },
      { name: "My Routines", soon: true, age: "3+", tint: "#e8f5e1", art: ART.routines,
        line: "Tap the pictures as you do your day." },
    ],
  },
];

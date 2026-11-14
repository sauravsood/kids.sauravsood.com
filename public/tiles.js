// The hub's tiles, in order. To add a project, add one entry here and put
// its landing page at public/<path>/index.html.
export const TILES = [
  {
    name: "Trace",
    href: "/trace/",
    line: "Pick an animal and trace it in your favourite colours.",
    tint: "#ffe3b8",
    art: `<svg viewBox="0 0 200 160" aria-hidden="true">
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
  },
  {
    name: "Planetarium",
    href: "/planetarium/",
    line: "Explore the night sky: stars, planets and star pictures.",
    tint: "#1d2b57",
    art: `<svg viewBox="0 0 200 160" aria-hidden="true">
      <path d="M118 30 A44 44 0 1 0 160 92 A36 36 0 1 1 118 30 Z" fill="#ffd166"/>
      <g fill="#fff">
        <path d="M40 34 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z"/>
        <circle cx="70" cy="22" r="3"/><circle cx="28" cy="96" r="3.5"/><circle cx="62" cy="128" r="2.5"/>
        <circle cx="168" cy="36" r="3"/><circle cx="180" cy="128" r="2.5"/><circle cx="92" cy="70" r="2.5"/>
      </g>
      <path d="M28 96 L62 128 L92 70" fill="none" stroke="#9fb4ff" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    name: "3D Dino",
    href: "/dino/",
    line: "Meet prehistoric animals in 3D. Turn them round and zoom in.",
    tint: "#cfe8c4",
    art: `<svg viewBox="0 0 200 160" aria-hidden="true">
      <path d="M30 128 C30 96 52 80 84 80 L118 80 C130 80 136 70 136 56 L136 40 C136 28 146 22 158 22 C172 22 182 30 182 42 C182 52 174 56 164 56 L156 56 L156 86 C156 110 140 128 112 128 Z" fill="#6bbf59"/>
      <path d="M60 80 l8 -16 8 16 M84 80 l8 -18 8 18 M108 80 l7 -14 7 14" fill="#ff9f1c"/>
      <path d="M30 128 C18 128 10 120 6 108 C20 114 26 112 34 106" fill="#6bbf59"/>
      <rect x="64" y="118" width="14" height="24" rx="6" fill="#4e9a40"/><rect x="110" y="118" width="14" height="24" rx="6" fill="#4e9a40"/>
      <circle cx="164" cy="36" r="4" fill="#3a3f4b"/>
      <path d="M168 48 Q174 50 178 46" fill="none" stroke="#3a3f4b" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
];

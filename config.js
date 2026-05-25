/* ============================================================
   PORTFOLIO CLICKER — WORLD CONFIG
   ============================================================ */

(function() {
const ICONS = {
  // Worlds
  cash: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><rect x="6" y="14" width="52" height="36" rx="4"/><circle cx="32" cy="32" r="10"/><text x="32" y="37" text-anchor="middle" font-family="DM Mono" font-size="14" font-weight="600" fill="currentColor" stroke="none">€</text><circle cx="14" cy="22" r="1.5" fill="currentColor"/><circle cx="50" cy="42" r="1.5" fill="currentColor"/></svg>`,

  crypto: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><polygon points="32,4 56,18 56,46 32,60 8,46 8,18"/><polygon points="32,16 46,24 46,40 32,48 18,40 18,24"/><text x="32" y="37" text-anchor="middle" font-family="DM Mono" font-size="13" font-weight="700" fill="currentColor" stroke="none">₿</text></svg>`,

  stocks: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><polyline points="6,48 20,36 30,42 42,22 52,28 58,14"/><polyline points="48,14 58,14 58,24"/><line x1="6" y1="56" x2="58" y2="56"/></svg>`,

  restate: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><rect x="10" y="20" width="20" height="34"/><rect x="32" y="8" width="22" height="46"/><line x1="14" y1="28" x2="18" y2="28"/><line x1="22" y1="28" x2="26" y2="28"/><line x1="14" y1="36" x2="18" y2="36"/><line x1="22" y1="36" x2="26" y2="36"/><line x1="14" y1="44" x2="18" y2="44"/><line x1="22" y1="44" x2="26" y2="44"/><line x1="36" y1="16" x2="40" y2="16"/><line x1="44" y1="16" x2="48" y2="16"/><line x1="36" y1="24" x2="40" y2="24"/><line x1="44" y1="24" x2="48" y2="24"/><line x1="36" y1="32" x2="40" y2="32"/><line x1="44" y1="32" x2="48" y2="32"/><line x1="36" y1="40" x2="40" y2="40"/><line x1="44" y1="40" x2="48" y2="40"/></svg>`,

  // Assets — simple line glyphs
  piggybank:    `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18c0-5 5-9 11-9s11 4 11 9c0 3-2 5-2 7v3h-4v-3M8 23v3h4v-3"/><circle cx="22" cy="16" r="1.2" fill="currentColor"/><path d="M4 14h2"/><path d="M15 9v-3"/></svg>`,
  sidehustle:   `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="24" height="18" rx="2"/><path d="M11 10v-4h10v4"/><line x1="4" y1="18" x2="28" y2="18"/></svg>`,
  bankaccount:  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 L16 5 L28 12"/><line x1="4" y1="14" x2="28" y2="14"/><line x1="8" y1="14" x2="8" y2="24"/><line x1="14" y1="14" x2="14" y2="24"/><line x1="18" y1="14" x2="18" y2="24"/><line x1="24" y1="14" x2="24" y2="24"/><line x1="4" y1="26" x2="28" y2="26"/></svg>`,
  freelance:    `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="20" height="24" rx="1"/><line x1="10" y1="10" x2="22" y2="10"/><line x1="10" y1="15" x2="22" y2="15"/><line x1="10" y1="20" x2="18" y2="20"/></svg>`,
  rental:       `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16 L16 5 L28 16"/><path d="M7 14v14h18V14"/><rect x="13" y="20" width="6" height="8"/></svg>`,

  wallet:       `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="24" height="18" rx="2"/><path d="M22 17h6v-2h-6a1 1 0 0 0 0 2z"/><path d="M4 12V8a2 2 0 0 1 2-2h16v2"/></svg>`,
  miner:        `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="24" height="12" rx="1"/><circle cx="11" cy="16" r="3"/><circle cx="21" cy="16" r="3"/><line x1="4" y1="26" x2="28" y2="26"/></svg>`,
  staking:      `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="11"/><polyline points="11,17 14,20 21,12"/><circle cx="16" cy="16" r="2" fill="currentColor"/></svg>`,
  exchange:     `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,10 26,10 22,6"/><polyline points="26,10 22,14"/><polyline points="26,22 6,22 10,18"/><polyline points="6,22 10,26"/></svg>`,
  defi:         `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><circle cx="21" cy="21" r="6"/><line x1="11" y1="11" x2="21" y2="21"/></svg>`,

  etf:          `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="6" ry="12"/><line x1="4" y1="16" x2="28" y2="16"/></svg>`,
  stockpick:    `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="4" x2="10" y2="28"/><rect x="6" y="10" width="8" height="14"/><line x1="22" y1="6" x2="22" y2="26"/><rect x="18" y="12" width="8" height="8"/></svg>`,
  divportfolio: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="11"/><path d="M16 5 v11 l9 5"/></svg>`,
  hedgefund:    `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="24" height="24" rx="2"/><polyline points="8,22 13,16 17,19 24,10"/></svg>`,
  ipo:          `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4 L24 16 L20 16 L20 26 L12 26 L12 16 L8 16 Z"/></svg>`,

  studio:       `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="20" height="20"/><line x1="6" y1="14" x2="26" y2="14"/><line x1="16" y1="8" x2="16" y2="14"/><rect x="13" y="20" width="6" height="8"/></svg>`,
  building:     `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="20" height="24"/><line x1="11" y1="9" x2="13" y2="9"/><line x1="15" y1="9" x2="17" y2="9"/><line x1="19" y1="9" x2="21" y2="9"/><line x1="11" y1="14" x2="13" y2="14"/><line x1="15" y1="14" x2="17" y2="14"/><line x1="19" y1="14" x2="21" y2="14"/><line x1="11" y1="19" x2="13" y2="19"/><line x1="15" y1="19" x2="17" y2="19"/><line x1="19" y1="19" x2="21" y2="19"/><rect x="14" y="23" width="4" height="5"/></svg>`,
  office:       `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="10" height="20"/><rect x="14" y="2" width="14" height="26"/><line x1="6" y1="13" x2="8" y2="13"/><line x1="10" y1="13" x2="12" y2="13"/><line x1="6" y1="18" x2="8" y2="18"/><line x1="10" y1="18" x2="12" y2="18"/><line x1="6" y1="23" x2="8" y2="23"/><line x1="10" y1="23" x2="12" y2="23"/><line x1="17" y1="7" x2="19" y2="7"/><line x1="21" y1="7" x2="23" y2="7"/><line x1="25" y1="7" x2="26" y2="7"/><line x1="17" y1="13" x2="19" y2="13"/><line x1="21" y1="13" x2="23" y2="13"/><line x1="25" y1="13" x2="26" y2="13"/><line x1="17" y1="19" x2="19" y2="19"/><line x1="21" y1="19" x2="23" y2="19"/><line x1="25" y1="19" x2="26" y2="19"/></svg>`,
  shoppingcenter:`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 L16 4 L28 12"/><path d="M6 12 v16 h20 v-16"/><rect x="11" y="18" width="4" height="10"/><rect x="17" y="18" width="4" height="10"/></svg>`,
  skyscraper:   `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11,28 11,8 16,2 21,8 21,28"/><line x1="16" y1="2" x2="16" y2="28"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="17" x2="21" y2="17"/><line x1="11" y1="22" x2="21" y2="22"/></svg>`,

  // Misc
  trophy: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h14v8a7 7 0 0 1-14 0z"/><path d="M9 7H5v3a4 4 0 0 0 4 4"/><path d="M23 7h4v3a4 4 0 0 1-4 4"/><line x1="12" y1="19" x2="20" y2="19"/><line x1="13" y1="19" x2="13" y2="26"/><line x1="19" y1="19" x2="19" y2="26"/><line x1="9" y1="28" x2="23" y2="28"/></svg>`,
  reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 L14 9 L21 11 L14 13 L12 20 L10 13 L3 11 L10 9 Z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

const WORLDS = {
  cash: {
    id: 'cash',
    name: 'Cash',
    eyebrow: 'World 01 · Income',
    icon: 'cash',
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.35)',
    soft: 'rgba(34, 197, 94, 0.12)',
    unlockThreshold: 0,
    clickBase: 1,
    clickAction: 'Work a shift',
    description: 'Het begint klein. Lonen, spaargeld, de oude blikken doos op de plank.',
    assets: [
      { id: 'piggybank',   name: 'Spaarpot',           cost: 15,      eps: 0.1,  flavour: 'Oud blikje op de plank' },
      { id: 'sidehustle',  name: 'Bijverdienste',      cost: 100,     eps: 0.5,  flavour: 'Spullen op 2dehands' },
      { id: 'bankaccount', name: 'Spaarrekening',      cost: 500,     eps: 2,    flavour: '0,01% rente, classique' },
      { id: 'freelance',   name: 'Freelance opdracht', cost: 2000,    eps: 8,    flavour: 'Factuur verstuurd, wachten…' },
      { id: 'rental',      name: 'Kamer verhuren',     cost: 10000,   eps: 30,   flavour: 'Studentenkot in Gent' },
    ],
    upgrades: [
      { id: 'overtime',  name: 'Overuren',          desc: 'Click yield ×2',         cost: 1000,    mult: 2, target: 'click' },
      { id: 'compound',  name: 'Samengestelde rente', desc: 'Alle Cash-assets ×2',  cost: 5000,    mult: 2, target: 'world' },
      { id: 'taxopt',    name: 'Fiscale optimalisatie', desc: 'Alle Cash-assets ×2', cost: 25000,  mult: 2, target: 'world' },
      { id: 'autopilot', name: 'Bank-app autopilot', desc: 'Click yield ×3',        cost: 50000,   mult: 3, target: 'click' },
    ],
  },
  crypto: {
    id: 'crypto',
    name: 'Crypto',
    eyebrow: 'World 02 · Digital Assets',
    icon: 'crypto',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.40)',
    soft: 'rgba(245, 158, 11, 0.12)',
    unlockThreshold: 50_000,
    clickBase: 50,
    clickAction: 'Mine a block',
    description: '24/7 markten. Volatiel, snel, en de fans loeien continu.',
    assets: [
      { id: 'wallet',   name: 'Crypto Wallet', cost: 5_000,      eps: 25,        flavour: 'HODL mentaliteit' },
      { id: 'miner',    name: 'GPU Miner',     cost: 25_000,     eps: 150,       flavour: 'Inclusief fan-lawaai' },
      { id: 'staking',  name: 'Staking Node',  cost: 100_000,    eps: 600,       flavour: 'Passive yield farming' },
      { id: 'exchange', name: 'Eigen Exchange',cost: 1_000_000,  eps: 5_000,     flavour: '0,1% fee op alles' },
      { id: 'defi',     name: 'DeFi Protocol', cost: 20_000_000, eps: 100_000,   flavour: 'Liquidity pools' },
    ],
    upgrades: [
      { id: 'leverage', name: 'Leverage trading', desc: 'Click yield ×3',       cost: 100_000,    mult: 3, target: 'click' },
      { id: 'whale',    name: 'Whale wallet',     desc: 'Alle Crypto-assets ×2',cost: 500_000,    mult: 2, target: 'world' },
      { id: 'launchpad',name: 'Launchpad access', desc: 'Alle Crypto-assets ×2',cost: 5_000_000,  mult: 2, target: 'world' },
      { id: 'liquidity',name: 'Liquidity boost',  desc: 'Alle Crypto-assets ×3',cost: 50_000_000, mult: 3, target: 'world' },
    ],
  },
  stocks: {
    id: 'stocks',
    name: 'Stocks & ETFs',
    eyebrow: 'World 03 · Institutional',
    icon: 'stocks',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.40)',
    soft: 'rgba(59, 130, 246, 0.12)',
    unlockThreshold: 5_000_000,
    clickBase: 500,
    clickAction: 'Place an order',
    description: 'Lange termijn, samengesteld rendement. Tijd is je grootste hefboom.',
    assets: [
      { id: 'etf',          name: 'World ETF',          cost: 50_000,         eps: 200,        flavour: 'VWCE enjoyer' },
      { id: 'stockpick',    name: 'Aandelenpositie',    cost: 250_000,        eps: 1_200,      flavour: '"I did my research"' },
      { id: 'divportfolio', name: 'Dividendportfolio',  cost: 1_000_000,      eps: 6_000,      flavour: 'Quarterly payouts' },
      { id: 'hedgefund',    name: 'Hedgefonds',         cost: 50_000_000,     eps: 300_000,    flavour: '2 and 20 fees' },
      { id: 'ipo',          name: 'IPO Underwriter',    cost: 1_000_000_000,  eps: 8_000_000,  flavour: 'Taking companies public' },
    ],
    upgrades: [
      { id: 'margin',   name: 'Margin account',    desc: 'Click yield ×3',         cost: 1_000_000,    mult: 3, target: 'click' },
      { id: 'options',  name: 'Options trading',   desc: 'Alle Stocks-assets ×2',  cost: 10_000_000,   mult: 2, target: 'world' },
      { id: 'algo',     name: 'Algorithmic trading',desc: 'Alle Stocks-assets ×2', cost: 100_000_000,  mult: 2, target: 'world' },
      { id: 'insider',  name: 'Insider tip',       desc: '"Niet doorvertellen" ×3',cost: 1_000_000_000,mult: 3, target: 'world' },
    ],
  },
  restate: {
    id: 'restate',
    name: 'Real Estate',
    eyebrow: 'World 04 · Tangible',
    icon: 'restate',
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.40)',
    soft: 'rgba(139, 92, 246, 0.12)',
    unlockThreshold: 500_000_000,
    clickBase: 10_000,
    clickAction: 'Sign a deed',
    description: 'Beton, glas en lange termijn contracten. Trager opstarten, massieve compound.',
    assets: [
      { id: 'studio',        name: 'Studio Appartement', cost: 200_000,         eps: 800,        flavour: 'Antwerpen centrum' },
      { id: 'building',      name: 'Appartementsgebouw', cost: 2_000_000,       eps: 10_000,     flavour: '12 units, één lift' },
      { id: 'office',        name: 'Kantoorcomplex',     cost: 20_000_000,      eps: 120_000,    flavour: '"Premium A-locatie"' },
      { id: 'shoppingcenter',name: 'Shoppingcenter',     cost: 500_000_000,     eps: 3_500_000,  flavour: 'Anchor tenant: Zara' },
      { id: 'skyscraper',    name: 'Wolkenkrabber',      cost: 10_000_000_000,  eps: 80_000_000, flavour: 'Naam op het gebouw' },
    ],
    upgrades: [
      { id: 'renovate', name: 'Renovatie premium', desc: 'Alle RE-assets ×2',    cost: 50_000_000,    mult: 2, target: 'world' },
      { id: 'lease',    name: 'Long-term leases',  desc: 'Alle RE-assets ×2',    cost: 500_000_000,   mult: 2, target: 'world' },
      { id: 'reit',     name: 'REIT structuur',    desc: 'Click yield ×3',       cost: 2_000_000_000, mult: 3, target: 'click' },
      { id: 'offshore', name: 'Offshore holding',  desc: 'Alle RE-assets ×3',    cost: 20_000_000_000,mult: 3, target: 'world' },
    ],
  },
};

const WORLD_ORDER = ['cash', 'crypto', 'stocks', 'restate'];

const ACHIEVEMENTS = [
  { id: 'firstEuro',     label: 'Eerste euro',          check: g => g.totalEarned >= 1 },
  { id: 'thousandaire',  label: 'Duizendste',           check: g => g.totalEarned >= 1_000 },
  { id: 'firstAsset',    label: 'Eerste investering',   check: g => Object.values(g.worlds).some(w => Object.values(w.assets).some(c => c >= 1)) },
  { id: 'tenOfOne',      label: 'Schaalvoordelen',      check: g => Object.values(g.worlds).some(w => Object.values(w.assets).some(c => c >= 10)) },
  { id: 'cryptoUnlocked',label: 'Into the blockchain',  check: g => g.worlds.crypto.unlocked },
  { id: 'millionaire',   label: 'Miljonair',            check: g => g.totalEarned >= 1_000_000 },
  { id: 'stocksUnlocked',label: 'Wall Street arrival',  check: g => g.worlds.stocks.unlocked },
  { id: 'billionaire',   label: 'Miljardair',           check: g => g.totalEarned >= 1_000_000_000 },
  { id: 'restateUnlocked',label:'Beton & staal',        check: g => g.worlds.restate.unlocked },
  { id: 'diversified',   label: 'Gediversifieerd portfolio', check: g => WORLD_ORDER.every(w => g.worlds[w].unlocked) },
  { id: 'fullPortfolio', label: 'Full portfolio',       check: g => WORLD_ORDER.every(wid => WORLDS[wid].assets.every(a => (g.worlds[wid].assets[a.id] || 0) >= 1)) },
];

const TICKER_LINES = [
  { sym: 'VWCE.AS',   pct:  0.42, text: 'Passief beleggen blijft populair' },
  { sym: 'BTC/EUR',   pct: 12.31, text: 'Analist: "Dit keer is het anders"' },
  { sym: 'ETH/EUR',   pct: -3.18, text: 'Layer-2 volume bereikt nieuw record' },
  { sym: 'ASML.AS',   pct:  1.86, text: 'EUV-orders blijven aantrekken' },
  { sym: 'AMS:KBC',   pct: -0.74, text: 'Belgisch bankwezen blijft stabiel' },
  { sym: 'IMMO',      pct:  0.91, text: 'Vastgoedprijzen Antwerpen stijgen opnieuw' },
  { sym: 'FED',       pct:  0.00, text: 'Fed houdt rente stabiel — markten reageren positief' },
  { sym: 'IPO',       pct:  null, text: 'Nieuwe IPO verwacht: inschrijven voor vrijdag' },
  { sym: 'EUR/USD',   pct:  0.12, text: 'ECB-voorzitter spreekt om 14u00' },
  { sym: 'GOLD',      pct:  2.04, text: 'Goud breekt opnieuw door €2.500/oz' },
  { sym: 'SOL/EUR',   pct:  8.77, text: 'Solana ecosystem onder de loep' },
  { sym: 'BNB/EUR',   pct: -1.24, text: 'Binance kondigt nieuwe Belgische IBAN aan' },
  { sym: 'OIL',       pct: -0.55, text: 'Brent-prijs zakt door overaanbod' },
  { sym: 'AEX',       pct:  0.31, text: 'Amsterdam beurs hoger geopend' },
  { sym: 'BEL20',     pct:  0.18, text: 'Bel20 in groen, defensieven leiden' },
  { sym: 'CRYPTO',    pct:  null, text: 'Belgische beurstoezichthouder licht regels toe' },
  { sym: 'REIT',      pct:  0.62, text: 'Logistiek vastgoed blijft sterke yield leveren' },
  { sym: 'DAX',       pct: -0.21, text: 'Duitse industrie wacht op stimulus' },
];

window.GAME_CONFIG = { WORLDS, WORLD_ORDER, ACHIEVEMENTS, TICKER_LINES, ICONS };
})();

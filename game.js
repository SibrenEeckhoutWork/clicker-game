/* ============================================================
   PORTFOLIO CLICKER — GAME ENGINE
   ============================================================ */

const { WORLDS, WORLD_ORDER, ACHIEVEMENTS, TICKER_LINES, ICONS } = window.GAME_CONFIG;

const SAVE_KEY = 'portfolio-clicker-v1';

/* ============================================================
   Number formatting
   ============================================================ */

const SUFFIXES = [
  { v: 1e15, s: 'P' },
  { v: 1e12, s: 'T' },
  { v: 1e9,  s: 'B' },
  { v: 1e6,  s: 'M' },
  { v: 1e3,  s: 'K' },
];

function fmt(n, withSymbol = true) {
  const prefix = withSymbol ? '€' : '';
  if (n === undefined || n === null || isNaN(n)) return prefix + '0';
  const sign = n < 0 ? '-' : '';
  n = Math.abs(n);
  if (n < 1000) {
    // Show decimals only when it would otherwise read as 0
    if (n === 0) return prefix + '0';
    if (n < 10 && n % 1 !== 0) return sign + prefix + n.toFixed(1);
    return sign + prefix + Math.floor(n).toLocaleString('nl-BE');
  }
  for (const { v, s } of SUFFIXES) {
    if (n >= v) {
      const val = n / v;
      const str = val >= 100 ? val.toFixed(0) : val >= 10 ? val.toFixed(1) : val.toFixed(2);
      return sign + prefix + str + s;
    }
  }
  return sign + prefix + Math.floor(n).toString();
}

function fmtRate(n) { return fmt(n) + '/s'; }
function fmtPct(n) {
  if (n === null || n === undefined) return '';
  const sign = n > 0 ? '+' : '';
  return sign + n.toFixed(2) + '%';
}

/* ============================================================
   State
   ============================================================ */

function newGame() {
  const worlds = {};
  for (const wid of WORLD_ORDER) {
    worlds[wid] = {
      unlocked: wid === 'cash',
      assets: {},
      purchasedUpgrades: {},
      earnedHere: 0,
    };
    for (const a of WORLDS[wid].assets) worlds[wid].assets[a.id] = 0;
  }
  return {
    netWorth: 0,
    totalEarned: 0,
    totalClicks: 0,
    worlds,
    activeWorld: 'cash',
    lastTick: Date.now(),
    gameStartedAt: Date.now(),
    unlockedAchievements: {},
    shopTab: 'assets',
  };
}

let state = loadOrNew();
let pendingFlash = new Set();
let pendingBump = new Set();
let pendingUnlocks = [];
let achievementQueue = [];

function loadOrNew() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return newGame();
    const parsed = JSON.parse(raw);
    // Merge with fresh to add any new fields
    const fresh = newGame();
    const merged = { ...fresh, ...parsed };
    merged.worlds = {};
    for (const wid of WORLD_ORDER) {
      const w = parsed.worlds && parsed.worlds[wid] ? parsed.worlds[wid] : fresh.worlds[wid];
      const assets = {};
      for (const a of WORLDS[wid].assets) assets[a.id] = w.assets[a.id] || 0;
      merged.worlds[wid] = {
        unlocked: !!w.unlocked,
        assets,
        purchasedUpgrades: w.purchasedUpgrades || {},
        earnedHere: w.earnedHere || 0,
      };
    }
    merged.worlds.cash.unlocked = true;
    merged.unlockedAchievements = parsed.unlockedAchievements || {};
    merged.shopTab = parsed.shopTab || 'assets';
    merged.activeWorld = parsed.activeWorld || 'cash';
    if (!merged.worlds[merged.activeWorld].unlocked) merged.activeWorld = 'cash';
    return merged;
  } catch (e) {
    console.warn('Save load failed', e);
    return newGame();
  }
}

let saveCooldown = 0;
function save() {
  const now = Date.now();
  if (now - saveCooldown < 1000) return;
  saveCooldown = now;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) { console.warn('Save failed', e); }
}

function resetGame() {
  if (!confirm('Are you sure? This will erase all progress.')) return;
  localStorage.removeItem(SAVE_KEY);
  state = newGame();
  fullRender();
}

/* ============================================================
   Derived values
   ============================================================ */

function assetCost(asset, owned) {
  return asset.cost * Math.pow(1.15, owned);
}

function worldClickYield(wid) {
  const w = state.worlds[wid];
  if (!w.unlocked) return 0;
  const def = WORLDS[wid];
  let mult = 1;
  for (const u of def.upgrades) {
    if (w.purchasedUpgrades[u.id] && u.target === 'click') mult *= u.mult;
  }
  return def.clickBase * mult;
}

function totalClickYield() {
  let sum = 0;
  for (const wid of WORLD_ORDER) sum += worldClickYield(wid);
  return sum;
}

function worldEPS(wid) {
  const w = state.worlds[wid];
  if (!w.unlocked) return 0;
  const def = WORLDS[wid];
  let worldMult = 1;
  for (const u of def.upgrades) {
    if (w.purchasedUpgrades[u.id] && u.target === 'world') worldMult *= u.mult;
  }
  let sum = 0;
  for (const a of def.assets) {
    const c = w.assets[a.id] || 0;
    sum += c * a.eps;
  }
  return sum * worldMult;
}

function totalEPS() {
  let s = 0;
  for (const wid of WORLD_ORDER) s += worldEPS(wid);
  return s;
}

/* ============================================================
   Actions
   ============================================================ */

function tick(now) {
  const delta = Math.min((now - state.lastTick) / 1000, 1);
  state.lastTick = now;
  const eps = totalEPS();
  const earned = eps * delta;
  if (earned > 0) {
    state.netWorth += earned;
    state.totalEarned += earned;
    // distribute to per-world earnedHere proportionally
    for (const wid of WORLD_ORDER) {
      const e = worldEPS(wid) * delta;
      state.worlds[wid].earnedHere += e;
    }
  }
  checkUnlocks();
  checkAchievements();
}

function doClick(evt) {
  const yieldPerClick = totalClickYield();
  state.netWorth += yieldPerClick;
  state.totalEarned += yieldPerClick;
  state.totalClicks++;
  // proportion to active world
  state.worlds[state.activeWorld].earnedHere += yieldPerClick;

  const btn = document.getElementById('click-btn');
  btn.classList.remove('is-pulsing');
  void btn.offsetWidth;
  btn.classList.add('is-pulsing');

  spawnRipple(btn);
  spawnFloat(evt, yieldPerClick);
  checkUnlocks();
  checkAchievements();
  renderKPIs();
  renderBreakdown();
  renderShopAffordability();
  save();
}

function buyAsset(wid, aid) {
  const w = state.worlds[wid];
  if (!w.unlocked) return;
  const def = WORLDS[wid];
  const asset = def.assets.find(a => a.id === aid);
  const owned = w.assets[aid] || 0;
  const cost = assetCost(asset, owned);
  if (state.netWorth < cost) return;
  state.netWorth -= cost;
  w.assets[aid] = owned + 1;
  pendingFlash.add(`${wid}:${aid}`);
  pendingBump.add(`${wid}:${aid}`);
  checkAchievements();
  renderKPIs();
  renderBreakdown();
  renderShop();
  save();
}

function buyUpgrade(wid, uid) {
  const w = state.worlds[wid];
  if (!w.unlocked) return;
  const def = WORLDS[wid];
  const up = def.upgrades.find(u => u.id === uid);
  if (w.purchasedUpgrades[uid]) return;
  if (state.netWorth < up.cost) return;
  state.netWorth -= up.cost;
  w.purchasedUpgrades[uid] = true;
  renderKPIs();
  renderBreakdown();
  renderShop();
  save();
}

function setActiveWorld(wid) {
  if (!state.worlds[wid].unlocked) return;
  state.activeWorld = wid;
  applyAccent(wid);
  renderTabs();
  renderClicker();
  renderShop();
  save();
}

function setShopTab(tab) {
  state.shopTab = tab;
  renderShop();
}

function checkUnlocks() {
  for (const wid of WORLD_ORDER) {
    const w = state.worlds[wid];
    if (!w.unlocked && state.totalEarned >= WORLDS[wid].unlockThreshold) {
      w.unlocked = true;
      pendingUnlocks.push(wid);
    }
  }
  if (pendingUnlocks.length) showUnlockModal();
}

function checkAchievements() {
  for (const ach of ACHIEVEMENTS) {
    if (state.unlockedAchievements[ach.id]) continue;
    if (ach.check(state)) {
      state.unlockedAchievements[ach.id] = Date.now();
      achievementQueue.push(ach);
    }
  }
  if (achievementQueue.length) drainAchievements();
}

/* ============================================================
   Floating numbers + ripple
   ============================================================ */

function spawnFloat(evt, val) {
  const layer = document.getElementById('float-layer');
  const rect = layer.getBoundingClientRect();
  let x = rect.width / 2, y = rect.height / 2;
  if (evt && evt.clientX) {
    x = evt.clientX - rect.left;
    y = evt.clientY - rect.top;
  }
  // small random jitter
  x += (Math.random() - 0.5) * 30;
  const el = document.createElement('div');
  el.className = 'float-num';
  el.textContent = '+' + fmt(val);
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  layer.appendChild(el);
  setTimeout(() => el.remove(), 850);
}

function spawnRipple(btn) {
  const r = document.createElement('div');
  r.className = 'ripple';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 720);
}

/* ============================================================
   Unlock modal
   ============================================================ */

function showUnlockModal() {
  if (!pendingUnlocks.length) return;
  const wid = pendingUnlocks.shift();
  const def = WORLDS[wid];
  applyAccent(wid);
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop">
      <div class="modal">
        <div class="modal__icon">${ICONS[def.icon]}</div>
        <div class="modal__eyebrow">New asset class unlocked</div>
        <h2 class="modal__title">${def.name}</h2>
        <p class="modal__desc">${def.description}</p>
        <div class="modal__stats">
          <div>
            <div class="modal__stat-label">Click yield</div>
            <div class="modal__stat-value">${fmt(def.clickBase)}</div>
          </div>
          <div>
            <div class="modal__stat-label">Top asset</div>
            <div class="modal__stat-value">${fmtRate(def.assets[def.assets.length - 1].eps)}</div>
          </div>
        </div>
        <button class="modal__cta" id="modal-cta">Open ${def.name}</button>
      </div>
    </div>
  `;
  document.getElementById('modal-cta').addEventListener('click', () => {
    root.innerHTML = '';
    setActiveWorld(wid);
    save();
    // show next if any
    if (pendingUnlocks.length) setTimeout(showUnlockModal, 300);
  });
}

/* ============================================================
   Achievement toasts
   ============================================================ */

function drainAchievements() {
  const container = document.getElementById('toasts');
  while (achievementQueue.length) {
    const ach = achievementQueue.shift();
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `
      <div class="toast__icon">${ICONS.trophy}</div>
      <div class="toast__body">
        <div class="toast__eyebrow">Achievement</div>
        <div class="toast__name">${ach.label}</div>
      </div>
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }
}

/* ============================================================
   Accent / world theming
   ============================================================ */

function applyAccent(wid) {
  const def = WORLDS[wid];
  document.documentElement.style.setProperty('--accent', def.color);
  document.documentElement.style.setProperty('--accent-glow', def.glow);
  document.documentElement.style.setProperty('--accent-soft', def.soft);
  document.querySelector('.clicker-panel').dataset.world = wid;
}

/* ============================================================
   Render
   ============================================================ */

function renderTicker() {
  const track = document.getElementById('ticker-track');
  const items = TICKER_LINES.map(t => {
    const pctStr = t.pct === null ? '' : (t.pct >= 0 ? `<span class="pos">${fmtPct(t.pct)}</span>` : `<span class="neg">${fmtPct(t.pct)}</span>`);
    return `<span class="ticker__item"><span class="sym">${t.sym}</span> ${pctStr} <span>— ${t.text}</span></span>`;
  }).join('');
  // duplicate for seamless loop
  track.innerHTML = items + items;
}

function renderKPIs() {
  document.getElementById('kpi-networth').textContent = fmt(state.netWorth);
  document.getElementById('kpi-eps').textContent = fmtRate(totalEPS());
}

function renderBreakdown() {
  const bar = document.getElementById('breakdown-bar');
  const total = WORLD_ORDER.reduce((s, w) => s + worldEPS(w), 0);
  bar.innerHTML = '';
  if (total === 0) {
    // empty state shimmer
    bar.innerHTML = `<div class="breakdown__seg" data-world="cash" style="width:100%; opacity:0.2;"></div>`;
  } else {
    for (const wid of WORLD_ORDER) {
      const v = worldEPS(wid);
      if (v <= 0) continue;
      const pct = (v / total) * 100;
      const seg = document.createElement('div');
      seg.className = 'breakdown__seg';
      seg.dataset.world = wid;
      seg.style.width = pct + '%';
      seg.title = `${WORLDS[wid].name}: ${fmtRate(v)} (${pct.toFixed(1)}%)`;
      bar.appendChild(seg);
    }
  }
  // legend
  const legend = document.getElementById('breakdown-legend');
  legend.innerHTML = WORLD_ORDER.map(wid => {
    const w = state.worlds[wid];
    const eps = worldEPS(wid);
    const cls = `l-${wid}` + (!w.unlocked ? ' locked' : '');
    const value = w.unlocked ? fmtRate(eps) : 'GELOCKT';
    return `<span class="${cls}"><i></i>${WORLDS[wid].name.toUpperCase()} · ${value}</span>`;
  }).join('');
}

function renderTabs() {
  const container = document.getElementById('tabs');
  container.innerHTML = '';
  for (const wid of WORLD_ORDER) {
    const def = WORLDS[wid];
    const w = state.worlds[wid];
    const tab = document.createElement('button');
    const active = state.activeWorld === wid;
    const locked = !w.unlocked;
    tab.className = 'tab' + (active ? ' tab--active' : '') + (locked ? ' tab--locked' : '');
    tab.style.setProperty('--tab-color', def.color);
    let inner = `<span class="tab__icon" style="color:${locked ? '' : def.color}">${ICONS[def.icon]}</span>`;
    inner += `<span>${def.name}</span>`;
    if (locked) {
      inner += `<span class="tab__threshold">${fmt(def.unlockThreshold)}</span>`;
    } else if (worldEPS(wid) > 0) {
      inner += `<span class="tab__live" style="background:${def.color}; box-shadow: 0 0 8px ${def.color}"></span>`;
    }
    tab.innerHTML = inner;
    if (!locked) tab.addEventListener('click', () => setActiveWorld(wid));
    container.appendChild(tab);
  }
  // clock
  const meta = document.createElement('div');
  meta.className = 'tabs__meta';
  meta.innerHTML = `
    <span class="market"><i></i>MARKET OPEN</span>
    <span class="clock" id="clock">--:--:--</span>
  `;
  container.appendChild(meta);
}

function renderClicker() {
  const wid = state.activeWorld;
  const def = WORLDS[wid];
  const root = document.getElementById('clicker-panel');
  root.dataset.world = wid;
  const clickYield = worldClickYield(wid);
  const eps = worldEPS(wid);
  const earnedHere = state.worlds[wid].earnedHere;
  root.innerHTML = `
    <div class="clicker-panel__header">
      <div class="world-title">
        <div class="world-title__eyebrow">${def.eyebrow}</div>
        <div class="world-title__name">${def.name}</div>
      </div>
      <div class="world-tag"><i></i>LIVE</div>
    </div>
    <div class="clicker-stage">
      <button class="click-btn" id="click-btn">
        <div class="click-btn__icon">${ICONS[def.icon]}</div>
      </button>
      <div class="click-action">${def.clickAction.toUpperCase()}</div>
      <div class="click-yield"><span>+</span><strong>${fmt(clickYield)}</strong><span>per klik</span></div>
      <div class="float-layer" id="float-layer"></div>
    </div>
    <div class="world-stats">
      <div class="world-stat">
        <div class="world-stat__label">World EPS</div>
        <div class="world-stat__value accent">${fmtRate(eps)}</div>
      </div>
      <div class="world-stat">
        <div class="world-stat__label">Click yield</div>
        <div class="world-stat__value">${fmt(clickYield)}</div>
      </div>
      <div class="world-stat">
        <div class="world-stat__label">Earned here</div>
        <div class="world-stat__value">${fmt(earnedHere)}</div>
      </div>
    </div>
  `;
  const btn = document.getElementById('click-btn');
  btn.addEventListener('click', doClick);
}

function renderShop() {
  const wid = state.activeWorld;
  const def = WORLDS[wid];
  const w = state.worlds[wid];
  const root = document.getElementById('shop');
  const tab = state.shopTab;
  root.innerHTML = `
    <div class="shop__header">
      <button class="shop__tab ${tab==='assets'?'shop__tab--active':''}" data-tab="assets">Assets</button>
      <button class="shop__tab ${tab==='upgrades'?'shop__tab--active':''}" data-tab="upgrades">Upgrades</button>
      <div class="shop__filter">${def.name.toUpperCase()} · ${def.assets.length} ASSETS · ${def.upgrades.length} UPGRADES</div>
    </div>
    <div class="shop__body" id="shop-body"></div>
  `;
  root.querySelectorAll('.shop__tab').forEach(b => {
    b.addEventListener('click', () => setShopTab(b.dataset.tab));
  });
  const body = document.getElementById('shop-body');
  if (tab === 'assets') {
    // determine which assets are unlocked: each subsequent asset locks until prior one bought once
    let prevOwned = true;
    for (let i = 0; i < def.assets.length; i++) {
      const a = def.assets[i];
      const owned = w.assets[a.id] || 0;
      const cost = assetCost(a, owned);
      const can = state.netWorth >= cost;
      const locked = !prevOwned && owned === 0;
      const almost = !locked && !can && state.netWorth >= cost * 0.7;
      const eps = a.eps;
      const totalEps = eps * owned;
      const row = document.createElement('div');
      const flashKey = `${wid}:${a.id}`;
      row.className = 'asset' + (locked ? ' asset--locked' : (can ? '' : ' asset--cannot')) + (almost ? ' almost' : '') + (pendingFlash.has(flashKey) ? ' flash' : '');
      row.innerHTML = `
        <div class="asset__icon">
          ${ICONS[a.id] || ICONS.spark}
          ${owned > 0 ? `<div class="asset__count ${pendingBump.has(flashKey) ? 'bump' : ''}">${owned}</div>` : ''}
        </div>
        <div class="asset__info">
          <div class="asset__name">${locked ? '???' : a.name}</div>
          ${locked ? `<div class="asset__meta"><span>Unlocked after previous asset</span></div>` :
          `<div class="asset__meta">
            <span>${fmtRate(eps)}/unit</span>
            ${owned > 0 ? `<span class="total">${fmtRate(totalEps)} total</span>` : ''}
          </div>
          <div class="asset__flavour">${a.flavour}</div>`}
        </div>
        <div class="asset__buy">
          <button class="buy-btn" ${(can && !locked) ? '' : 'disabled'}>
            <span class="buy-btn__label">${locked ? 'Locked' : 'Buy'}</span>
            <span class="buy-btn__price">${locked ? '— —' : fmt(cost)}</span>
          </button>
        </div>
      `;
      if (!locked && can) {
        row.querySelector('.buy-btn').addEventListener('click', e => { e.stopPropagation(); buyAsset(wid, a.id); });
        row.addEventListener('click', () => buyAsset(wid, a.id));
      }
      body.appendChild(row);
      pendingFlash.delete(flashKey);
      pendingBump.delete(flashKey);
      if (owned > 0) prevOwned = true;
      else prevOwned = false;
    }
  } else {
    const grid = document.createElement('div');
    grid.className = 'upgrades';
    for (const u of def.upgrades) {
      const owned = !!w.purchasedUpgrades[u.id];
      const can = state.netWorth >= u.cost;
      const card = document.createElement('button');
      card.className = 'upgrade' + (owned ? ' upgrade--owned' : (can ? '' : ' upgrade--cannot'));
      card.innerHTML = `
        <div class="upgrade__icon">${ICONS.bolt}</div>
        <div class="upgrade__name">${u.name}</div>
        <div class="upgrade__desc">${u.desc}</div>
        <div class="upgrade__price">${owned ? 'Active' : fmt(u.cost)}</div>
      `;
      if (!owned && can) card.addEventListener('click', () => buyUpgrade(wid, u.id));
      grid.appendChild(card);
    }
    body.appendChild(grid);
  }
}

// lighter render path: re-render only affordability/labels in shop without rebuilding DOM
function renderShopAffordability() {
  const rows = document.querySelectorAll('#shop .asset, #shop .upgrade');
  if (!rows.length) return;
  // simplest: re-render every ~250ms via render loop; this fn called per click does nothing heavy
}

function renderClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const d = new Date();
  const pad = n => n.toString().padStart(2, '0');
  el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function fullRender() {
  renderTicker();
  renderTabs();
  applyAccent(state.activeWorld);
  renderClicker();
  renderKPIs();
  renderBreakdown();
  renderShop();
}

/* ============================================================
   Loop
   ============================================================ */

let lastShopRebuild = 0;
function loop() {
  const now = Date.now();
  tick(now);
  renderKPIs();
  renderBreakdown();
  // rebuild shop every 400ms so affordability + flash/bump update
  if (now - lastShopRebuild > 350) {
    lastShopRebuild = now;
    renderShop();
    renderTabs(); // for live dots
  }
  renderClock();
  save();
  requestAnimationFrame(loop);
}

/* ============================================================
   Offline progress
   ============================================================ */

function applyOfflineProgress() {
  const now = Date.now();
  const delta = Math.min((now - state.lastTick) / 1000, 8 * 3600);
  if (delta < 30) return;
  const eps = totalEPS();
  const earned = eps * delta * 0.5;
  if (earned <= 0) return;
  state.netWorth += earned;
  state.totalEarned += earned;
  state.lastTick = now;
  // show toast-like banner
  const container = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.borderLeftColor = 'var(--accent)';
  el.style.minWidth = '320px';
  el.innerHTML = `
    <div class="toast__icon" style="color:var(--accent)">${ICONS.spark}</div>
    <div class="toast__body">
      <div class="toast__eyebrow" style="color:var(--accent)">Welcome back</div>
      <div class="toast__name">Your portfolio grew by ${fmt(earned)} while you were away</div>
    </div>
  `;
  container.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}

/* ============================================================
   Init
   ============================================================ */

function init() {
  applyOfflineProgress();
  fullRender();
  // reset button
  document.getElementById('reset-btn').addEventListener('click', resetGame);
  // keyboard space click
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.target.matches('input,textarea,button')) {
      e.preventDefault();
      const btn = document.getElementById('click-btn');
      if (btn) {
        const rect = btn.getBoundingClientRect();
        doClick({ clientX: rect.left + rect.width/2, clientY: rect.top + rect.height/2 });
      }
    }
  });
  // tab key cycles worlds
  window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '4') {
      const wid = WORLD_ORDER[parseInt(e.key) - 1];
      if (state.worlds[wid].unlocked) setActiveWorld(wid);
    }
  });
  requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', init);
window.GAME = {
  giveMoney: (n) => { state.netWorth += n; state.totalEarned += n; checkUnlocks(); checkAchievements(); fullRender(); },
  state: () => state,
  reset: resetGame,
};

// ═══════════════════════════════════════════════
//  MUSSOORIE TRIP — APP.JS
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initCanvas();
  initNav();
  buildItinerary();
  buildPlaces();
  buildFoodGuide();
  buildPacking();
  buildWeather();
  initScrollAnimations();
  initMobileMenu();
});

// ── COUNTDOWN ─────────────────────────────────
function initCountdown() {
  const el = {
    days:    document.getElementById('cd-days'),
    hours:   document.getElementById('cd-hours'),
    mins:    document.getElementById('cd-mins'),
    secs:    document.getElementById('cd-secs'),
    banner:  document.getElementById('cd-banner'),
  };

  function tick() {
    const now  = new Date();
    const diff = TRIP_START - now;

    if (diff <= 0) {
      if (el.banner) el.banner.textContent = '🏔️ The trip is ON! See you in the mountains!';
      return;
    }

    const d  = Math.floor(diff / 86400000);
    const h  = Math.floor((diff % 86400000) / 3600000);
    const m  = Math.floor((diff % 3600000) / 60000);
    const s  = Math.floor((diff % 60000) / 1000);

    if (el.days)  el.days.textContent  = String(d).padStart(2, '0');
    if (el.hours) el.hours.textContent = String(h).padStart(2, '0');
    if (el.mins)  el.mins.textContent  = String(m).padStart(2, '0');
    if (el.secs)  el.secs.textContent  = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

// ── HERO CANVAS (starfield) ───────────────────
function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      s: (Math.random() - 0.5) * 0.3,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(st => {
      st.a += st.s * 0.02;
      if (st.a > 1) { st.a = 1; st.s *= -1; }
      if (st.a < 0) { st.a = 0; st.s *= -1; }
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${st.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ── NAV ────────────────────────────────────────
function initNav() {
  const navbar  = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Active link on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    });
  });
}

// ── MOBILE MENU ────────────────────────────────
function initMobileMenu() {
  const btn   = document.getElementById('menu-btn');
  const menu  = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.innerHTML = open ? '✕' : '☰';
  });
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('menu-btn');
  if (menu) menu.classList.remove('open');
  if (btn)  { btn.innerHTML = '☰'; btn.setAttribute('aria-expanded', false); }
}

// ── BUILD ITINERARY ────────────────────────────
function buildItinerary() {
  const tabBar  = document.getElementById('day-tabs');
  const panels  = document.getElementById('day-panels');
  if (!tabBar || !panels) return;

  itinerary.forEach((day, i) => {
    // Tab button
    const btn = document.createElement('button');
    btn.className = 'day-tab' + (i === 0 ? ' active' : '');
    btn.dataset.day = i;
    btn.innerHTML = `<span class="tab-num">Day ${day.day}</span><span class="tab-label">${day.emoji}</span>`;
    btn.style.setProperty('--tab-color', day.color);
    btn.addEventListener('click', () => switchDay(i));
    tabBar.appendChild(btn);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'day-panel' + (i === 0 ? ' active' : '');
    panel.id = `panel-${i}`;

    panel.innerHTML = `
      <div class="panel-header">
        <div class="panel-day-num" style="color:${day.color}">Day ${day.day}</div>
        <div>
          <h3 class="panel-title">${day.title}</h3>
          <p class="panel-date">${day.date}</p>
        </div>
      </div>
      <div class="timeline">
        ${day.events.map((ev, ei) => buildEventHTML(ev, ei, day.color)).join('')}
      </div>
    `;
    panels.appendChild(panel);
  });
}

function buildEventHTML(ev, i, color) {
  const typeClass = {
    travel: 'type-travel', food: 'type-food', explore: 'type-explore',
    trek: 'type-trek', stay: 'type-stay', chill: 'type-chill', optional: 'type-optional',
  }[ev.type] || 'type-explore';

  const mapsBtn = ev.mapsLink
    ? `<a class="btn-maps small" href="${ev.mapsLink}" target="_blank" rel="noopener">
         📍 Directions
       </a>`
    : '';

  return `
    <div class="tl-item reveal" style="--i:${i}">
      <div class="tl-dot" style="background:${color}">
        <span>${ev.icon}</span>
      </div>
      <div class="tl-content">
        <div class="tl-time">
          ${ev.time}${ev.endTime ? ' → ' + ev.endTime : ''}
          ${ev.duration ? `<span class="tl-dur">${ev.duration}</span>` : ''}
        </div>
        <h4 class="tl-title">${ev.title}</h4>
        <p class="tl-desc">${ev.desc}</p>
        <div class="tl-foot">
          <span class="ev-type ${typeClass}">${ev.type}</span>
          ${mapsBtn}
        </div>
      </div>
    </div>
  `;
}

function switchDay(i) {
  document.querySelectorAll('.day-tab').forEach((t, ti) => t.classList.toggle('active', ti === i));
  document.querySelectorAll('.day-panel').forEach((p, pi) => {
    p.classList.toggle('active', pi === i);
    if (pi === i) {
      setTimeout(() => p.querySelectorAll('.reveal').forEach((el, ei) => {
        setTimeout(() => el.classList.add('visible'), ei * 80);
      }), 30);
    }
  });
}

// Animate first panel on load
setTimeout(() => {
  document.querySelectorAll('#panel-0 .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 100);
  });
}, 400);

// ── BUILD PLACES ───────────────────────────────
function buildPlaces() {
  const grid = document.getElementById('places-grid');
  if (!grid) return;

  places.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'place-card reveal';
    card.style.setProperty('--i', i);

    card.innerHTML = `
      <div class="place-img-wrap">
        <img
          src="${p.image}"
          alt="${p.name}"
          loading="lazy"
          onerror="this.style.display='none';this.parentElement.style.background='${p.fallbackGradient}'"
        />
        <div class="place-overlay">
          <span class="place-day-badge">${p.dayLabel}</span>
          <span class="place-cat">${p.category}</span>
        </div>
      </div>
      <div class="place-body">
        <h3 class="place-name">${p.name}</h3>
        <p class="place-desc">${p.description}</p>
        <div class="place-meta">
          <span>⏱ ${p.duration}</span>
          <span>🌅 ${p.bestTime}</span>
          <span>🎫 ${p.entryFee}</span>
          <span>💪 ${p.difficulty}</span>
        </div>
        <div class="place-tip">💡 <em>${p.tips}</em></div>
        <div class="place-actions">
          <a class="btn-maps" href="${p.dirLink}" target="_blank" rel="noopener">
            📍 Get Directions
          </a>
          <a class="btn-outline" href="${p.mapsLink}" target="_blank" rel="noopener">
            🗺 View on Map
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ── BUILD FOOD GUIDE ───────────────────────────
function buildFoodGuide() {
  const filterBar = document.getElementById('food-filters');
  const grid      = document.getElementById('food-grid');
  if (!filterBar || !grid) return;

  // Collect all food places
  const allPlaces = [];
  foodGuide.filter(a => a.area !== 'all').forEach(area => {
    area.places.forEach(p => allPlaces.push({ ...p, area: area.area, areaLabel: area.areaLabel }));
  });

  // Build filter buttons
  foodGuide.forEach(area => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (area.area === 'all' ? ' active' : '');
    btn.dataset.filter = area.area;
    btn.textContent = area.areaLabel;
    btn.addEventListener('click', () => filterFood(area.area));
    filterBar.appendChild(btn);
  });

  // Build cards
  allPlaces.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'food-card reveal';
    card.dataset.area = p.area;
    card.style.setProperty('--i', i);

    const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
    const priceLabel = '₹'.repeat(p.priceNum) + '<span style="opacity:.3">' + '₹'.repeat(3 - p.priceNum) + '</span>';
    const localBadge = p.localRec ? '<span class="local-badge">👥 Local Pick</span>' : '';

    card.innerHTML = `
      <div class="food-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'" />
        <div class="food-emoji-overlay">${p.emoji}</div>
      </div>
      <div class="food-body">
        <div class="food-top">
          <div>
            <h4 class="food-name">${p.name} ${localBadge}</h4>
            <p class="food-cuisine">${p.cuisine}</p>
          </div>
          <div class="food-price">${priceLabel}</div>
        </div>
        <p class="food-specialty">⭐ <strong>${p.specialty}</strong></p>
        <p class="food-note">${p.notes}</p>
        <div class="food-meta">
          <span>🕐 ${p.timings}</span>
          <span>🎯 ${p.bestFor}</span>
        </div>
        <div class="food-rating">${stars} <span>${p.rating}</span></div>
        <div class="food-area-tag">${p.areaLabel}</div>
        <a class="btn-maps" href="${p.dirLink}" target="_blank" rel="noopener">
          📍 Get Directions
        </a>
      </div>
    `;
    grid.appendChild(card);
  });

  // Trigger initial reveal
  setTimeout(observeReveal, 100);
}

function filterFood(area) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === area));
  document.querySelectorAll('.food-card').forEach(card => {
    const match = area === 'all' || card.dataset.area === area;
    card.style.display = match ? '' : 'none';
  });
}

// ── BUILD PACKING ──────────────────────────────
function buildPacking() {
  const container = document.getElementById('packing-list');
  if (!container) return;

  let totalItems = 0;
  let checkedItems = 0;

  packingList.forEach((cat, ci) => {
    const section = document.createElement('div');
    section.className = 'pack-category reveal';
    section.style.setProperty('--i', ci);

    const items = cat.items.map((item, ii) => {
      const id = `pack-${ci}-${ii}`;
      totalItems++;
      return `
        <label class="pack-item" for="${id}">
          <input type="checkbox" id="${id}" class="pack-check" />
          <span class="pack-tick">✓</span>
          <span class="pack-text">${item}</span>
        </label>
      `;
    }).join('');

    section.innerHTML = `
      <h4 class="pack-cat-title">${cat.category}</h4>
      <div class="pack-items">${items}</div>
    `;
    container.appendChild(section);
  });

  // Progress bar
  const bar      = document.getElementById('pack-progress-fill');
  const countEl  = document.getElementById('pack-count');
  const totalEl  = document.getElementById('pack-total');
  if (totalEl) totalEl.textContent = totalItems;

  document.addEventListener('change', e => {
    if (!e.target.classList.contains('pack-check')) return;
    checkedItems = document.querySelectorAll('.pack-check:checked').length;
    const pct = Math.round((checkedItems / totalItems) * 100);
    if (bar)     bar.style.width = pct + '%';
    if (countEl) countEl.textContent = checkedItems;
    e.target.closest('.pack-item')?.classList.toggle('checked', e.target.checked);
  });
}

// ── BUILD WEATHER ──────────────────────────────
function buildWeather() {
  const el = document.getElementById('weather-card');
  if (!el) return;
  el.innerHTML = `
    <div class="wx-row">
      <div class="wx-block">
        <span class="wx-icon">${weather.day.icon}</span>
        <span class="wx-label">Daytime</span>
        <span class="wx-temp">${weather.day.min}–${weather.day.max}°C</span>
      </div>
      <div class="wx-divider">|</div>
      <div class="wx-block">
        <span class="wx-icon">${weather.night.icon}</span>
        <span class="wx-label">Nights</span>
        <span class="wx-temp">${weather.night.min}–${weather.night.max}°C</span>
      </div>
      <div class="wx-divider">|</div>
      <div class="wx-block wx-condition">
        <span class="wx-cond-text">${weather.condition}</span>
        <span class="wx-tip">💡 ${weather.tip}</span>
      </div>
    </div>
  `;
}

// ── SCROLL ANIMATIONS ──────────────────────────
function initScrollAnimations() {
  observeReveal();
}

function observeReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const i = parseInt(entry.target.style.getPropertyValue('--i') || 0);
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

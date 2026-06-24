/* ============================================================
   ADVERTISEIQ — SHARED SITE SCRIPTS
   ============================================================ */

(function () {
  'use strict';

  const html = document.documentElement;

  /* ── Page Loader ── */
  window.addEventListener('load', function () {
    const loader = document.getElementById('page-loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 280);
  });

  /* ============================================================
     THEME SYSTEM
     System / Dark / Light with localStorage persistence
     ============================================================ */
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(themeChoice) {
    // themeChoice: 'system' | 'dark' | 'light'
    const resolved = themeChoice === 'system' ? getSystemTheme() : themeChoice;
    html.setAttribute('data-theme', resolved);
    localStorage.setItem('aiq-theme-choice', themeChoice);
    applyThemeAssets(resolved);

    // Keep settings panel options in sync
    document.querySelectorAll('.theme-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeChoice === themeChoice);
    });

    // Keep nav theme icon in sync
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = resolved === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }

  function applyThemeAssets(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    ['navLogo', 'footerLogo', 'loaderLogo'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.src = theme === 'dark' ? 'assets/img/logo-dark.svg' : 'assets/img/logo.svg';
    });
  }

  // Init theme on load
  const savedChoice = localStorage.getItem('aiq-theme-choice') || 'system';
  applyTheme(savedChoice);

  // Watch for system preference changes (when using "system" mode)
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    const choice = localStorage.getItem('aiq-theme-choice') || 'system';
    if (choice === 'system') applyTheme('system');
  });

  // Legacy nav theme toggle (keep backward compat)
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ============================================================
     SETTINGS FAB + DRAWER  (injected dynamically so it works
     on every page without touching HTML files)
     ============================================================ */
  function injectSettingsPanel() {
    const fab = document.createElement('button');
    fab.className = 'settings-fab';
    fab.id = 'settingsFab';
    fab.setAttribute('aria-label', 'Appearance settings');
    fab.innerHTML = '<i class="bi bi-sliders spin-on-hover"></i>';

    const backdrop = document.createElement('div');
    backdrop.className = 'settings-backdrop';
    backdrop.id = 'settingsBackdrop';

    const currentChoice = localStorage.getItem('aiq-theme-choice') || 'system';

    const drawer = document.createElement('div');
    drawer.className = 'settings-drawer';
    drawer.id = 'settingsDrawer';
    drawer.innerHTML = `
      <div class="settings-drawer-header">
        <h4><i class="bi bi-palette" style="margin-right:8px;color:var(--accent)"></i>Appearance</h4>
        <button class="settings-close-btn" id="settingsCloseBtn" aria-label="Close settings">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="settings-section">
        <div class="settings-section-title">Theme Mode</div>
        <div class="theme-options">
          <button class="theme-opt${currentChoice === 'system' ? ' active' : ''}" data-theme-choice="system">
            <div class="theme-opt-icon">💻</div>
            <div>
              <div style="font-weight:700;font-size:.875rem;color:var(--text)">System</div>
              <div style="font-size:.75rem;color:var(--text-muted);margin-top:1px">Follows your OS setting</div>
            </div>
            <div class="theme-opt-check"><i class="bi bi-check2"></i></div>
          </button>
          <button class="theme-opt${currentChoice === 'dark' ? ' active' : ''}" data-theme-choice="dark">
            <div class="theme-opt-icon">🌙</div>
            <div>
              <div style="font-weight:700;font-size:.875rem;color:var(--text)">Dark</div>
              <div style="font-size:.75rem;color:var(--text-muted);margin-top:1px">Easy on the eyes at night</div>
            </div>
            <div class="theme-opt-check"><i class="bi bi-check2"></i></div>
          </button>
          <button class="theme-opt${currentChoice === 'light' ? ' active' : ''}" data-theme-choice="light">
            <div class="theme-opt-icon">☀️</div>
            <div>
              <div style="font-weight:700;font-size:.875rem;color:var(--text)">Light</div>
              <div style="font-size:.75rem;color:var(--text-muted);margin-top:1px">Crisp and clean look</div>
            </div>
            <div class="theme-opt-check"><i class="bi bi-check2"></i></div>
          </button>
        </div>
      </div>

      <div class="settings-info">
        <i class="bi bi-info-circle" style="color:var(--accent)"></i>
        &nbsp;Your preference is saved locally and applied across all pages automatically.
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    function openSettings() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
    }
    function closeSettings() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
    }

    fab.addEventListener('click', openSettings);
    backdrop.addEventListener('click', closeSettings);
    document.getElementById('settingsCloseBtn').addEventListener('click', closeSettings);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSettings(); });

    drawer.querySelectorAll('.theme-opt').forEach(btn => {
      btn.addEventListener('click', () => applyTheme(btn.dataset.themeChoice));
    });
  }

  injectSettingsPanel();

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  function initCursor() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const dot  = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.id = 'cursorDot';

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.id = 'cursorRing';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100, my = -100; // mouse position
    let rx = -100, ry = -100; // ring position (lerp'd)
    const lerp = 0.12;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Hover state on interactive elements
    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, label, .anti-gravity, .faq-question, .stack-card, .theme-opt, .sstack-nav-item';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(interactiveSelector)) ring.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(interactiveSelector)) ring.classList.remove('cursor-hover');
    });

    // Click effect
    document.addEventListener('mousedown', () => ring.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('cursor-click'));

    // Cursor leaves/enters window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

    // Smooth ring follow via rAF
    function animate() {
      rx += (mx - rx) * lerp;
      ry += (my - ry) * lerp;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animate);
    }
    animate();
  }

  initCursor();

  /* ── Nav: scroll shadow + hamburger ── */
  const mainNav = document.getElementById('mainNav');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      mainNav.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }

  /* ── Mark active nav link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'index.html') || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ============================================================
     WAVY BACKGROUND (Canvas)
     ============================================================ */
  (function initWavyBg() {
    const canvas = document.getElementById('wavyBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const isDark = () => html.getAttribute('data-theme') !== 'light';
    const waves = [
      { amp: 55, freq: 0.0018, speed: 0.008, yRatio: 0.38, alpha: 0.045 },
      { amp: 40, freq: 0.0025, speed: 0.012, yRatio: 0.52, alpha: 0.035 },
      { amp: 65, freq: 0.0014, speed: 0.006, yRatio: 0.65, alpha: 0.025 },
      { amp: 30, freq: 0.003,  speed: 0.018, yRatio: 0.78, alpha: 0.020 }
    ];

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      const accent = isDark() ? '59,130,246' : '37,99,235';
      waves.forEach((wv, i) => {
        ctx.beginPath();
        const baseY = h * wv.yRatio;
        ctx.moveTo(0, h);
        ctx.lineTo(0, baseY + Math.sin(t * wv.speed + i) * wv.amp);
        for (let x = 0; x <= w; x += 4) {
          const y = baseY + Math.sin(x * wv.freq + t * wv.speed + i * 1.2) * wv.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = `rgba(${accent},${wv.alpha})`;
        ctx.fill();
      });
      t++;
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ============================================================
     TEXT GENERATE / TYPEWRITER
     ============================================================ */
  (function initTypewriter() {
    const el = document.getElementById('heroTypewriter');
    if (!el) return;
    const words = ['Precision', 'Intelligence', 'Automation', 'Efficiency', 'Results'];
    let wi = 0, ci = 0, deleting = false, pauseTicks = 0;

    function tick() {
      const word = words[wi];
      if (deleting) {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
        setTimeout(tick, 55);
      } else {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) {
          if (pauseTicks < 18) { pauseTicks++; setTimeout(tick, 100); }
          else { pauseTicks = 0; deleting = true; setTimeout(tick, 55); }
        } else {
          setTimeout(tick, 68);
        }
      }
    }
    setTimeout(tick, 800);
  })();

  /* ============================================================
     BILLING TAB TOGGLE
     ============================================================ */
  (function initBillingTab() {
    document.querySelectorAll('.billing-tab-toggle').forEach(container => {
      const tabs  = container.querySelectorAll('.bill-tab');
      const indic = container.querySelector('.bill-tab-indicator');
      if (!tabs.length) return;

      function setIndicator(activeTab) {
        if (!indic) return;
        const cr = container.getBoundingClientRect();
        const tr = activeTab.getBoundingClientRect();
        indic.style.width     = tr.width + 'px';
        indic.style.transform = `translateX(${tr.left - cr.left - 5}px)`;
      }

      tabs[0].classList.add('active');
      setTimeout(() => setIndicator(container.querySelector('.bill-tab.active') || tabs[0]), 50);

      function animateCount(el, from, to, dur) {
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(from + (to - from) * e);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          setIndicator(tab);
          const isAnnual = tab.dataset.period === 'annual';
          document.querySelectorAll('.price-amount').forEach(el => {
            animateCount(el, +el.textContent, isAnnual ? +el.dataset.annual : +el.dataset.monthly, 400);
          });
        });
      });

      window.addEventListener('resize', () => {
        const a = container.querySelector('.bill-tab.active');
        if (a) setIndicator(a);
      });
    });
  })();

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Feature filter ── */
  const filterBar = document.getElementById('filterBar');
  if (filterBar) {
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('#featuresGrid .fp-card').forEach(card => {
          const matches = cat === 'all' || card.dataset.cat === cat;
          card.style.display = matches ? '' : 'none';
        });
      });
    });
  }

  /* ── Stack carousel ── */
  (function initStack() {
    const track = document.getElementById('stackTrack');
    const dotsContainer = document.getElementById('stackDots');
    const prevBtn = document.getElementById('stackPrev');
    const nextBtn = document.getElementById('stackNext');
    if (!track) return;

    const cardsData = [
      { icon: 'bi-megaphone', iconClass: 'icon-purple', title: 'Campaign Manager', desc: 'Build and manage high-performing campaigns with ease.', details: ['Smart bid adj.', 'Budget automation', 'Campaign scheduling', 'Performance rules'], metric: '+32% ROAS', metricIcon: 'bi-graph-up-arrow' },
      { icon: 'bi-robot', iconClass: 'icon-sky', title: 'Bid Automation', desc: 'AI adjusts bids to hit target ACOS and maximize ROI.', details: ['Real-time bidding', 'Target ACOS', 'Placement rules', '24/7 optimization'], metric: '-21% ACOS', metricIcon: 'bi-arrow-down-circle' },
      { icon: 'bi-grid', iconClass: 'icon-orange', title: 'Placement Rules', desc: 'Win Top of Search and outperform competitors consistently.', details: ['Top-of-search bid', 'Competitor targeting', 'Dynamic placement', 'Performance split'], metric: 'Top 3 share +47%', metricIcon: 'bi-trophy' },
      { icon: 'bi-wallet2', iconClass: 'icon-green', title: 'Budget Automation', desc: 'Pause and enable campaigns automatically based on budget rules.', details: ['Daily budget caps', 'Automated pausing', 'Budget alerts', 'Spend forecasting'], metric: '-18% overspend', metricIcon: 'bi-piggy-bank' },
      { icon: 'bi-graph-up-arrow', iconClass: 'icon-amber', title: 'Analytics Dashboard', desc: 'Real-time visibility into every metric driving your business.', details: ['Sales attribution', 'Profit analytics', 'Custom reports', 'Multi-market view'], metric: '3.2x avg. ROAS', metricIcon: 'bi-eye' },
      { icon: 'bi-bell', iconClass: 'icon-rose', title: 'Smart Alerts', desc: 'Get notified about critical changes before they impact revenue.', details: ['Inventory alerts', 'Sales drop', 'Budget exhausted', 'Anomaly detection'], metric: '-28% stockouts', metricIcon: 'bi-shield-check' }
    ];

    let currentIndex = 0;
    const total = cardsData.length;

    function renderCards() {
      track.innerHTML = '';
      cardsData.forEach((card, idx) => {
        const div = document.createElement('div');
        div.className = 'stack-card';
        div.dataset.index = idx;
        div.innerHTML = `
          <div class="card-icon ${card.iconClass}"><i class="bi ${card.icon}"></i></div>
          <h4>${card.title}</h4>
          <div class="card-desc">${card.desc}</div>
          <div class="detail-grid">${card.details.map(d => `<div class="detail-item"><i class="bi bi-check2-circle"></i> ${d}</div>`).join('')}</div>
          <div class="card-metric"><i class="bi ${card.metricIcon}"></i> ${card.metric}</div>`;
        track.appendChild(div);
      });
    }

    function updateStack() {
      const cards = track.querySelectorAll('.stack-card');
      if (!cards.length) return;
      cards.forEach(c => c.classList.remove('active', 'prev', 'next', 'far-left', 'far-right'));
      cards[currentIndex]?.classList.add('active');
      cards[(currentIndex - 1 + total) % total]?.classList.add('prev');
      cards[(currentIndex + 1) % total]?.classList.add('next');
      cards[(currentIndex - 2 + total) % total]?.classList.add('far-left');
      cards[(currentIndex + 2) % total]?.classList.add('far-right');
      dotsContainer?.querySelectorAll('.stack-dot').forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) { currentIndex = (index + total) % total; updateStack(); }

    function init() {
      renderCards();
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.className = 'stack-dot' + (i === 0 ? ' active' : '');
          dot.dataset.index = i;
          dot.addEventListener('click', () => goTo(i));
          dotsContainer.appendChild(dot);
        }
      }
      goTo(0);
      prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
      nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
        else if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      });
      let startX = 0, isDragging = false;
      track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
      window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        if (Math.abs(e.clientX - startX) > 50) {
          goTo(e.clientX < startX ? currentIndex + 1 : currentIndex - 1);
          isDragging = false;
        }
      });
      window.addEventListener('mouseup', () => { isDragging = false; });
      track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend',   e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) goTo(diff < 0 ? currentIndex + 1 : currentIndex - 1);
      }, { passive: true });
      window.addEventListener('resize', updateStack, { passive: true });
    }
    init();
  })();

  /* ============================================================
     SCROLL STACK (Sticky Platform Reveal)
     ============================================================ */
  (function initScrollStack() {
    const section = document.getElementById('sstackSection');
    if (!section) return;
    const navItems = section.querySelectorAll('.sstack-nav-item');
    const cards    = section.querySelectorAll('.sstack-card');
    if (!cards.length) return;
    const total = cards.length;
    let current = 0;

    function activate(idx) {
      if (idx === current && cards[idx].classList.contains('scard-active')) return;
      current = idx;
      cards.forEach((c, i) => {
        c.classList.remove('scard-active', 'scard-behind-1', 'scard-behind-2');
        if (i === idx) c.classList.add('scard-active');
        else if (i === (idx + 1) % total) c.classList.add('scard-behind-1');
        else if (i === (idx + 2) % total) c.classList.add('scard-behind-2');
      });
      navItems.forEach((n, i) => n.classList.toggle('active', i === idx));
    }

    function onScroll() {
      const rect    = section.getBoundingClientRect();
      const scrolled = -rect.top;
      if (scrolled < 0 || scrolled > section.offsetHeight - window.innerHeight) return;
      const progress = scrolled / (section.offsetHeight - window.innerHeight);
      activate(Math.min(Math.floor(progress * total), total - 1));
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    activate(0);

    navItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        const top = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + (i / total) * (section.offsetHeight - window.innerHeight), behavior: 'smooth' });
      });
    });
  })();

  /* ============================================================
     WORLD MAP CANVAS
     ============================================================ */
  (function initWorldMap() {
    const canvas = document.getElementById('worldMapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const hubs = [
      { x:0.18,y:0.42,size:7 },{ x:0.13,y:0.52,size:4 },{ x:0.22,y:0.64,size:5 },
      { x:0.47,y:0.30,size:6 },{ x:0.50,y:0.32,size:5 },{ x:0.49,y:0.36,size:4 },
      { x:0.51,y:0.37,size:4 },{ x:0.48,y:0.35,size:4 },{ x:0.55,y:0.28,size:3 },
      { x:0.56,y:0.26,size:3 },{ x:0.62,y:0.30,size:3 },{ x:0.65,y:0.38,size:4 },
      { x:0.66,y:0.42,size:4 },{ x:0.68,y:0.44,size:6 },{ x:0.82,y:0.38,size:6 },
      { x:0.80,y:0.42,size:5 },{ x:0.78,y:0.50,size:4 },{ x:0.86,y:0.72,size:5 }
    ];

    const dotMap = [
      { y:0.20,segs:[[0.10,0.22],[0.44,0.56],[0.60,0.90]] },
      { y:0.25,segs:[[0.09,0.24],[0.43,0.57],[0.58,0.92]] },
      { y:0.30,segs:[[0.10,0.26],[0.42,0.58],[0.57,0.93]] },
      { y:0.35,segs:[[0.12,0.25],[0.44,0.60],[0.57,0.90]] },
      { y:0.40,segs:[[0.13,0.24],[0.45,0.62],[0.56,0.88]] },
      { y:0.45,segs:[[0.14,0.23],[0.45,0.55],[0.60,0.72],[0.76,0.86]] },
      { y:0.50,segs:[[0.15,0.22],[0.10,0.14],[0.58,0.68],[0.76,0.84]] },
      { y:0.55,segs:[[0.16,0.20],[0.10,0.15],[0.55,0.64]] },
      { y:0.60,segs:[[0.17,0.21],[0.12,0.14],[0.44,0.54]] },
      { y:0.65,segs:[[0.18,0.24],[0.43,0.52],[0.84,0.90]] },
      { y:0.70,segs:[[0.20,0.26],[0.44,0.50]] },
      { y:0.75,segs:[[0.22,0.28],[0.44,0.48],[0.82,0.90]] }
    ];

    let pulse = 0;

    function drawMap() {
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { requestAnimationFrame(drawMap); return; }
      ctx.clearRect(0, 0, W, H);
      const isDark = html.getAttribute('data-theme') !== 'light';
      const dotAlpha = isDark ? 0.18 : 0.12;
      const hubColor = isDark ? '#3b82f6' : '#2563eb';
      const spacing  = 14;
      const cols = Math.ceil(W / spacing);

      dotMap.forEach(row => {
        const r = Math.round((row.y * H) / spacing);
        row.segs.forEach(seg => {
          for (let c = 0; c < cols; c++) {
            const xn = (c * spacing + spacing / 2) / W;
            if (xn >= seg[0] && xn <= seg[1]) {
              ctx.beginPath();
              ctx.arc(c * spacing + spacing / 2, r * spacing + spacing / 2, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(59,130,246,${dotAlpha})`;
              ctx.fill();
            }
          }
        });
      });

      hubs.forEach((h1, i) => {
        hubs.forEach((h2, j) => {
          if (j <= i) return;
          if (Math.hypot(h1.x - h2.x, h1.y - h2.y) > 0.28) return;
          const g = ctx.createLinearGradient(h1.x*W, h1.y*H, h2.x*W, h2.y*H);
          g.addColorStop(0, isDark ? 'rgba(59,130,246,0.35)' : 'rgba(37,99,235,0.25)');
          g.addColorStop(1, 'rgba(59,130,246,0)');
          ctx.beginPath();
          ctx.moveTo(h1.x*W, h1.y*H);
          ctx.lineTo(h2.x*W, h2.y*H);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      hubs.forEach((hub, i) => {
        const x = hub.x*W, y = hub.y*H;
        const pf = (Math.sin(pulse * 0.04 + i * 0.8) + 1) / 2;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, hub.size * 3 + pf * 6);
        grd.addColorStop(0, isDark ? 'rgba(59,130,246,0.5)' : 'rgba(37,99,235,0.4)');
        grd.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.beginPath();
        ctx.arc(x, y, hub.size * 3 + pf * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, hub.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = hubColor;
        ctx.fill();
      });

      pulse++;
      requestAnimationFrame(drawMap);
    }
    drawMap();
  })();

  /* ── Contact form (AJAX + reCAPTCHA) ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const successMsg = document.getElementById('successMsg');
      const errorMsg   = document.getElementById('errorMsg');
      const submitBtn  = contactForm.querySelector('.form-submit');

      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg)   errorMsg.style.display   = 'none';
      if (submitBtn)  { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      function showMsg(el, msg) { if (el) { el.innerHTML = msg; el.style.display = 'block'; } }

      function sendForm(token) {
        const ri = document.getElementById('g-recaptcha-response');
        if (ri && token) ri.value = token;
        fetch('contact-mail.php', { method: 'POST', body: new FormData(contactForm) })
          .then(r => r.json())
          .then(d => {
            if (d.success) {
              contactForm.reset();
              showMsg(successMsg, '<i class="bi bi-check-circle-fill"></i> Thank you! We\'ll be in touch within 24 hours.');
            } else {
              showMsg(errorMsg, '<i class="bi bi-exclamation-circle-fill"></i> ' + (d.message || 'Something went wrong. Please try again.'));
            }
          })
          .catch(() => showMsg(errorMsg, '<i class="bi bi-exclamation-circle-fill"></i> Network error. Please try again.'))
          .finally(() => {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = 'Send Message <i class="bi bi-arrow-right"></i>'; }
          });
      }

      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.ready(() => {
          grecaptcha.execute('6LfzFEgsAAAAAPaNZetpq1UVZeb1CscjstB2Gb6l', { action: 'contact' })
            .then(sendForm).catch(() => sendForm(null));
        });
      } else {
        sendForm(null);
      }
    });
  }

  /* ── Anti-gravity hover ── */
  document.querySelectorAll('.anti-gravity').forEach(el => {
    el.addEventListener('mouseenter', () => el.classList.add('hovered'));
    el.addEventListener('mouseleave', () => el.classList.remove('hovered'));
  });

})();

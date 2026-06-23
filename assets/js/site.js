/* ============================================================
   ADVERTISEIQ — SHARED SITE SCRIPTS
   ============================================================ */

(function () {
  'use strict';

  /* ── Page Loader ── */
  window.addEventListener('load', function () {
    const loader = document.getElementById('page-loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 280);
  });

  /* ── Theme (dark / light) ── */
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('aiq-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  applyThemeAssets(savedTheme);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('aiq-theme', next);
      applyThemeAssets(next);
    });
  }

  function applyThemeAssets(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    const navLogo = document.getElementById('navLogo');
    if (navLogo) navLogo.src = theme === 'dark' ? 'assets/img/logo-dark.svg' : 'assets/img/logo.svg';
    const footerLogo = document.getElementById('footerLogo');
    if (footerLogo) footerLogo.src = theme === 'dark' ? 'assets/img/logo-dark.svg' : 'assets/img/logo.svg';
    const loaderLogo = document.getElementById('loaderLogo');
    if (loaderLogo) loaderLogo.src = theme === 'dark' ? 'assets/img/logo-dark.svg' : 'assets/img/logo.svg';
  }

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
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Wavy Background (Canvas) ── */
  (function initWavyBg() {
    const canvas = document.getElementById('wavyBgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, raf;

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
      { amp: 30, freq: 0.003,  speed: 0.018, yRatio: 0.78, alpha: 0.02  }
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
      raf = requestAnimationFrame(draw);
    }
    draw();

    // React to theme changes
    new MutationObserver(() => {}).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  })();

  /* ── Text Type — ReactBits-style scramble/decode effect ── */
  (function initTextType() {
    const el = document.getElementById('heroTypewriter');
    if (!el) return;

    const words  = ['Precision', 'Intelligence', 'Automation', 'Efficiency', 'Growth'];
    const POOL   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!%&';
    const SCRAMBLE_MS = 38;   /* speed of each scramble frame          */
    const REVEAL_MS   = 52;   /* ms between each character being locked */
    const HOLD_MS     = 2400; /* pause after word is fully revealed     */

    let wi = 0;
    let timer = null;

    function rndChar() {
      return POOL[Math.floor(Math.random() * POOL.length)];
    }

    /* Build the span structure: one .tt-char span per character */
    function buildSpans(word) {
      el.innerHTML = '';
      return Array.from(word).map(function (ch) {
        var span = document.createElement('span');
        span.className = 'tt-char';
        span.textContent = rndChar();
        el.appendChild(span);
        return span;
      });
    }

    function scrambleWord(word, onDone) {
      var spans   = buildSpans(word);
      var locked  = new Array(word.length).fill(false);
      var current = 0;

      /* Phase 1: scramble all chars while revealing left-to-right */
      function scrambleTick() {
        spans.forEach(function (s, i) {
          if (!locked[i]) s.textContent = rndChar();
        });

        /* Lock the next char every REVEAL_MS */
        if (current < word.length) {
          locked[current] = true;
          spans[current].textContent = word[current];
          spans[current].classList.add('tt-locked');
          current++;
        }

        if (current < word.length) {
          timer = setTimeout(function () {
            timer = setTimeout(scrambleTick, SCRAMBLE_MS);
          }, current === 1 ? REVEAL_MS : REVEAL_MS);
        } else {
          /* All locked — hold then move to next word */
          timer = setTimeout(onDone, HOLD_MS);
        }
      }

      timer = setTimeout(scrambleTick, 60);
    }

    function cycle() {
      var word = words[wi];
      scrambleWord(word, function () {
        /* Quick scramble-out before next word */
        var spans = el.querySelectorAll('.tt-char');
        var count = { v: 0 };
        var total = spans.length * SCRAMBLE_MS * 2;
        spans.forEach(function (s, i) {
          setTimeout(function () {
            s.classList.remove('tt-locked');
          }, i * 18);
        });
        timer = setTimeout(function () {
          wi = (wi + 1) % words.length;
          cycle();
        }, spans.length * 18 + 120);
      });
    }

    timer = setTimeout(cycle, 700);
  })();

  /* ── Billing Tab Toggle ── */
  (function initBillingTab() {
    document.querySelectorAll('.billing-tab-toggle').forEach(container => {
      const tabs    = container.querySelectorAll('.bill-tab');
      const indic   = container.querySelector('.bill-tab-indicator');
      if (!tabs.length) return;

      function setIndicator(activeTab) {
        if (!indic) return;
        const containerRect = container.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        indic.style.width  = tabRect.width + 'px';
        indic.style.transform = `translateX(${tabRect.left - containerRect.left - 5}px)`;
      }

      // Init indicator on first active tab
      const initialActive = container.querySelector('.bill-tab.active') || tabs[0];
      tabs[0].classList.add('active');
      setTimeout(() => setIndicator(initialActive), 50);

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          setIndicator(tab);

          const isAnnual = tab.dataset.period === 'annual';
          document.querySelectorAll('.price-amount').forEach(el => {
            const target = isAnnual ? +el.dataset.annual : +el.dataset.monthly;
            animateCount(el, +el.textContent, target, 400);
          });
          // Update period label
          const periodEls = document.querySelectorAll('.price-period');
          periodEls.forEach(p => {
            if (isAnnual) {
              p.innerHTML = p.innerHTML.replace('/mo', '/mo <span style="font-size:.7rem;color:var(--success);">billed annually</span>');
            } else {
              p.textContent = p.textContent.replace(' billed annually', '').trim() === '' ? '/mo' : p.textContent.split('<')[0];
            }
          });
        });
      });

      window.addEventListener('resize', () => {
        const active = container.querySelector('.bill-tab.active');
        if (active) setIndicator(active);
      });
    });

    function animateCount(el, from, to, duration) {
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(from + (to - from) * ease);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
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

  /* ── Feature filter (features page) ── */
  const filterBar = document.getElementById('filterBar');
  if (filterBar) {
    filterBar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('#featuresGrid .fp-card').forEach(card => {
          const matches = cat === 'all' || card.dataset.cat === cat;
          card.setAttribute('data-hidden', !matches);
          card.style.display = matches ? '' : 'none';
        });
      });
    });
  }

  /* ── Stack carousel (showcase) ── */
  (function initStack() {
    const track = document.getElementById('stackTrack');
    const dotsContainer = document.getElementById('stackDots');
    const prevBtn = document.getElementById('stackPrev');
    const nextBtn = document.getElementById('stackNext');
    if (!track) return;

    const cardsData = [
      { icon: 'bi-megaphone', iconClass: 'icon-purple', title: 'Campaign Manager', desc: 'Build, structure and manage high-performing campaigns with ease.', details: ['Smart bid adj.', 'Budget automation', 'Campaign scheduling', 'Performance rules'], metric: '+32% ROAS', metricIcon: 'bi-graph-up-arrow' },
      { icon: 'bi-robot', iconClass: 'icon-sky', title: 'Bid Automation', desc: 'AI adjusts bids automatically to hit target ACOS and maximize ROI.', details: ['Real-time bidding', 'Target ACOS', 'Placement rules', '24/7 optimization'], metric: '-21% ACOS', metricIcon: 'bi-arrow-down-circle' },
      { icon: 'bi-grid', iconClass: 'icon-orange', title: 'Placement Rules', desc: 'Win Top of Search and outperform your competitors consistently.', details: ['Top-of-search bid', 'Competitor targeting', 'Dynamic placement', 'Performance split'], metric: 'Top 3 share +47%', metricIcon: 'bi-trophy' },
      { icon: 'bi-wallet2', iconClass: 'icon-green', title: 'Budget Automation', desc: 'Pause and enable campaigns automatically based on budget rules.', details: ['Daily budget caps', 'Automated pausing', 'Budget alerts', 'Spend forecasting'], metric: '-18% overspend', metricIcon: 'bi-piggy-bank' },
      { icon: 'bi-graph-up-arrow', iconClass: 'icon-amber', title: 'Analytics Dashboard', desc: 'Real-time visibility into every metric that drives your business.', details: ['Sales attribution', 'Profit analytics', 'Custom reports', 'Multi-market view'], metric: '3.2x avg. ROAS', metricIcon: 'bi-eye' },
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
      dotsContainer?.querySelectorAll('.stack-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
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
      track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; track.style.cursor = 'grabbing'; });
      window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        if (Math.abs(e.clientX - startX) > 50) {
          goTo(e.clientX < startX ? currentIndex + 1 : currentIndex - 1);
          isDragging = false; track.style.cursor = '';
        }
      });
      window.addEventListener('mouseup', () => { isDragging = false; track.style.cursor = ''; });
      track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) goTo(diff < 0 ? currentIndex + 1 : currentIndex - 1);
      }, { passive: true });
      window.addEventListener('resize', updateStack, { passive: true });
    }
    init();
  })();

  /* ── Scroll Stack (Sticky Platform Reveal) ── */
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

    // Scroll-driven activation
    function onScroll() {
      const rect    = section.getBoundingClientRect();
      const totalH  = section.offsetHeight;
      const scrolled = -rect.top;
      if (scrolled < 0 || scrolled > totalH - window.innerHeight) return;
      const progress = scrolled / (totalH - window.innerHeight);
      const idx = Math.min(Math.floor(progress * total), total - 1);
      activate(idx);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    activate(0);

    // Nav click
    navItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        // Scroll to corresponding position
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const targetScroll = sectionTop + (i / total) * (section.offsetHeight - window.innerHeight);
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      });
    });
  })();

  /* ── World Map Canvas ── */
  (function initWorldMap() {
    const canvas = document.getElementById('worldMapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawMap();
    }

    // Amazon marketplace hub coordinates (normalized 0-1)
    const hubs = [
      { x: 0.18, y: 0.42, label: 'US', size: 7 },
      { x: 0.13, y: 0.52, label: 'MX', size: 4 },
      { x: 0.22, y: 0.64, label: 'BR', size: 5 },
      { x: 0.47, y: 0.30, label: 'UK', size: 6 },
      { x: 0.50, y: 0.32, label: 'DE', size: 5 },
      { x: 0.49, y: 0.36, label: 'FR', size: 4 },
      { x: 0.51, y: 0.37, label: 'IT', size: 4 },
      { x: 0.48, y: 0.35, label: 'ES', size: 4 },
      { x: 0.55, y: 0.28, label: 'PL', size: 3 },
      { x: 0.56, y: 0.26, label: 'SE', size: 3 },
      { x: 0.62, y: 0.30, label: 'TR', size: 3 },
      { x: 0.65, y: 0.38, label: 'SA', size: 4 },
      { x: 0.66, y: 0.42, label: 'AE', size: 4 },
      { x: 0.68, y: 0.44, label: 'IN', size: 6 },
      { x: 0.82, y: 0.38, label: 'JP', size: 6 },
      { x: 0.80, y: 0.42, label: 'CN', size: 5 },
      { x: 0.78, y: 0.50, label: 'SG', size: 4 },
      { x: 0.86, y: 0.72, label: 'AU', size: 5 },
    ];

    // Simplified dot-grid world map (continent outlines as dots)
    // rows of [xStart, xEnd] ranges for each y level
    const dotMap = [
      // y=0.20 (N America top, Europe top, Asia top)
      { y: 0.20, segs: [[0.10,0.22],[0.44,0.56],[0.60,0.90]] },
      { y: 0.25, segs: [[0.09,0.24],[0.43,0.57],[0.58,0.92]] },
      { y: 0.30, segs: [[0.10,0.26],[0.42,0.58],[0.57,0.93],[0.50,0.55]] },
      { y: 0.35, segs: [[0.12,0.25],[0.44,0.60],[0.57,0.90]] },
      { y: 0.40, segs: [[0.13,0.24],[0.45,0.62],[0.56,0.88],[0.84,0.88]] },
      { y: 0.45, segs: [[0.14,0.23],[0.45,0.55],[0.60,0.72],[0.76,0.86]] },
      { y: 0.50, segs: [[0.15,0.22],[0.10,0.14],[0.58,0.68],[0.76,0.84]] },
      { y: 0.55, segs: [[0.16,0.20],[0.10,0.15],[0.55,0.64]] },
      { y: 0.60, segs: [[0.17,0.21],[0.12,0.14],[0.44,0.54]] },
      { y: 0.65, segs: [[0.18,0.24],[0.43,0.52],[0.84,0.90]] },
      { y: 0.70, segs: [[0.20,0.26],[0.44,0.50]] },
      { y: 0.75, segs: [[0.22,0.28],[0.44,0.48],[0.82,0.90]] },
    ];

    let pulse = 0;
    let raf;

    function drawMap() {
      if (!canvas.width) return;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const isDark = html.getAttribute('data-theme') !== 'light';
      const dotColor = isDark ? 'rgba(59,130,246,0.18)' : 'rgba(37,99,235,0.12)';
      const hubColor = isDark ? '#3b82f6' : '#2563eb';

      // Draw grid dots (continents)
      const spacing = 14;
      const cols = Math.ceil(W / spacing);
      const rows = Math.ceil(H / spacing);

      for (let r = 0; r < rows; r++) {
        const yn = (r * spacing + spacing / 2) / H;
        // Check if this y-row has any segment covering it
        let inMap = false;
        dotMap.forEach(row => {
          if (Math.abs(row.y - yn) < 0.03) {
            row.segs.forEach(seg => {
              for (let c = 0; c < cols; c++) {
                const xn = (c * spacing + spacing / 2) / W;
                if (xn >= seg[0] && xn <= seg[1]) {
                  ctx.beginPath();
                  ctx.arc(c * spacing + spacing / 2, r * spacing + spacing / 2, 2, 0, Math.PI * 2);
                  ctx.fillStyle = dotColor;
                  ctx.fill();
                }
              }
            });
            inMap = true;
          }
        });
      }

      // Draw connection lines between close hubs
      hubs.forEach((h1, i) => {
        hubs.forEach((h2, j) => {
          if (j <= i) return;
          const dist = Math.hypot(h1.x - h2.x, h1.y - h2.y);
          if (dist > 0.28) return;
          const x1 = h1.x * W, y1 = h1.y * H;
          const x2 = h2.x * W, y2 = h2.y * H;
          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, isDark ? 'rgba(59,130,246,0.35)' : 'rgba(37,99,235,0.25)');
          grad.addColorStop(1, 'rgba(59,130,246,0)');
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Draw hubs
      hubs.forEach((hub, i) => {
        const x = hub.x * W, y = hub.y * H;
        const pulseFactor = (Math.sin(pulse * 0.04 + i * 0.8) + 1) / 2;

        // Outer glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, hub.size * 3 + pulseFactor * 6);
        grd.addColorStop(0, isDark ? 'rgba(59,130,246,0.5)' : 'rgba(37,99,235,0.4)');
        grd.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.beginPath();
        ctx.arc(x, y, hub.size * 3 + pulseFactor * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, hub.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = hubColor;
        ctx.fill();
      });

      pulse++;
      raf = requestAnimationFrame(drawMap);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
  })();

  /* ── Contact form (AJAX + reCAPTCHA) ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const successMsg = document.getElementById('successMsg');
      const errorMsg   = document.getElementById('errorMsg');
      const submitBtn  = contactForm.querySelector('.form-submit');

      function showMsg(el, msg) {
        if (el) { el.innerHTML = msg; el.style.display = 'block'; }
      }
      function resetMsgs() {
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg)   errorMsg.style.display   = 'none';
      }

      resetMsgs();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      function sendForm(token) {
        const recaptchaInput = document.getElementById('g-recaptcha-response');
        if (recaptchaInput && token) recaptchaInput.value = token;
        fetch('contact-mail.php', { method: 'POST', body: new FormData(contactForm) })
          .then(r => r.json())
          .then(data => {
            if (data.success) {
              contactForm.reset();
              showMsg(successMsg, '<i class="bi bi-check-circle-fill"></i> Thank you! We\'ll be in touch within 24 hours.');
            } else {
              showMsg(errorMsg, '<i class="bi bi-exclamation-circle-fill"></i> ' + (data.message || 'Something went wrong. Please try again.'));
            }
          })
          .catch(() => {
            showMsg(errorMsg, '<i class="bi bi-exclamation-circle-fill"></i> Network error. Please try again or email us directly.');
          })
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

})();

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

  /* ── Billing toggle (pricing) ── */
  const billingToggle = document.getElementById('billingToggle');
  if (billingToggle) {
    const monthlyLabel = document.getElementById('monthlyLabel');
    const annualLabel = document.getElementById('annualLabel');

    billingToggle.addEventListener('change', function () {
      const isAnnual = this.checked;
      if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
      if (annualLabel) annualLabel.classList.toggle('active', isAnnual);

      document.querySelectorAll('.price-amount').forEach(el => {
        el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
      });
    });
  }

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
      // Drag / swipe
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

  /* ── Contact form (AJAX + reCAPTCHA) ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const successMsg = document.getElementById('successMsg');
      const errorMsg = document.getElementById('errorMsg');
      const submitBtn = contactForm.querySelector('.form-submit');

      function showMsg(el, msg) {
        if (el) { el.innerHTML = msg; el.style.display = 'block'; }
      }

      function resetMsgs() {
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
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

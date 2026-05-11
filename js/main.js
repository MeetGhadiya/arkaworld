/* =============================================
   ARKAWORLD™ — MAIN JAVASCRIPT — FIXED v2
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* 1. NAVBAR SCROLL + PROGRESS BAR */
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.querySelector('.scroll-progress');

  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
    navbar?.classList.toggle('scrolled', scrollTop > 50);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollTop > 300);
  });

  /* 2. HAMBURGER MENU */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu?.classList.toggle('open', isOpen);
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu?.classList.remove('open');
    });
  });

  /* 3. SCROLL-TRIGGERED REVEAL */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* 4. ANIMATED COUNTERS */
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.getAttribute('data-counter'));
        const suffix = entry.target.getAttribute('data-suffix') || '+';
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            entry.target.textContent = target + suffix;
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(current) + suffix;
          }
        }, 28);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  /* 5. PARTICLE GENERATOR */
  const particlesContainer = document.querySelector('.particles');
  if (particlesContainer) {
    const count = parseInt(particlesContainer.getAttribute('data-count') || '20');
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation-delay:${Math.random() * 4}s;
        animation-duration:${(Math.random() * 3 + 5)}s;
        opacity:${Math.random() * 0.5 + 0.1};
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* 6. SCROLL TO TOP */
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* 7. PRODUCT FILTER — index.html pills */
  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  if (filterPills.length) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', function () {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        document.querySelectorAll('[data-category]').forEach(card => {
          const show = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* 8. PRODUCT SEARCH + FILTER — products.html */
  const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const resultCount = document.querySelector('.result-count');

  function filterProducts() {
    const term = (searchInput?.value || '').toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    let visible = 0;

    document.querySelectorAll('.product-item').forEach(item => {
      const name = (item.getAttribute('data-name') || '').toLowerCase();
      const cat = item.getAttribute('data-category') || '';
      const matchSearch = !term || name.includes(term);
      const matchFilter = activeFilter === 'all' || cat === activeFilter;
      const show = matchSearch && matchFilter;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Show/hide category block headers
    document.querySelectorAll('.category-block').forEach(block => {
      const anyVisible = [...block.querySelectorAll('.product-item')].some(i => i.style.display !== 'none');
      block.style.display = anyVisible ? '' : 'none';
    });

    if (resultCount) {
      resultCount.textContent = visible > 0
        ? `Showing ${visible} product${visible !== 1 ? 's' : ''}`
        : 'No products found — try a different search';
    }
  }

  if (searchInput) searchInput.addEventListener('input', filterProducts);
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterProducts();
    });
  });

  /* 9. FORM VALIDATION — contact.html */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      validateAndSubmit();
    });
  }

  function validateAndSubmit() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const rules = {
      name:     { regex: /.{2,}/, msg: 'Please enter your full name' },
      phone:    { regex: /^[6-9][0-9]{9}$/, msg: 'Enter a valid 10-digit Indian mobile number' },
      city:     { regex: /.{2,}/, msg: 'Please enter your city' },
      battery:  { regex: /.+/, msg: 'Please select a battery type' },
      quantity: { regex: /^[1-9][0-9]*$/, msg: 'Enter a valid quantity (number > 0)' },
      message:  { regex: /.{5,}/, msg: 'Please provide more details (min 5 chars)' }
    };

    let valid = true;
    form.querySelectorAll('.form-group').forEach(group => {
      const input = group.querySelector('input, select, textarea');
      if (!input) return;
      const fieldName = input.name;
      const rule = rules[fieldName];
      if (!rule) return;
      const ok = rule.regex.test(input.value.trim());
      group.classList.toggle('error', !ok);
      const errEl = group.querySelector('.form-error');
      if (errEl) errEl.textContent = ok ? '' : rule.msg;
      if (!ok) valid = false;
    });

    if (valid) {
      const successMsg = form.querySelector('.form-success');
      const submitBtn = form.querySelector('.form-submit');
      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        if (res.ok) {
          if (successMsg) {
            successMsg.textContent = '✅ Enquiry sent! We\'ll call you within 24 hours.';
            successMsg.classList.add('show');
          }
          setTimeout(() => {
            form.reset();
            if (successMsg) successMsg.classList.remove('show');
            if (submitBtn) submitBtn.disabled = false;
            form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
          }, 4000);
        } else {
          if (successMsg) {
            successMsg.textContent = '❌ Something went wrong. Please call us directly.';
            successMsg.classList.add('show');
          }
          if (submitBtn) submitBtn.disabled = false;
        }
      })
      .catch(() => {
        if (successMsg) {
          successMsg.textContent = '❌ Network error. Please call +91 95108 28573.';
          successMsg.classList.add('show');
        }
        if (submitBtn) submitBtn.disabled = false;
      });
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError?.focus();
    }
  }

  /* 10. TESTIMONIAL IMAGE FALLBACK — canvas initials */
  document.querySelectorAll('.testi-avatar-img').forEach(img => {
    img.addEventListener('error', function () {
      const initials = (this.getAttribute('data-initials') || 'AW').toUpperCase();
      const canvas = document.createElement('canvas');
      canvas.width = 44; canvas.height = 44;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1a1d20';
      ctx.fillRect(0, 0, 44, 44);
      ctx.fillStyle = '#3DD900';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 22, 22);
      this.src = canvas.toDataURL();
    });
  });

  /* 11. PRODUCT QUOTE BUTTONS → contact.html */
  document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      window.location.href = 'contact.html';
    });
  });

  /* 12. CLEAR FIELD ERRORS ON INPUT */
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
    el.addEventListener('input', function () {
      this.closest('.form-group')?.classList.remove('error');
    });
  });

  /* 13. CLOSE MOBILE MENU ON OUTSIDE CLICK */
  document.addEventListener('click', function (e) {
    if (mobileMenu?.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    }
  });

  /* 14. Hero Battery Animation */
  (function initHeroBattery() {

    // Percentage counter 20 → 100, loops
    const pctEl = document.getElementById('hvPctNum');
    if (pctEl) {
      let pct = 20;
      setInterval(() => {
        pct = pct >= 100 ? 20 : pct + 1;
        pctEl.textContent = pct;
      }, 65);
    }

    // Orbit dots on ring
    const orbit = document.getElementById('hvOrbit');
    if (orbit) {
      const r = 185;
      [
        { angle: 0,   color: '#3DD900' },
        { angle: 120, color: '#00BFA5' },
        { angle: 240, color: '#0077CC' }
      ].forEach(({ angle, color }) => {
        const dot = document.createElement('div');
        dot.className = 'hv-orbit-dot';
        const rad = (angle - 90) * Math.PI / 180;
        dot.style.cssText = `
          background: ${color};
          transform: translate(${Math.cos(rad) * r}px, ${Math.sin(rad) * r}px);
          box-shadow: 0 0 8px ${color};
        `;
        orbit.appendChild(dot);
      });
    }

    // Floating energy particles
    const scene = document.getElementById('heroVisual');
    if (scene) {
      function spawnParticle() {
        const p = document.createElement('div');
        p.className = 'hv-particle';
        const angle = Math.random() * Math.PI * 2;
        const startR = 60;
        const endR   = 120 + Math.random() * 80;
        const cx = scene.offsetWidth / 2;
        const cy = scene.offsetHeight / 2;
        p.style.cssText = `
          left: ${cx + Math.cos(angle) * startR}px;
          top:  ${cy + Math.sin(angle) * startR}px;
          opacity: 0; position: absolute;
          background: ${Math.random() > 0.5 ? '#3DD900' : '#00BFA5'};
        `;
        scene.appendChild(p);
        const dx = Math.cos(angle) * endR;
        const dy = Math.sin(angle) * endR;
        let start = null;
        const dur = 700 + Math.random() * 600;
        (function anim(ts) {
          if (!start) start = ts;
          const prog = (ts - start) / dur;
          if (prog >= 1) { p.remove(); return; }
          p.style.opacity = Math.sin(prog * Math.PI) * 0.7;
          p.style.transform = `translate(${dx * prog}px, ${dy * prog}px)`;
          requestAnimationFrame(anim);
        })(performance.now());
      }
      setInterval(spawnParticle, 250);
    }

    // Spec strip cycling
    const specData = [
      ['48V', '30Ah', 'LFP'],
      ['60V', '40Ah', 'Li-Ion'],
      ['72V', '50Ah', 'NMC'],
      ['12V', '150Ah', 'Tubular'],
      ['6V',  '200Ah', 'Deep Cycle'],
    ];
    const s1 = document.getElementById('hvSpec1');
    const s2 = document.getElementById('hvSpec2');
    const s3 = document.getElementById('hvSpec3');
    if (s1 && s2 && s3) {
      let si = 0;
      setInterval(() => {
        si = (si + 1) % specData.length;
        [s1, s2, s3].forEach((el, i) => {
          el.style.opacity = '0';
          setTimeout(() => {
            el.textContent = specData[si][i];
            el.style.opacity = '1';
          }, 200);
        });
      }, 3000);
    }

  })();

  /* 15. Why Section — brand ticker */
  (function initWhyTicker() {
    const brands = [
      ['Exide', 'Amaron', 'Luminous'],
      ['Okaya', 'SF Sonic', 'Livguard'],
      ['Microtek', 'Base', 'Exide'],
    ];
    const els = [
      document.getElementById('wt1'),
      document.getElementById('wt2'),
      document.getElementById('wt3'),
    ];
    if (!els[0]) return;
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % brands.length;
      els.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = brands[idx][i];
          el.style.opacity = '1';
        }, 180);
      });
    }, 2500);
  })();

  /* 16. PRODUCT CARD CLICK — Navigate to detail page */
  function setupProductClickHandlers() {
    document.querySelectorAll('.product-item[data-name]').forEach(card => {
      const productId = card.getAttribute('data-name');
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        // Don't navigate if clicking the Get Quote button
        if (e.target.closest('.product-btn') || e.target.closest('.cta-button')) {
          return;
        }
        console.log('Navigating to product:', productId);
        window.location.href = `product-detail.html?product=${productId}`;
      });
    });
  }
  
  // Setup on initial load
  setupProductClickHandlers();
  
  // Also setup on any dynamic content changes
  const observer = new MutationObserver(() => {
    setupProductClickHandlers();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

});

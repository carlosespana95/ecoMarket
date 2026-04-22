/* ============================================================
   EcoMarket Digital — Custom JavaScript
   Handles: smooth scroll, navbar effects, stat counters,
            scroll-reveal animations, contact form, back-to-top
   ============================================================ */

'use strict';

/* ── DOMContentLoaded entry point ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackToTop();
  initScrollReveal();
  initStatCounters();
  initContactForm();
  initProductButtons();
  initGallery();
});

/* ── 1. NAVBAR — shrink on scroll & active link tracking ────── */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('#mainNavbar .nav-link');

  /* Add/remove scrolled class for compact navbar */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* Smooth-close mobile nav when a link is clicked */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.getElementById('navbarNav');
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) bsCollapse.hide();
    });
  });
}

/* Highlight the nav link whose section is currently in view */
function highlightActiveLink() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('#mainNavbar .nav-link');
  const scrollPos = window.scrollY + 100;

  let current = '';

  sections.forEach(section => {
    if (section.offsetTop <= scrollPos) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ── 2. BACK-TO-TOP BUTTON ──────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 3. SCROLL-REVEAL ANIMATIONS ───────────────────────────── */
function initScrollReveal() {
  /* Tag elements we want to animate on scroll */
  const targets = document.querySelectorAll(
    '.product-card, .service-card, .gallery-item, .testimonial-card, .contact-form-card, .contact-info-list, .stat-item, .section-header'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          /* Staggered delay for grouped elements */
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/* ── 4. ANIMATED STAT COUNTERS ──────────────────────────────── */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ── 5. CONTACT FORM — validation & simulated submit ─────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn  = form.querySelector('button[type="submit"]');
  const btnText    = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  const successBox = document.getElementById('formSuccess');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Bootstrap validation */
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    /* Show loading state */
    setSubmitLoading(true);

    /* Simulate async send (replace with real API call if needed) */
    await delay(1800);

    /* Show success */
    setSubmitLoading(false);
    successBox?.classList.remove('d-none');
    form.reset();
    form.classList.remove('was-validated');

    /* Hide success message after 6 seconds */
    setTimeout(() => successBox?.classList.add('d-none'), 6000);
  });

  function setSubmitLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    btnText?.classList.toggle('d-none', loading);
    btnLoading?.classList.toggle('d-none', !loading);
  }
}

/* ── 6. PRODUCT "BUY NOW" BUTTON — toast feedback ───────────── */
function initProductButtons() {
  const buyBtns = document.querySelectorAll('.eco-btn-card');

  buyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card?.querySelector('.product-name')?.textContent || 'Product';

      /* Briefly change button text for feedback */
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check me-1"></i> Added!';
      btn.style.background = '#16A34A';
      btn.style.borderColor = '#16A34A';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 1800);

      showToast(`"${name}" added to cart!`);
    });
  });
}

/* Simple toast notification */
function showToast(message) {
  /* Remove any existing toast */
  document.getElementById('ecoToast')?.remove();

  const toast = document.createElement('div');
  toast.id = 'ecoToast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div style="
      position: fixed;
      bottom: 88px;
      right: 28px;
      background: #1B5E20;
      color: #fff;
      padding: 12px 20px;
      border-radius: 10px;
      font-family: Roboto, sans-serif;
      font-size: .9rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,.2);
      display: flex;
      align-items: center;
      gap: 10px;
      z-index: 2000;
      opacity: 0;
      transform: translateY(10px);
      transition: all .3s ease;
    ">
      <i class="fa-solid fa-circle-check" style="color: #8BC34A;"></i>
      ${message}
    </div>
  `;
  document.body.appendChild(toast);

  /* Trigger animation */
  requestAnimationFrame(() => {
    const inner = toast.firstElementChild;
    inner.style.opacity = '1';
    inner.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    const inner = toast.firstElementChild;
    if (inner) {
      inner.style.opacity = '0';
      inner.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 350);
    }
  }, 2600);
}

/* ── 7. GALLERY — lightbox overlay ─────────────────────────── */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  /* Build a simple lightbox */
  const lightbox = document.createElement('div');
  lightbox.id = 'ecoLightbox';
  lightbox.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.9);
    z-index: 3000;
    align-items: center;
    justify-content: center;
    cursor: zoom-out;
    animation: fadeIn .2s ease;
  `;
  lightbox.innerHTML = `
    <button id="lbClose" style="
      position: absolute;
      top: 20px; right: 24px;
      background: none; border: none;
      color: #fff; font-size: 1.8rem;
      cursor: pointer; z-index: 1;
    " aria-label="Close lightbox">&times;</button>
    <button id="lbPrev" style="
      position: absolute;
      left: 20px;
      background: rgba(255,255,255,.15);
      border: none;
      color: #fff;
      font-size: 1.4rem;
      width: 48px; height: 48px;
      border-radius: 50%;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    " aria-label="Previous">&#8592;</button>
    <img id="lbImg" src="" alt="Gallery image" style="
      max-width: 90vw;
      max-height: 88vh;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0,0,0,.5);
      object-fit: contain;
    " />
    <button id="lbNext" style="
      position: absolute;
      right: 20px;
      background: rgba(255,255,255,.15);
      border: none;
      color: #fff;
      font-size: 1.4rem;
      width: 48px; height: 48px;
      border-radius: 50%;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    " aria-label="Next">&#8594;</button>
  `;
  document.body.appendChild(lightbox);

  const lbImg  = lightbox.querySelector('#lbImg');
  const lbClose = lightbox.querySelector('#lbClose');
  const lbPrev  = lightbox.querySelector('#lbPrev');
  const lbNext  = lightbox.querySelector('#lbNext');

  let currentIndex = 0;
  const images = Array.from(items).map(item => item.querySelector('.gallery-img'));

  const openLightbox = (index) => {
    currentIndex = index;
    lbImg.src = images[currentIndex].src;
    lbImg.alt = images[currentIndex].alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };

  const navigate = (dir) => {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    lbImg.src = images[currentIndex].src;
    lbImg.alt = images[currentIndex].alt;
  };

  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  /* Keyboard navigation */
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
}

/* ── Utility: promise-based delay ───────────────────────────── */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

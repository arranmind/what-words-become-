/* ============================================
   WHAT WORDS BECOME — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Password Gate ---
  const gate = document.getElementById('gate');
  const site = document.getElementById('site');
  const gateInput = document.getElementById('gate-input');
  const gateButton = document.getElementById('gate-button');
  const gateError = document.getElementById('gate-error');
  const gateForm = gateInput.closest('.gate-form');

  // The password — change this to whatever you want
  const PASSWORD = 'whatwordsbecome';

  // Check if already authenticated this session
  if (sessionStorage.getItem('wwb-auth') === 'true') {
    gate.classList.add('unlocked');
    site.classList.add('visible');
  }

  function attemptUnlock() {
    const value = gateInput.value.trim().toLowerCase();

    if (value === PASSWORD) {
      sessionStorage.setItem('wwb-auth', 'true');
      gate.classList.add('unlocked');

      setTimeout(() => {
        site.classList.add('visible');
      }, 200);
    } else {
      gateError.classList.add('show');
      gateForm.classList.add('shake');

      setTimeout(() => {
        gateForm.classList.remove('shake');
      }, 500);

      setTimeout(() => {
        gateError.classList.remove('show');
      }, 3000);
    }
  }

  gateButton.addEventListener('click', attemptUnlock);
  gateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });

  // --- Scroll Reveal (IntersectionObserver) ---
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el, i) => {
    // Stagger reveals for grid items and chain links
    const parent = el.parentElement;
    if (parent && (parent.classList.contains('hosts-grid') ||
                   parent.classList.contains('chain-timeline') ||
                   parent.classList.contains('format-steps'))) {
      const siblings = Array.from(parent.querySelectorAll('.reveal'));
      const index = siblings.indexOf(el);
      el.dataset.delay = index * 120;
    }
    revealObserver.observe(el);
  });

  // --- Navigation Scroll State ---
  const nav = document.getElementById('main-nav');

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile Menu ---
  window.toggleMenu = function() {
    const navLinks = document.getElementById('nav-links');
    const toggle = document.getElementById('nav-toggle');
    navLinks.classList.toggle('open');

    if (navLinks.classList.contains('open')) {
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    } else {
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }
  };

  window.closeMenu = function() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  };

  // --- Hero entrance animation ---
  const heroContent = document.querySelector('.hero-content');
  const heroScroll = document.querySelector('.hero-scroll-indicator');

  // Only animate hero if site is visible (authenticated)
  function animateHero() {
    if (heroContent) {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(20px)';
      heroContent.style.transition = 'opacity 1800ms ease, transform 1800ms ease';

      setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
      }, 300);
    }

    if (heroScroll) {
      heroScroll.style.opacity = '0';
      heroScroll.style.transition = 'opacity 1200ms ease';

      setTimeout(() => {
        heroScroll.style.opacity = '0.4';
      }, 1800);
    }
  }

  // If already authenticated, animate immediately
  if (sessionStorage.getItem('wwb-auth') === 'true') {
    animateHero();
  } else {
    // Animate after gate unlocks
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        if (gate.classList.contains('unlocked')) {
          setTimeout(animateHero, 800);
          observer.disconnect();
        }
      });
    });
    observer.observe(gate, { attributes: true, attributeFilter: ['class'] });
  }

  // --- Chain line draw-in animation ---
  const chainLines = document.querySelectorAll('.chain-line');

  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'scaleY(1)';
        lineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  chainLines.forEach(line => {
    line.style.transformOrigin = 'top';
    line.style.transform = 'scaleY(0)';
    line.style.transition = 'transform 800ms cubic-bezier(0.25, 0.1, 0.25, 1)';
    lineObserver.observe(line);
  });

});

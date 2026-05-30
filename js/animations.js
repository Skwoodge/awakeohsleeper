/**
 * AWAKE OH SLEEPER — Main Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. LOADING SCREEN ---- */
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
    }, 800);
  }

  /* ---- 2. NAVIGATION ---- */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- 3. ACTIVE NAV LINK ---- */
  function updateActiveNav() {
    const hash = window.location.hash || '#home';
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === hash);
    });
  }
  updateActiveNav();
  window.addEventListener('hashchange', updateActiveNav);

  /* ---- 4. SCROLL REVEAL ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
    .forEach(el => observer.observe(el));

  /* ---- 5. SAFETY NET ---- */
  setTimeout(() => {
    document.querySelectorAll('.hero-title, .hero-badge, .hero-subtitle, .hero-actions').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }, 2000);

  /* ---- 6. GSAP ENHANCEMENTS ---- */
  if (typeof gsap !== 'undefined') {
    try {
      const heroTl = gsap.timeline({ delay: 0.9 });
      heroTl
        .to('.hero-badge', { opacity: 1, duration: 0.4, ease: 'power2.out' })
        .to('.hero-title', { opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2')
        .to('.hero-subtitle', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3')
        .to('.hero-actions', { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2');
    } catch(e) {}
  }

  /* ---- 6. COUNTDOWN TIMER ---- */
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    const targetDate = new Date(2026, 4, 30, 18, 0, 0).getTime();
    function updateCountdown() {
      const diff = Math.max(0, targetDate - new Date().getTime());
      document.getElementById('count-days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
      document.getElementById('count-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
      document.getElementById('count-minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      document.getElementById('count-seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---- 7. SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- 8. SCROLL PROGRESS BAR ---- */
  window.addEventListener('scroll', () => {
    const bar = document.getElementById('scroll-progress');
    if (bar) {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
  });

  /* ---- 9. CARD TILT ON HOVER ---- */
  document.querySelectorAll('.band-card, .sponsor-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -10;
      const ry = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    });
  });

  /* ---- 10. ---- */

  /* ---- 11. MAGNETIC BUTTONS ---- */
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-ticket, .crisis-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ---- 12. GRADIENT TEXT ON "LOUDER" ---- */
  const louder = document.querySelector('.hero-title .highlight');
  if (louder) {
    let hue = 60;
    function cycleHue() {
      hue = hue >= 120 ? 60 : hue + 0.15;
      const c = `hsl(${hue}, 95%, 55%)`;
      louder.style.color = c;
      louder.style.textShadow = `0 0 3px ${c}, 0 0 8px ${c}`;
      requestAnimationFrame(cycleHue);
    }
    cycleHue();
  }
});

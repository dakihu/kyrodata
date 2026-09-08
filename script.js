/* ============================================================
   KyroData — Landing page
   Logique d'interaction (réécrite en JavaScript natif)
   ============================================================ */

(function () {
  'use strict';

  const root = document.getElementById('app');
  if (!root) return;

  const EASE = 'cubic-bezier(0.16,1,0.3,1)';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Compteurs animés ------------------------------ */
  const finalOf = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    return target.toFixed(decimals) + (el.dataset.suffix || '');
  };

  const startCounter = (el) => {
    if (el.dataset.counterDone) return;
    el.dataset.counterDone = '1';
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = finalOf(el); return; }
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = () => Array.from(root.querySelectorAll('[data-counter]'));
  const sweepCounters = () => {
    counters().forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) startCounter(el);
    });
  };

  /* ---------- CTA flottant selon le scroll ------------------ */
  let scrolledPastHero = false;
  const floatCta = root.querySelector('[data-float-cta]');
  const applyFloatCta = () => {
    if (!floatCta) return;
    floatCta.style.opacity = scrolledPastHero ? '1' : '0';
    floatCta.style.transform = scrolledPastHero ? 'translateY(0)' : 'translateY(20px)';
    floatCta.style.pointerEvents = scrolledPastHero ? 'auto' : 'none';
  };

  const onScroll = () => {
    sweepCounters();
    const past = window.scrollY > 620;
    if (past !== scrolledPastHero) { scrolledPastHero = past; applyFloatCta(); }
  };

  sweepCounters();
  applyFloatCta();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Effet magnétique / tilt / parallaxe ----------- */
  if (!prefersReduced) {
    root.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.14}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    root.querySelectorAll('[data-tilt]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-py * 6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    const heroVisual = root.querySelector('[data-parallax]');
    const heroEl = root.querySelector('header');
    if (heroVisual && heroEl) {
      heroEl.addEventListener('mousemove', (e) => {
        const r = heroEl.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroVisual.style.transform = `translate(${px * 12}px, ${py * 12}px)`;
      });
      heroEl.addEventListener('mouseleave', () => { heroVisual.style.transform = ''; });
    }
  }

  /* ---------- Démo : requête tapée + réponse ---------------- */
  const typedEl = root.querySelector('[data-demo-typed]');
  const thinkingEl = root.querySelector('[data-demo-thinking]');
  const answerEl = root.querySelector('[data-demo-answer]');
  const panel = root.querySelector('[data-demo-panel]');
  if (panel && typedEl && answerEl) {
    const query = 'Quel est le CA consolidé du Q2 par département, et son évolution vs Q1 ?';
    const typeIt = () => {
      if (prefersReduced) {
        typedEl.textContent = query;
        answerEl.style.opacity = '1';
        answerEl.style.transform = 'translateY(0)';
        return;
      }
      let i = 0;
      const iv = setInterval(() => {
        i += 1;
        typedEl.textContent = query.slice(0, i);
        if (i >= query.length) {
          clearInterval(iv);
          if (thinkingEl) thinkingEl.style.display = 'flex';
          setTimeout(() => {
            if (thinkingEl) thinkingEl.style.display = 'none';
            answerEl.style.opacity = '1';
            answerEl.style.transform = 'translateY(0)';
          }, 1000);
        }
      }, 24);
    };
    setTimeout(typeIt, 800);
  }

  /* ---------- Toggle Avant / Après -------------------------- */
  const beforeBtn = root.querySelector('[data-tab="before"]');
  const afterBtn = root.querySelector('[data-tab="after"]');
  const beforePanel = root.querySelector('[data-panel="before"]');
  const afterPanel = root.querySelector('[data-panel="after"]');

  const renderBeforeAfter = (isAfter) => {
    if (beforeBtn) {
      beforeBtn.style.background = isAfter ? 'transparent' : 'var(--white)';
      beforeBtn.style.color = isAfter ? 'rgba(28,15,77,.6)' : 'var(--purple)';
    }
    if (afterBtn) {
      afterBtn.style.background = isAfter ? 'var(--purple)' : 'transparent';
      afterBtn.style.color = isAfter ? '#ffffff' : 'rgba(28,15,77,.6)';
    }
    if (beforePanel) {
      beforePanel.style.opacity = isAfter ? '0' : '1';
      beforePanel.style.position = isAfter ? 'absolute' : '';
      beforePanel.style.inset = isAfter ? '0' : '';
      beforePanel.style.pointerEvents = isAfter ? 'none' : '';
    }
    if (afterPanel) {
      afterPanel.style.opacity = isAfter ? '1' : '0';
      afterPanel.style.position = isAfter ? '' : 'absolute';
      afterPanel.style.inset = isAfter ? '' : '0';
      afterPanel.style.pointerEvents = isAfter ? '' : 'none';
    }
  };
  if (beforeBtn) beforeBtn.addEventListener('click', () => renderBeforeAfter(false));
  if (afterBtn) afterBtn.addEventListener('click', () => renderBeforeAfter(true));
  renderBeforeAfter(true); // état par défaut : "Avec KyroData"

  /* ---------- Carrousel de témoignages ---------------------- */
  const slides = Array.from(root.querySelectorAll('[data-testimonial]'));
  const dots = Array.from(root.querySelectorAll('[data-dot]'));
  let tIndex = 0;

  const renderTestimonials = () => {
    slides.forEach((el, i) => {
      const active = i === tIndex;
      el.style.position = active ? 'relative' : 'absolute';
      el.style.inset = active ? 'auto' : 'clamp(1.5rem, 1.2rem + 1vw, 2rem)';
      el.style.opacity = active ? '1' : '0';
      el.style.transform = active ? 'translateY(0)' : 'translateY(8px)';
      el.style.transition = `opacity 0.5s ${EASE}, transform 0.5s ${EASE}`;
      el.style.pointerEvents = active ? 'auto' : 'none';
    });
    dots.forEach((el, i) => {
      const active = i === tIndex;
      el.style.width = active ? '20px' : '8px';
      el.style.height = '8px';
      el.style.borderRadius = '999px';
      el.style.background = active ? 'var(--purple)' : 'rgba(28,15,77,.18)';
      el.style.transition = `width 0.3s ${EASE}, background 0.3s ${EASE}`;
    });
  };

  dots.forEach((el, i) => el.addEventListener('click', () => { tIndex = i; renderTestimonials(); }));
  renderTestimonials();
  if (slides.length > 1) {
    setInterval(() => {
      tIndex = (tIndex + 1) % slides.length;
      renderTestimonials();
    }, 5500);
  }

  /* ---------- Accordéon FAQ --------------------------------- */
  const faqItems = Array.from(root.querySelectorAll('[data-faq]'));
  let faqOpen = 0;

  const renderFaq = () => {
    faqItems.forEach((item, i) => {
      const open = faqOpen === i;
      const chev = item.querySelector('[data-faq-chev]');
      const body = item.querySelector('[data-faq-body]');
      const text = item.querySelector('[data-faq-text]');
      if (chev) chev.style.transform = `rotate(${open ? 180 : 0}deg)`;
      if (body) body.style.gridTemplateRows = open ? '1fr' : '0fr';
      if (text) text.style.paddingBottom = open ? '1.35rem' : '0';
    });
  };
  faqItems.forEach((item, i) => {
    const btn = item.querySelector('[data-faq-btn]');
    if (btn) btn.addEventListener('click', () => { faqOpen = faqOpen === i ? -1 : i; renderFaq(); });
  });
  renderFaq();

  /* ---------- Formulaire de démo ---------------------------- */
  const form = root.querySelector('[data-demo-form]');
  const formBtn = root.querySelector('[data-form-btn]');
  if (form && formBtn) {
    let timeout;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formBtn.textContent = 'Demande envoyée ✓';
      formBtn.style.background = 'var(--green)';
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        formBtn.textContent = 'Réserver ma démonstration';
        formBtn.style.background = '#ffffff';
      }, 3200);
    });
  }
})();

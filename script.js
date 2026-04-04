/* ═══════════════════════════════════════════
   PROTOSPARK — Main Script
   ═══════════════════════════════════════════ */


/* ── Nav active state by page ── */
(function setActiveNav() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-dropdown a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    if (
      linkFile === filename ||
      (filename === '' && linkFile === 'index.html') ||
      (filename === 'index.html' && linkFile === 'index.html')
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* ── Mobile nav toggle ── */
const navToggle  = document.querySelector('.nav-toggle');
const navDropdown = document.querySelector('.nav-dropdown');

navToggle?.addEventListener('click', () => {
  navDropdown?.classList.toggle('open');
});

document.querySelectorAll('.nav-dropdown a').forEach(link => {
  link.addEventListener('click', () => navDropdown?.classList.remove('open'));
});

document.addEventListener('click', (e) => {
  if (navDropdown?.classList.contains('open') &&
      !navDropdown.contains(e.target) &&
      !navToggle?.contains(e.target)) {
    navDropdown.classList.remove('open');
  }
});

/* ── Scroll Animations ── */
const animClasses = ['fade-up', 'fade-left', 'fade-right', 'scale-in'];

// Setup stagger delays on children
document.querySelectorAll('.stagger-children').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.dataset.staggerDelay = i * 80;
  });
});

// Apply animation classes to key elements
function setupAnimations() {
  // Section titles
  document.querySelectorAll('.section-title').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('scale-in');
  });
  // About cards
  document.querySelectorAll('.about-cards').forEach(el => el.classList.add('stagger-children'));
  document.querySelectorAll('.about-card').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('fade-up');
  });
  // Camp details
  document.querySelectorAll('.camp-detail').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('fade-left');
  });
  // Schedule days
  document.querySelectorAll('.camp-schedule').forEach(el => el.classList.add('stagger-children'));
  document.querySelectorAll('.schedule-day').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('fade-right');
  });
  // Curriculum cards
  document.querySelectorAll('.learn-grid').forEach(el => el.classList.add('stagger-children'));
  document.querySelectorAll('.learn-card').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('scale-in');
  });
  // Chapter steps
  document.querySelectorAll('.chapter-step').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('fade-left');
  });
  // Join/form cards
  document.querySelectorAll('.join-card, .form-card, .team-card').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('scale-in');
  });
  // Volunteer mini cards
  document.querySelectorAll('.vol-mini-card').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('fade-up');
  });
  // FAQ items
  document.querySelectorAll('.faq-item').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('fade-up');
  });
  // Camp teaser
  document.querySelectorAll('.camp-teaser').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('scale-in');
  });
  // Page hero
  document.querySelectorAll('.page-hero h1, .page-hero p').forEach(el => {
    if (!hasAnimClass(el)) el.classList.add('fade-up');
  });
}

function hasAnimClass(el) {
  return animClasses.some(c => el.classList.contains(c));
}

setupAnimations();

// IntersectionObserver for all animation elements
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.staggerDelay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
  animObserver.observe(el);
});

/* ── Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  if (isNaN(target)) return;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  el.textContent = '0';
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ── Active nav highlight on scroll (single-page fallback) ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

if (sections.length > 0) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          if (a.getAttribute('href')?.startsWith('#')) a.classList.remove('active');
        });
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        active?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));
}

/* ── Toast ── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.ps-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'ps-toast';
  toast.textContent = message;
  const bg = type === 'error' ? '#e53e3e' : '#1A1040';
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: ${bg};
    color: #fff;
    padding: 14px 24px;
    border-radius: 50px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: clamp(0.78rem, 3.5vw, 0.95rem);
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    z-index: 9999;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    white-space: normal;
    width: max-content;
    max-width: min(420px, 88vw);
    text-align: center;
    line-height: 1.4;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ═══════════════════════════════════════════════════════════════
   SECURITY CONFIG
   This is a fully static site — there is no server-side secret
   injection. SHEETS_URL and SUBMIT_TOKEN are intentionally
   client-visible: the Apps Script endpoint is public, and the
   token is validated server-side in the Google Apps Script.
   To rotate: update SUBMIT_TOKEN here AND in the Apps Script.
   Never store OAuth tokens, private keys, or passwords here.
   ═══════════════════════════════════════════════════════════════ */
const PS_CONFIG = {
  SHEETS_URL:   'https://script.google.com/macros/s/AKfycbzugPKwhraPlb8_tHraEZCzaVWCitXPd7MKyoKQkekZZeSODVVD3sNUf-1AzzgiUKvP/exec',
  SUBMIT_TOKEN: '36e972b692cf7acfc7a87c62afedbe065efe3bbe05cc94bf',
};

/* ── OWASP A07: Rate limiting (client-side, localStorage-backed)
   True IP-level enforcement requires a server. These limits persist
   across page reloads and guard against accidental double-submits
   and casual abuse. Hard enforcement lives in the Google Apps Script.
   Limits: Students ≤ 3/hr · Volunteers ≤ 2/hr per browser. ── */
const RateLimit = (() => {
  const RULES = {
    Students:   { max: 3, windowMs: 60 * 60 * 1000 },
    Volunteers: { max: 2, windowMs: 60 * 60 * 1000 },
  };
  const key = type => `ps_rl_${type}`;
  const load = type => { try { return JSON.parse(localStorage.getItem(key(type))); } catch { return null; } };
  const save = (type, s) => { try { localStorage.setItem(key(type), JSON.stringify(s)); } catch {} };

  return {
    // Returns { allowed: true } or { allowed: false, retryMinutes }
    check(type) {
      const rule = RULES[type];
      if (!rule) return { allowed: true };
      const now = Date.now();
      const s = load(type) || { count: 0, windowStart: now };
      if (now - s.windowStart > rule.windowMs) return { allowed: true };
      if (s.count >= rule.max) {
        const retryMs = rule.windowMs - (now - s.windowStart);
        return { allowed: false, retryMinutes: Math.ceil(retryMs / 60000) };
      }
      return { allowed: true };
    },
    // Call after a successful submission
    record(type) {
      const rule = RULES[type];
      if (!rule) return;
      const now = Date.now();
      const s = load(type) || { count: 0, windowStart: now };
      if (now - s.windowStart > rule.windowMs) save(type, { count: 1, windowStart: now });
      else save(type, { count: s.count + 1, windowStart: s.windowStart });
    },
  };
})();

/* ── OWASP A03: Input sanitization ── */
const Sanitize = {
  // Strip HTML tags to prevent stored XSS in Google Sheets / admin view
  stripTags: str => String(str).replace(/<[^>]*>/g, '').trim(),
  // Full pipeline: strip tags, trim whitespace, enforce max length
  field(value, maxLen) {
    const clean = this.stripTags(value);
    return maxLen ? clean.slice(0, maxLen) : clean;
  },
  // RFC 5322-lite email check — belt-and-suspenders beyond type="email"
  isValidEmail: v => /^[^\s@]{1,64}@[^\s@]{1,255}$/.test(v),
};

/* ── OWASP A03: Schema — allowed fields + max lengths per form type.
   Any field not listed here is silently discarded before submission. ── */
const FORM_SCHEMA = {
  Students: {
    parent_name: 100, student_name: 100, contact_preference: 20,
    parent_email: 254, parent_phone: 30, student_country: 60,
    age_group: 20, timing_questions: 1000,
  },
  Volunteers: {
    full_name: 100, email: 254, phone: 30, region: 100,
    time_zone: 50, languages: 200, role_interest: 100,
    coding_background: 3000, motivation: 3000, leadership_qualities: 3000,
  },
};

/* ── Form submission helper ── */
async function submitForm(form, type, subject, successMsg) {
  // HTML5 built-in validation (required, type=email, pattern, maxlength, etc.)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // OWASP A07: Rate limit — graceful 429-style rejection with retry guidance
  const rl = RateLimit.check(type);
  if (!rl.allowed) {
    showToast(
      `Too many submissions. Please try again in ${rl.retryMinutes} minute${rl.retryMinutes !== 1 ? 's' : ''}.`,
      'error'
    );
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span class="btn-spinner"></span>Sending…';
  btn.disabled = true;

  const formData = new FormData(form);

  // Honeypot check — bots fill hidden fields, humans don't
  if (formData.get('_hp')) return;

  // OWASP A03: Additional email validation beyond the browser's type="email"
  const emailVal = formData.get('parent_email') || formData.get('email') || '';
  if (emailVal && !Sanitize.isValidEmail(emailVal)) {
    showToast('Please enter a valid email address.', 'error');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    return;
  }

  // OWASP A03: Build submission from schema-allowed fields only.
  // Any unexpected key (e.g. injected via DevTools) is discarded here.
  const schema = FORM_SCHEMA[type] || {};
  const submission = {
    _type:      type,
    _timestamp: new Date().toISOString(),
    _token:     PS_CONFIG.SUBMIT_TOKEN,
  };
  formData.forEach((val, key) => {
    if (key === '_hp') return;           // always discard honeypot
    if (!(key in schema)) return;        // discard fields not in schema
    submission[key] = Sanitize.field(val, schema[key]); // sanitize + truncate
  });

  try {
    await fetch(PS_CONFIG.SHEETS_URL, {
      method: 'POST',
      body:   JSON.stringify(submission),
    });
    RateLimit.record(type); // only record after a successful network call
    showToast(successMsg);
  } catch (_) {
    showToast('Something went wrong. Please try again.', 'error');
  }

  form.reset();
  btn.innerHTML = originalHTML;
  btn.disabled = false;
}

/* ── Globe flag cycling (motion-blur swipe effect) ── */
(function cycleGlobeFlags() {
  // Use ISO country codes — rendered as <img> via flagcdn.com (works on Windows)
  const countries = [
    ['us','USA'],['in','India'],['ng','Nigeria'],['br','Brazil'],['ph','Philippines'],
    ['gb','UK'],['mx','Mexico'],['jp','Japan'],['de','Germany'],['eg','Egypt'],
    ['za','S. Africa'],['kr','Korea'],['ca','Canada'],['au','Australia'],['id','Indonesia'],
    ['pk','Pakistan'],['bd','Bangladesh'],['vn','Vietnam'],['tr','Turkey'],['ke','Kenya'],
    ['co','Colombia'],['ar','Argentina'],['iq','Iraq'],['nl','Netherlands'],['pl','Poland'],
    ['th','Thailand'],['es','Spain'],['fr','France'],['it','Italy'],['sa','S. Arabia'],
    ['my','Malaysia'],['gh','Ghana'],['ug','Uganda'],['ro','Romania'],['pe','Peru'],
    ['cl','Chile'],['se','Sweden'],['be','Belgium'],['cz','Czechia'],['pt','Portugal'],
  ];

  function flagImg(code) {
    return `<img src="https://flagcdn.com/24x18/${code}.png" alt="${code}" style="width:1.4rem;height:auto;vertical-align:middle;border-radius:2px;">`;
  }
  const total = countries.length;

  const allPins = [
    ...document.querySelectorAll('.tgw-pin'),
    ...document.querySelectorAll('.chapter-pin'),
  ];
  if (!allPins.length) return;

  // Each pin gets its own cursor, evenly spread so no two pins show the
  // same country at the same time. Advancing by 1 each tick means every
  // pin cycles through all 40 countries before repeating.
  const cursors = allPins.map((_, i) => i % total);

  function blurSwap(flagEl, labelEl, newFlag, newLabel) {
    // Phase 1: slide + blur out (rightward)
    flagEl.style.transition = 'transform 0.22s ease-in, filter 0.22s ease-in, opacity 0.22s ease-in';
    if (labelEl) labelEl.style.transition = 'opacity 0.22s ease-in';
    flagEl.style.transform = 'scale(0.5) translateX(10px)';
    flagEl.style.filter = 'blur(5px)';
    flagEl.style.opacity = '0';
    if (labelEl) labelEl.style.opacity = '0';

    setTimeout(() => {
      // Swap content while invisible, snap to left-blurred start
      flagEl.innerHTML = flagImg(newFlag);
      if (labelEl) labelEl.textContent = newLabel;
      flagEl.style.transition = 'none';
      flagEl.style.transform = 'scale(0.5) translateX(-10px)';
      flagEl.style.filter = 'blur(5px)';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        // Phase 2: slide + blur in (leftward into place)
        flagEl.style.transition = 'transform 0.32s cubic-bezier(0.22,1,0.36,1), filter 0.32s ease-out, opacity 0.32s ease-out';
        if (labelEl) labelEl.style.transition = 'opacity 0.32s ease-out';
        flagEl.style.transform = 'scale(1) translateX(0)';
        flagEl.style.filter = 'blur(0px)';
        flagEl.style.opacity = '1';
        if (labelEl) labelEl.style.opacity = '1';
      }));
    }, 230);
  }

  function update() {
    allPins.forEach((pin, i) => {
      // Advance this pin's cursor by 1 — guarantees new country every tick,
      // no country repeats until all 40 have been shown.
      cursors[i] = (cursors[i] + 1) % total;
      const flagEl = pin.querySelector('.tgw-flag');
      const labelEl = pin.querySelector('.tgw-label');
      if (!flagEl) return;
      blurSwap(flagEl, labelEl, countries[cursors[i]][0], countries[cursors[i]][1]);
    });
  }

  // Set initial display values (cursors already at i, update will advance to i+1)
  allPins.forEach((pin, i) => {
    const flagEl = pin.querySelector('.tgw-flag');
    const labelEl = pin.querySelector('.tgw-label');
    if (flagEl) flagEl.innerHTML = flagImg(countries[cursors[i]][0]);
    if (labelEl) labelEl.textContent = countries[cursors[i]][1];
  });

  setInterval(update, 2400);
})();

/* ── Language selector ── */
function changeLang(code) {
  document.getElementById('lang-menu')?.classList.remove('open');
  if (code === 'en') {
    window.location.href = 'https://protospark.org' + window.location.pathname;
    return;
  }
  const page = encodeURIComponent('https://protospark.org' + window.location.pathname);
  window.location.href = 'https://translate.google.com/translate?hl=en&sl=en&tl=' + code + '&u=' + page;
}

function toggleLangMenu() {
  document.getElementById('lang-menu')?.classList.toggle('open');
}

document.addEventListener('click', e => {
  const sel = document.getElementById('lang-selector');
  if (sel && !sel.contains(e.target)) {
    document.getElementById('lang-menu')?.classList.remove('open');
  }
});

/* ── Student Form ── */
document.getElementById('student-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await submitForm(
    e.target,
    'Students',
    'New Student Registration — ProtoSpark',
    '🎉 Registration received! We\'ll be in touch soon.'
  );
});

/* ── Volunteer Form ── */
document.getElementById('volunteer-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await submitForm(
    e.target,
    'Volunteers',
    'New Volunteer Application — ProtoSpark',
    '✅ Application received! We\'ll be in touch within a week.'
  );
});

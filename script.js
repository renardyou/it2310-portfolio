/* ============================================================
   RENARD YOUNG — PROFESSIONAL PORTFOLIO
   script.js — All JS behaviors
   ============================================================ */

'use strict';

/* ── SCROLL PROGRESS ─────────────────────────────────────── */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const scrolled = document.documentElement.scrollTop;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const pct      = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', Math.round(pct));
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── NAV: SCROLL STATE + ACTIVE SECTION ─────────────────── */
(function () {
  const header   = document.getElementById('site-header');
  const links    = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class for shadow
    header.classList.toggle('scrolled', window.scrollY > 40);

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();

/* ── HAMBURGER MENU ──────────────────────────────────────── */
(function () {
  const btn       = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const links     = document.querySelectorAll('.mobile-link');
  if (!btn) return;

  function open() {
    btn.classList.add('open');
    mobileNav.classList.add('open');
    mobileNav.removeAttribute('aria-hidden');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    btn.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  links.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ── HERO CANVAS (football field) ───────────────────────── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Floating spark particles
  const TOTAL = 55;
  const sparks = Array.from({ length: TOTAL }, () => spawn(canvas));

  function spawn(c, fromBottom) {
    return {
      x:      Math.random() * c.width,
      y:      fromBottom ? c.height + 10 : Math.random() * c.height,
      r:      Math.random() * 2 + 0.5,
      vy:     -(Math.random() * 0.35 + 0.15),
      vx:     (Math.random() - 0.5) * 0.3,
      alpha:  Math.random() * 0.45 + 0.05,
      orange: Math.random() > 0.6,
    };
  }

  function drawField() {
    const w = canvas.width, h = canvas.height;

    // Deep green turf gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0,   'rgba(10, 20, 10, 0.97)');
    grad.addColorStop(0.5, 'rgba(8, 18, 8, 0.95)');
    grad.addColorStop(1,   'rgba(6, 14, 6, 0.98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Alternating turf stripes (subtle)
    const stripeW = w / 10;
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 2 === 0
        ? 'rgba(255,255,255,0.012)'
        : 'rgba(0,0,0,0.015)';
      ctx.fillRect(i * stripeW, 0, stripeW, h);
    }

    // Yard lines (horizontal)
    ctx.strokeStyle = 'rgba(255,255,255,0.055)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      const y = (h / 10) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Hash marks (two columns)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    const hx1 = w * 0.33, hx2 = w * 0.67;
    for (let i = 0; i < 20; i++) {
      const y = (h / 20) * i;
      [[hx1 - 8, hx1 + 8], [hx2 - 8, hx2 + 8]].forEach(([x1, x2]) => {
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      });
    }

    // Midfield circle
    ctx.strokeStyle = 'rgba(212, 90, 0, 0.07)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Accent glow at centre
    const cg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
    cg.addColorStop(0,   'rgba(212, 90, 0, 0.045)');
    cg.addColorStop(1,   'transparent');
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, w, h);
  }

  function drawSparks() {
    sparks.forEach((s, i) => {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle   = s.orange ? '#d45a00' : '#3a6e3a';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      s.x     += s.vx;
      s.y     += s.vy;
      s.alpha *= 0.9994;

      if (s.y < -10 || s.alpha < 0.008) {
        sparks[i] = spawn(canvas, true);
      }
    });
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawField();
    drawSparks();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── HERO TYPEWRITER ─────────────────────────────────────── */
(function () {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'Web Developer',
    'JavaScript Engineer',
    'Event Security Professional',
    'Cleveland, Ohio',
    'Available for Opportunities',
  ];

  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 75, SPEED_DEL = 40, PAUSE = 1800;

  function tick() {
    const phrase = phrases[pi];
    el.textContent = deleting ? phrase.slice(0, ci - 1) : phrase.slice(0, ci + 1);
    deleting ? ci-- : ci++;

    if (!deleting && ci === phrase.length) {
      deleting = true;
      setTimeout(tick, PAUSE);
      return;
    }
    if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 1400);
})();

/* ── STAT COUNTERS ───────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.stat-val[data-target]');
  if (!counters.length || !window.IntersectionObserver) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.target, 10);

      // Determine display: years vs short numbers
      const isYear   = end > 1000;
      const duration = isYear ? 1200 : 900;
      const start    = isYear ? end - 10 : 0;
      const startTime = performance.now();

      function animate(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        el.textContent = Math.round(start + (end - start) * eased);
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = end;
      }
      requestAnimationFrame(animate);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ── SKILL BAR ANIMATION ─────────────────────────────────── */
(function () {
  const fills = document.querySelectorAll('.skill-fill[data-width]');
  if (!fills.length || !window.IntersectionObserver) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const idx  = Array.from(fills).indexOf(fill);
      setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, idx * 90);
      obs.unobserve(fill);
    });
  }, { threshold: 0.25 });

  fills.forEach(f => obs.observe(f));
})();

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !window.IntersectionObserver) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach(el => obs.observe(el));
})();

/* ── TIMELINE STAGGER ────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length || !window.IntersectionObserver) return;

  items.forEach((item, i) => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-16px)';
    item.style.transition = `opacity 0.55s 0.05s cubic-bezier(0.16,1,0.3,1), transform 0.55s 0.05s cubic-bezier(0.16,1,0.3,1)`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const idx = parseInt(el.dataset.index || '0', 10);
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateX(0)';
      }, idx * 70);
      obs.unobserve(el);
    });
  }, { threshold: 0.12 });

  items.forEach((item, i) => {
    item.dataset.index = i;
    obs.observe(item);
  });
})();

/* ── TABS ────────────────────────────────────────────────── */
(function () {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.tab-panel');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update buttons
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
        b.removeAttribute('tabindex');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
      const target = document.getElementById(btn.getAttribute('aria-controls'));
      if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');

        // Re-animate skill bars when tech tab re-opened
        if (btn.getAttribute('aria-controls') === 'panel-tech') {
          target.querySelectorAll('.skill-fill[data-width]').forEach((fill, i) => {
            fill.style.width = '0%';
            setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, i * 90 + 50);
          });
        }
      }
    });

    // Keyboard: left/right arrow navigation
    btn.addEventListener('keydown', e => {
      const btns = [...document.querySelectorAll('.tab-btn')];
      const idx  = btns.indexOf(btn);
      if (e.key === 'ArrowRight') btns[(idx + 1) % btns.length].click();
      if (e.key === 'ArrowLeft')  btns[(idx - 1 + btns.length) % btns.length].click();
    });
  });
})();

/* ── PROJECT FILTER ──────────────────────────────────────── */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.proj-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cats = (card.dataset.cat || '').split(' ');
        const show = f === 'all' || cats.includes(f);
        card.classList.toggle('filtered', !show);
      });
    });
  });

  // Keyboard: enter/space on project cards
  cards.forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.proj-link');
        if (link) link.click();
      }
    });
  });
})();

/* ── QUOTE GENERATOR ─────────────────────────────────────── */
(function () {
  const quotes = [
    { text: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.", author: "Vince Lombardi" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
    { text: "Perfection is not attainable, but if we chase perfection we can catch excellence.", author: "Vince Lombardi" },
    { text: "The price of success is hard work, dedication to the job at hand, and the determination that whether we win or lose, we have applied the best of ourselves.", author: "Vince Lombardi" },
    { text: "Success isn't owned. It's leased. And rent is due every day.", author: "J.J. Watt" },
    { text: "When you've got something to prove, there's nothing greater than a challenge.", author: "Jerry Rice" },
    { text: "I'd rather be prepared and not have an opportunity than to have an opportunity and not be prepared.", author: "Whitney Young Jr." },
    { text: "Football is like life — it requires perseverance, self-denial, hard work, sacrifice, dedication and respect for authority.", author: "Vince Lombardi" },
    { text: "The secret to success is to work hard, be patient, and never give up on your goals.", author: "Tom Brady" },
    { text: "You can't win without people who want to win.", author: "Paul Brown" },
    { text: "In order to achieve your best, you must be willing to fail.", author: "Emmitt Smith" },
    { text: "A winner never stops trying.", author: "Tom Landry" },
  ];

  const textEl   = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  const btn      = document.getElementById('new-quote-btn');
  if (!textEl || !btn) return;

  let idx = 0;

  function show(i) {
    textEl.style.opacity   = '0';
    authorEl.style.opacity = '0';
    setTimeout(() => {
      textEl.textContent   = '\u201c' + quotes[i].text + '\u201d';
      authorEl.textContent = quotes[i].author;
      textEl.style.opacity   = '1';
      authorEl.style.opacity = '1';
    }, 280);
  }

  btn.addEventListener('click', () => {
    idx = (idx + 1) % quotes.length;
    show(idx);
  });
})();

/* ── FOOTBALL TRIVIA QUIZ ────────────────────────────────── */
(function () {
  const questions = [
    {
      q:  "How many points is a touchdown worth in the NFL?",
      opts: ["3 points", "6 points", "7 points", "8 points"],
      ans: 1,
      fact: "A touchdown scores 6 points. The extra point (PAT) adds 1 more, and a two-point conversion adds 2."
    },
    {
      q:  "Which NFL team has won the most Super Bowl championships?",
      opts: ["Dallas Cowboys", "San Francisco 49ers", "New England Patriots", "Pittsburgh Steelers"],
      ans: 3,
      fact: "The Pittsburgh Steelers and New England Patriots are both tied with 6 Super Bowl titles — Pittsburgh won theirs first, however."
    },
    {
      q:  "How many players from each team are on the field simultaneously?",
      opts: ["9 players", "10 players", "11 players", "12 players"],
      ans: 2,
      fact: "Each NFL team fields exactly 11 players at a time, whether on offense, defense, or special teams."
    },
    {
      q:  "In football terminology, what does 'fourth and long' mean?",
      opts: [
        "It is the fourth quarter with a long time remaining",
        "It is fourth down with a long distance needed for a first down",
        "A long field goal attempt on the fourth play",
        "The fourth overtime period of a game"
      ],
      ans: 1,
      fact: "Down-and-distance describes the current down (1st–4th) and yards needed. Fourth and long means the offense has one final chance to gain significant yardage or must punt."
    },
    {
      q:  "What is the name of the NFL's annual championship game?",
      opts: ["The NFL Finals", "The Championship Bowl", "The Super Bowl", "The Pro Bowl"],
      ans: 2,
      fact: "The Super Bowl is the NFL Championship game, played annually since 1967 following the merger of the AFL and NFL."
    },
  ];

  const results = [
    "Keep studying the playbook. Every expert starts at zero.",
    "A strong start — review the fundamentals and try again.",
    "Solid performance. You have the foundation; now sharpen the details.",
    "Strong showing. You clearly know your way around the game.",
    "Excellent work. That is professional-level football knowledge.",
    "Perfect score. Exceptional performance from start to finish.",
  ];

  let qi = 0, score = 0;

  const startEl    = document.getElementById('quiz-start');
  const questionEl = document.getElementById('quiz-question');
  const resultEl   = document.getElementById('quiz-result');
  const startBtn   = document.getElementById('quiz-start-btn');
  const nextBtn    = document.getElementById('quiz-next-btn');
  const retryBtn   = document.getElementById('quiz-retry-btn');
  const qTextEl    = document.getElementById('quiz-q-text');
  const optsEl     = document.getElementById('quiz-options');
  const feedbackEl = document.getElementById('quiz-feedback');
  const progFill   = document.getElementById('quiz-progress-fill');
  const qLabel     = document.getElementById('quiz-q-label');
  const scoreLive  = document.getElementById('quiz-score-live');
  const finalNum   = document.getElementById('quiz-final-num');
  const resultMsg  = document.getElementById('quiz-result-msg');

  if (!startBtn) return;

  function screen(id) {
    [startEl, questionEl, resultEl].forEach(el => {
      if (el) el.classList.toggle('hidden', el.id !== id);
    });
  }

  function loadQ() {
    const q = questions[qi];
    qLabel.textContent       = `Question ${qi + 1} of ${questions.length}`;
    scoreLive.textContent    = score;
    progFill.style.width     = `${(qi / questions.length) * 100}%`;
    qTextEl.textContent      = q.q;
    feedbackEl.className     = 'quiz-feedback hidden';
    feedbackEl.textContent   = '';
    nextBtn.classList.add('hidden');
    optsEl.innerHTML         = '';

    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className   = 'q-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i, btn));
      optsEl.appendChild(btn);
    });
  }

  function handleAnswer(i, btn) {
    const q    = questions[qi];
    const all  = optsEl.querySelectorAll('.q-opt');
    all.forEach(b => b.disabled = true);

    if (i === q.ans) {
      btn.classList.add('correct');
      score++;
      scoreLive.textContent = score;
      feedbackEl.textContent = 'Correct. ' + q.fact;
      feedbackEl.className   = 'quiz-feedback ok';
    } else {
      btn.classList.add('wrong');
      all[q.ans].classList.add('correct');
      feedbackEl.textContent = 'Incorrect. ' + q.fact;
      feedbackEl.className   = 'quiz-feedback err';
    }
    nextBtn.classList.remove('hidden');
  }

  function showResult() {
    progFill.style.width  = '100%';
    finalNum.textContent  = score;
    resultMsg.textContent = results[score];
    screen('quiz-result');
  }

  startBtn.addEventListener('click', () => {
    qi = 0; score = 0;
    screen('quiz-question');
    loadQ();
  });
  nextBtn.addEventListener('click', () => {
    qi++;
    qi < questions.length ? loadQ() : showResult();
  });
  retryBtn.addEventListener('click', () => {
    qi = 0; score = 0;
    screen('quiz-question');
    loadQ();
  });
})();

/* ── DRAFT POSITION QUIZ ─────────────────────────────────── */
(function () {
  const questions = [
    {
      q:  "What is your natural role when working in a team?",
      opts: [
        { t: "I direct the strategy and make the key decisions",          v: "qb"  },
        { t: "I execute reliably and handle the difficult work",           v: "rb"  },
        { t: "I bring creativity and make game-changing contributions",    v: "wr"  },
        { t: "I protect others, study the opponent, and prevent mistakes", v: "def" },
      ]
    },
    {
      q:  "How do you respond when facing pressure or a tight deadline?",
      opts: [
        { t: "I stay calm, read the situation, and make a decisive call",  v: "qb"  },
        { t: "I lower my head, grind harder, and push through",            v: "rb"  },
        { t: "I make an unexpected, creative move that changes momentum",  v: "wr"  },
        { t: "I lock in, analyze the problem, and eliminate the risk",     v: "def" },
      ]
    },
    {
      q:  "Which work environment suits you best?",
      opts: [
        { t: "Leading meetings, setting direction, communicating strategy", v: "qb"  },
        { t: "Focused, independent work with clear objectives",             v: "rb"  },
        { t: "Fast-paced, visible roles where initiative is rewarded",      v: "wr"  },
        { t: "Research-driven, analytical roles requiring precision",       v: "def" },
      ]
    },
    {
      q:  "What is your most defining professional strength?",
      opts: [
        { t: "Intelligence, communication, and reading situations quickly", v: "qb"  },
        { t: "Work ethic, consistency, and reliability under pressure",     v: "rb"  },
        { t: "Speed, creativity, and ability to make high-impact moves",    v: "wr"  },
        { t: "Discipline, analysis, and protecting the team from setbacks", v: "def" },
      ]
    },
  ];

  const results = {
    qb:  { pos: "QUARTERBACK",  desc: "You are a natural leader — intelligent, calm under pressure, and trusted to make the critical calls when it matters most. You thrive when others depend on your judgment.",     traits: ["Leadership", "Strategic Thinking", "Decision Making", "Communication"] },
    rb:  { pos: "RUNNING BACK", desc: "You are the backbone of any team — reliable, tenacious, and unafraid of difficult work. You deliver results consistently without requiring the spotlight.",                   traits: ["Resilience", "Work Ethic", "Reliability", "Consistency"] },
    wr:  { pos: "WIDE RECEIVER", desc: "You bring speed, creativity, and the ability to change outcomes in a single play. You excel in high-visibility roles and have the confidence to make bold moves.",           traits: ["Creativity", "Initiative", "Speed", "High Impact"] },
    def: { pos: "LINEBACKER",   desc: "You are the analytical, protective force on the team — studying problems before they arise, positioning yourself correctly, and shutting down threats before they develop.", traits: ["Analysis", "Discipline", "Attention to Detail", "Team Orientation"] },
  };

  const votes   = { qb: 0, rb: 0, wr: 0, def: 0 };
  let   qi      = 0;

  const startEl    = document.getElementById('draft-start');
  const questionEl = document.getElementById('draft-question');
  const resultEl   = document.getElementById('draft-result');
  const startBtn   = document.getElementById('draft-start-btn');
  const retryBtn   = document.getElementById('draft-retry-btn');
  const qLabel     = document.getElementById('draft-q-label');
  const qText      = document.getElementById('draft-q-text');
  const optsEl     = document.getElementById('draft-options');
  const posEl      = document.getElementById('draft-result-pos');
  const descEl     = document.getElementById('draft-result-desc');
  const traitsEl   = document.getElementById('draft-traits');

  if (!startBtn) return;

  function screen(id) {
    [startEl, questionEl, resultEl].forEach(el => {
      if (el) el.classList.toggle('hidden', el.id !== id);
    });
  }

  function loadQ() {
    const q = questions[qi];
    qLabel.textContent = `Question ${qi + 1} of ${questions.length}`;
    qText.textContent  = q.q;
    optsEl.innerHTML   = '';
    q.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className   = 'd-opt';
      btn.textContent = opt.t;
      btn.addEventListener('click', () => {
        votes[opt.v]++;
        qi++;
        if (qi < questions.length) loadQ();
        else showResult();
      });
      optsEl.appendChild(btn);
    });
  }

  function showResult() {
    const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    const r = results[winner];
    posEl.textContent   = r.pos;
    descEl.textContent  = r.desc;
    traitsEl.innerHTML  = r.traits.map(t => `<span class="draft-trait">${t}</span>`).join('');
    screen('draft-result');
  }

  startBtn.addEventListener('click', () => {
    qi = 0;
    Object.keys(votes).forEach(k => votes[k] = 0);
    screen('draft-question');
    loadQ();
  });
  retryBtn.addEventListener('click', () => {
    qi = 0;
    Object.keys(votes).forEach(k => votes[k] = 0);
    screen('draft-start');
  });
})();

/* ── CONTACT FORM VALIDATION ─────────────────────────────── */
(function () {
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('form-submit');
  const success = document.getElementById('form-success');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('f-name'),    err: document.getElementById('err-name'),    fn: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    email:   { el: document.getElementById('f-email'),   err: document.getElementById('err-email'),   fn: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
    subject: { el: document.getElementById('f-subject'), err: document.getElementById('err-subject'), fn: v => v.trim().length >= 3 ? '' : 'Please enter a subject line.' },
    message: { el: document.getElementById('f-message'), err: document.getElementById('err-message'), fn: v => v.trim().length >= 10 ? '' : 'Please write a message of at least 10 characters.' },
  };

  Object.values(fields).forEach(({ el, err, fn }) => {
    el.addEventListener('blur', () => {
      const msg = fn(el.value);
      err.textContent = msg;
      el.classList.toggle('err', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('err')) {
        const msg = fn(el.value);
        err.textContent = msg;
        el.classList.toggle('err', !!msg);
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.values(fields).forEach(({ el, err, fn }) => {
      const msg = fn(el.value);
      err.textContent = msg;
      el.classList.toggle('err', !!msg);
      if (msg) valid = false;
    });
    if (!valid) return;

    submit.classList.add('loading');
    submit.disabled = true;

    setTimeout(() => {
      submit.style.display = 'none';
      success.classList.remove('hidden');
      form.reset();
      Object.values(fields).forEach(({ el }) => el.classList.remove('err'));
    }, 1600);
  });
})();

/* ── BACK TO TOP ─────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

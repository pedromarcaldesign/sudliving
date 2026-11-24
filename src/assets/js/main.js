(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: transparente sobre a hero, sólido depois */
  const header = $('#header');
  const hero = $('.hero');
  const heroLogo = $('#heroLogo');
  if (header && hero) {
    const onScroll = () => {
      const h = hero.offsetHeight;
      const y = window.scrollY;
      header.classList.toggle('is-solid', y > h - 90);
      if (!reduce && heroLogo && y < h) {
        const p = y / h;
        heroLogo.style.transform = `translateY(${-p * 40}px)`;
        heroLogo.style.opacity = String(1 - p * 1.4);
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  /* Menu (telemóvel) */
  const btn = $('#menuBtn');
  const panel = $('#menuPanel');
  if (btn && panel) {
    const setMenu = open => {
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      setMenu(open);
      if (open) setTimeout(() => $('a', panel).focus(), 50);
    });
    $$('a', panel).forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); btn.focus(); }
    });
  }

  /* Carrossel da hero: as outras fotografias só carregam depois da página */
  const slides = $$('#heroSlides .slide');
  const dots = $('#heroDots');
  const pauseBtn = $('#heroPause');
  if (slides.length > 1 && dots && pauseBtn) {
    let current = 0, timer, paused = reduce;
    const go = i => {
      slides[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].hidden = false;
      slides[current].classList.add('is-active');
      $$('button', dots).forEach((d, j) => d.setAttribute('aria-current', String(j === current)));
    };
    const restart = () => { clearInterval(timer); if (!paused) timer = setInterval(() => go(current + 1), 5500); };
    const setPaused = p => {
      paused = p;
      pauseBtn.setAttribute('aria-pressed', String(p));
      pauseBtn.setAttribute('aria-label', p ? 'Retomar fotografias' : 'Pausar fotografias');
      pauseBtn.textContent = p ? '▶' : '❚❚';
      restart();
    };
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', `Fotografia ${i + 1}`);
      d.addEventListener('click', () => { go(i); restart(); });
      dots.appendChild(d);
    });
    pauseBtn.addEventListener('click', () => setPaused(!paused));
    $$('button', dots).forEach((d, j) => d.setAttribute('aria-current', String(j === 0)));
    const start = () => {
      slides.forEach(s => { s.hidden = false; });
      setPaused(paused);
    };
    if (document.readyState === 'complete') setTimeout(start, 1500);
    else addEventListener('load', () => setTimeout(start, 1500));
  }

  /* Antes / depois */
  $$('.ba').forEach(ba => {
    const range = $('input[type="range"]', ba);
    if (range) range.addEventListener('input', () => ba.style.setProperty('--pos', range.value + '%'));
  });

  /* Filtros dos imóveis */
  const filterBtns = $$('.filters button');
  filterBtns.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    filterBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $$('.listing').forEach(l => { l.hidden = !(f === 'all' || l.dataset.status === f); });
  }));

  /* Assunto do formulário a partir de botões como "Invista connosco" */
  const topic = $('#f-topic');
  $$('[data-topic]').forEach(a => a.addEventListener('click', () => { if (topic) topic.value = a.dataset.topic; }));

  /* Formulário: mensagem clara quando falta alguma coisa */
  const form = $('#contactForm');
  const note = $('#formNote');
  if (form && note) {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        note.textContent = 'Falta preencher: nome, um email válido, a mensagem e a aceitação da Política de Privacidade.';
        const first = $(':invalid:not(form)', form);
        if (first) first.focus();
      }
    });
  }

  /* Janela "Quer investir com a Sud Living?" */
  const invest = $('#invest');
  if (invest) {
    const KEY = 'sud-invest-dismissed';
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(KEY) === '1'; } catch (_) {}
    const close = () => {
      invest.classList.remove('is-open');
      try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
    };
    if (!dismissed) {
      setTimeout(() => {
        invest.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => invest.classList.add('is-open')));
      }, 9000);
    }
    $('#investClose').addEventListener('click', close);
    $('#investCta').addEventListener('click', close);
  }

  /* Revelar ao fazer scroll */
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight) el.classList.add('is-in'); else { el.classList.add('will-reveal'); io.observe(el); }
    });
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-in'));
  }
})();

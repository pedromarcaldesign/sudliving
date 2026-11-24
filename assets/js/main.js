(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: transparente sobre a hero, sólido depois */
  const header = $('#header');
  const hero = $('.hero');
  const heroLogo = $('#heroLogo');
  const onScroll = () => {
    const h = hero.offsetHeight;
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > h - 90);
    if (!reduce && y < h) {
      const p = y / h;
      heroLogo.style.transform = `translateY(${-p * 40}px)`;
      heroLogo.style.opacity = String(1 - p * 1.4);
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* Menu mobile */
  const btn = $('#menuBtn');
  const panel = $('#menuPanel');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('a', panel).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* Carrossel da hero */
  const slides = $$('#heroSlides img');
  const dots = $('#heroDots');
  let current = 0, timer;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', `Fotografia ${i + 1}`);
    d.addEventListener('click', () => { go(i); restart(); });
    dots.appendChild(d);
  });
  const go = i => {
    slides[current].classList.remove('is-active');
    current = (i + slides.length) % slides.length;
    const img = slides[current];
    if (img.loading === 'lazy') img.loading = 'eager';
    img.classList.add('is-active');
    $$('button', dots).forEach((d, j) => d.setAttribute('aria-current', String(j === current)));
  };
  const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(current + 1), 5500); };
  go(0); restart();

  /* Antes / depois */
  $$('.ba:not(.ba-empty)').forEach(ba => {
    const range = $('input[type="range"]', ba);
    const set = v => ba.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => set(range.value));
  });

  /* Filtros For Sale */
  const filterBtns = $$('.filters button');
  filterBtns.forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    filterBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    $$('.listing').forEach(l => { l.hidden = !(f === 'all' || l.dataset.status === f); });
  }));

  /* Clicar num imóvel preenche o formulário */
  const msg = $('#f-msg');
  const topic = $('#f-topic');
  $$('.listing').forEach(l => l.addEventListener('click', () => {
    topic.value = 'Comprar um imóvel';
    msg.value = `Olá, gostaria de saber mais sobre: ${l.dataset.subject}.`;
  }));
  $$('[data-invest]').forEach(a => a.addEventListener('click', () => { topic.value = 'Investir com a Sud Living'; }));

  /* Formulário → email */
  const form = $('#contactForm');
  const note = $('#formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      note.textContent = 'Por favor preencha o nome, um email válido e a mensagem.';
      form.reportValidity();
      return;
    }
    const d = new FormData(form);
    const body = `${d.get('message')}\n\n—\n${d.get('name')}\n${d.get('email')}${d.get('phone') ? '\n' + d.get('phone') : ''}`;
    location.href = `mailto:geral@sudliving.com?subject=${encodeURIComponent('Sud Living — ' + d.get('topic'))}&body=${encodeURIComponent(body)}`;
    note.textContent = 'Obrigado! O seu programa de email foi aberto com a mensagem pronta a enviar.';
  });

  /* Pop-up "Quer investir com a Sud Living?" */
  const invest = $('#invest');
  const KEY = 'sud-invest-dismissed';
  let dismissed = false;
  try { dismissed = sessionStorage.getItem(KEY) === '1'; } catch (_) {}
  const closeInvest = () => {
    invest.classList.remove('is-open');
    invest.setAttribute('aria-hidden', 'true');
    try { sessionStorage.setItem(KEY, '1'); } catch (_) {}
  };
  if (!dismissed) {
    setTimeout(() => { invest.classList.add('is-open'); invest.setAttribute('aria-hidden', 'false'); }, 9000);
  }
  $('#investClose').addEventListener('click', closeInvest);
  $('#investCta').addEventListener('click', () => { topic.value = 'Investir com a Sud Living'; closeInvest(); });

  /* Links ainda por definir */
  $$('[data-todo-link]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* Revelar ao fazer scroll */
  const io = 'IntersectionObserver' in window && !reduce
    ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' })
    : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('is-in'));

  $('#year').textContent = new Date().getFullYear();
})();

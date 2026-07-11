(() => {
  const fallback = 'assets/img/ui/placeholder.svg';
  const qs = (s, ctx = document) => ctx.querySelector(s);
  const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const roomGrid = qs('#roomGrid');
  const heroImage = qs('#heroImage');
  const heroTitle = qs('#heroTitle');
  const heroDesc = qs('#heroDesc');
  const lightbox = qs('#lightbox');
  const lightboxImage = qs('#lightboxImage');
  const lightboxTitle = qs('#lightboxTitle');
  const lightboxRoom = qs('#lightboxRoom');
  let currentRoomIndex = 0;
  let currentWorkIndex = 0;
  let heroIndex = 0;

  function imageFallback(img){ img.onerror = null; img.src = fallback; }

  function buildRoomCards(){
    roomGrid.innerHTML = MUSEO.salas.map(sala => `
      <a class="room-card reveal" href="#sala-${sala.id}">
        <div class="thumb"><img src="${sala.portada}" alt="${sala.titulo} - ${sala.tema}" onerror="this.src='${fallback}'"></div>
        <strong>${sala.titulo}</strong>
        <span>${sala.tema}</span>
      </a>
    `).join('');
  }

  function buildRooms(){
    MUSEO.salas.forEach((sala, roomIndex) => {
      const section = qs(`#sala-${sala.id}`);
      const first = sala.obras[0] || {titulo:sala.tema, archivo:sala.portada};
      section.innerHTML = `
        <div class="room-inner">
          <div class="room-header reveal">
            <div class="room-kicker">Museo Virtual Virgen de Zapopan</div>
            <h3>${sala.titulo}</h3>
            <div class="room-title-sub">${sala.tema}</div>
          </div>
          <div class="room-layout">
            <article class="featured reveal" aria-label="Obra principal de ${sala.titulo}">
              <div class="frame">
                <img class="featured-image" src="${sala.portada}" alt="${sala.tema}" onerror="this.src='${fallback}'">
              </div>
              <div class="plaque">
                <strong class="featured-title">${sala.tema}</strong>
                <span class="featured-desc">Selecciona una imagen para verla en grande.</span>
              </div>
              <div class="featured-controls">
                <button class="small-btn prev-room-work" type="button">Anterior</button>
                <button class="small-btn open-current" type="button">Ver grande</button>
                <button class="small-btn next-room-work" type="button">Siguiente</button>
              </div>
            </article>
            <div class="gallery-grid reveal">
              ${sala.obras.map((obra, workIndex) => `
                <button class="work-card" type="button" data-room-index="${roomIndex}" data-work-index="${workIndex}">
                  <span class="mini-frame"><img src="${obra.archivo}" alt="${obra.titulo}" onerror="this.src='${fallback}'"></span>
                  <span>${obra.titulo}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      const firstCard = qs('.work-card', section);
      if(firstCard) firstCard.classList.add('active');
      section.dataset.currentWork = '0';
      updateFeatured(section, sala, first, 0);
    });
  }

  function updateFeatured(section, sala, obra, index){
    const img = qs('.featured-image', section);
    const title = qs('.featured-title', section);
    const desc = qs('.featured-desc', section);
    if(!img || !title || !desc) return;
    img.src = obra.archivo;
    img.alt = `${obra.titulo} - ${sala.tema}`;
    img.onerror = () => imageFallback(img);
    title.textContent = obra.titulo;
    desc.textContent = `${sala.titulo} · ${sala.tema}`;
    section.dataset.currentWork = String(index);
    qsa('.work-card', section).forEach(btn => btn.classList.toggle('active', Number(btn.dataset.workIndex) === index));
  }

  function selectWork(roomIndex, workIndex, open = false){
    const sala = MUSEO.salas[roomIndex];
    const obra = sala.obras[workIndex];
    const section = qs(`#sala-${sala.id}`);
    currentRoomIndex = roomIndex;
    currentWorkIndex = workIndex;
    updateFeatured(section, sala, obra, workIndex);
    if(open) openLightbox(roomIndex, workIndex);
  }

  function openLightbox(roomIndex, workIndex){
    const sala = MUSEO.salas[roomIndex];
    const obra = sala.obras[workIndex];
    currentRoomIndex = roomIndex;
    currentWorkIndex = workIndex;
    lightboxImage.src = obra.archivo;
    lightboxImage.alt = `${obra.titulo} - ${sala.tema}`;
    lightboxImage.onerror = () => imageFallback(lightboxImage);
    lightboxTitle.textContent = obra.titulo;
    lightboxRoom.textContent = `${sala.titulo} · ${sala.tema}`;
    if(typeof lightbox.showModal === 'function') lightbox.showModal();
  }

  function moveLightbox(step){
    const sala = MUSEO.salas[currentRoomIndex];
    currentWorkIndex = (currentWorkIndex + step + sala.obras.length) % sala.obras.length;
    selectWork(currentRoomIndex, currentWorkIndex, true);
  }

  function moveRoomWork(section, step){
    const roomId = Number(section.dataset.room);
    const roomIndex = MUSEO.salas.findIndex(s => s.id === roomId);
    const sala = MUSEO.salas[roomIndex];
    const next = (Number(section.dataset.currentWork || 0) + step + sala.obras.length) % sala.obras.length;
    selectWork(roomIndex, next, false);
  }

  function startHero(){
    const featured = [
      { img: MUSEO.principal.imagen, title: 'Entrada principal', desc: 'Bienvenida al museo virtual.' },
      ...MUSEO.salas.map(s => ({ img: s.portada, title: s.titulo, desc: s.tema }))
    ];
    const render = () => {
      const item = featured[heroIndex % featured.length];
      heroImage.src = item.img;
      heroImage.onerror = () => imageFallback(heroImage);
      heroTitle.textContent = item.title;
      heroDesc.textContent = item.desc;
      heroIndex++;
    };
    render();
    setInterval(render, 5200);
  }

  function observeReveals(){
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
    }, {threshold:.12});
    qsa('.reveal').forEach(el => io.observe(el));
  }

  function observeActiveNav(){
    const navLinks = qsa('.main-nav a, .room-menu a');
    const targets = ['entrada','sala-1','sala-2','sala-3','sala-4'].map(id => qs(`#${id}`));
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, {threshold:.48});
    targets.forEach(el => io.observe(el));
  }

  function bindEvents(){
    qs('#menuToggle').addEventListener('click', () => {
      const nav = qs('#mainNav');
      nav.classList.toggle('open');
      qs('#menuToggle').setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    document.addEventListener('click', e => {
      const card = e.target.closest('.work-card');
      if(card) selectWork(Number(card.dataset.roomIndex), Number(card.dataset.workIndex), true);
      if(e.target.classList.contains('prev-room-work')) moveRoomWork(e.target.closest('.room'), -1);
      if(e.target.classList.contains('next-room-work')) moveRoomWork(e.target.closest('.room'), 1);
      if(e.target.classList.contains('open-current')){
        const section = e.target.closest('.room');
        const roomIndex = MUSEO.salas.findIndex(s => s.id === Number(section.dataset.room));
        openLightbox(roomIndex, Number(section.dataset.currentWork || 0));
      }
    });
    qs('#closeLightbox').addEventListener('click', () => lightbox.close());
    qs('#prevWork').addEventListener('click', () => moveLightbox(-1));
    qs('#nextWork').addEventListener('click', () => moveLightbox(1));
    lightbox.addEventListener('click', e => { if(e.target === lightbox) lightbox.close(); });
    document.addEventListener('keydown', e => {
      if(!lightbox.open) return;
      if(e.key === 'ArrowLeft') moveLightbox(-1);
      if(e.key === 'ArrowRight') moveLightbox(1);
      if(e.key === 'Escape') lightbox.close();
    });
  }

  buildRoomCards();
  buildRooms();
  startHero();
  bindEvents();
  observeReveals();
  observeActiveNav();
})();

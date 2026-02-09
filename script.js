// Scroll reveal + staggered animations
(function(){
  function initReveals(){
  // Select elements we want animated (extended for site-wide animation)
  const selector = ['.brand', '.site-title', '.site-sub', 'header', '.hero h1', '.hero p', 'h1', 'h2', 'p', 'section', '.card-light', '.btn-custom', '.main-nav a', 'img', 'figure', 'figcaption', '.site-footer'];
  const els = Array.from(document.querySelectorAll(selector.join(','))).filter(Boolean);

    if(els.length === 0) return;

    // apply base class and incremental delays
    els.forEach((el, i) => {
      // don't overwrite existing inline delay if set
      if(!el.classList.contains('reveal')) el.classList.add('reveal');
      // set a gentle stagger, clamp to avoid huge delays
      const delay = Math.min(700, i * 70);
      el.style.animationDelay = `${delay}ms`;
    });

    // Special handling: stagger list items inside any .stagger-list container
    const staggerContainers = Array.from(document.querySelectorAll('.stagger-list'));
    staggerContainers.forEach(container => {
      const items = Array.from(container.querySelectorAll('li'));
      items.forEach((li, idx) => {
        // ensure reveal class present
        if(!li.classList.contains('reveal')) li.classList.add('reveal');
        const base = 220; // base delay for lists
        li.style.animationDelay = `${base + idx * 90}ms`;
      });
    });

    // use IntersectionObserver to reveal on enter
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      // Observe all elements that currently have the reveal class (includes stagger-list items)
      const toObserve = Array.from(document.querySelectorAll('.reveal'));
      toObserve.forEach(el => io.observe(el));
    } else {
      // fallback: show all slowly
      const toShow = Array.from(document.querySelectorAll('.reveal'));
      toShow.forEach((el, idx) => { setTimeout(()=> el.classList.add('show'), 120 + idx * 40); });
    }
  }

  // Run on DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initReveals);
  } else {
    initReveals();
  }

  // small helper: animate new elements added dynamically
  window.__reveal = function(node, delay){
    if(!node) return;
    node.classList.add('reveal');
    if(delay) node.style.animationDelay = `${delay}ms`;
    // reveal immediately if visible
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); obs.unobserve(e.target); } });
      }, { threshold: 0.12 });
      io.observe(node);
    } else {
      setTimeout(()=> node.classList.add('show'), delay || 80);
    }
  };

})();

/* Lightbox + micro-tilt for gallery images */
(function(){
  function buildLightbox(){
    const overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.innerHTML = `
      <div class="lb-content">
        <button class="lb-close" aria-label="Fermer">✕</button>
        <img src="" alt="" />
        <div class="lb-caption"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  const overlay = buildLightbox();
  const lbImg = overlay.querySelector('img');
  const lbCaption = overlay.querySelector('.lb-caption');
  const lbClose = overlay.querySelector('.lb-close');

  function openLightbox(src, alt, caption){
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCaption.textContent = caption || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    overlay.classList.remove('active');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e)=>{ if(e.target === overlay || e.target === lbClose) closeLightbox(); });

  // Attach handlers to gallery images
  function initGallery(){
    const imgs = Array.from(document.querySelectorAll('.gallery img'));
    imgs.forEach(img => {
      img.classList.add('tilt');
      // preserve existing reveal behaviour
      img.addEventListener('click', ()=> openLightbox(img.src, img.alt, img.dataset.caption || img.alt || ''));
      // keyboard accessibility
      img.setAttribute('tabindex', '0');
      img.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img.src, img.alt, img.dataset.caption || img.alt || ''); } });
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGallery); else initGallery();

})();

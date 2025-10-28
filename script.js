// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const siteNav = document.getElementById('siteNav');
if (menuBtn && siteNav){
  menuBtn.addEventListener('click', () => {
    const open = siteNav.style.display === 'flex';
    siteNav.style.display = open ? 'none' : 'flex';
    siteNav.style.flexDirection = 'column';
    menuBtn.setAttribute('aria-expanded', String(!open));
  });
}

// Expand/collapse testimonials
document.querySelectorAll('.moreless').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = btn.previousElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    if (!expanded){
      // expand
      p.classList.remove('truncate');
      p.textContent = '“' + (p.dataset.more || p.textContent.replace(/^“|”$/g,'')) + '”';
      btn.textContent = 'Show less';
    } else {
      // collapse to two lines
      p.classList.add('truncate');
      const short = (p.dataset.more || p.textContent).slice(0, 64).trim().replace(/\s+\S*$/, '');
      p.textContent = '“' + short + '…”';
      btn.textContent = 'Read more';
    }
    btn.setAttribute('aria-expanded', String(!expanded));
  });
});

// Year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Mark nav link as current when clicked or when hash matches
(function(){
  const navLinks = document.querySelectorAll('#siteNav a');
  if (!navLinks || navLinks.length === 0) return;
  const STORAGE_KEY = 'siteNavCurrentHref';
  function clearCurrent(){ navLinks.forEach(a => a.removeAttribute('aria-current')); }
  function setCurrent(link){
    if (!link) return;
    clearCurrent();
    link.setAttribute('aria-current','page');
    try{ localStorage.setItem(STORAGE_KEY, link.getAttribute('href') || ''); }catch(e){}
  }

  function restoreFromStorage(){
    // Prefer hash if present
    if (location.hash){
      const match = Array.from(navLinks).find(a => a.getAttribute('href') === location.hash);
      if (match){ setCurrent(match); return; }
    }
    // Otherwise use saved selection
    try{
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved){
        const match = Array.from(navLinks).find(a => a.getAttribute('href') === saved);
        if (match) setCurrent(match);
      }
    }catch(e){}
  }

  // Initialize selection on load
  restoreFromStorage();

  // Persist selection on click
  navLinks.forEach(a => a.addEventListener('click', () => setCurrent(a)));

  // Update when hash/popstate changes
  window.addEventListener('hashchange', restoreFromStorage);
  window.addEventListener('popstate', restoreFromStorage);

  // When the header logo/link is clicked, mark the Home (#home) nav item as current
  try{
    const brandAnchor = document.querySelector('.brand a');
    const homeLink = Array.from(navLinks).find(a => a.getAttribute('href') === '#home') || navLinks[0];
    if (brandAnchor && homeLink){
      brandAnchor.addEventListener('click', () => {
        // setCurrent will also persist to localStorage
        setCurrent(homeLink);
      });
    }
  }catch(e){}
})();

// Hero flip (mobile) - toggles the hero card flip state
(function(){
  const heroCard = document.getElementById('heroCard');
  const flipBtn = document.getElementById('heroFlipBtn');
  if (!heroCard || !flipBtn) return;
  flipBtn.addEventListener('click', (e) => {
    e.preventDefault();
    heroCard.classList.toggle('is-flipped');
    // update aria-pressed for accessibility
    const pressed = heroCard.classList.contains('is-flipped');
    flipBtn.setAttribute('aria-pressed', String(pressed));
  });
})();

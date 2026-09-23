/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== HAMBURGER / MOBILE MENU ===== */
const ham = document.getElementById('ham');
const mobMenu = document.getElementById('mobMenu');
ham && ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mobMenu.classList.toggle('open');
  document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mob-links a').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== MOBILE SERVICES TOGGLE ===== */
const mobSrvToggle = document.getElementById('mobSrvToggle');
const mobSrvList = document.getElementById('mobSrvList');
if (mobSrvToggle && mobSrvList) {
  mobSrvToggle.addEventListener('click', (e) => {
    e.preventDefault();
    mobSrvList.classList.toggle('show');
    const arrow = mobSrvToggle.querySelector('.nav-arrow');
    if (arrow) arrow.textContent = mobSrvList.classList.contains('show') ? '▴' : '▾';
  });
}

/* ===== ACTIVE NAV ===== */
(function() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links > li > a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
})();

/* ===== SCROLL ANIMATIONS (AOS) ===== */
window.aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.aos').forEach(el => window.aosObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
function runCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const dur = 1800;
  const step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur) + suffix;
    if (cur >= target) clearInterval(t);
  }, 16);
}
const cntObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      runCounter(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-target]').forEach(el => cntObserver.observe(el));

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ===== PORTFOLIO FILTER ===== */
function bindPortfolioFilter() {
  const pfBtns = document.querySelectorAll('.pf-btn');
  const pfCards = document.querySelectorAll('.pf-card');
  pfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pfBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      pfCards.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        c.style.display = show ? '' : 'none';
        if (show) c.style.animation = 'fadeIn 0.35s ease';
      });
    });
  });
}
bindPortfolioFilter();

/* ===== CONTACT FORM ===== */
const cForm = document.getElementById('contactForm');
if (cForm) {
  cForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = cForm.querySelector('[type=submit]');
    const origText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      cForm.style.display = 'none';
      const succ = document.getElementById('formSuccess');
      if (succ) succ.classList.add('show');
    }, 1400);
  });
}

/* ===== SMOOTH SCROLL FOR HASH LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ===== CMS DYNAMIC DATA FETCHING ===== */
document.addEventListener('DOMContentLoaded', () => {
  fetch('data/content.json')
    .then(res => res.json())
    .then(data => {

      // 1. Render Team
      const teamGrid = document.querySelector('.team-grid');
      if (teamGrid && data.team) {
        // Keep ONLY the featured founder card
        const founderCard = teamGrid.querySelector('.team-card.featured');
        // Remove all other static team cards
        teamGrid.innerHTML = '';
        if (founderCard) teamGrid.appendChild(founderCard);

        data.team.forEach((member, idx) => {
          const div = document.createElement('div');
          const delay = (idx % 4) + 2;
          div.className = 'team-card aos d' + delay;

          const img = document.createElement('img');
          img.src = member.image;
          img.alt = member.name;
          img.className = 'team-photo';
          div.appendChild(img);

          const body = document.createElement('div');
          body.className = 'team-body';

          const role = document.createElement('div');
          role.className = 'team-role';
          role.textContent = member.role;
          body.appendChild(role);

          const name = document.createElement('h3');
          name.className = 'team-name';
          name.textContent = member.name;
          body.appendChild(name);

          const desc = document.createElement('p');
          desc.className = 'team-desc';
          desc.textContent = member.description;
          body.appendChild(desc);

          div.appendChild(body);
          teamGrid.appendChild(div);
        });

        // Re-observe AOS for dynamically added team members
        teamGrid.querySelectorAll('.aos').forEach(el => window.aosObserver.observe(el));
      }

      // 2. Render Stats
      if (data.stats) {
        document.querySelectorAll('[data-stat]').forEach(el => {
          const statKey = el.dataset.stat;
          if (data.stats[statKey]) {
            el.dataset.target = data.stats[statKey];
          }
        });
      }

      // 3. Render Portfolio
      const pfGrid = document.querySelector('.pf-grid');
      if (pfGrid && data.portfolio) {
        pfGrid.innerHTML = '';
        data.portfolio.forEach(item => {
          const div = document.createElement('div');
          div.className = 'pf-card';
          div.dataset.cat = item.category;

          const imgBox = document.createElement('div');
          imgBox.className = 'pf-img-box';
          const img = document.createElement('img');
          img.src = item.image;
          img.alt = item.title;
          img.className = 'pf-img';
          imgBox.appendChild(img);
          div.appendChild(imgBox);

          const info = document.createElement('div');
          info.className = 'pf-info';

          const cat = document.createElement('div');
          cat.className = 'pf-cat';
          cat.textContent = item.category.toUpperCase();
          info.appendChild(cat);

          const title = document.createElement('h3');
          title.className = 'pf-title';
          title.textContent = item.title;
          info.appendChild(title);

          const desc = document.createElement('p');
          desc.textContent = item.description;
          info.appendChild(desc);

          div.appendChild(info);
          pfGrid.appendChild(div);
        });

        // Re-bind portfolio filter for dynamic cards
        bindPortfolioFilter();
      }
    })
    .catch(err => console.log('CMS data not loaded, using static fallback.', err));
});
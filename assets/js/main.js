/* =====================================================
   SANKALP MARATHI MANDAL — SHARED JAVASCRIPT
   =====================================================
   ALL SITE DATA IS SERVED FROM EXCEL WORKBOOKS IN THIS
   REPO (converted from the original Google Sheets).
   To update content, edit the .xlsx files in /data —
   the site reads them directly in the browser (SheetJS):

     data/home-events.xlsx            → homepage event cards
     data/timeline.xlsx               → Event Timeline page
     data/testimonials.xlsx  → homepage Community Voices
     data/highlights.json    → homepage slider (AUTO — just
                               add photos to assets/images/highlights/)
     data/partners.xlsx        → homepage partner logos
     data/team.xlsx             → Our Team page
     data/shala-team.xlsx        → Marathi Shala team section
     data/faq.xlsx            → FAQs page
     data/shala-faq.xlsx               → Marathi Shala FAQs

   Images live in assets/images/. Add new images there
   and reference them by relative path in the workbooks.
   ===================================================== */

const CONFIG = {
  EVENTS_CSV: 'data/home-events.xlsx',
  TIMELINE_CSV: 'data/timeline.xlsx',
  TESTIMONIALS_CSV: 'data/testimonials.xlsx',
  HIGHLIGHTS_JSON: 'data/highlights.json',
  PARTNERS_CSV: 'data/partners.xlsx',
  TEAM_CSV: 'data/team.xlsx',
  SHALA_TEAM_CSV: 'data/shala-team.xlsx',
  FAQS_CSV: 'data/faq.xlsx',
  SHALA_FAQS_CSV: 'data/shala-faq.xlsx',

  SLIDER_INTERVAL: 4000,

  // Google Forms
  JOIN_FORM: 'https://docs.google.com/forms/d/e/1FAIpQLScRMbN063-W2u8Czz53sszMnt1qNFGqaozf-9tspHdo28S-VQ/viewform?usp=sharing',
  SPONSOR_FORM: 'https://docs.google.com/forms/d/e/1FAIpQLSdZlvQ6H7zD9gD5h3I9Vmxi0uXRG7W8vBtijhQ_J2JXTS-p3w/viewform?usp=sharing',

  // SHOWCASE ITEMS — PLACEHOLDER: replace with real performances/art/achievements.
  SHOWCASE_ITEMS: [
    { title: 'Community Performance', category: 'Dance',   image: '', desc: 'Placeholder — describe the performance or achievement.' },
    { title: 'Talent Showcase',       category: 'Music',   image: '', desc: 'Placeholder — describe the performance or achievement.' },
    { title: 'Art & Craft',           category: 'Art',     image: '', desc: 'Placeholder — describe the artwork or exhibit.' },
    { title: 'Shala Students',        category: 'Marathi Shala', image: '', desc: 'Placeholder — highlight student accomplishments.' }
  ]
};

/* =====================================================
   NAV — mobile toggle + active link
   ===================================================== */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });
}

/* =====================================================
   BACK TO TOP
   ===================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* =====================================================
   HELPERS
   ===================================================== */
function viewFullSize(imageUrl) { window.open(imageUrl, '_blank'); }

function badgeText(t) {
  return t === 'previous' ? 'Previous' : t === 'current' ? 'Happening Now' : 'Upcoming';
}

function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

/* Warn when the site is opened as a file:// page — data cannot load without a server */
function fileProtocolNotice() {
  if (location.protocol !== 'file:') return false;
  const msg = `<div style="text-align:center;padding:32px;color:#92400e;background:#fffbeb;border:1px dashed #f59e0b;border-radius:12px;max-width:640px;margin:0 auto;">
    <p style="font-weight:700;margin-bottom:8px;">Data can't load when the page is opened directly as a file.</p>
    <p style="font-size:14px;line-height:1.6;">Double-click <strong>Start Local Preview.command</strong> in the site folder to view the site with data,<br>or visit the live site once it's on GitHub Pages.</p>
  </div>`;
  ['timeline-loading','events-grid','testimonials-container','team-container','shala-team-container','faq-container','shala-faq-container']
    .forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = msg; });
  return true;
}

/* Load an Excel workbook and return rows of the first sheet as objects */
function loadSheet(path, onDone, onError) {
  if (location.protocol === 'file:') return;
  fetch(path)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then(buf => {
      const wb = XLSX.read(buf, { type: 'array' });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      onDone(rows.map(r => {
        const out = {};
        for (const k in r) out[String(k).trim()] = String(r[k]).trim();
        return out;
      }));
    })
    .catch(err => { console.error('Failed to load', path, err); if (onError) onError(err); });
}

const MONTH_NUM = { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 };
function monthNum(m) { return MONTH_NUM[(m || '').slice(0,3).toLowerCase()] || 0; }

/* Derive previous/current/future from Year+Month vs today */
function deriveType(e) {
  const now = new Date();
  const y = parseInt(e.Year) || now.getFullYear();
  const m = monthNum(e.Month);
  const nowKey = now.getFullYear() * 100 + (now.getMonth() + 1);
  const evKey = y * 100 + m;
  if (evKey < nowKey) return 'previous';
  if (evKey === nowKey) return 'current';
  return 'future';
}

/* =====================================================
   EVENT MODAL
   ===================================================== */
let modalTriggerElement = null;
const FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function animateModalOpen(el) {
  const r = el.getBoundingClientRect();
  const ox = ((r.left + r.width / 2) / window.innerWidth) * 100;
  const oy = ((r.top + r.height / 2) / window.innerHeight) * 100;
  const mc = document.getElementById('modal-content');
  mc.style.transformOrigin = `${ox}% ${oy}%`;
  mc.classList.add('animating-in');
  setTimeout(() => mc.classList.remove('animating-in'), 400);
}

function openModal(e, clickedElement) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const flyer = (e.Flyer || e.ImageURL || '').trim();
  const media = document.getElementById('modal-media');
  modalTriggerElement = clickedElement;

  if (flyer) {
    media.innerHTML = `
      <div class="modal-media-container">
        <img src="${flyer}" alt="Event flyer for ${escapeHtml(e.Name)}" loading="eager">
        <button class="view-fullsize-btn" onclick="viewFullSize('${flyer}')" title="View Full Size" aria-label="View full size image">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </button>
      </div>`;
    media.style.display = 'flex';
  } else {
    media.innerHTML = '';
    media.style.display = 'none';
  }

  document.getElementById('modal-title').innerText = e.Name || '';
  document.getElementById('modal-desc').innerText  = e.Description || e.Summary || '';
  document.getElementById('modal-meta').innerHTML  = `
    <div class="meta-item">
      <svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span><strong>Date:</strong> ${escapeHtml(e.Month)} ${escapeHtml(e.Date || '')}${e.Date ? ',' : ''} ${escapeHtml(e.Year)}</span>
    </div>
    ${e.Time   ? `<div class="meta-item"><svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span><strong>Time:</strong> ${escapeHtml(e.Time)}</span></div>` : ''}
    ${e.Venue  ? `<div class="meta-item"><svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg><span><strong>Venue:</strong> ${escapeHtml(e.Venue)}${e.Location ? ', ' + escapeHtml(e.Location) : ''}</span></div>` : ''}
    ${e.Contact? `<div class="meta-item"><svg class="meta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><span><strong>Contact:</strong> ${escapeHtml(e.Contact)}</span></div>` : ''}
  `;

  modal.classList.add('active');
  document.body.classList.add('modal-open');
  animateModalOpen(clickedElement);
  setTimeout(() => document.getElementById('modal-close-btn').focus(), 100);
  initFocusTrap();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.classList.remove('active');
    modal.style.opacity = '';
    document.body.classList.remove('modal-open');
    if (modalTriggerElement) { modalTriggerElement.focus(); modalTriggerElement = null; }
  }, 200);
}

function initFocusTrap() {
  const modal = document.getElementById('modal');
  const els   = modal.querySelectorAll(FOCUSABLE_ELEMENTS);
  const first = els[0], last = els[els.length - 1];
  modal.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) { if (document.activeElement === first) { last.focus();  e.preventDefault(); } }
    else            { if (document.activeElement === last)  { first.focus(); e.preventDefault(); } }
  });
}

document.addEventListener('keydown', e => {
  const modal = document.getElementById('modal');
  if (e.key === 'Escape' && modal?.classList.contains('active')) closeModal();
});

/* =====================================================
   EVENTS GRID (homepage)
   ===================================================== */
function loadEvents() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div>';

  loadSheet(CONFIG.EVENTS_CSV, rows => {
      grid.innerHTML = '';
      rows
        .filter(e => e.Name && e.Name.trim())
        .sort((a, b) => ({previous:0,current:1,future:2}[a.Type] - {previous:0,current:1,future:2}[b.Type]))
        .forEach(e => {
          const t = e.Type || deriveType(e);
          const card = document.createElement('article');
          card.className = `event-card ${t}`;
          card.setAttribute('tabindex', '0');
          card.setAttribute('role', 'button');
          card.setAttribute('aria-label', `View details for ${e.Name}`);
          card.innerHTML = `
            <div class="event-badge badge-${t}">${badgeText(t)}</div>
            <div class="event-image">
              ${e.ImageURL ? `<img src="${e.ImageURL}" alt="${escapeHtml(e.Name)} event image" loading="lazy">` : ''}
              <div class="date-overlay">
                <div class="date-month">${escapeHtml(e.Month)}</div>
                <div class="date-day">${escapeHtml(e.Date)}</div>
                <div class="date-year">${escapeHtml(e.Year)}</div>
              </div>
            </div>
            <div class="event-content">
              <h2 class="event-name">${escapeHtml(e.Name)}</h2>
              ${e.Venue    ? `<div class="event-venue-info"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="venue-icon location-building"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg><span>${escapeHtml(e.Venue)}</span></div>` : ''}
              ${e.Location ? `<div class="event-venue-info"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="venue-icon venue-pin"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><span>${escapeHtml(e.Location)}</span></div>` : ''}
              <p class="event-description">${escapeHtml(e.Summary || e.Description || '')}</p>
            </div>`;
          card.addEventListener('click', function() { openModal(e, this); });
          card.addEventListener('keydown', function(ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openModal(e, this); } });
          grid.appendChild(card);
        });
    },
    () => { grid.innerHTML = '<p style="text-align:center;color:var(--apple-gray);grid-column:1/-1;">Events could not be loaded right now.</p>'; }
  );
}

/* =====================================================
   EVENT TIMELINE (event-timeline.html)
   ===================================================== */
let timelineData = {};

function loadTimeline() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  const loading = document.getElementById('timeline-loading');

  loadSheet(CONFIG.TIMELINE_CSV, rows => {
      timelineData = {};
      rows.forEach(e => { if (!e.Name && e.Title) e.Name = e.Title; });
      rows.filter(e => e.Name && e.Name.trim()).forEach(e => {
        const y = e.Year || 'Other';
        (timelineData[y] = timelineData[y] || []).push(e);
      });
      Object.values(timelineData).forEach(list => list.sort((a, b) => {
        const d = monthNum(a.Month) - monthNum(b.Month);
        return d !== 0 ? d : (parseInt(a.Date) || 0) - (parseInt(b.Date) || 0);
      }));

      const select = document.getElementById('yearSelect');
      select.innerHTML = '';
      Object.keys(timelineData).sort((a, b) => b - a).forEach(y => {
        const o = document.createElement('option');
        o.value = y; o.textContent = y;
        select.appendChild(o);
      });
      select.onchange = renderTimelineYear;

      if (loading) loading.style.display = 'none';
      document.getElementById('yearSelector').style.display = 'block';
      renderTimelineYear();
    },
    () => { if (loading) loading.textContent = 'Error loading events. Please try again.'; }
  );
}

function renderTimelineYear() {
  const year = document.getElementById('yearSelect').value;
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';
  if (!timelineData[year]) return;

  timelineData[year].forEach((e, i) => {
    const t = deriveType(e);
    const item = document.createElement('div');
    item.className = `timeline-item ${t}`;
    item.style.animationDelay = `${i * 0.1}s`;
    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content" tabindex="0" role="button" aria-label="View details for ${escapeHtml(e.Name)}">
        <div class="month-label">${escapeHtml(e.Month)} ${escapeHtml(e.Year)}</div>
        ${e.ImageURL ? `<img class="timeline-event-image" src="${e.ImageURL}" alt="${escapeHtml(e.Name)}" loading="lazy">` : ''}
        <div class="timeline-event-title">${escapeHtml(e.Name)}</div>
        <div class="timeline-event-summary">${escapeHtml(e.Summary || e.Description || '')}</div>
      </div>`;
    const card = item.querySelector('.timeline-content');
    card.addEventListener('click', function() { openModal(e, this); });
    card.addEventListener('keydown', function(ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openModal(e, this); } });
    timeline.appendChild(item);
  });
}

/* =====================================================
   TESTIMONIALS (homepage)
   ===================================================== */
function loadTestimonials() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;
  loadSheet(CONFIG.TESTIMONIALS_CSV, rows => {
      container.innerHTML = '';
      const active = rows
        .filter(t => t.Active && t.Active.toUpperCase() === 'YES')
        .sort((a, b) => parseInt(a['Display Order'] || 0) - parseInt(b['Display Order'] || 0));
      active.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        const showPic = t['Show Profile Picture']?.toUpperCase() === 'YES' && t['Profile Image URL'];
        card.innerHTML = `
          ${showPic ? `<div class="testimonial-profile"><img src="${t['Profile Image URL']}" alt="${escapeHtml(t.Name)}" loading="lazy" onerror="this.style.display='none'"><div class="testimonial-name">${escapeHtml(t.Name)}</div></div>` : `<div style="margin-bottom:16px;"><div class="testimonial-name">${escapeHtml(t.Name)}</div></div>`}
          <p class="testimonial-text">"${escapeHtml(t.Testimonial)}"</p>`;
        container.appendChild(card);
      });
      if (!active.length) container.innerHTML = '<p style="text-align:center;color:var(--apple-gray);">No testimonials available at this time.</p>';
  });
}

/* =====================================================
   IMPACT SLIDER (homepage)
   ===================================================== */
let slides = [], currentSlideIndex = 0, slideInterval;

function loadImpactSlider() {
  if (!document.getElementById('slider')) return;
  if (location.protocol === 'file:') return;
  fetch(CONFIG.HIGHLIGHTS_JSON)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(items => {
      slides = items.filter(s => s.photo);
      buildSlider();
      showSlide(0);
      startAutoSlide();
    })
    .catch(err => console.error('Failed to load highlights', err));
}

function buildSlider() {
  const slider = document.getElementById('slider');
  const thumbs = document.getElementById('thumbs');
  slider.innerHTML = ''; thumbs.innerHTML = '';
  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `<img class="bg-img" src="${s.photo}" alt="" loading="lazy"><img class="fg-img" src="${s.photo}" onclick="openPopup('${s.photo}')" alt="${escapeHtml(s.title || 'Highlight photo')}" loading="lazy">${s.title ? `<div class="slide-title">${escapeHtml(s.title)}</div>` : ''}`;
    slider.appendChild(slide);
    const thumb = document.createElement('div');
    thumb.className = 'thumbnail';
    thumb.innerHTML = `<img src="${s.photo}" alt="${escapeHtml(s.title || '')}" loading="lazy">`;
    thumb.onclick = () => showSlide(i);
    thumbs.appendChild(thumb);
  });
}

function showSlide(i) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  currentSlideIndex = i;
  document.querySelectorAll('.slide')[i]?.classList.add('active');
  document.querySelectorAll('.thumbnail')[i]?.classList.add('active');
}

function nextSlide() { showSlide((currentSlideIndex + 1) % slides.length); }
function prevSlide() { showSlide((currentSlideIndex - 1 + slides.length) % slides.length); }
function startAutoSlide() { if (slideInterval) clearInterval(slideInterval); slideInterval = setInterval(nextSlide, CONFIG.SLIDER_INTERVAL); }
function openPopup(src) { document.getElementById('popupImg').src = src; document.getElementById('popup').classList.add('active'); clearInterval(slideInterval); }
function closePopup() { document.getElementById('popup').classList.remove('active'); startAutoSlide(); }

/* =====================================================
   PARTNERS (homepage)
   ===================================================== */
function renderPartnerLogos() {
  const track = document.getElementById('logos-track');
  if (!track) return;
  loadSheet(CONFIG.PARTNERS_CSV, rows => {
      const active = rows.filter(p => p.Name && (p.Active || '').toLowerCase() === 'yes');
      track.innerHTML = active.map(logo => `
        <div class="logo-item">
          <div class="logo-item-image">
            <img src="${logo.ImageURL}" alt="${escapeHtml(logo.Name)}" loading="lazy" onerror="this.closest('.logo-item').style.display='none';">
          </div>
          <div class="logo-item-name">${escapeHtml(logo.Name)}</div>
        </div>`).join('');
  });
}

/* =====================================================
   TEAM (our-team.html + marathi-shala.html)
   ===================================================== */
function renderTeamGrid(csv, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  loadSheet(csv, rows => {
      const members = rows.filter(m => m.Name && m.Name.trim());
      const groups = [...new Set(members.map(m => m.Group))];
      container.innerHTML = groups.map(g => `
        <h2 class="timeline-year" style="text-align:center;margin-top:40px;">${escapeHtml(g)}</h2>
        <div class="team-grid" style="padding-top:20px;padding-bottom:20px;">
          ${members.filter(m => m.Group === g).map(m => {
            const initials = m.Name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            const avatar = m.Photo
              ? `<img class="team-avatar" src="${m.Photo}" alt="${escapeHtml(m.Name)}" loading="lazy" onerror="this.outerHTML='<div class=\\'team-avatar\\'>${initials}</div>'">`
              : `<div class="team-avatar">${initials}</div>`;
            return `
              <div class="team-card">
                ${avatar}
                <div class="team-name">${escapeHtml(m.Name)}</div>
                <div class="team-role">${escapeHtml(m.Position)}</div>
              </div>`;
          }).join('')}
        </div>`).join('');
  });
}

/* =====================================================
   SHOWCASE (showcase.html)
   ===================================================== */
function renderShowcase() {
  const grid = document.getElementById('showcase-grid');
  if (!grid) return;
  grid.innerHTML = CONFIG.SHOWCASE_ITEMS.map(item => `
    <div class="showcase-card">
      <div class="showcase-media">
        ${item.image ? `<img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">` : '<i class="fas fa-image"></i>'}
      </div>
      <div class="showcase-body">
        <div class="showcase-meta">${escapeHtml(item.category)}</div>
        <div class="showcase-title">${escapeHtml(item.title)}</div>
        <p class="showcase-desc">${escapeHtml(item.desc)}</p>
      </div>
    </div>`).join('');
}

/* =====================================================
   FAQ ACCORDION (faqs.html + marathi-shala.html)
   ===================================================== */
function renderFaqs(csv, containerId, groupByCategory) {
  const container = document.getElementById(containerId);
  if (!container) return;
  loadSheet(csv, rows => {
      let faqs = rows
        .filter(f => f.Question && f.Question.trim())
        .filter(f => !f.Active || f.Active.toLowerCase() !== 'no' || csv === CONFIG.SHALA_FAQS_CSV)
        .sort((a, b) => parseInt(a.Order || 0) - parseInt(b.Order || 0));

      const item = f => `
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false">${escapeHtml(f.Question)}</button>
          <div class="faq-answer"><div class="faq-answer-inner">${escapeHtml(f.Answer)}</div></div>
        </div>`;

      if (groupByCategory) {
        const cats = [...new Set(faqs.map(f => f.Category || 'General'))];
        container.innerHTML = cats.map(c => `
          <h2 class="timeline-year" style="font-size:22px;">${escapeHtml(c)}</h2>
          ${faqs.filter(f => (f.Category || 'General') === c).map(item).join('')}`).join('');
      } else {
        container.innerHTML = faqs.map(item).join('');
      }
      initFaqAccordion(container);
  });
}

function initFaqAccordion(scope) {
  (scope || document).querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-answer').style.maxHeight = null;
        o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener('DOMContentLoaded', function() {
  initNav();
  initBackToTop();
  fileProtocolNotice();
  loadEvents();
  loadTestimonials();
  loadImpactSlider();
  renderPartnerLogos();
  loadTimeline();
  renderTeamGrid(CONFIG.TEAM_CSV, 'team-container');
  renderTeamGrid(CONFIG.SHALA_TEAM_CSV, 'shala-team-container');
  renderFaqs(CONFIG.FAQS_CSV, 'faq-container', false);
  renderFaqs(CONFIG.SHALA_FAQS_CSV, 'shala-faq-container', true);
  renderShowcase();

  const modal = document.getElementById('modal');
  modal?.addEventListener('click', function(e) { if (e.target === this) closeModal(); });

  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

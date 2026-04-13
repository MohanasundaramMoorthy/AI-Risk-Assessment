/**
 * AI Risk Assessment Platform — script.js
 * Sidebar navigation, scroll spy, lightbox, mobile menu
 */

/* ─── DOM references ──────────────────────────────────────────────── */
const sidebar        = document.getElementById('sidebar');
const hamburger      = document.getElementById('hamburger');
const overlay        = document.getElementById('sidebar-overlay');
const mainContent    = document.getElementById('main-content');
const navLinks       = document.querySelectorAll('.nav-link[data-section]');
const navGroupToggles= document.querySelectorAll('.nav-group-toggle');
const sections       = document.querySelectorAll('.section[id]');

/* ─── Scroll progress bar ─────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

/* ─── Section fade-in (IntersectionObserver) ──────────────────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.06 }
);

sections.forEach(section => {
  if (!section.classList.contains('hero-section')) {
    fadeObserver.observe(section);
  }
});

/* ─── Scroll spy (active nav link) ───────────────────────────────── */
function getActiveSection() {
  // Find the section whose top is closest to 20% from the viewport top
  const offset = window.innerHeight * 0.25;
  let active = null;
  let closest = Infinity;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const dist = Math.abs(rect.top - offset);
    if (rect.top <= offset + 60 && dist < closest) {
      closest = dist;
      active = section.id;
    }
  });

  // Fallback to first section if none matched
  if (!active && sections.length) active = sections[0].id;
  return active;
}

function setActiveNav(sectionId) {
  navLinks.forEach(link => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle('active', isActive);

    // If active link is inside a nav group, open that group
    if (isActive) {
      const subList = link.closest('.nav-sub');
      if (subList) {
        const group = subList.closest('.nav-group');
        if (group && !group.classList.contains('open')) {
          group.classList.add('open');
        }
      }
    }
  });
}

let scrollRafId = null;
function onScroll() {
  if (scrollRafId) return;
  scrollRafId = requestAnimationFrame(() => {
    updateScrollProgress();
    const activeId = getActiveSection();
    if (activeId) setActiveNav(activeId);
    scrollRafId = null;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
// Run once on load
updateScrollProgress();
setActiveNav(sections[0]?.id);

/* ─── Smooth anchor navigation ────────────────────────────────────── */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    // Close mobile sidebar
    closeMobileSidebar();

    const headerOffset = window.innerWidth <= 900 ? 60 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── CTA button smooth scroll (Home section buttons) ─────────────── */
document.querySelectorAll('.btn[href^="#"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    const headerOffset = window.innerWidth <= 900 ? 60 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* Footer and other anchor links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  if (anchor.classList.contains('nav-link') || anchor.classList.contains('btn')) return;
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerOffset = window.innerWidth <= 900 ? 60 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Nav group toggles (collapsible) ─────────────────────────────── */
navGroupToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.closest('.nav-group');
    group.classList.toggle('open');
  });
});

// Auto-open the chatbot group on load (it has the most sub-links)
const chatbotGroup = document.querySelector('[data-group="chatbot"]')?.closest('.nav-group');
if (chatbotGroup) chatbotGroup.classList.add('open');

/* ─── Mobile sidebar ──────────────────────────────────────────────── */
function openMobileSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  document.body.style.overflow = 'hidden';
}
function closeMobileSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  if (sidebar.classList.contains('open')) {
    closeMobileSidebar();
  } else {
    openMobileSidebar();
  }
});

overlay?.addEventListener('click', closeMobileSidebar);

// Close sidebar on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileSidebar();
    closeLightbox();
  }
});

/* ─── Lightbox ────────────────────────────────────────────────────── */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = caption || '';
  if (lightboxCaption) lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Expose globally for inline onclick handlers
window.openLightbox  = openLightbox;
window.closeLightbox = closeLightbox;

// Prevent click inside lightbox image from closing it
lightboxImg?.addEventListener('click', (e) => e.stopPropagation());

// Make arch-frame images clickable for lightbox
document.querySelectorAll('.arch-frame').forEach(frame => {
  const img = frame.querySelector('img');
  if (!img) return;
  frame.addEventListener('click', () => {
    openLightbox(img.src, img.alt);
  });
});

// Same for slide-frame images
document.querySelectorAll('.slide-frame').forEach(frame => {
  const img = frame.querySelector('img');
  if (!img) return;
  frame.style.cursor = 'zoom-in';
  frame.addEventListener('click', () => {
    openLightbox(img.src, img.alt);
  });
});

/* ─── Resize handler ─────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    closeMobileSidebar();
  }
});

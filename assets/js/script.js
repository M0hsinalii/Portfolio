/* main.js — complete script with auto-closing mobile nav
   ------------------------------------------------------
   • Hamburger toggles navbar.
   • Any in-page link inside the navbar (e.g. “Resume”) closes it
     and smooth-scrolls to the target section.
*/

'use strict';

/* ──────────────────────────────
 * Utility: add one listener to   multiple nodes
 * ────────────────────────────── */
const addEventOnElements = (elements, eventType, callback) => {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/* ──────────────────────────────
 * PRELOADER
 * ────────────────────────────── */
const preloader = document.querySelector('[data-preloader]');

window.addEventListener('DOMContentLoaded', () => {
  preloader.classList.add('loaded');
  document.body.classList.add('loaded');
});

/* ──────────────────────────────
 * NAVBAR  (open / close / auto-close)
 * ────────────────────────────── */
const navTogglers  = document.querySelectorAll('[data-nav-toggler]');
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar       = document.querySelector('[data-navbar]');
const overlay      = document.querySelector('[data-overlay]');

const openNavbar = () => {
  navbar.classList.add('active');
  navToggleBtn.classList.add('active');
  overlay.classList.add('active');
  document.body.classList.add('nav-active');
};

const closeNavbar = () => {
  navbar.classList.remove('active');
  navToggleBtn.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('nav-active');
};

const toggleNavbar = () =>
  navbar.classList.contains('active') ? closeNavbar() : openNavbar();

addEventOnElements(navTogglers, 'click', toggleNavbar);

/* Auto-close menu + smooth scroll for any internal link */
const pageLinks = navbar.querySelectorAll('a[href^="#"]');

addEventOnElements(pageLinks, 'click', function (e) {
  e.preventDefault();                         // stop the instant jump
  const target = document.querySelector(this.getAttribute('href'));
  closeNavbar();                              // hide menu first
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

/* ──────────────────────────────
 * HEADER  (sticky after 100 px)
 * ────────────────────────────── */
const header = document.querySelector('[data-header]');

window.addEventListener('scroll', () => {
  window.scrollY >= 100
    ? header.classList.add('active')
    : header.classList.remove('active');
});

/* ──────────────────────────────
 * SLIDER
 * ────────────────────────────── */
const sliders = document.querySelectorAll('[data-slider]');

const initSlider = (slider) => {
  const container   = slider.querySelector('[data-slider-container]');
  const prevBtn     = slider.querySelector('[data-slider-prev]');
  const nextBtn     = slider.querySelector('[data-slider-next]');

  let visible = +getComputedStyle(slider).getPropertyValue('--slider-items');
  let maxMove = container.childElementCount - visible;
  let pos     = 0;

  const move = () =>
    (container.style.transform =
      `translateX(-${container.children[pos].offsetLeft}px)`);

  const slideNext = () => {
    pos = pos >= maxMove ? 0 : pos + 1;
    move();
  };

  const slidePrev = () => {
    pos = pos <= 0 ? maxMove : pos - 1;
    move();
  };

  nextBtn.addEventListener('click', slideNext);
  prevBtn.addEventListener('click', slidePrev);

  if (maxMove <= 0) {                // all items already visible
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
  }

  /* Shift + wheel scrolling */
  slider.addEventListener('wheel', (e) => {
    if (!e.shiftKey) return;
    e.deltaY > 0 ? slideNext() : slidePrev();
  });

  /* Responsive recalculation */
  window.addEventListener('resize', () => {
    visible = +getComputedStyle(slider).getPropertyValue('--slider-items');
    maxMove = container.childElementCount - visible;
    move();
  });
};

for (let i = 0, len = sliders.length; i < len; i++) initSlider(sliders[i]);

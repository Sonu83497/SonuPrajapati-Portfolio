/* script.js - portfolio interactions */

/* Basic DOM helpers */
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

/* --- theme toggle (dark/light) --- */
const themeToggle = qs('#theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') body.classList.add('dark');

function updateThemeButton() {
  themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
}
updateThemeButton();

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeButton();
});

/* --- mobile nav toggle --- */
const navToggle = qs('#nav-toggle');
const navList = qs('#nav-list');
navToggle?.addEventListener('click', () => {
  navList.classList.toggle('open');
});

/* Close mobile nav when clicking a link */
qsa('.nav-link').forEach(link => {
  link.addEventListener('click', () => navList.classList.remove('open'));
});

/* --- smooth section highlighting (IntersectionObserver) --- */
const sections = qsa('main section');
const navLinks = qsa('.nav-link');

const obsOptions = { root: null, rootMargin: '0px', threshold: 0.55 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = qs(`.nav-link[href="#${id}"]`);
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      if (link) link.classList.add('active');
    }
  });
}, obsOptions);
sections.forEach(s => sectionObserver.observe(s));

/* --- scroll reveal for .reveal elements --- */
const reveals = qsa('.reveal');
const revealObserver = new IntersectionObserver((entries, o) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      o.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(r => revealObserver.observe(r));

/* --- typing effect --- */
const typedEl = qs('#typed');
const phrases = [
  'Frontend Developer',
  'MERN stack enthusiast',
  'Building modern web experiences',
  'Open to internships & collaborations'
];
let tIndex = 0, charIndex = 0, typingForward = true;

function typeLoop(){
  const current = phrases[tIndex];
  if (typingForward) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      typingForward = false;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      typingForward = true;
      tIndex = (tIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, typingForward ? 80 : 35);
}
typeLoop();

/* --- contact form validation (client-side only) --- */
const form = qs('#contact-form');
const showError = (field, message) => {
  const el = qs(`.error[data-for="${field}"]`);
  if (el) el.textContent = message;
};
const clearErrors = () => qsa('.error').forEach(e => e.textContent = '');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  const name = qs('#name').value.trim();
  const email = qs('#email').value.trim();
  const message = qs('#message').value.trim();

  let valid = true;
  if (!name || name.length < 2) { showError('name', 'Please enter your name (min 2 chars).'); valid=false; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) { showError('email', 'Please enter a valid email.'); valid=false; }
  if (!message || message.length < 10) { showError('message', 'Message should be at least 10 characters.'); valid=false; }

  if (!valid) return;

  // Since no backend: log to console and show user-friendly confirmation
  console.log('Contact form submission (client-side only):', { name, email, message, time: new Date().toISOString() });

  // Show a tiny success UI
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Sent ✓';
  submitBtn.disabled = true;
  setTimeout(() => {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    form.reset();
  }, 1500);
});

/* --- set current year in footer --- */
qs('#year').textContent = new Date().getFullYear();

/* --- accessible: enable keyboard focus styles briefly when using keyboard --- */
function handleFirstTab(e) {
  if (e.key === 'Tab') {
    document.documentElement.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
  }
}
window.addEventListener('keydown', handleFirstTab);

/* End of script.js */

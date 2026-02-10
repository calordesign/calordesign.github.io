// Internationalization (i18n) handler for language switching
let currentLang = sessionStorage.getItem('lang') || 'fi';
let translations = {};

// Fetch translations
fetch('assets/lang/translations.json')
  .then(r => r.json())
  .then(data => {
    translations = data;
    setLanguage(currentLang);
    initializeButton();
  })
  .catch(err => console.error('Failed to load translations:', err));

// Set the language and update all elements with data-i18n attributes
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`Language ${lang} not found, using en`);
    lang = 'en';
  }
  currentLang = lang;
  sessionStorage.setItem('lang', lang);

  // Update all elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    
    if (text) {
      // For title elements, update textContent; for img, update alt
      if (el.tagName === 'TITLE') {
        el.textContent = text;
      } else if (el.tagName === 'IMG') {
        el.setAttribute('alt', text);
      } else {
        el.textContent = text;
      }
      // If element has an aria-label, keep it in sync with the translation
      if (el.hasAttribute && el.hasAttribute('aria-label')) {
        el.setAttribute('aria-label', text);
      }
    }
  });

  // Update language button
  const btnText = translations[lang]['langToggle'];
  updateSliderState();
  document.documentElement.lang = lang;
}

// Initialize language button
function initializeButton() {
  const slider = document.getElementById('langSlider');
  if (slider) {
    slider.addEventListener('click', () => {
      const newLang = currentLang === 'en' ? 'fi' : 'en';
      setLanguage(newLang);
    });
    // Set initial state
    updateSliderState();
  }
}

function updateSliderState() {
  const slider = document.getElementById('langSlider');
  if (slider) {
    slider.classList.remove('active-en', 'active-fi');
    slider.classList.add(currentLang === 'en' ? 'active-en' : 'active-fi');
  }
}

// Set year in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

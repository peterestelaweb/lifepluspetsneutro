(function () {
  const body = document.body;
  if (!body) return;

  const locale = body.dataset.locale || document.documentElement.lang || 'es';
  const page = body.dataset.page || 'home';
  const storageKey = 'lpPetsLocale';
  const pathMap = {
    es: { home: '/index.html', guide: '/guia.html' },
    en: { home: '/en/index.html', guide: '/en/guia.html' },
    ar: { home: '/ar/index.html', guide: '/ar/guia.html' }
  };

  function normalizePath(pathname) {
    if (!pathname || pathname === '/') return '/index.html';
    return pathname.endsWith('/') ? pathname + 'index.html' : pathname;
  }

  function resolvePath(targetLocale, targetPage) {
    return pathMap[targetLocale] && pathMap[targetLocale][targetPage]
      ? pathMap[targetLocale][targetPage]
      : pathMap.es.home;
  }

  function applyDirection(activeLocale) {
    const isArabic = activeLocale === 'ar';
    document.documentElement.lang = isArabic ? 'ar' : activeLocale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }

  function syncButtons(activeLocale) {
    document.querySelectorAll('.lang-switcher button[data-lang]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.lang === activeLocale);
      button.setAttribute('aria-pressed', button.dataset.lang === activeLocale ? 'true' : 'false');
    });
  }

  function maybeRedirectToSavedLocale() {
    const savedLocale = localStorage.getItem(storageKey);
    if (!savedLocale || savedLocale === locale || !pathMap[savedLocale]) return;

    const currentPath = normalizePath(window.location.pathname);
    const expectedPath = resolvePath(savedLocale, page);
    if (currentPath !== expectedPath) {
      window.location.replace(expectedPath + window.location.hash);
    }
  }

  applyDirection(locale);
  syncButtons(locale);
  maybeRedirectToSavedLocale();

  document.querySelectorAll('.lang-switcher button[data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextLocale = button.dataset.lang;
      if (!nextLocale || !pathMap[nextLocale]) return;

      localStorage.setItem(storageKey, nextLocale);
      const targetPath = resolvePath(nextLocale, page);
      const nextUrl = targetPath + window.location.hash;
      if (normalizePath(window.location.pathname) !== targetPath) {
        window.location.href = nextUrl;
      } else {
        applyDirection(nextLocale);
        syncButtons(nextLocale);
      }
    });
  });
})();

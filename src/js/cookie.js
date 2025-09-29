/**
 * @synapxlab/cookie-core
 * Bannière de consentement - Version allégée (sans logging)
 *
 * @version 1.0.0
 */

import '../scss/cookie.scss';

const STORAGE_KEY = 'politecookiebanner';

const loadPrefs = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || ''); } catch { return null; }
};

const savePrefs = obj => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj || {}));
  document.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { preferences: obj } }));
};

/* Helpers internes */
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const qs  = (sel, root = document) => root.querySelector(sel);
const nameSelector = 'input[name^="politecookie["]';

const getPrefsFromChecks = (root) => {
  const prefs = {};
  qsa(nameSelector, root).forEach(cb => {
    const m = cb.name.match(/^politecookie\['(.+)'\]$/);
    if (m) prefs[m[1]] = !!cb.checked;
  });
  return prefs;
};

const setAllChecks = (root, checked) => {
  qsa(nameSelector, root).forEach(cb => { cb.checked = !!checked; });
};

const setMasterState = (root, mode /* 'all' | 'none' | 'mixed' */) => {
  const btnAccept = qs('.pmcpli-accept', root);
  const btnDeny   = qs('.pmcpli-deny', root);
  if (!btnAccept || !btnDeny) return;

  if (mode === 'all') {
    btnAccept.setAttribute('aria-pressed', 'true');
    btnDeny.setAttribute('aria-pressed', 'false');
  } else if (mode === 'none') {
    btnAccept.setAttribute('aria-pressed', 'false');
    btnDeny.setAttribute('aria-pressed', 'true');
  } else {
    btnAccept.setAttribute('aria-pressed', 'false');
    btnDeny.setAttribute('aria-pressed', 'false');
  }
};

const recalcMasterFromChecks = (root) => {
  const checks = qsa(nameSelector, root);
  if (checks.length === 0) { setMasterState(root, 'mixed'); return; }
  const allChecked  = checks.every(cb => cb.checked);
  const noneChecked = checks.every(cb => !cb.checked);
  setMasterState(root, allChecked ? 'all' : (noneChecked ? 'none' : 'mixed'));
};

function renderOnce() {
  if (document.getElementById('politecookiebanner')) return;

  const tpl = `<div id="politecookiebanner" class="pmcpli-cookiebanner pmcpli-show" aria-label="cookiebanner" title="cookiebanner" aria-modal="true" data-nosnippet="true" role="dialog" aria-live="polite" style="display:none;">
  <div class="pmcpli-header">
    <div class="pmcpli-title">Gérer le consentement aux cookies</div>
    <div class="pmcpli-close" tabindex="0" role="button" title="cookiebanner" aria-label="close-cookiebanner" role-js="close">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 352 512" class="pmcpli-close-icon"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
    </div>
  </div>
  <div class="pmcpli-divider pmcpli-divider-header"></div>
  <div class="pmcpli-body">
    <div class="pmcpli-message">Pour vous offrir la meilleure expérience possible, on utilise des cookies (pas les gourmands, hélas) pour garder quelques infos sur votre appareil. En acceptant, vous nous aidez à mieux comprendre comment vous naviguez ici. Si vous refusez, certaines fonctionnalités pourraient ne pas marcher aussi bien.</div>
    <div class="pmcpli-categories" style="display:none;">
      <div class="pmcpli-category pmcpli-functional">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Stockage strictement nécessaire</span> 
          <span class="pmcpli-category-status">Toujours actif</span>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-functional">Le stockage ou l'accès aux informations est uniquement utilisé pour des finalités techniques indispensables.</span>
        </div>
      </div>
      <div class="pmcpli-category pmcpli-statistics">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Cookies</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxcookies" name="politecookie['cookies']">
            <label for="politecookiecheckboxcookies"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-statistics-anonymous">Ces cookies ne sont pas utilisés à des fins publicitaires, mais ils jouent un rôle essentiel dans l'amélioration de votre expérience utilisateur.</span>
        </div>
      </div>
      <div class="pmcpli-category pmcpli-statistics">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Statistiques</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxstatistics" name="politecookie['statistics']">
            <label for="politecookiecheckboxstatistics"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-statistics-anonymous">Le stockage ou l'accès technique est utilisé exclusivement à des fins statistiques.</span>
        </div>
      </div>
      <div class="pmcpli-category pmcpli-marketing">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Marketing</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxmarketing" name="politecookie['marketing']">
            <label for="politecookiecheckboxmarketing"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-marketing">Le stockage ou l'accès technique est nécessaire pour créer des profils d'utilisateurs afin d'envoyer de la publicité.</span>
        </div>
      </div>
    </div>
  </div>
  <div class="pmcpli-links pmcpli-information p-2"></div>
  <div class="pmcpli-divider pmcpli-footer"></div>
  <div class="pmcpli-buttons">
    <button class="pmcpli-btn pmcpli-accept" aria-pressed="false">Tout Accepter</button>
    <button class="pmcpli-btn pmcpli-deny" aria-pressed="false">Refuser</button>
    <button class="pmcpli-btn pmcpli-view-preferences">Les préférences</button>
    <button class="pmcpli-btn pmcpli-save-preferences" style="display:none;">Enregistrer</button>
    <button class="pmcpli-btn pmcpli-del-preferences" style="display:none;">Supprimer</button>
  </div>
  <div class="pmcpli-links pmcpli-documents"></div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

const openBanner = (showPrefs = false) => {
  renderOnce();
  const el = document.getElementById('politecookiebanner');
  if (!el) return;
  el.style.display = 'block';

  setTimeout(() => {
    const firstButton = el.querySelector('button');
    if (firstButton) firstButton.focus();
  }, 100);

  if (showPrefs) {
    const cats = el.querySelector('.pmcpli-categories');
    cats.style.display = 'block';
    el.querySelector('.pmcpli-save-preferences').style.display = 'inline-block';
    el.querySelector('.pmcpli-del-preferences').style.display = 'inline-block';
    el.querySelector('.pmcpli-view-preferences').style.display = 'none';
  }

  // À l’ouverture, recalcule l’état maître selon l’état actuel des cases
  recalcMasterFromChecks(el);
};

function attachHandlers() {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

  const stored = loadPrefs();
  if (stored) {
    // Restaure
    qsa(nameSelector, el).forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) cb.checked = !!stored[m[1]];
    });
    recalcMasterFromChecks(el);
  } else {
    el.style.display = 'block';
    qs('.pmcpli-categories', el).style.display = 'none';
    recalcMasterFromChecks(el); // default (probablement 'none')
  }

  const save = () => {
    const prefs = getPrefsFromChecks(el);
    savePrefs(prefs);
    el.style.display = 'none';
  };

  const deletePrefs = () => {
    localStorage.removeItem(STORAGE_KEY);
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { preferences: null, action: 'deleted' }
    }));
    setAllChecks(el, false);
    recalcMasterFromChecks(el);
    el.style.display = 'none';
  };

  const togglePreferencesView = () => {
    const cats = qs('.pmcpli-categories', el);
    const saveBtn = qs('.pmcpli-save-preferences', el);
    const delBtn  = qs('.pmcpli-del-preferences', el);
    const viewBtn = qs('.pmcpli-view-preferences', el);

    const isHidden = cats.style.display === 'none' || !cats.style.display;
    cats.style.display = isHidden ? 'block' : 'none';
    saveBtn.style.display = delBtn.style.display = isHidden ? 'inline-block' : 'none';
    viewBtn.style.display = isHidden ? 'none' : 'inline-block';
  };

  const handlers = {
    '.pmcpli-close': () => { el.style.display = 'none'; },
    '.pmcpli-accept': () => {
      // Tout cocher + maître = all + enregistrement
      setAllChecks(el, true);
      setMasterState(el, 'all');
      save(); // on persiste immédiatement (comportement standard “Accepter tout”)
    },
    '.pmcpli-deny': () => {
      // Tout décocher + maître = none + enregistrement
      setAllChecks(el, false);
      setMasterState(el, 'none');
      save(); // on persiste immédiatement (comportement standard “Refuser”)
    },
    '.pmcpli-view-preferences': togglePreferencesView,
    '.pmcpli-save-preferences': save,
    '.pmcpli-del-preferences': deletePrefs
  };

  Object.entries(handlers).forEach(([selector, handler]) => {
    qs(selector, el)?.addEventListener('click', handler);
  });

  // Recalcul dynamique des états maître quand l’utilisateur (dé)coche manuellement
  qsa(nameSelector, el).forEach(cb => {
    cb.addEventListener('change', () => {
      recalcMasterFromChecks(el);
      // Note: on NE sauvegarde pas ici ; l’utilisateur doit cliquer “Enregistrer”
    });
  });

  // Gestion des catégories extensibles
  qsa('.pmcpli-category-clickable', el).forEach(header => {
    const toggleCategoryContent = () => {
      const category = header.closest('.pmcpli-category');
      const description = qs('.pmcpli-description', category);
      const icon = qs('.pmcpli-icon svg', header);
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        description.style.display = 'none';
        header.setAttribute('aria-expanded', 'false');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        description.style.display = 'block';
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    };

    header.addEventListener('click', (e) => {
      if (e.target.closest('.checkbox-wrapper')) return;
      toggleCategoryContent();
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategoryContent();
      }
    });
  });

  // Accessibilité : échapper pour fermer
  el.addEventListener('keydown', (e) => { if (e.key === 'Escape') el.style.display = 'none'; });

  // Lien global pour rouvrir la bannière
  document.addEventListener('click', e => {
    if (e.target.closest('#openpolitecookie, #openpolitecookie a')) {
      e.preventDefault();
      openBanner(true);
    }
  });
}

// API globale minimaliste
window.CookieConsent = {
  open: openBanner,
  reset: () => { localStorage.removeItem(STORAGE_KEY); openBanner(true); },
  getPreferences: loadPrefs,
  hasConsent: category => !!(loadPrefs()?.[category])
};

document.addEventListener('DOMContentLoaded', () => {
  renderOnce();
  attachHandlers();
});

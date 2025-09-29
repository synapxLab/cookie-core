# 🍪 Cookie Banner Core (Light)

> Bannière cookies RGPD minimaliste, gratuite et open source. Version light : **aucune télémétrie, aucun logging intégré**. À vous de gérer la preuve de consentement.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@synapxlab/cookie-core.svg)](https://www.npmjs.com/package/@synapxlab/cookie-core)

## 📋 À propos

**Cookie Core** est la version **light** d'une solution de gestion du consentement RGPD/GDPR. Elle est conçue pour être **la plus légère possible** (18Ko) sans fonctionnalités additionnelles.

### Caractéristiques

- ✅ **Ultra légère** : 18Ko minifiée
- ✅ **Aucun logging intégré** : pas de journaux serveur, pas d'ID device, pas d'API
- ✅ **Stockage local uniquement** : utilise `localStorage` (clé `politecookiebanner`)
- ✅ **Gratuit et open source** : licence MIT
- ✅ **Conforme RGPD** : gestion des catégories de consentement

### ⚠️ Important : Conformité RGPD

La preuve du consentement (journalisation, timestamp, version de politique, etc.) **n'est pas gérée** par cette version light.

**Vous devez** mettre en place votre propre mécanisme de *logging de consentement* côté serveur pour être pleinement conforme au RGPD.

---

## 🚀 Installation

### Via npm / yarn / pnpm

```bash
npm install @synapxlab/cookie-core
# ou
yarn add @synapxlab/cookie-core
# ou
pnpm add @synapxlab/cookie-core
```

Dans votre bundle (ex. `src/js/bundle.js`) :

```javascript
import '@synapxlab/cookie-core'; // charge la bannière (version light)
```

### Via balise `<script>` HTML

Placez le script **avant** votre JS principal :

```html
<!-- CDN -->
<script src="https://unpkg.com/@synapxlab/cookie-core/dist/cookie.js"></script>

<!-- Ou en local -->
<script src="/assets/js/cookie.js"></script>
```

---

## 💻 Utilisation

La bannière est injectée automatiquement au chargement. Les catégories sont **cachées par défaut** et s'affichent quand l'utilisateur clique sur *« Les préférences »*.

### Intégration de base

Ajoutez dans le footer de votre page :

```html
<div id="openpolitecookie" class="credits">
  <a href="#">[Politique en matière de cookies]</a>
</div>
```

### API JavaScript

```javascript
// Ouvrir la bannière (showPrefs = true ⇒ onglet Préférences directement visible)
window.CookieConsent.open(true);

// Effacer les préférences et rouvrir en mode Préférences
window.CookieConsent.reset();

// Récupérer les préférences (objet ou null)
const prefs = window.CookieConsent.getPreferences();

// Vérifier un consentement spécifique (ex. 'statistics', 'marketing', 'cookies')
const ok = window.CookieConsent.hasConsent('statistics');
```

**Clé de stockage :** `localStorage['politecookiebanner']`

---

## 📦 Exemple complet

### Charger Google Analytics uniquement si consentement "statistics"

```javascript
function loadGoogleAnalytics() {
  console.log('Google Analytics chargé');
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID';
  script.async = true;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-VOTRE-ID', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
}

const startWithPrefs = (prefs) => {
  console.log('Préférences:', prefs);

  if (prefs?.statistics) {
    loadGoogleAnalytics();
  }
  if (prefs?.marketing) {
    // loadMarketingPixels();
  }
  if (prefs?.cookies) {
    // enableFunctionalCookies();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.CookieConsent) {
    const prefs = window.CookieConsent.getPreferences();
    if (prefs) startWithPrefs(prefs);
  }
  
  // Écouter les changements de consentement
  document.addEventListener('cookieConsentChanged', (e) => {
    startWithPrefs(e.detail.preferences);
  });
});
```

### Page HTML complète

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Gérer le consentement aux cookies</title>
  </head>
  <body>
    <footer>
      <div id="openpolitecookie">
        <a href="#">[Politique en matière de cookies]</a>
      </div>
    </footer>

    <!-- IMPORTANT : la bannière avant votre JS applicatif -->
    <script src="/assets/js/cookie.js"></script>
    <script src="/assets/js/bundle.js"></script>
  </body>
</html>
```

---

## ⚖️ Règle d'or RGPD

Tant que l'utilisateur **n'a pas consenti** à la catégorie concernée :

- ❌ **Ne chargez pas** les scripts tiers (GA, pixels, chat, maps…)
- ❌ **Ne déposez pas** leurs cookies

**Catégories :**
- ✅ **Strictement nécessaire** → toujours actif (non refusables)
- ⚠️ **Statistiques / Marketing refusés** → rien ne doit être chargé

---

## 📄 Licence

**MIT** — Utilisez, modifiez, redistribuez librement. Merci de conserver la mention de licence.

---

## 🔗 Liens

- **Repository** : [github.com/synapxLab/cookie-core](https://github.com/synapxLab/cookie-core)
- **Projet d'origine** : [github.com/synapxLab/cookie-consent](https://github.com/synapxLab/cookie-consent)
- **Documentation** : [synapx.fr/sdk/cookie/](https://synapx.fr/sdk/cookie/)

---

## 🤝 Contributions

Les contributions et suggestions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**Développé par** [Synapx.fr](https://lockness-informatique.fr/) | © All Rights Reserved
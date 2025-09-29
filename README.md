# 🍪 Cookie Banner Core (Light)

> Minimalist, free and open source GDPR cookie banner. Light version: **no telemetry, no built-in logging**. You manage the consent proof yourself.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@synapxlab/cookie-core.svg)](https://www.npmjs.com/package/@synapxlab/cookie-core)

**[🇫🇷 Version française](./README.fr.md)**

---

## 📋 About

**Cookie Core** is the **light version** of a GDPR/RGPD consent management solution. It's designed to be **as lightweight as possible** (18KB) without additional features.

### Features

- ✅ **Ultra lightweight**: 18KB minified
- ✅ **No built-in logging**: no server logs, no device ID, no API
- ✅ **Local storage only**: uses `localStorage` (key `politecookiebanner`)
- ✅ **Free and open source**: MIT license
- ✅ **GDPR compliant**: consent category management

### ⚠️ Important: GDPR Compliance

Consent proof (logging, timestamp, policy version, etc.) **is not managed** by this light version.

**You must** implement your own server-side *consent logging* mechanism to be fully GDPR compliant.

---

## 🚀 Installation

### Via npm / yarn / pnpm

```bash
npm install @synapxlab/cookie-core
# or
yarn add @synapxlab/cookie-core
# or
pnpm add @synapxlab/cookie-core
```

In your bundle (e.g., `src/js/bundle.js`):

```javascript
import '@synapxlab/cookie-core'; // loads the banner (light version)
```

### Via HTML `<script>` tag

Place the script **before** your main JS:

```html
<!-- CDN -->
<script src="https://unpkg.com/@synapxlab/cookie-core/dist/cookie.js"></script>

<!-- Or local -->
<script src="/assets/js/cookie.js"></script>
```

---

## 💻 Usage

The banner is automatically injected on page load. Categories are **hidden by default** and appear when the user clicks on *"Preferences"*.

### Basic Integration

Add this to your page footer:

```html
<div id="openpolitecookie" class="credits">
  <a href="#">[Cookie Policy]</a>
</div>
```

### JavaScript API

```javascript
// Open the banner (showPrefs = true ⇒ Preferences tab directly visible)
window.CookieConsent.open(true);

// Clear preferences and reopen in Preferences mode
window.CookieConsent.reset();

// Get preferences (object or null)
const prefs = window.CookieConsent.getPreferences();

// Check specific consent (e.g., 'statistics', 'marketing', 'cookies')
const ok = window.CookieConsent.hasConsent('statistics');
```

**Storage key:** `localStorage['politecookiebanner']`

---

## 📦 Complete Example

### Load Google Analytics only if "statistics" consent is given

```javascript
function loadGoogleAnalytics() {
  console.log('Google Analytics loaded');
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID';
  script.async = true;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-YOUR-ID', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
}

const startWithPrefs = (prefs) => {
  console.log('Preferences:', prefs);

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
  
  // Listen to consent changes
  document.addEventListener('cookieConsentChanged', (e) => {
    startWithPrefs(e.detail.preferences);
  });
});
```

### Complete HTML page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Cookie Consent Management</title>
  </head>
  <body>
    <footer>
      <div id="openpolitecookie">
        <a href="#">[Cookie Policy]</a>
      </div>
    </footer>

    <!-- IMPORTANT: banner script before your application JS -->
    <script src="/assets/js/cookie.js"></script>
    <script src="/assets/js/bundle.js"></script>
  </body>
</html>
```

---

## ⚖️ GDPR Golden Rule

As long as the user **has not consented** to the relevant category:

- ❌ **Do not load** third-party scripts (GA, pixels, chat, maps…)
- ❌ **Do not set** their cookies

**Categories:**
- ✅ **Strictly necessary** → always active (cannot be refused)
- ⚠️ **Statistics / Marketing refused** → nothing should be loaded

---

## 📄 License

**MIT** — Use, modify, and redistribute freely. Please keep the license notice.

---

## 🔗 Links

- **Repository**: [github.com/synapxLab/cookie-core](https://github.com/synapxLab/cookie-core)
- **Original project**: [github.com/synapxLab/cookie-consent](https://github.com/synapxLab/cookie-consent)
- **Documentation**: [synapx.fr/sdk/cookie/](https://synapx.fr/sdk/cookie/)

---

## 🤝 Contributing

Contributions and suggestions are welcome! Feel free to open an issue or pull request.

---

**Developed by** [Synapx.fr](https://lockness-informatique.fr/) | © All Rights Reserved
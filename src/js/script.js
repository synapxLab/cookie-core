import '../scss/style.scss';
import './cookie';

// Fonction pour charger Google Analytics
function loadGoogleAnalytics() {
  console.log('Google Analytics chargé');
  // Exemple d’intégration GA :
  // const script = document.createElement('script');
  // script.src = 'https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID';
  // script.async = true;
  // document.head.appendChild(script);
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){ window.dataLayer.push(arguments); }
  // gtag('js', new Date());
  // gtag('config', 'G-VOTRE-ID', {
  //   anonymize_ip: true,
  //   cookie_flags: 'SameSite=None;Secure'
  // });
}

/*********************************************************************************************************/
// Boutons de test (reset / open)
const bindDemoButtons = () => {
  const resetBtn = document.getElementById('btn-reset-consent');
  const openBtn  = document.getElementById('btn-open-consent');

  resetBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.reset) {
      window.CookieConsent.reset(); // ouvre la bannière en mode préférences
    } else {
      try {
        localStorage.removeItem('politecookiebanner');
      } catch {
        // ignore (quota plein ou restriction storage)
      }
      alert('Consentement effacé. Rechargez la page avec F5 pour voir la bannière.');
    }
  });

  openBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.open) {
      window.CookieConsent.open(true); // ouvre directement avec préférences visibles
    } else {
      const link = document.querySelector('#openpolitecookie a');
      if (link) {
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    }
  });
};

// Callback central qui agit selon les prefs
const startWithPrefs = (prefs) => {
  console.log('Préférences reçues:', prefs);
  if (prefs?.statistics) {
    loadGoogleAnalytics();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Démo Cookie Consent initialisée');

  // Récupération initiale des préférences si déjà présentes
  if (window.CookieConsent) {
    const prefs = window.CookieConsent.getPreferences();
    if (prefs) startWithPrefs(prefs);
  }

  // Abonnement aux changements
  document.addEventListener('cookieConsentChanged', (event) => {
    startWithPrefs(event.detail.preferences);
  });

  // Bind boutons de test
  bindDemoButtons();
});

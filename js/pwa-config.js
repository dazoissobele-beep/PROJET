/**
 * PWA Configuration & Service Worker Registration
 * À activer pour transformer l'app en PWA
 */

// Code pour enregistrer le Service Worker (optionnel, à décommenter pour PWA)
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/sw.js')
            .then(registration => {
                console.log('✅ Service Worker enregistré:', registration);
            })
            .catch(error => {
                console.error('❌ Erreur Service Worker:', error);
            });
    });
}

// Détecte les mises à jour du Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controller', () => {
        console.log('🔄 New Service Worker prêt');
        window.location.reload();
    });
}

// Ajoute le manifest au HTML (faire manuellement dans index.html)
// <link rel="manifest" href="/manifest.json">
// <meta name="theme-color" content="#667eea">
*/

// Installation PWA - Prompts d'installation
let deferredPrompt = null;
const installBtn = document.createElement('button');

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📦 PWA installable détectée');
    e.preventDefault();
    deferredPrompt = e;

    // Affiche le bouton d'installation
    installBtn.textContent = '📲 Installer l\'app';
    installBtn.className = 'pwa-install-btn';
    installBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ PWA installée avec succès');
        }

        deferredPrompt = null;
        installBtn.remove();
    });

    // document.body.appendChild(installBtn);
});

window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA installée!');
    deferredPrompt = null;
});

// Détecte si l'app est en mode PWA
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Mode PWA Standalone activé');
    document.body.classList.add('pwa-mode');
}

// Ajoute les meta tags essentiels à la volée (backup)
function addPWAMetaTags() {
    const metaTags = [
        { name: 'theme-color', content: '#667eea' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'LumiLang' }
    ];

    metaTags.forEach(tag => {
        if (!document.querySelector(`meta[name="${tag.name}"]`)) {
            const meta = document.createElement('meta');
            meta.name = tag.name;
            meta.content = tag.content;
            document.head.appendChild(meta);
        }
    });
}

// Exécute au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPWAMetaTags);
} else {
    addPWAMetaTags();
}

console.log('✅ Configuration PWA chargée');

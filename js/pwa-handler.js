/**
 * PWA Handler - Gestion de l'installation Progressive Web App
 * Permet aux utilisateurs d'installer l'app sur leur appareil
 */

let deferredPrompt = null;
let installButton = null;

/**
 * Initialise le gestionnaire PWA
 */
function initPWAHandler() {
    // Enregistrer le Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js', { scope: '/' })
                .then((registration) => {
                    console.log('✅ Service Worker enregistré avec succès');
                    console.log('🎓 App installable sur:', navigator.userAgent);
                    
                    // Vérifier les mises à jour
                    registration.onupdatefound = () => {
                        console.log('🔄 Nouvelle version du Service Worker détectée');
                    };
                })
                .catch((error) => {
                    console.warn('⚠️ Erreur Service Worker:', error.message);
                });
        });
    } else {
        console.warn('⚠️ Service Worker non supporté par ce navigateur');
    }
    
    // Écouter l'événement beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (event) => {
        console.log('✅ Événement beforeinstallprompt détecté - App installable!');
        event.preventDefault();
        deferredPrompt = event;
        showInstallButton();
    });
    
    // Écouter l'événement appinstalled
    window.addEventListener('appinstalled', () => {
        console.log('✅ App installée avec succès!');
        deferredPrompt = null;
        hideInstallButton();
        alert('✅ LumiLang a été installée sur votre écran d\'accueil!');
    });
    
    // Vérifier si déjà installée
    if (isAppInstalled()) {
        console.log('ℹ️ App exécutée en mode standalone (installée)');
        hideInstallButton();
    }
}

/**
 * Affiche le bouton d'installation
 */
function showInstallButton() {
    installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.classList.remove('hidden');
    }
}

/**
 * Cache le bouton d'installation
 */
function hideInstallButton() {
    if (installButton) {
        installButton.style.display = 'none';
        installButton.classList.add('hidden');
    }
}

/**
 * Gère le clic sur le bouton d'installation
 */
async function handleInstallClick() {
    if (!deferredPrompt) {
        console.log('Installation non disponible');
        return;
    }
    
    try {
        // Afficher le prompt d'installation native
        deferredPrompt.prompt();
        
        // Attendre la réponse de l'utilisateur
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ Utilisateur a accepté l\'installation');
        } else {
            console.log('❌ Utilisateur a refusé l\'installation');
        }
        
        deferredPrompt = null;
    } catch (error) {
        console.error('Erreur lors de l\'installation:', error);
    }
}

/**
 * Vérifie si l'app est déjà installée
 */
function isAppInstalled() {
    // Vérifier si l'app s'exécute en mode standalone
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator.standalone === true) ||
           document.referrer.includes('android-app://');
}

/**
 * Vérifie la compatibilité PWA du navigateur
 */
function isPWASupported() {
    return 'serviceWorker' in navigator &&
           'caches' in window &&
           'indexedDB' in window;
}

/**
 * Initialiser automatiquement au chargement
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWAHandler);
} else {
    initPWAHandler();
}

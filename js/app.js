/**
 * Application Principal
 * Gère la navigation et l'initialisation globale
 */

/**
 * Navigateur vers un écran spécifique
 */
function navigateTo(screenId) {
    // Cache tous les écrans (y compris lessonPlayerScreen)
    document.querySelectorAll('[id$="Screen"]').forEach(screen => {
        if (screen.id !== 'onboardingScreen' && screen.id !== 'appScreen') {
            screen.classList.add('hidden');
            screen.style.display = 'none';
        }
    });

    // Affiche l'écran demandé
    const screen = document.getElementById(screenId);
    if (screen && screenId !== 'onboardingScreen' && screenId !== 'appScreen') {
        screen.classList.remove('hidden');
        screen.style.display = 'block';

        // Reinitialize l'écran si nécessaire
        if (screenId === 'homeScreen') {
            initHome();
        } else if (screenId === 'lessonsScreen') {
            initLessons();
        } else if (screenId === 'badgesScreen') {
            initBadges();
        } else if (screenId === 'profileScreen') {
            initProfile();
        }

        // Scroll to top
        document.getElementById('contentArea').scrollTop = 0;
    }

    // Met à jour la barre de navigation
    updateNavBar(screenId);

    // Vérifie les badges et le streak
    checkBadgeUnlock();
    updateStreak();
}

/**
 * Met à jour la barre de navigation active
 */
function updateNavBar(screenId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('nav-active');
    });

    const activeBtn = document.querySelector(`.nav-btn[data-screen="${screenId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('nav-active');
    }
}

/**
 * Ajoute les styles pour la barre de navigation active
 */
function addNavBarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .nav-btn {
            color: #999;
            transition: all 0.3s ease;
        }

        .nav-btn:hover {
            color: #667eea;
            background-color: rgba(102, 126, 234, 0.1);
        }

        .nav-active {
            color: #667eea;
            background-color: rgba(102, 126, 234, 0.15);
            border-radius: 12px;
        }

        .nav-active i {
            animation: pulse 0.6s ease-in-out;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        /* Smooth transitions */
        #contentArea {
            scroll-behavior: smooth;
        }

        /* Disable default button styles */
        button {
            font-family: inherit;
        }

        /* Animations personnalisées */
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .lesson-bubble {
            animation: slideUp 0.6s ease-out;
        }

        .badge-item {
            animation: slideUp 0.6s ease-out;
        }

        /* Fix mobile viewport */
        @media (max-width: 640px) {
            body {
                position: fixed;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            #contentArea {
                max-height: calc(100vh - 120px);
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialise l'application
 */
async function initApp() {
    console.log('🚀 Initialisation de l\'application...');

    // Ajoute les styles
    addNavBarStyles();

    // Initialise AOS (Animate On Scroll)
    AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true
    });

    // Affiche l'écran d'accueil par défaut
    navigateTo('homeScreen');

    // Mise à jour du streak au démarrage
    await updateStreak();

    console.log('✅ Application initialisée');
}

/**
 * Point d'entrée principal
 */
async function main() {
    console.log('⏳ Démarrage de l\'application...');

    // Initialise la base de données
    await initDB();

    // Initialise l'onboarding
    await initOnboarding();
}

// Démarrage au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

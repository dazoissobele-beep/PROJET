/**
 * Onboarding Manager
 * Gère l'écran d'onboarding initial
 */

const AVATARS = ['😊', '😎', '🤩', '😍', '🥳', '🤗', '😘', '🎉'];
const DIFFICULTY_LEVELS = [
    { id: 'beginner', name: 'Débutant', emoji: '🟢', description: 'Je suis nouveau' },
    { id: 'intermediate', name: 'Intermédiaire', emoji: '🟡', description: 'J\'ai déjà commencé' },
    { id: 'advanced', name: 'Avancé', emoji: '🔴', description: 'Je maîtrise les bases' },
    { id: 'expert', name: 'Expert', emoji: '⭐', description: 'Je suis très avancé' }
];

/**
 * Initialise l'écran d'onboarding
 */
async function initOnboarding() {
    const user = await getUser();

    // Si l'utilisateur existe, affiche l'app
    if (user && user.onboardingDone) {
        showAppScreen();
        return;
    }

    // Sinon, affiche l'onboarding
    showOnboardingScreen();
    setupOnboardingHandlers();
}

/**
 * Affiche l'écran d'onboarding
 */
function showOnboardingScreen() {
    document.getElementById('onboardingScreen').classList.remove('hidden');
    document.getElementById('appScreen').classList.add('hidden');
    renderAvatarGrid();
}

/**
 * Affiche l'écran principal de l'app
 */
function showAppScreen() {
    document.getElementById('onboardingScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
}

/**
 * Rend la grille d'avatars
 */
function renderAvatarGrid() {
    const grid = document.getElementById('avatarGrid');
    grid.innerHTML = AVATARS.map((avatar, index) => `
        <button 
            type="button"
            class="avatar-btn text-4xl p-3 rounded-xl bg-gray-100 hover:bg-blue-200 transition-all transform hover:scale-110"
            data-avatar="${avatar}"
            onclick="selectAvatar('${avatar}')"
        >
            ${avatar}
        </button>
    `).join('');

    // Sélectionne le premier avatar par défaut
    selectAvatar(AVATARS[0]);
}

/**
 * Rend la grille de sélection de niveau
 */
function renderDifficultyGrid() {
    const grid = document.getElementById('difficultyGrid');
    grid.innerHTML = DIFFICULTY_LEVELS.map((level) => `
        <button 
            type="button"
            class="difficulty-btn p-4 rounded-2xl bg-gray-100 hover:bg-blue-200 transition-all transform hover:scale-105 text-center"
            data-difficulty="${level.id}"
            onclick="selectDifficulty('${level.id}')"
        >
            <div class="text-4xl mb-2">${level.emoji}</div>
            <div class="font-bold text-gray-800">${level.name}</div>
            <div class="text-xs text-gray-600 mt-1">${level.description}</div>
        </button>
    `).join('');

    // Sélectionne le niveau débutant par défaut
    selectDifficulty('beginner');
}

/**
 * Sélectionne un avatar
 */
function selectAvatar(avatar) {
    // Mise à jour visuelle
    document.querySelectorAll('.avatar-btn').forEach(btn => {
        btn.classList.remove('ring-4', 'ring-blue-500', 'bg-blue-200');
        btn.classList.add('bg-gray-100');
    });

    document.querySelector(`[data-avatar="${avatar}"]`).classList.add('ring-4', 'ring-blue-500', 'bg-blue-200');
    document.getElementById('selectedAvatarDisplay').textContent = avatar;

    // Stockage dans sessionStorage pour la sauvegarde
    sessionStorage.setItem('selectedAvatar', avatar);
}

/**
 * Sélectionne un niveau de difficulté
 */
function selectDifficulty(difficulty) {
    // Mise à jour visuelle
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('ring-4', 'ring-purple-500', 'bg-purple-200');
        btn.classList.add('bg-gray-100');
    });

    document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('ring-4', 'ring-purple-500', 'bg-purple-200');

    // Stockage dans sessionStorage pour la sauvegarde
    sessionStorage.setItem('selectedDifficulty', difficulty);
}

/**
 * Configure les gestionnaires d'événements de l'onboarding
 */
function setupOnboardingHandlers() {
    const nameInput = document.getElementById('userNameInput');
    const startBtn = document.getElementById('startBtn');

    // Valide le bouton start
    nameInput.addEventListener('input', () => {
        startBtn.disabled = nameInput.value.trim().length === 0;
    });

    // Gère le clic sur le bouton Start
    startBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const avatar = sessionStorage.getItem('selectedAvatar') || AVATARS[0];
        const difficulty = sessionStorage.getItem('selectedDifficulty') || 'beginner';

        if (!name) {
            alert('Veuillez entrer votre nom');
            return;
        }

        // Sauvegarde l'utilisateur avec le niveau de difficulté
        await saveUser({
            name,
            avatar,
            difficulty,
            onboardingDone: true,
            joinDate: new Date().toISOString()
        });

        // Crée les leçons par défaut selon le niveau
        await initDefaultLessons(difficulty);

        // Crée les badges par défaut
        await initDefaultBadges();

        // Initialise les stats
        await saveStats({
            xp: 0,
            streak: 0,
            lastActivityDate: new Date().toISOString()
        });

        // Affiche l'app
        showAppScreen();
        initApp();
    });

    // Rend les grilles
    renderAvatarGrid();
    renderDifficultyGrid();

    // Permet d'appuyer sur Entrée
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !startBtn.disabled) {
            startBtn.click();
        }
    });
}

/**
 * Initialise les leçons par défaut avec 30+ leçons par thème
 */
async function initDefaultLessons(difficulty = 'beginner') {
    const lessons = [];
    let lessonId = 1;
    const themes = [
        {
            name: 'Alphabet & Phonétique',
            icon: '🔤',
            baseXP: 10
        },
        {
            name: 'Nombres & Mathématiques',
            icon: '🔢',
            baseXP: 15
        },
        {
            name: 'Vocabulaire Quotidien',
            icon: '📖',
            baseXP: 20
        },
        {
            name: 'Grammaire Essentiellе',
            icon: '✏️',
            baseXP: 25
        },
        {
            name: 'Conversation & Dialogue',
            icon: '💬',
            baseXP: 30
        }
    ];

    // Multiplicateurs XP par niveau
    const xpMultipliers = {
        'beginner': 1,
        'intermediate': 1.5,
        'advanced': 2,
        'expert': 2.5
    };
    const xpMult = xpMultipliers[difficulty] || 1;

    // Créer 30+ leçons par thème
    for (const theme of themes) {
        for (let i = 1; i <= 35; i++) {
            // Déterminer la difficulté relative
            let relDifficulty = 1;
            if (i <= 10) relDifficulty = 1;
            else if (i <= 20) relDifficulty = 2;
            else if (i <= 30) relDifficulty = 3;
            else relDifficulty = 4;

            // Filtrer selon le niveau de l'utilisateur
            const shouldInclude = 
                (difficulty === 'beginner' && relDifficulty <= 2) ||
                (difficulty === 'intermediate' && relDifficulty <= 3) ||
                (difficulty === 'advanced' && relDifficulty <= 4) ||
                (difficulty === 'expert');

            if (!shouldInclude) continue;

            lessons.push({
                id: lessonId++,
                theme: theme.name,
                themeIcon: theme.icon,
                title: `${theme.name} - Leçon ${i}`,
                icon: theme.icon,
                difficulty: relDifficulty,
                xp: Math.round(theme.baseXP * (1 + relDifficulty * 0.5) * xpMult),
                completed: false,
                progress: 0,
                order: lessonId - 1,
                createdAt: new Date().toISOString()
            });
        }
    }

    // Sauvegarder toutes les leçons
    for (const lesson of lessons) {
        await saveLesson(lesson);
    }

    console.log(`✅ ${lessons.length} leçons créées pour niveau ${difficulty}`);
}

/**
 * Initialise les badges par défaut
 */
async function initDefaultBadges() {
    const badges = [
        {
            id: 1,
            name: 'Premier Pas',
            icon: '👣',
            description: 'Complète ta première leçon',
            unlocked: false,
            unlockedAt: null
        },
        {
            id: 2,
            name: 'Passionné',
            icon: '🔥',
            description: 'Complète 5 leçons',
            unlocked: false,
            unlockedAt: null
        },
        {
            id: 3,
            name: 'Maître Linguiste',
            icon: '🏆',
            description: 'Complète toutes les leçons',
            unlocked: false,
            unlockedAt: null
        },
        {
            id: 4,
            name: 'Constant(e)',
            icon: '⭐',
            description: 'Apprends pendant 7 jours de suite',
            unlocked: false,
            unlockedAt: null
        },
        {
            id: 5,
            name: 'Légendaire',
            icon: '👑',
            description: 'Apprends pendant 30 jours de suite',
            unlocked: false,
            unlockedAt: null
        },
        {
            id: 6,
            name: '1000 Points',
            icon: '💎',
            description: 'Gagne 1000 points XP',
            unlocked: false,
            unlockedAt: null
        }
    ];

    for (const badge of badges) {
        await saveBadge(badge);
    }

    console.log('✅ Badges par défaut créés');
}

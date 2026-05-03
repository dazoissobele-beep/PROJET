/**
 * Lessons Manager
 * Gère l'écran des leçons et l'interaction avec les leçons
 */

let currentTheme = null;

/**
 * Initialise l'écran des leçons
 */
async function initLessons() {
    const lessons = await getLessons();
    
    // Extraire les thèmes uniques
    const themes = [...new Set(lessons.map(l => l.theme))];
    
    // Rendre les onglets de thèmes
    renderThemesTabs(themes);
    
    // Afficher le premier thème par défaut
    if (themes.length > 0) {
        currentTheme = themes[0];
        const themeLesson = lessons.filter(l => l.theme === currentTheme);
        renderLessons(themeLesson);
    }
}

/**
 * Rend les onglets de thèmes
 */
function renderThemesTabs(themes) {
    const container = document.getElementById('themesContainer');
    
    container.innerHTML = themes.map((theme, index) => {
        const themeLessons = themes[index];
        const iconMap = {
            'Alphabet & Phonétique': '🔤',
            'Nombres & Mathématiques': '🔢',
            'Vocabulaire Quotidien': '📖',
            'Grammaire Essentiellе': '✏️',
            'Conversation & Dialogue': '💬'
        };
        const icon = iconMap[theme] || '📚';
        
        return `
            <button 
                onclick="switchTheme('${theme}')"
                class="theme-tab whitespace-nowrap px-4 py-2 rounded-lg font-semibold transition-all ${currentTheme === theme ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}"
                data-theme="${theme}"
            >
                ${icon} ${theme}
            </button>
        `;
    }).join('');
}

/**
 * Change de thème
 */
async function switchTheme(theme) {
    currentTheme = theme;
    
    // Mettre à jour les onglets actifs
    document.querySelectorAll('.theme-tab').forEach(tab => {
        if (tab.dataset.theme === theme) {
            tab.classList.remove('bg-gray-200', 'text-gray-800');
            tab.classList.add('bg-blue-500', 'text-white', 'shadow-lg');
        } else {
            tab.classList.remove('bg-blue-500', 'text-white', 'shadow-lg');
            tab.classList.add('bg-gray-200', 'text-gray-800');
        }
    });
    
    // Charger les leçons du thème
    const lessons = await getLessons();
    const themeLesson = lessons.filter(l => l.theme === theme)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    renderLessons(themeLesson);
}

/**
 * Rend les leçons dans le DOM
 */
function renderLessons(lessons) {
    const container = document.getElementById('lessonsContainer');
    
    if (lessons.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg"><i class="fas fa-inbox mr-2"></i>Aucune leçon pour ce thème</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = lessons.map((lesson, index) => {
        const statusClass = lesson.completed 
            ? 'bg-gradient-to-br from-green-300 to-emerald-400' 
            : lesson.progress > 0 
            ? 'bg-gradient-to-br from-yellow-300 to-orange-400'
            : 'bg-gradient-to-br from-gray-200 to-gray-300 opacity-60';

        const statusIcon = lesson.completed 
            ? '✅' 
            : lesson.progress > 0 
            ? '⏳'
            : '🔒';

        // Couleur du badge de difficulté
        const difficultyColors = {
            1: 'bg-green-500',
            2: 'bg-yellow-500',
            3: 'bg-orange-500',
            4: 'bg-red-500'
        };
        const diffColor = difficultyColors[lesson.difficulty] || 'bg-gray-500';

        return `
            <div 
                class="lesson-bubble animate__animated animate__fadeInUp"
                style="animation-delay: ${index * 50}ms;"
            >
                <button 
                    onclick="openLesson(${lesson.id})"
                    class="w-full h-48 rounded-3xl ${statusClass} text-white shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 relative overflow-hidden group"
                >
                    <!-- Background pattern -->
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-4 right-4 text-2xl">✨</div>
                        <div class="absolute bottom-4 left-4 text-2xl">🌟</div>
                    </div>

                    <!-- Content -->
                    <div class="relative h-full flex flex-col items-center justify-center p-4">
                        <div class="text-5xl mb-2 transform group-hover:scale-110 transition-transform">${lesson.icon}</div>
                        <h3 class="text-lg font-bold text-center mb-2 line-clamp-2">${lesson.title}</h3>
                        
                        <!-- Progress Bar -->
                        <div class="w-full max-w-xs bg-white bg-opacity-30 h-2 rounded-full overflow-hidden mb-2">
                            <div 
                                class="h-full bg-white transition-all duration-500" 
                                style="width: ${lesson.progress}%"
                            ></div>
                        </div>

                        <!-- Stats -->
                        <div class="flex justify-center gap-2 text-xs flex-wrap">
                            <span class="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                <i class="fas fa-star"></i> ${lesson.xp} XP
                            </span>
                            <span class="bg-white bg-opacity-20 px-2 py-1 rounded-full">
                                ${statusIcon}
                            </span>
                            <span class="${diffColor} text-white px-2 py-1 rounded-full text-xs font-bold">
                                Lvl ${lesson.difficulty}
                            </span>
                        </div>
                    </div>
                </button>
            </div>
        `;
    }).join('');

    // Initialise AOS pour les animations
    AOS.refresh();
}

/**
 * Ouvre une leçon - Lance le lecteur de cours complet
 */
async function openLesson(lessonId) {
    const lesson = await getLesson(lessonId);
    
    if (!lesson) return;

    // Marque la leçon comme en cours si elle ne l'est pas
    if (lesson.progress === 0) {
        lesson.progress = 10;
        await saveLesson(lesson);
    }

    // Lance le lecteur de cours
    initLessonPlayer(lesson.theme, lesson.id);
}

/**
 * Affiche un modal de leçon
 */
function showLessonModal(lesson) {
    // Crée le modal HTML
    const modal = document.createElement('div');
    modal.id = 'lessonModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate__animated animate__bounceIn">
            <!-- Close Button -->
            <button 
                onclick="closeLessonModal()"
                class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
                <i class="fas fa-times text-2xl"></i>
            </button>

            <!-- Lesson Icon -->
            <div class="text-6xl text-center mb-4">${lesson.icon}</div>

            <!-- Lesson Title -->
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">${lesson.title}</h2>

            <!-- Difficulty -->
            <div class="text-center mb-4">
                <span class="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
                    ${'⭐'.repeat(lesson.difficulty)} Niveau ${lesson.difficulty}
                </span>
            </div>

            <!-- Progress -->
            <div class="mb-6">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-semibold text-gray-700">Progression</span>
                    <span class="text-sm font-bold text-blue-600">${lesson.progress}%</span>
                </div>
                <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500" 
                        style="width: ${lesson.progress}%"
                    ></div>
                </div>
            </div>

            <!-- Reward Info -->
            <div class="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-6 text-center">
                <p class="text-sm text-gray-700 mb-1">Récompense à la fin</p>
                <p class="text-2xl font-bold text-orange-600"><i class="fas fa-star"></i> ${lesson.xp} XP</p>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
                <button 
                    onclick="completeLessonWithModal(${lesson.id})"
                    class="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all active:scale-95"
                >
                    <i class="fas fa-check mr-2"></i>Compléter la leçon
                </button>
                <button 
                    onclick="closeLessonModal()"
                    class="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300 transition-all"
                >
                    Fermer
                </button>
            </div>

            <!-- Lesson Description -->
            <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-sm text-gray-600 text-center">
                    Cette leçon vous permettra de maîtriser les concepts clés de "${lesson.title}".
                    Progressez à votre rythme et déverrouillez les prochaines leçons!
                </p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Complète une leçon à partir du modal
 */
async function completeLessonWithModal(lessonId) {
    const lesson = await getLesson(lessonId);
    
    if (!lesson) return;

    // Marque comme complète
    lesson.completed = true;
    lesson.progress = 100;
    await saveLesson(lesson);

    // Récupère et met à jour les stats
    let stats = await getStats();
    if (!stats) stats = { xp: 0, streak: 0 };

    stats.xp = (stats.xp || 0) + lesson.xp;
    await saveStats(stats);

    // Affiche une animation de succès
    showCompletionAnimation(lesson);

    // Ferme le modal après un délai
    setTimeout(() => {
        closeLessonModal();
        initLessons();
        refreshHomeStats();
        checkBadgeUnlock();
    }, 2000);
}

/**
 * Affiche une animation de complétude
 */
function showCompletionAnimation(lesson) {
    const modal = document.getElementById('lessonModal');
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate__animated animate__bounceIn text-center">
            <div class="mb-4">
                <i class="fas fa-check-circle text-6xl text-green-500 animate__animated animate__bounceIn"></i>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Excellent!</h2>
            <p class="text-gray-600 mb-6">Tu as complété: <span class="font-bold">${lesson.title}</span></p>
            
            <div class="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-6">
                <p class="text-2xl font-bold text-orange-600">
                    <i class="fas fa-star"></i> +${lesson.xp} XP
                </p>
            </div>

            <div class="space-y-2">
                <p class="text-sm text-gray-600">Prochaine étape déverrouillée! 🎉</p>
            </div>
        </div>
    `;
}

/**
 * Ferme le modal de leçon
 */
function closeLessonModal() {
    const modal = document.getElementById('lessonModal');
    if (modal) {
        modal.classList.add('animate__animated', 'animate__fadeOut');
        setTimeout(() => modal.remove(), 500);
    }
}

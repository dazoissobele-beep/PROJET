/**
 * Home Screen Manager
 * Gère l'écran d'accueil
 */

/**
 * Initialise l'écran d'accueil
 */
async function initHome() {
    const user = await getUser();
    const stats = await getStats();
    const lessons = await getLessons();

    // Mise à jour du greeting
    document.getElementById('homeGreeting').textContent = `Bonjour, ${user?.name || 'Apprenant'}! 👋`;
    document.getElementById('homeUserAvatar').textContent = user?.avatar || '😊';

    // Mise à jour des stats
    document.getElementById('xpDisplay').textContent = stats?.xp || 0;
    document.getElementById('badgesDisplay').textContent = (await getBadges()).filter(b => b.unlocked).length;
    document.getElementById('streakDisplay').textContent = stats?.streak || 0;

    // Mise à jour des stats de leçons
    const completedCount = lessons.filter(l => l.completed).length;
    const inProgressCount = lessons.filter(l => !l.completed && l.progress > 0).length;
    const lockedCount = lessons.filter(l => l.progress === 0 && !l.completed).length;

    document.getElementById('completedLessonsHome').textContent = completedCount;
    document.getElementById('inProgressLessonsHome').textContent = inProgressCount;
    document.getElementById('lockedLessonsHome').textContent = lockedCount;
}

/**
 * Actualise les stats de l'écran d'accueil
 */
async function refreshHomeStats() {
    await initHome();
}

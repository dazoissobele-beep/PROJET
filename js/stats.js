/**
 * Stats & Badges Manager
 * Gère les statistiques et les badges
 */

/**
 * Initialise l'écran des badges
 */
async function initBadges() {
    const badges = await getBadges();
    const stats = await getStats();
    const lessons = await getLessons();

    // Mise à jour de la barre d'XP
    const totalXP = stats?.xp || 0;
    const nextLevel = 100;
    const currentLevelXP = totalXP % nextLevel;

    document.getElementById('xpProgressBar').style.width = `${(currentLevelXP / nextLevel) * 100}%`;
    document.getElementById('xpProgressText').textContent = `${currentLevelXP}/${nextLevel}`;

    // Rend les badges
    renderBadges(badges);
}

/**
 * Rend les badges dans le DOM
 */
function renderBadges(badges) {
    const container = document.getElementById('badgesContainer');

    container.innerHTML = badges.map((badge, index) => {
        const isUnlocked = badge.unlocked;
        const badgeClass = isUnlocked
            ? 'bg-white shadow-lg'
            : 'bg-gray-100 opacity-50';

        return `
            <div 
                class="badge-item ${badgeClass} rounded-2xl p-4 text-center transition-all hover:scale-105 transform cursor-pointer animate__animated animate__fadeInUp"
                style="animation-delay: ${index * 50}ms;"
                title="${badge.name}"
            >
                <div class="text-5xl mb-2">${badge.icon}</div>
                <h3 class="font-bold text-sm text-gray-800 mb-1">${badge.name}</h3>
                <p class="text-xs text-gray-600 mb-3">${badge.description}</p>
                
                ${isUnlocked ? `
                    <span class="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                        <i class="fas fa-check-circle"></i> Déverrouillé
                    </span>
                ` : `
                    <span class="inline-block bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                        <i class="fas fa-lock"></i> Verrouillé
                    </span>
                `}
            </div>
        `;
    }).join('');

    AOS.refresh();
}

/**
 * Vérifie et déverrouille les badges
 */
async function checkBadgeUnlock() {
    const lessons = await getLessons();
    const badges = await getBadges();
    const stats = await getStats();

    const completedLessons = lessons.filter(l => l.completed).length;
    const totalXP = stats?.xp || 0;

    // Badge: Premier Pas (1 leçon complétée)
    if (completedLessons >= 1 && badges[0] && !badges[0].unlocked) {
        badges[0].unlocked = true;
        badges[0].unlockedAt = new Date().toISOString();
        await saveBadge(badges[0]);
        showBadgeUnlockedNotification(badges[0]);
    }

    // Badge: Passionné (5 leçons complétées)
    if (completedLessons >= 5 && badges[1] && !badges[1].unlocked) {
        badges[1].unlocked = true;
        badges[1].unlockedAt = new Date().toISOString();
        await saveBadge(badges[1]);
        showBadgeUnlockedNotification(badges[1]);
    }

    // Badge: Maître Linguiste (toutes les leçons)
    if (completedLessons === lessons.length && badges[2] && !badges[2].unlocked) {
        badges[2].unlocked = true;
        badges[2].unlockedAt = new Date().toISOString();
        await saveBadge(badges[2]);
        showBadgeUnlockedNotification(badges[2]);
    }

    // Badge: 1000 Points
    if (totalXP >= 1000 && badges[5] && !badges[5].unlocked) {
        badges[5].unlocked = true;
        badges[5].unlockedAt = new Date().toISOString();
        await saveBadge(badges[5]);
        showBadgeUnlockedNotification(badges[5]);
    }
}

/**
 * Affiche une notification de badge déverrouillé
 */
function showBadgeUnlockedNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-2xl z-50 animate__animated animate__slideInDown max-w-sm';
    notification.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="text-5xl">${badge.icon}</div>
            <div>
                <p class="font-bold">Badge Déverrouillé!</p>
                <p class="text-sm opacity-90">${badge.name}</p>
                <p class="text-xs opacity-75 mt-1">${badge.description}</p>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Retire la notification après 4 secondes
    setTimeout(() => {
        notification.classList.add('animate__animated', 'animate__slideOutUp');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

/**
 * Calcule le streak et met à jour
 */
async function updateStreak() {
    const stats = await getStats();
    const today = new Date().toDateString();
    const lastActivityDate = stats?.lastActivityDate ? new Date(stats.lastActivityDate).toDateString() : null;

    if (!stats) {
        await saveStats({
            xp: 0,
            streak: 1,
            lastActivityDate: new Date().toISOString()
        });
        return;
    }

    if (lastActivityDate === today) {
        // Déjà compté aujourd'hui
        return;
    }

    // Vérifie si c'est le jour suivant
    const lastDate = new Date(stats.lastActivityDate);
    const nextDay = new Date(lastDate);
    nextDay.setDate(nextDay.getDate() + 1);

    if (nextDay.toDateString() === today) {
        // C'est le jour suivant, augmente le streak
        stats.streak = (stats.streak || 0) + 1;
    } else {
        // Plus d'un jour s'est écoulé, réinitialise le streak
        stats.streak = 1;
    }

    stats.lastActivityDate = new Date().toISOString();
    await saveStats(stats);

    // Vérifie les badges de streak
    await checkStreakBadges();
}

/**
 * Vérifie les badges de streak
 */
async function checkStreakBadges() {
    const stats = await getStats();
    const badges = await getBadges();
    const streak = stats?.streak || 0;

    // Badge: Constant(e) (7 jours)
    if (streak >= 7 && badges[3] && !badges[3].unlocked) {
        badges[3].unlocked = true;
        badges[3].unlockedAt = new Date().toISOString();
        await saveBadge(badges[3]);
        showBadgeUnlockedNotification(badges[3]);
    }

    // Badge: Légendaire (30 jours)
    if (streak >= 30 && badges[4] && !badges[4].unlocked) {
        badges[4].unlocked = true;
        badges[4].unlockedAt = new Date().toISOString();
        await saveBadge(badges[4]);
        showBadgeUnlockedNotification(badges[4]);
    }
}

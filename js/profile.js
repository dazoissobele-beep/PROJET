/**
 * Profile Manager
 * Gère l'écran de profil et les paramètres utilisateur
 */

/**
 * Initialise l'écran de profil
 */
async function initProfile() {
    const user = await getUser();
    const stats = await getStats();
    const lessons = await getLessons();
    const badges = await getBadges();

    if (!user) return;

    // Mise à jour du profil
    document.getElementById('profileAvatar').textContent = user.avatar;
    document.getElementById('profileName').textContent = user.name;

    // Date d'inscription formatée
    const joinDate = new Date(user.joinDate);
    const formattedDate = joinDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('profileJoinDate').textContent = `Inscrit(e) depuis ${formattedDate}`;

    // Mise à jour des stats
    document.getElementById('profileXP').textContent = stats?.xp || 0;
    document.getElementById('profileBadges').textContent = badges.filter(b => b.unlocked).length;
    document.getElementById('profileStreak').textContent = stats?.streak || 0;
    document.getElementById('profileLessons').textContent = lessons.filter(l => l.completed).length;

    // Setup des event listeners
    setupProfileHandlers();
}

/**
 * Configure les gestionnaires d'événements du profil
 */
function setupProfileHandlers() {
    const updateNameBtn = document.getElementById('updateNameBtn');
    const newNameInput = document.getElementById('newNameInput');

    updateNameBtn.addEventListener('click', async () => {
        const newName = newNameInput.value.trim();

        if (!newName) {
            alert('Veuillez entrer un nouveau nom');
            return;
        }

        // Mise à jour de l'utilisateur
        const user = await getUser();
        user.name = newName;
        await saveUser(user);

        // Mise à jour de l'affichage
        document.getElementById('profileName').textContent = newName;
        newNameInput.value = '';

        // Affiche une notification
        showUpdateNotification('Nom mis à jour avec succès! ✅');
    });

    // Permet d'appuyer sur Entrée
    newNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateNameBtn.click();
        }
    });

    // Bouton reset
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        const confirmed = confirm(
            '⚠️ ATTENTION!\n\nCette action est irréversible.\n' +
            'Toutes tes données seront supprimées.\n\n' +
            'Es-tu sûr(e) ?'
        );

        if (confirmed) {
            const doubleConfirm = confirm(
                'Dernier avertissement.\n\nTape "OUI" pour confirmer la suppression:'
            );

            if (doubleConfirm === 'OUI') {
                resetDatabase();
            }
        }
    });
}

/**
 * Affiche une notification de mise à jour
 */
function showUpdateNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-32 left-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-4 shadow-2xl z-50 animate__animated animate__slideInUp max-w-sm mx-auto';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('animate__animated', 'animate__slideOutDown');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

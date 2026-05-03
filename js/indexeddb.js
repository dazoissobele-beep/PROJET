/**
 * IndexedDB Manager
 * Gère toutes les opérations de base de données locale
 */

const DB_NAME = 'ApprendreDB';
const DB_VERSION = 1;
let db = null;

/**
 * Initialise la base de données IndexedDB
 */
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            console.log('✅ IndexedDB initialisée');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Users Store
            if (!db.objectStoreNames.contains('users')) {
                const userStore = db.createObjectStore('users', { keyPath: 'id' });
                userStore.createIndex('name', 'name', { unique: false });
            }

            // Lessons Store
            if (!db.objectStoreNames.contains('lessons')) {
                const lessonStore = db.createObjectStore('lessons', { keyPath: 'id' });
                lessonStore.createIndex('completed', 'completed', { unique: false });
            }

            // Badges Store
            if (!db.objectStoreNames.contains('badges')) {
                const badgeStore = db.createObjectStore('badges', { keyPath: 'id' });
                badgeStore.createIndex('unlocked', 'unlocked', { unique: false });
            }

            // Stats Store
            if (!db.objectStoreNames.contains('stats')) {
                db.createObjectStore('stats', { keyPath: 'id' });
            }

            console.log('✅ Stores IndexedDB créés');
        };
    });
}

/**
 * Ajoute ou met à jour un utilisateur
 */
async function saveUser(user) {
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    return new Promise((resolve, reject) => {
        const request = store.put({
            id: 1,
            ...user,
            updatedAt: new Date().toISOString()
        });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            console.log('✅ Utilisateur sauvegardé');
            resolve(request.result);
        };
    });
}

/**
 * Récupère l'utilisateur
 */
async function getUser() {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    return new Promise((resolve, reject) => {
        const request = store.get(1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Ajoute une leçon
 */
async function saveLesson(lesson) {
    const tx = db.transaction('lessons', 'readwrite');
    const store = tx.objectStore('lessons');
    return new Promise((resolve, reject) => {
        const request = store.put({
            ...lesson,
            updatedAt: new Date().toISOString()
        });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Récupère toutes les leçons
 */
async function getLessons() {
    const tx = db.transaction('lessons', 'readonly');
    const store = tx.objectStore('lessons');
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
    });
}

/**
 * Récupère une leçon spécifique
 */
async function getLesson(id) {
    const tx = db.transaction('lessons', 'readonly');
    const store = tx.objectStore('lessons');
    return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Récupère une leçon par son ID numérique
 */
async function getLessonById(lessonId) {
    const lessons = await getLessons();
    return lessons.find(l => l.id === lessonId);
}

/**
 * Ajoute un badge
 */
async function saveBadge(badge) {
    const tx = db.transaction('badges', 'readwrite');
    const store = tx.objectStore('badges');
    return new Promise((resolve, reject) => {
        const request = store.put({
            ...badge,
            updatedAt: new Date().toISOString()
        });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Récupère tous les badges
 */
async function getBadges() {
    const tx = db.transaction('badges', 'readonly');
    const store = tx.objectStore('badges');
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
    });
}

/**
 * Ajoute ou met à jour les statistiques
 */
async function saveStats(stats) {
    const tx = db.transaction('stats', 'readwrite');
    const store = tx.objectStore('stats');
    return new Promise((resolve, reject) => {
        const request = store.put({
            id: 1,
            ...stats,
            updatedAt: new Date().toISOString()
        });
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Récupère les statistiques
 */
async function getStats() {
    const tx = db.transaction('stats', 'readonly');
    const store = tx.objectStore('stats');
    return new Promise((resolve, reject) => {
        const request = store.get(1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Réinitialise toute la base de données
 */
async function resetDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            console.log('✅ Base de données réinitialisée');
            window.location.reload();
            resolve();
        };
    });
}

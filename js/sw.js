/**
 * Service Worker
 * À activer quand vous êtes prêt pour une PWA complète
 */

// Version du cache
const CACHE_VERSION = 'apprendre-v1.0.0';
const CACHE_ASSETS = 'apprendre-assets-v1.0.0';

// Fichiers à mettre en cache
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/indexeddb.js',
    '/js/onboarding.js',
    '/js/home.js',
    '/js/lessons.js',
    '/js/stats.js',
    '/js/profile.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installation...');

    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            console.log('[Service Worker] Mise en cache des fichiers');
            return cache.addAll(FILES_TO_CACHE);
        }).catch(err => {
            console.error('[Service Worker] Erreur lors de la mise en cache:', err);
        })
    );

    self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activation...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_VERSION && cacheName !== CACHE_ASSETS) {
                        console.log('[Service Worker] Suppression du cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    // Stratégie: Cache first, fallback to network
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(event.request).then((response) => {
                // Ne cache que les réponses valides
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone la réponse
                const responseToCache = response.clone();

                caches.open(CACHE_ASSETS).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Fallback offline
                return new Response(
                    'Erreur de connexion. L\'app devrait être disponible offline avec vos données en cache.',
                    { status: 503, statusText: 'Service Unavailable' }
                );
            });
        })
    );
});

// Gestion des messages depuis le client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Service Worker] Chargé et prêt');

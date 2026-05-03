/**
 * Service Worker - Apprendre
 * Gère la mise en cache et le fonctionnement hors ligne
 */

const CACHE_NAME = 'apprendre-v1.3.2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/styles.css',
    '/js/indexeddb.js',
    '/js/speech-handler.js',
    '/js/pwa-handler.js',
    '/js/onboarding.js',
    '/js/home.js',
    '/js/lesson-content.js',
    '/js/lesson-player.js',
    '/js/lessons.js',
    '/js/stats.js',
    '/js/profile.js',
    '/js/app.js'
];

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
    console.log('✅ Service Worker en cours d\'installation...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Mise en cache des assets locaux...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    
    self.skipWaiting();
});

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activé');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => {
                        console.log('🗑️ Suppression ancienne version du cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        })
    );
    
    self.clients.claim();
});

/**
 * Interception des requêtes
 */
self.addEventListener('fetch', (event) => {
    // Ignore les requêtes non-GET et les données locales (IndexedDB)
    if (event.request.method !== 'GET') {
        return;
    }
    
    const url = new URL(event.request.url);
    
    // Ignorer les CDN externes - laisser le navigateur les gérer
    if (url.hostname.includes('cdn') || 
        url.hostname.includes('cdnjs') || 
        url.hostname.includes('unpkg') ||
        url.hostname.includes('googleapis')) {
        return;
    }
    
    // Stratégie: Cache first, then network (pour les assets locaux)
    if (event.request.url.includes('/js/') || 
        event.request.url.includes('/css/') || 
        event.request.url.includes('.json')) {
        
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        // Mettre en cache les nouvelles réponses
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    })
                    .catch(() => {
                        // Retourner une réponse par défaut en cas d'erreur
                        return new Response('Contenu non disponible hors ligne');
                    });
            })
        );
    } else if (event.request.url.includes('/index.html') || url.pathname === '/') {
        // Stratégie: Network first pour la page principale
        event.respondWith(
            fetch(event.request)
                .then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                })
                .catch(() => {
                    return caches.match(event.request)
                        .then((response) => response || new Response('Page non disponible hors ligne'));
                })
        );
    }
});

/**
 * Gestion des messages depuis le client
 */
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

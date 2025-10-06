// Service Worker для WebMaster Pro
// Версия кэша
const CACHE_VERSION = 'webmaster-pro-v1.0';
const CACHE_NAME = `webmaster-pro-${CACHE_VERSION}`;

// Файлы для кэширования
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Skip waiting');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Installation failed:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
    // Только для GET запросов
    if (event.request.method !== 'GET') {
        return;
    }

    // Стратегия: сначала кэш, затем сеть
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                console.log('[SW] Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // Проверяем валидность ответа
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Клонируем ответ для кэширования
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Fetch failed:', error);
                        
                        // Возвращаем офлайн страницу если она есть в кэше
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Обработка сообщений от главного потока
self.addEventListener('message', (event) => {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                console.log('[SW] Received SKIP_WAITING message');
                self.skipWaiting();
                break;
                
            case 'GET_VERSION':
                event.ports[0].postMessage({
                    type: 'VERSION',
                    version: CACHE_VERSION
                });
                break;
                
            case 'CACHE_URLS':
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            return cache.addAll(event.data.urls);
                        })
                );
                break;
        }
    }
});

// Периодическая синхронизация (если поддерживается)
if ('sync' in self.registration) {
    self.addEventListener('sync', (event) => {
        console.log('[SW] Background sync triggered:', event.tag);
        
        if (event.tag === 'background-analysis') {
            event.waitUntil(
                // Здесь можно выполнить отложенный анализ
                Promise.resolve()
            );
        }
    });
}

// Push уведомления (если нужны)
self.addEventListener('push', (event) => {
    console.log('[SW] Push message received');
    
    const options = {
        body: event.data ? event.data.text() : 'WebMaster Pro: Анализ завершен',
        icon: '/icon-192x192.png',
        badge: '/icon-72x72.png',
        tag: 'webmaster-pro-notification',
        data: {
            url: '/',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'open',
                title: 'Открыть результаты'
            },
            {
                action: 'close',
                title: 'Закрыть'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('WebMaster Pro', options)
    );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification click received:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
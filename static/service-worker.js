// ============================================================
// CHARRY SCENTS - SERVICE WORKER
// ============================================================


// ============================================================
// CACHE VERSION
// ============================================================

const CACHE_NAME = "charry-scents-v2";


// ============================================================
// STATIC FILES TO CACHE
// ============================================================

const STATIC_ASSETS = [

    "/static/manifest.json",

    "/static/css/style.css",

    "/static/js/script.js",

    "/static/images/icon-192.png",

    "/static/images/icon-512.png",

    "/static/images/charry-scents-logo.png"

];


// ============================================================
// INSTALL SERVICE WORKER
// ============================================================

self.addEventListener(
    "install",
    function(event) {

        console.log(
            "Charry Scents Service Worker installing..."
        );


        event.waitUntil(

            caches
                .open(CACHE_NAME)

                .then(
                    function(cache) {

                        console.log(
                            "Caching Charry Scents static files..."
                        );

                        return cache.addAll(
                            STATIC_ASSETS
                        );

                    }
                )

        );


        self.skipWaiting();

    }
);


// ============================================================
// ACTIVATE SERVICE WORKER
// ============================================================

self.addEventListener(
    "activate",
    function(event) {

        console.log(
            "Charry Scents Service Worker activated."
        );


        event.waitUntil(

            caches
                .keys()

                .then(
                    function(cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function(cacheName) {

                                    if (
                                        cacheName !==
                                        CACHE_NAME
                                    ) {

                                        console.log(
                                            "Deleting old cache:",
                                            cacheName
                                        );

                                        return caches.delete(
                                            cacheName
                                        );

                                    }

                                }
                            )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


// ============================================================
// FETCH REQUESTS
// ============================================================

self.addEventListener(
    "fetch",
    function(event) {


        // Only handle GET requests

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        const requestURL =
            new URL(
                event.request.url
            );


        // Ignore external websites/resources

        if (
            requestURL.origin !==
            self.location.origin
        ) {

            return;

        }


        // ====================================================
        // STATIC FILES
        // ====================================================

        if (
            requestURL.pathname.startsWith(
                "/static/"
            )
        ) {

            event.respondWith(

                caches
                    .match(
                        event.request
                    )

                    .then(
                        function(cachedResponse) {


                            // Return cached file if available

                            if (
                                cachedResponse
                            ) {

                                return cachedResponse;

                            }


                            // Otherwise request from network

                            return fetch(
                                event.request
                            )

                                .then(
                                    function(networkResponse) {


                                        if (
                                            !networkResponse ||
                                            networkResponse.status !==
                                            200
                                        ) {

                                            return networkResponse;

                                        }


                                        const responseToCache =
                                            networkResponse.clone();


                                        caches
                                            .open(
                                                CACHE_NAME
                                            )

                                            .then(
                                                function(cache) {

                                                    cache.put(
                                                        event.request,
                                                        responseToCache
                                                    );

                                                }
                                            );


                                        return networkResponse;

                                    }
                                );

                        }
                    )

            );

        }

    }
);
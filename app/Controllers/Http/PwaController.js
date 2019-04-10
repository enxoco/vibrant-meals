'use strict'
const Helpers = use('Helpers')
const publicPath = Helpers.publicPath()
const recursive = require("recursive-readdir");



class PwaController {

    async serviceWorker ({request, response}){
        // var css = []
        // var adminCss = []

        // var cssPath = publicPath + '/css'
        // const list = recursive(publicPath, ['*.scss'], function (err, files) {
        //     // `files` is an array of file paths
        //     css.push(files)
        //     return css
        //   });
        // var fileList = list
        // return response.send(css)

        var sw = `// Names of the two caches used in this version of the service worker.
        // Change to v2, etc. when you update any of the local resources, which will
        // in turn trigger the install event again.
        const PRECACHE = 'precache-v1';
        const RUNTIME = 'runtime';
        
        // A list of local resources we always want to be cached.

        const PRECACHE_URLS = [
            "./",
            "./menu",
            "/admin/css/montserrat.css",
            "/images/logo.png",
            "/images/pickup-icon-inactive.png",
            "/images/delivery-icon-inactive.png",
            "https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css",
            "/css/bootstrap-tags.css",
            "/css/cart.css",
            "/css/checkout.css",
            "/css/fontawesome.min.css",
            "/css/main.css",
            "/css/opensans.css",
            "/css/product-card.css",
            "/css/slider.css",
            "/css/style.css",
            "/css/toastr.min.css",
            "/favicons/android-chrome-192x192.png",
            "/favicons/android-chrome-512x512.png",
            "/favicons/apple-touch-icon.png",
            "/favicons/browserconfig.xml",
            "/favicons/favicon-16x16.png",
            "/favicons/favicon-32x32.png",
            "/favicons/favicon.ico",
"/favicons/manifest.json",
"/favicons/mstile-150x150.png",
"/favicons/safari-pinned-tab.svg",
"/js/checkout-flow.js",
"/js/cloudinary-jquery-file-upload.min.js",
"/js/combodate.min.js",
"/js/countdown.min.js",
"/js/form-handler.js",
"/js/items.js",
"/js/items.min.js",
"/js/jquery-2.2.4.min.js",
"/js/jquery-ui.min.js",
"/js/jquery.fileupload.min.js",
"/js/lodash.core.min.js",
"/js/moment.js",
"/js/moment.min.js",
"/js/multirange.js",
"/js/pickup-flow.js",
"/js/popper.min.js",
"/js/product-card.js",
"/js/registration-form.js",
"/js/slider.min.js",
"/js/update-cart.js",
"/admin/css/bootstrap.min.css",
"/admin/css/bootstrap.min.css.map",
"/admin/css/paper-dashboard.css",
"/admin/css/paper-dashboard.css.map",
"/admin/css/paper-dashboard.min.css",
"/admin/css/paper-dashboard.user.css",
"/admin/demo/demo.css",
"/admin/demo/demo.js",
"/admin/fonts/nucleo-icons.eot",
"/admin/fonts/nucleo-icons.ttf",
"/admin/fonts/nucleo-icons.woff",
"/admin/fonts/nucleo-icons.woff2",
"/images/icons/icon-128x128.png",
"/images/icons/icon-144x144.png",
"/images/icons/icon-152x152.png",
"/images/icons/icon-192x192.png",
"/images/icons/icon-384x384.png",
"/images/icons/icon-512x512.png",
"/images/icons/icon-72x72.png",
"/images/icons/icon-96x96.png",
"/admin/js/core/bootstrap.min.js",
"/admin/js/core/jquery.min.js",
"/admin/js/core/popper.min.js",
"/admin/js/plugins/bootstrap-notify.js",
"/admin/js/plugins/chartjs.min.js",
"/admin/js/plugins/perfect-scrollbar.jquery.min.js"]

        // The install handler takes care of precaching the resources we always need.
        self.addEventListener('install', event => {
          event.waitUntil(
            caches.open(PRECACHE)
              .then(cache => cache.addAll(PRECACHE_URLS))
              .then(self.skipWaiting())
          );
        });
        
        // The activate handler takes care of cleaning up old caches.
        self.addEventListener('activate', event => {
          const currentCaches = [PRECACHE, RUNTIME];
          event.waitUntil(
            caches.keys().then(cacheNames => {
              return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
            }).then(cachesToDelete => {
              return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
              }));
            }).then(() => self.clients.claim())
          );
        });
        
        // The fetch handler serves responses for same-origin resources from a cache.
        // If no response is found, it populates the runtime cache with the response
        // from the network before returning it to the page.
        self.addEventListener('fetch', event => {
          // Skip cross-origin requests, like those for Google Analytics.
          if (event.request.url.startsWith(self.location.origin)) {
            event.respondWith(
              caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
        
                return caches.open(RUNTIME).then(cache => {
                  return fetch(event.request).then(response => {
                    // Put a copy of the response in the runtime cache.
                    return cache.put(event.request, response.clone()).then(() => {
                      return response;
                    });
                  });
                });
              })
            );
          }
        });`
        response.safeHeader('Content-type', 'text/javascript')
        return response.send(sw)
    }

    async manifest ({response}) {
        var manifest = `{
            "name": "Vibrant Meals",
            "short_name": "Vibrant Meals",
            "display": "standalone",
            "orientation": "portrait",
            "Scope": "/",
            "start_url": "/",
            "background_color": "#f2f2f2",
            "theme_color": "#f2f2f2",
          
            "icons": [
              {
                "src": "images/icons/icon-72x72.png",
                "sizes": "72x72",
                "type": "image/png"
              },
              {
                "src": "images/icons/icon-96x96.png",
                "sizes": "96x96",
                "type": "image/png"
              },
              {
                "src": "images/icons/icon-128x128.png",
                "sizes": "128x128",
                "type": "image/png"
              },
              {
                "src": "images/icons/icon-144x144.png",
                "sizes": "144x144",
                "type": "image/png"
              },
              {
                "src": "images/icons/icon-152x152.png",
                "sizes": "152x152",
                "type": "image/png"
              },
              {
                "src": "images/icons/icon-192x192.png",
                "sizes": "192x192",
                "type": "image/png"
              },
              {
                "src": "images/icons/icon-384x384.png",
                "sizes": "384x384",
                "type": "image/png"
              },
              {
                "src": "images/icons/icon-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
              }
            ],
            "splash_pages": null
          }`

          response.safeHeader('Content-type', 'application/json')
          return response.send(manifest)
    }
}

module.exports = PwaController

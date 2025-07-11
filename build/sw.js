const staticCacheName = 'pre-cache-v20-06-2025';
const dynamicCacheName = 'runtime-cache-v20-06-2025';

// Pre Caching Assets
const precacheAssets = [
    '/',
    './css/vendors.bundle.css',
    './css/sb-admin-2.css',
    './css/fa-solid.css',
    './css/fa-regular.css',
    './css/fa-brands.css',
    './css/btn.css',
    './css/bootstrap.min.css',
    './css/bootstrap-toggle.css',
    './css/app.bundle.css.map',
    './css/app.bundle.css',
    './controllers/GlobalVars.js',
    './controllers/dbcalls.js',
    './controllers/customerVars.js',
    './controllers/classNavegar.js',
    './controllers/classDb.js',
    './controllers/apicallsx.js',
    './img/usericon.png',
    './img/logo.png',
    './img/cog.png',
    './img/favicon.png',
    './img/icon-60.png',
    './img/icon-114.png',
    './img/icon-152.png',
    './js/vendors.bundle.js',
    './js/script.js',
    './js/sb-admnin-2.min.js',
    './js/sb-admin-2.js',
    './js/holder.js',
    './js/bootstrap.min.js',
    './js/bootstrap-toggle.js',
    './js/app.bundle.js',
    './libs/jsstore/jsstore.min.js',
    './libs/jsstore/jsstore.worker.min.js',
    './libs/leaflet/images/marker-icon.png',
    './libs/leaflet/leaflet.css',
    './libs/leaftlet/leaftlet.js',
    './libs/noty/noty.min.js',
    './libs/noty/noty.min.css',
    './libs/chartjs.bundle.js',
    './libs/F.js',
    './libs/sweetalert.min.js',
    './libs/toastr.js',
    './models/classTipoDocumentos.js',
    './models/classEmpleados.js',
    './vendor/jquery-easing/jquery.easing.js',
    './vendor/jquery/jquery.slim.min.map',
    './vendor/jquery/jquery.slim.min.js',
    './vendor/jquery/jquery.slim.js',
    './vendor/jquery/jquery.min.map',
    './vendor/jquery/jquery.min.js',
    './vendor/jquery/jquery.js',
    './vendor/fontawesome-free/css/all.css',
    './vendor/chart.js/Chart.min.js',
    './views/vendedor/vendedor.js',
    './views/vendedor/reparto.js',
    './views/vendedor/mapaclientes.js',
    './views/vendedor/facturacion.js',
    './views/vendedor/censo.js',
    './views/vendedor/vendedorlogro.js',
    './views/vendedor/clientes.js',
    './views/supervisor/config.js',
    './views/supervisor/mapa.js',
    './views/supervisor/ventas.js',
    './views/login/index.js',
    './views/programador.js',
    './favicon.png',
    './listaprecios.js',
    './sw.js',
    './index.html',
    './index.js',
    './manifest.json'
];

// INSTALL Event
self.addEventListener('install', function (event) {
    
    return;

    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll(precacheAssets);
        })
    );

});

// ACTIVATE Event
self.addEventListener('activate', function (event) {
    
    return;

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// FETCH Event
self.addEventListener('fetch', function (event) {
    
    return;

    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(response => {
                return caches.open(dynamicCacheName).then(function (cache) {
                    cache.put(event.request, response.clone());
                    return response;
                })
            });
        }).catch(function() {
            // Fallback Page, When No Internet Connection
            return caches.match('offline.html');
          })
    );
});
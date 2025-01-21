
// Filename - public/worker.js
 
let STATIC_CACHE_NAME = "gfg-pwa";
let DYNAMIC_CACHE_NAME = "dynamic-gfg-pwa";
 
// Add Routes and pages using React Browser Router
let urlsToCache = ["/", "/search", "/aboutus", "/profile"];
 
// Install a service worker
self.addEventListener("install", (event) => {
    // Perform install steps
    console.log('service worker installed')
});
 
// Cache and return requests
self.addEventListener("fetch", (event) => {
    console.log('service worker installed')
});
 
// Update a service worker
self.addEventListener("activate", (event) => {
    console.log('service worker installed')
});
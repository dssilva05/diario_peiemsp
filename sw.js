const CACHE_NAME = 'sobral-pinto-v10'; // Incremente sempre que mudar o código
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'icon-512.png',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80' // Imagem de fundo cacheada
];

// Instalação: Salva os arquivos essenciais no navegador
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando recursos...');
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => console.log('Erro ao cachear:', url, err));
        })
      );
    })
  );
  self.skipWaiting(); // Força o novo SW a assumir o controle imediatamente
});

// Ativação: Limpa caches de versões antigas automaticamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Garante que o SW controle as abas abertas na hora
});

// Estratégia Fetch: Network First (Tenta Internet, se falhar usa Cache)
// Isso é o que permite o LOGIN e os REGISTROS funcionarem offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

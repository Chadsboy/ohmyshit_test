// 캐시 이름 및 버전 설정
const CACHE_NAME = "oms-cache-v1";

// 캐시할 파일 목록
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/components/Timer.tsx",
  "/src/store/timerStore.ts",
];

// Service Worker 설치 시 캐시 생성
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("캐시가 열림");
      return cache.addAll(urlsToCache);
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // 캐시에서 먼저 확인
    caches.match(event.request).then((response) => {
      // 캐시에 있으면 캐시된 응답 반환
      if (response) {
        return response;
      }

      // 캐시에 없으면 네트워크 요청
      return fetch(event.request).then((response) => {
        // 유효한 응답이 아니면 그냥 반환
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // 응답 복제 (스트림은 한 번만 사용 가능)
        const responseToCache = response.clone();

        // 응답을 캐시에 저장
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// 이전 버전의 캐시 삭제
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 백그라운드 동기화 (Optional)
self.addEventListener("sync", (event) => {
  if (event.tag === "timer-sync") {
    console.log("타이머 동기화 요청됨");
    // 여기에 동기화 로직 추가
  }
});

// 클라이언트 메시지 처리
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

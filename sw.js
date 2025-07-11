// 缓存名称和版本
const CACHE_NAME = 'network-simulator-v1';
// 需要缓存的资源列表
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css'
];

// 网络模拟配置 (默认值)


// 安装Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('缓存已打开');
                return cache.addAll(urlsToCache);
            })
    );
});

// 激活Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('删除旧缓存:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 监听主线程的消息 (接收网络配置)
self.addEventListener('message', event => {
    if (event.data.type === 'SET_NETWORK_CONFIG') {
        networkConfig = {
            ...event.data.config,
            enabled: true
        };
        console.log('SW收到网络配置:', networkConfig);
    } else if (event.data.type === 'RESET_NETWORK') {
        networkConfig = {
            baseLatency: 0,
            uploadLatency: 0,
            downloadLatency: 0,
            packetLoss: 0,
            randomLoss: 0,
            enabled: false
        };
        console.log('SW网络配置已重置');
    }
});

// 拦截和处理网络请求
self.addEventListener('fetch', event => {
    // 排除Service Worker自身的请求
    if (event.request.url.includes('/sw.js')) return;

    // 如果网络模拟未启用，直接返回请求
    if (!networkConfig.enabled) {
        event.respondWith(fetch(event.request));
        return;
    }

    // 计算总丢包率
    const totalLoss = networkConfig.packetLoss + networkConfig.randomLoss;

    // 模拟丢包
    if (Math.random() * 100 < totalLoss) {
        console.log(`[SW] 模拟丢包: ${event.request.url}`);
        event.respondWith(
            new Response(null, {
                status: 504,
                statusText: 'Network Packet Loss'
            })
        );
        return;
    }

    // 计算总延迟 = 基础延迟 + 上行延迟 + 下行延迟
    const totalLatency = networkConfig.baseLatency +
        networkConfig.uploadLatency +
        networkConfig.downloadLatency;

    // 模拟网络延迟
    event.respondWith(
        new Promise(resolve => {
            // 添加上行延迟
            setTimeout(() => {
                fetch(event.request)
                    .then(response => {
                        // 克隆响应，因为响应是流，只能使用一次
                        const clonedResponse = response.clone();

                        // 添加下行延迟
                        setTimeout(() => {
                            resolve(clonedResponse);
                        }, networkConfig.downloadLatency);
                    })
                    .catch(error => {
                        setTimeout(() => resolve(new Response('Network error', {
                            status: 500
                        })), totalLatency);
                    });
            }, networkConfig.baseLatency + networkConfig.uploadLatency);
        })
    );
});

// 定时报告状态
setInterval(() => {
    if (networkConfig.enabled) {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'NETWORK_STATUS',
                    latency: networkConfig.baseLatency +
                        networkConfig.uploadLatency +
                        networkConfig.downloadLatency,
                    loss: networkConfig.packetLoss + networkConfig.randomLoss
                });
            });
        });
    }
}, 5000);
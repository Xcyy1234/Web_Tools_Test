// 模块数据加载
let activityData = [];
let ModelData = [];
let DrawLotsData = [];

async function loadExternalData() {
    try {
        ({ activityData } = await import('./Activity.js'));
        ({ ModelData } = await import('./model.js'));
        ({ DrawLotsData } = await import('./Drawlots.js'));
    } catch (error) {
        console.error("加载数据失败:", error);
        // 设置默认数据
        activityData = [];
        ModelData = [];
        DrawLotsData = [];
    }
}

// 初始化函数
async function init() {
    await loadExternalData();

    // 安全的元素获取函数
    function getElementSafe(id) {
        const el = document.getElementById(id);
        if (!el) console.warn(`元素 #${id} 未找到`);
        return el;
    }

    // 开发者工具检测
    detectDevTools();

    // 初始化滑块值显示
    const latencySlider = getElementSafe('latency');
    const packetLossSlider = getElementSafe('packet-loss');

    if (latencySlider) {
        latencySlider.addEventListener('input', function() {
            const valueDisplay = getElementSafe('latency-value');
            if (valueDisplay) valueDisplay.textContent = this.value + 'ms';
        });
    }

    if (packetLossSlider) {
        packetLossSlider.addEventListener('input', function() {
            const valueDisplay = getElementSafe('loss-value');
            if (valueDisplay) valueDisplay.textContent = this.value + '%';
        });
    }

    // 网络预设选择
    const networkItems = document.querySelectorAll('.network-item');
    networkItems.forEach(item => {
        item.addEventListener('click', function () {
            networkItems.forEach(i => i.classList.remove('network-selected'));
            this.classList.add('network-selected');

            const presets = {
                'network-good': {latency: 50, loss: 0},
                'network-medium': {latency: 200, loss: 8},
                'network-poor': {latency: 800, loss: 30}
            };

            const preset = presets[this.id];
            if (preset) {
                document.getElementById('latency').value = preset.latency;
                document.getElementById('packet-loss').value = preset.loss;
                document.getElementById('latency-value').textContent = preset.latency + 'ms';
                document.getElementById('loss-value').textContent = preset.loss + '%';
            }
        });
    });

    // 导航功能
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    if(sidebar) {
        // 修复：只添加一次事件监听
        sidebar.addEventListener('click', function(e) {
            const navItem = e.target.closest('.tool-nav-item');
            if (!navItem) return;

            const toolId = navItem.getAttribute('data-tool');
            document.querySelectorAll('.tool-nav-item').forEach(i => i.classList.remove('active'));
            navItem.classList.add('active');

            document.querySelectorAll('.tool-content').forEach(tool => {
                tool.classList.remove('active');
            });
            document.getElementById(toolId).classList.add('active');

            if (window.innerWidth < 768) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // 菜单切换
    if(menuToggle) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            if(sidebar) sidebar.classList.toggle('active');
            if(overlay) overlay.classList.toggle('active');
        });
    }

    // 点击遮罩层关闭菜单
    if(overlay) {
        overlay.addEventListener('click', function () {
            if(menuToggle) menuToggle.classList.remove('active');
            if(sidebar) sidebar.classList.remove('active');
            this.classList.remove('active');
        });
    }

    // 单位选择器（使用事件委托）
    const unitSelector = document.querySelector('.unit-selector');
    if(unitSelector) {
        unitSelector.addEventListener('click', function (e) {
            const option = e.target.closest('.unit-option');
            if (!option) return;

            option.parentNode.querySelectorAll('.unit-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    }

    // 时间戳单位选择器（使用事件委托）
    const timestampSelector = document.querySelector('.timestamp-unit-selector');
    if(timestampSelector) {
        timestampSelector.addEventListener('click', function (e) {
            const option = e.target.closest('.timestamp-unit-option');
            if (!option) return;

            option.parentNode.querySelectorAll('.timestamp-unit-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    }

    // 事件监听
    const eventBindings = [
        { id: 'calculate-remainder', event: 'click', handler: calculateRemainder },
        { id: 'network-simulator', event: 'click', handler: initNetworkSimulator },
        // { id: 'translate-screenshot', event: 'click', handler: translateScreenshot },
        { id: 'convert-to-date', event: 'click', handler: convertTimestampToDate },
        { id: 'convert-to-days', event: 'click', handler: convertTimestampToDays },
        { id: 'convert-to-timestamp', event: 'click', handler: convertDateToTimestamp },
        { id: 'convert-cd', event: 'click', handler: convertCD },
        { id: 'send-ai-question', event: 'click', handler: askDeepSeek },
        { id: 'clear-ai-chat', event: 'click', handler: clearAIChat },
        { id: 'zentao-link-btn', event: 'click', handler: () => window.open('http://192.168.1.52/zentao/bug-browse-1--assigntome.html', '_blank') },
        { id: 'package-download-btn-ct', event: 'click', handler: () => window.open('http://192.168.1.150/down/beta/', '_blank') },
        { id: 'package-download-btn-jms', event: 'click', handler: () => window.open('http://192.168.1.119/download/', '_blank') },
        { id: 'bugly-link-btn', event: 'click', handler: () => window.open('https://bugly.qq.com/v2/', '_blank') },
        { id: 'appstore-link-btn', event: 'click', handler: () => window.open('https://appid.naitu.cc/share/nice', '_blank') },
        { id: 'iphone-link-btn', event: 'click', handler: () => window.open('https://yunduanxin.net/', '_blank') }
    ];

    eventBindings.forEach(binding => {
        const element = getElementSafe(binding.id);
        if (element) {
            element.addEventListener(binding.event, binding.handler);
        }
    });

    // AI建议
    const aiSuggestions = document.querySelector('.ai-suggestions');
    if(aiSuggestions) {
        aiSuggestions.addEventListener('click', function (e) {
            const suggestion = e.target.closest('.ai-suggestion');
            if (!suggestion) return;

            const question = suggestion.getAttribute('data-question');
            document.getElementById('ai-question').value = question;
        });
    }

    // CD示例
    const cdExamples = document.querySelector('.cd-examples');
    if(cdExamples) {
        cdExamples.addEventListener('click', function (e) {
            const example = e.target.closest('.cd-example');
            if (!example) return;

            const value = example.getAttribute('data-value');
            const unit = example.getAttribute('data-unit');
            document.getElementById('cd-value').value = value;

            document.querySelectorAll('.unit-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-unit') === unit) {
                    option.classList.add('active');
                }
            });
            convertCD();
        });
    }

    // 默认选择良好网络
    const networkStatus = getElementSafe('network-status');
    if(networkStatus) networkStatus.click();

    // 设置当前时间作为默认值
    const now = new Date();
    const datetimeInput = getElementSafe('datetime-input');
    if(datetimeInput) datetimeInput.value = formatDate(now);

    const timestampInput = getElementSafe('timestamp-input');
    if(timestampInput) timestampInput.value = Math.floor(now.getTime() / 1000);

    // 初始化各功能模块
    // initScreenshot();
    initCurrencyConverter();
    calculateCoin();
    initActivitySearch();
    initModelSearch();
    initNetworkSimulator();
}



// =======================================以下是原有完整代码=====================================================//

// 开发者工具检测函数（新增）
function detectDevTools() {
    const element = new Image();

    Object.defineProperty(element, 'id', {
        get: () => {
            document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:100px;">禁止检查源代码</h1>';
            window.stop();
        }
    });

    console.log(element);
}


// AI助手相关变量
let aiConversation = [];

// DeepSeek API密钥
const OPENROUTER_API_KEY = "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";

// 汇率数据
const exchangeRates = {
    CNY: {name: "人民币", rate: 1, flag: "🇨🇳"},
    USD: {name: "美元", rate: 7.27, flag: "🇺🇸"},
    EUR: {name: "欧元", rate: 7.81, flag: "🇪🇺"},
    JPY: {name: "日元", rate: 0.049, flag: "🇯🇵"},
    GBP: {name: "英镑", rate: 8.91, flag: "🇬🇧"},
    HKD: {name: "港币", rate: 0.93, flag: "🇭🇰"},
    KRW: {name: "韩元", rate: 0.0055, flag: "🇰🇷"},
    AUD: {name: "澳元", rate: 4.71, flag: "🇦🇺"},
    CAD: {name: "加元", rate: 5.36, flag: "🇨🇦"}
};

// 通用日期格式化函数
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// 通用结果展示函数
function showResult(elementId, htmlContent) {
    const resultBox = document.getElementById(elementId);
    if (resultBox) {
        resultBox.innerHTML = htmlContent;
    }
}

// 计算余数
function calculateRemainder() {
    const dividend = parseInt(document.getElementById('dividend').value) || 0;
    const divisor = parseInt(document.getElementById('divisor').value) || 1;

    if (divisor === 0) {
        alert('除数不能为零！');
        return;
    }

    const remainder = dividend % divisor;
    const quotient = Math.floor(dividend / divisor);

    showResult('remainder-result', `
        <div style="margin-bottom: 10px;">${dividend} ÷ ${divisor} = ${quotient} ... ${remainder}</div>
        <div>计算结果: <strong>${remainder}</strong></div>
        <div style="margin-top: 10px; color: #a0aec0;">
            ${dividend} 除以 ${divisor} 的余数是 ${remainder}
        </div>
    `);
}

// 网络模拟功能
function initNetworkSimulator() {
    // 获取DOM元素
    const latencySlider = document.getElementById('latency');
    const uploadLatencySlider = document.getElementById('upload-latency');
    const downloadLatencySlider = document.getElementById('download-latency');
    const packetLossSlider = document.getElementById('packet-loss');
    const randomPacketLossSlider = document.getElementById('random-packet-loss');
    const latencyValue = document.getElementById('latency-value');
    const uploadLatencyValue = document.getElementById('upload-latency-value');
    const downloadLatencyValue = document.getElementById('download-latency-value');
    const lossValue = document.getElementById('loss-value');
    const randomLossValue = document.getElementById('random-loss-value');
    const applyBtn = document.getElementById('apply-settings');
    const resetBtn = document.getElementById('reset-settings');
    const networkResult = document.getElementById('network-result');
    const networkStatus = document.getElementById('network-status');
    const networkStats = document.getElementById('network-stats');
    const networkIndicator = document.getElementById('network-simulation-indicator');
    const presetItems = document.querySelectorAll('.preset-item');
    const latencyBar = document.getElementById('latency-bar');
    const lossBar = document.getElementById('loss-bar');
    const latencyGraph = document.getElementById('latency-graph');

    // 存储历史数据
    const latencyHistory = [];
    const maxHistoryItems = 20;

    // 初始值显示
    if (latencyValue) latencyValue.textContent = (latencySlider?.value || 0) + 'ms';
    if (uploadLatencyValue) uploadLatencyValue.textContent = (uploadLatencySlider?.value || 0) + 'ms';
    if (downloadLatencyValue) downloadLatencyValue.textContent = (downloadLatencySlider?.value || 0) + 'ms';
    if (lossValue) lossValue.textContent = (packetLossSlider?.value || 0) + '%';
    if (randomLossValue) randomLossValue.textContent = (randomPacketLossSlider?.value || 0) + '%';

    // 更新图表
    function updateGraph() {
        const totalLatency = parseInt(latencySlider?.value || 0) +
            parseInt(uploadLatencySlider?.value || 0) +
            parseInt(downloadLatencySlider?.value || 0);
        const totalLoss = parseInt(packetLossSlider?.value || 0) +
            parseInt(randomPacketLossSlider?.value || 0);

        // 更新条形图宽度
        if (latencyBar) latencyBar.style.width = Math.min(100, totalLatency / 20) + '%';
        if (lossBar) lossBar.style.width = Math.min(100, totalLoss * 2) + '%';

        // 更新条形图颜色
        const latencyColor = totalLatency < 100 ? 'var(--network-good)' :
            totalLatency < 500 ? 'var(--network-medium)' :
                totalLatency < 1000 ? 'var(--network-poor)' : 'var(--network-severe)';

        const lossColor = totalLoss < 5 ? 'var(--network-good)' :
            totalLoss < 15 ? 'var(--network-medium)' :
                totalLoss < 25 ? 'var(--network-poor)' : 'var(--network-severe)';

        if (latencyBar) latencyBar.style.background = latencyColor;
        if (lossBar) lossBar.style.background = lossColor;

        // 更新折线图数据
        latencyHistory.push(totalLatency);
        if (latencyHistory.length > maxHistoryItems) {
            latencyHistory.shift();
        }

        if (latencyGraph) {
            latencyGraph.innerHTML = '';
            const maxValue = Math.max(...latencyHistory, 100);

            latencyHistory.forEach((value, index) => {
                const height = (value / maxValue) * 100;
                const bar = document.createElement('div');
                bar.className = 'graph-line';
                bar.style.left = `${(index / maxHistoryItems) * 100}%`;
                bar.style.height = `${height}%`;
                bar.style.width = `${100 / maxHistoryItems}%`;
                bar.style.opacity = 0.3 + (0.7 * (height / 100));
                latencyGraph.appendChild(bar);
            });
        }
    }

    // 滑块事件监听
    const sliders = [latencySlider, uploadLatencySlider, downloadLatencySlider, packetLossSlider, randomPacketLossSlider];
    sliders.forEach(slider => {
        if (slider) {
            slider.addEventListener('input', function () {
                const id = this.id;
                if (id.includes('latency')) {
                    const valueElement = document.getElementById(`${id}-value`);
                    if (valueElement) valueElement.textContent = this.value + 'ms';
                } else {
                    const valueElement = document.getElementById(`${id}-value`);
                    if (valueElement) valueElement.textContent = this.value + '%';
                }
                updateNetworkStatus();
                updateGraph();
            });
        }
    });

    // 更新网络状态显示
    function updateNetworkStatus() {
        const latency = parseInt(latencySlider?.value || 0);
        const uploadLatency = parseInt(uploadLatencySlider?.value || 0);
        const downloadLatency = parseInt(downloadLatencySlider?.value || 0);
        const packetLoss = parseInt(packetLossSlider?.value || 0);
        const randomLoss = parseInt(randomPacketLossSlider?.value || 0);

        const totalLatency = latency + uploadLatency + downloadLatency;
        const totalLoss = packetLoss + randomLoss;

        if (networkStats) networkStats.textContent = `延迟: ${totalLatency}ms | 丢包: ${totalLoss}%`;

        // 更新网络状态文字
        let statusText, statusColor;
        if (totalLatency === 0 && totalLoss === 0) {
            statusText = "良好";
            statusColor = "var(--network-good)";
        } else if (totalLatency < 100 && totalLoss < 5) {
            statusText = "一般";
            statusColor = "var(--network-medium)";
        } else if (totalLatency < 500 && totalLoss < 20) {
            statusText = "较差";
            statusColor = "var(--network-poor)";
        } else {
            statusText = "极差";
            statusColor = "var(--network-severe)";
        }

        if (networkStatus) {
            networkStatus.textContent = statusText;
            networkStatus.style.color = statusColor;
        }
    }

    // 应用网络设置
    if (applyBtn) {
        applyBtn.addEventListener('click', function () {
            const uploadLatency = parseInt(uploadLatencySlider?.value || 0);
            const downloadLatency = parseInt(downloadLatencySlider?.value || 0);
            const packetLoss = parseInt(packetLossSlider?.value || 0);
            const randomLoss = parseInt(randomPacketLossSlider?.value || 0);

            const totalLatency = latency + uploadLatency + downloadLatency;
            const totalLoss = packetLoss + randomLoss;

            applyNetworkSettings(latency, uploadLatency, downloadLatency, packetLoss, randomLoss);
            if (networkIndicator) networkIndicator.style.display = 'block';

            // ServiceWorker 处理请求
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SET_NETWORK_CONFIG',
                    config: {
                        baseLatency: latency,
                        uploadLatency: uploadLatency,
                        downloadLatency: downloadLatency,
                        packetLoss: packetLoss,
                        randomLoss: randomLoss
                    }
                });
            }



            const now = new Date();
            showResult('network-result', `
                <div><strong>网络设置已应用 (${now.toLocaleTimeString()}):</strong></div>
                <div>基本延迟: ${latency}ms</div>
                <div>上行延时: ${uploadLatency}ms</div>
                <div>下行延时: ${downloadLatency}ms</div>
                <div>丢包率: ${packetLoss}%</div>
                <div>随机丢包率: ${randomLoss}%</div>
                <div style="margin-top: 10px; color: var(--neon-blue);">
                    <i class="fas fa-info-circle"></i> 总延迟: ${totalLatency}ms | 总丢包率: ${totalLoss}%
                </div>
            `);

            simulateNetworkRequests(totalLatency, totalLoss);
        });
    }

    // 恢复网络状态
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            sliders.forEach(slider => {
                if (slider) slider.value = 0;
            });
            document.querySelectorAll('.latency-value, .loss-value').forEach(el => {
                if (el) {
                    el.textContent = el.classList.contains('latency-value') ? '0ms' : '0%';
                }
            });

            resetNetworkSettings();
            if (networkIndicator) networkIndicator.style.display = 'none';

            // 添加ServiceWorker 请求
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'RESET_NETWORK'
                });
            }

            const now = new Date();
            showResult('network-result', `
                <div><strong>网络设置已恢复 (${now.toLocaleTimeString()}):</strong></div>
                <div style="color: var(--network-good); margin-top: 10px;">
                    <i class="fas fa-check-circle"></i> 网络状态已恢复正常
                </div>
            `);

            updateNetworkStatus();
            updateGraph();
        });
    }

    // 预设场景点击事件
    if (presetItems) {
        presetItems.forEach(item => {
            item.addEventListener('click', function () {
                presetItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                applyPreset(this.getAttribute('data-preset'));
            });
        });
    }

    // 应用预设
    function applyPreset(preset) {
        const presets = {
            'elevator': {latency: 500, upload: 300, download: 300, loss: 10, random: 5},
            'subway': {latency: 300, upload: 200, download: 200, loss: 8, random: 4},
            'tunnel': {latency: 1000, upload: 500, download: 500, loss: 15, random: 10},
            'rural': {latency: 800, upload: 400, download: 400, loss: 12, random: 8},
            'stadium': {latency: 200, upload: 100, download: 100, loss: 10, random: 5},
            'conference': {latency: 150, upload: 80, download: 80, loss: 8, random: 4}
        };

        const config = presets[preset] || {};
        if (latencySlider) latencySlider.value = config.latency || 0;
        if (uploadLatencySlider) uploadLatencySlider.value = config.upload || 0;
        if (downloadLatencySlider) downloadLatencySlider.value = config.download || 0;
        if (packetLossSlider) packetLossSlider.value = config.loss || 0;
        if (randomPacketLossSlider) randomPacketLossSlider.value = config.random || 0;

        if (latencyValue) latencyValue.textContent = (config.latency || 0) + 'ms';
        if (uploadLatencyValue) uploadLatencyValue.textContent = (config.upload || 0) + 'ms';
        if (downloadLatencyValue) downloadLatencyValue.textContent = (config.download || 0) + 'ms';
        if (lossValue) lossValue.textContent = (config.loss || 0) + '%';
        if (randomLossValue) randomLossValue.textContent = (config.random || 0) + '%';

        updateNetworkStatus();
        updateGraph();

        if (networkResult) {
            networkResult.innerHTML = `
                <div><strong>已应用${document.querySelector(`[data-preset="${preset}"] .preset-name`)?.textContent || ''} 预设</strong></div>
                <div>点击"应用网络设置"按钮启用此配置</div>
            `;
        }
    }

    // 模拟应用网络设置
    function applyNetworkSettings(latency, uploadLatency, downloadLatency, packetLoss, randomLoss) {
        console.log(`应用网络设置:
              基本延迟: ${latency}ms
              上行延时: ${uploadLatency}ms
              下行延时: ${downloadLatency}ms
              丢包率: ${packetLoss}%
              随机丢包率: ${randomLoss}%`);
    }

    // 模拟恢复网络设置
    function resetNetworkSettings() {
        console.log('网络设置已重置');
    }

    // 模拟网络请求
    function simulateNetworkRequests(latency, lossRate) {
        clearInterval(window.simulationInterval);

        window.simulationInterval = setInterval(() => {
            const isPacketLoss = Math.random() * 100 < lossRate;
            const now = new Date();
            const timeStr = now.toLocaleTimeString();

            const entry = document.createElement('div');
            entry.style.marginTop = '5px';
            entry.style.color = isPacketLoss ? 'var(--danger)' : 'var(--success)';
            entry.innerHTML = `
                <i class="fas ${isPacketLoss ? 'fa-times-circle' : 'fa-check-circle'}"></i> 
                ${timeStr}: ${isPacketLoss ? '网络请求失败 (丢包)' : `请求成功 (延迟: ${latency}ms)`}
            `;

            if (networkResult) {
                networkResult.appendChild(entry);
                networkResult.scrollTop = networkResult.scrollHeight;

                // 限制最多显示20条记录
                const entries = networkResult.querySelectorAll('div');
                if (entries.length > 20) {
                    entries[0].remove();
                }
            }
        }, 2000);
    }

    // 初始更新网络状态
    updateNetworkStatus();
    updateGraph();
}

// 注册Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker 注册成功: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker 注册失败: ', err);
        });
    });
}



// 时间戳转换
function convertTimestampToDate() {
    const timestamp = document.getElementById('timestamp-input')?.value;
    if (!timestamp) {
        alert('请输入时间戳');
        return;
    }

    const unitOption = document.querySelector('.timestamp-unit-option.active');
    if (!unitOption) return;

    const unit = unitOption.getAttribute('data-unit');
    const milliseconds = unit === 'seconds' ? timestamp * 1000 : parseInt(timestamp);
    const date = new Date(milliseconds);

    // 计算时区差
    const localOffset = -date.getTimezoneOffset();
    const utcMinus8Offset = -480;
    const hourDiff = (localOffset - utcMinus8Offset) / 60;
    const diffDescription = hourDiff > 0 ? `${hourDiff} 小时` :
        hourDiff < 0 ? `${-hourDiff} 小时` : "本地时间与西八区相同";

    // 美国时区转换
    const etTime = date.toLocaleString('zh-CN', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // 西八区时间计算
    const utcMinus8Date = new Date(milliseconds - 8 * 3600000);
    const utcMinus8Time = utcMinus8Date.toISOString().replace('T', ' ').substring(0, 19) + " (UTC-8)";

    showResult('timestamp-result', `
        <div><strong>转换结果 (${unit === 'seconds' ? '秒' : '毫秒'} 转日期):</strong></div>
        <div>北京时间: ${date.toLocaleString()}</div>
        <div>美国东部时间(ET): ${etTime}</div>
        <div>西八区时间(UTC-8): ${utcMinus8Time}</div>
        <div>北京与西八区时差: ${diffDescription}</div>
    `);

    const daysResult = document.getElementById('days-result');
    if (daysResult) daysResult.style.display = 'none';

    const timestampResult = document.getElementById('timestamp-result');
    if (timestampResult) timestampResult.style.display = 'block';
}

// 时间戳转天数功能
function convertTimestampToDays() {
    const timestamp = document.getElementById('timestamp-input')?.value;
    if (!timestamp) {
        alert('请输入时间戳');
        return;
    }

    const unitOption = document.querySelector('.timestamp-unit-option.active');
    if (!unitOption) return;

    const unit = unitOption.getAttribute('data-unit');
    const seconds = unit === 'seconds' ? timestamp : timestamp / 1000;
    const days = seconds / 86400;

    const daysValue = document.getElementById('days-value');
    if (daysValue) daysValue.textContent = days.toFixed(6);

    const timestampResult = document.getElementById('timestamp-result');
    if (timestampResult) timestampResult.style.display = 'none';

    const daysResult = document.getElementById('days-result');
    if (daysResult) daysResult.style.display = 'block';
}

function convertDateToTimestamp() {
    const dateString = document.getElementById('datetime-input')?.value;
    if (!dateString) {
        alert('请选择日期时间');
        return;
    }

    const date = new Date(dateString);
    const timestampSeconds = Math.floor(date.getTime() / 1000);
    const timestampMilliseconds = date.getTime();

    showResult('timestamp-result', `
        <div><strong>转换结果:</strong></div>
        <div>秒时间戳: ${timestampSeconds}</div>
        <div>毫秒时间戳: ${timestampMilliseconds}</div>
    `);

    const daysResult = document.getElementById('days-result');
    if (daysResult) daysResult.style.display = 'none';

    const timestampResult = document.getElementById('timestamp-result');
    if (timestampResult) timestampResult.style.display = 'block';
}

// CD转换功能
function convertCD() {
    const value = parseFloat(document.getElementById('cd-value')?.value) || 0;
    const unitOption = document.querySelector('.unit-option.active');
    if (!unitOption) return;

    const unit = unitOption.getAttribute('data-unit');

    if (value < 0) {
        alert("请输入有效的数值");
        return;
    }

    // 首先转换为毫秒
    const unitFactors = {
        'milliseconds': 1,
        'seconds': 1000,
        'minutes': 60 * 1000,
        'hours': 60 * 60 * 1000,
        'days': 24 * 60 * 60 * 1000
    };

    const milliseconds = value * (unitFactors[unit] || 0);

    // 计算各个时间单位
    const secondsTotal = milliseconds / 1000;
    const days = Math.floor(secondsTotal / 86400);
    const hours = Math.floor((secondsTotal % 86400) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = Math.floor(secondsTotal % 60);
    const remainingMilliseconds = Math.floor(milliseconds % 1000);

    // 更新结果框
    showResult('cd-result', `
        <div><strong>转换结果:</strong></div>
        <div>${value} ${getUnitName(unit)} = </div>
        <div>${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒 ${remainingMilliseconds}毫秒</div>
        <div style="margin-top: 10px; color: #a0aec0;">
            总计: ${secondsTotal.toFixed(3)} 秒 (${milliseconds} 毫秒)
        </div>
    `);

    // 更新单元显示
    const units = [days, hours, minutes, seconds, remainingMilliseconds];
    document.querySelectorAll('.cd-unit .cd-value').forEach((el, i) => {
        if (el) el.textContent = units[i];
    });
}

function getUnitName(unit) {
    const units = {
        'milliseconds': '毫秒',
        'seconds': '秒',
        'minutes': '分钟',
        'hours': '小时',
        'days': '天'
    };
    return units[unit] || '';
}

// 天气图标映射表
const weatherIcons = {
    '01d': {icon: "fa-sun", class: "sunny"},
    '01n': {icon: "fa-moon", class: "sunny"},
    '02d': {icon: "fa-cloud-sun", class: "cloudy"},
    '02n': {icon: "fa-cloud-moon", class: "cloudy"},
    '03d': {icon: "fa-cloud", class: "cloudy"},
    '03n': {icon: "fa-cloud", class: "cloudy"},
    '04d': {icon: "fa-cloud", class: "cloudy"},
    '04n': {icon: "fa-cloud", class: "cloudy"},
    '09d': {icon: "fa-cloud-rain", class: "rainy"},
    '09n': {icon: "fa-cloud-rain", class: "rainy"},
    '10d': {icon: "fa-cloud-showers-heavy", class: "rainy"},
    '10n': {icon: "fa-cloud-showers-heavy", class: "rainy"},
    '11d': {icon: "fa-bolt", class: "thunder"},
    '11n': {icon: "fa-bolt", class: "thunder"},
    '13d': {icon: "fa-snowflake", class: "snowy"},
    '13n': {icon: "fa-snowflake", class: "snowy"},
    '50d': {icon: "fa-smog", class: "foggy"},
    '50n': {icon: "fa-smog", class: "foggy"}
};

// 天气描述映射
const weatherDescriptions = {
    '01d': "晴空万里",
    '01n': "晴朗夜晚",
    '02d': "少云",
    '02n': "少云",
    '03d': "多云",
    '03n': "多云",
    '04d': "阴天",
    '04n': "阴天",
    '09d': "小雨",
    '09n': "小雨",
    '10d': "大雨",
    '10n': "大雨",
    '11d': "雷暴",
    '11n': "雷暴",
    '13d': "下雪",
    '13n': "下雪",
    '50d': "有雾",
    '50n': "有雾"
};

// 更新天气信息
async function updateWeather() {
    const loadingElement = document.getElementById('weather-loading');
    if (loadingElement) loadingElement.style.display = 'inline-block';

    const weatherTemp = document.getElementById('weather-temp');
    if (weatherTemp) weatherTemp.textContent = '--';

    const weatherStatus = document.getElementById('weather-status');
    if (weatherStatus) weatherStatus.textContent = '获取数据中...';

    try {
        const apiKey = 'e82041e6d254caae28fd6330b6952586';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Beijing&appid=${apiKey}&units=metric&lang=zh_cn`);
        const data = await response.json();

        if (data.cod === 200) {
            const temp = Math.round(data.main.temp);
            const weatherId = data.weather[0].icon;
            const iconConfig = weatherIcons[weatherId] || weatherIcons['01d'];
            const status = weatherDescriptions[weatherId] || data.weather[0].description;

            if (weatherTemp) weatherTemp.textContent = `${temp}°C`;
            if (weatherStatus) weatherStatus.textContent = status;

            const weatherHumidity = document.getElementById('weather-humidity');
            if (weatherHumidity) weatherHumidity.textContent = data.main.humidity;

            const weatherWind = document.getElementById('weather-wind');
            if (weatherWind) weatherWind.textContent = data.wind.speed.toFixed(1);

            const weatherPressure = document.getElementById('weather-pressure');
            if (weatherPressure) weatherPressure.textContent = data.main.pressure;

            const weatherIcon = document.getElementById('weather-icon');
            if (weatherIcon) {
                weatherIcon.className = `weather-icon ${iconConfig.class}`;
                weatherIcon.innerHTML = `<i class="fas ${iconConfig.icon}"></i>`;
            }

            const updateTime = document.getElementById('update-time');
            if (updateTime) updateTime.textContent = new Date().toLocaleTimeString();
        } else {
            throw new Error(data.message || '无法获取天气数据');
        }
    } catch (error) {
        console.error('获取天气数据失败:', error);
        if (weatherStatus) weatherStatus.textContent = '获取天气数据失败';

        // 使用默认数据
        if (weatherTemp) weatherTemp.textContent = '25';
        if (weatherStatus) weatherStatus.textContent = '晴';

        const weatherHumidity = document.getElementById('weather-humidity');
        if (weatherHumidity) weatherHumidity.textContent = '45';

        const weatherWind = document.getElementById('weather-wind');
        if (weatherWind) weatherWind.textContent = '3.5';

        const weatherPressure = document.getElementById('weather-pressure');
        if (weatherPressure) weatherPressure.textContent = '1015';

        const weatherIcon = document.getElementById('weather-icon');
        if (weatherIcon) {
            weatherIcon.className = 'weather-icon sunny';
            weatherIcon.innerHTML = '<i class="fas fa-sun"></i>';
        }

        const updateTime = document.getElementById('update-time');
        if (updateTime) updateTime.textContent = new Date().toLocaleTimeString();
    } finally {
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

// 更新当前日期
function updateCurrentDate() {
    const now = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weatherDate = document.getElementById('weather-date');
    if (weatherDate) {
        weatherDate.textContent =
            `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
    }
}

// 时钟功能
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const clockTimeElement = document.getElementById('clock-time');
    const clockSecondsElement = document.getElementById('clock-seconds');
    const clockDateElement = document.getElementById('clock-date');

    if (clockTimeElement) {
        clockTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
        if (clockSecondsElement) clockSecondsElement.textContent = `${seconds}秒`;

        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        if (clockDateElement) {
            clockDateElement.textContent =
                `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
        }
    }
}


//抽签功能
document.addEventListener('DOMContentLoaded', function () {
    const fortuneBtn = document.getElementById('fortune-btn');
    const fortuneAnimation = document.getElementById('fortune-animation');
    const fortuneResult = document.getElementById('fortune-result');
    const fortuneTitle = document.getElementById('fortune-title');
    const fortuneContent = document.getElementById('fortune-content');
    const fortuneExplanation = document.getElementById('fortune-explanation');
    const fortuneClose = document.getElementById('fortune-close');

    if (fortuneBtn) {
        fortuneBtn.addEventListener('click', function () {
            fortuneBtn.style.display = 'none';
            if (fortuneAnimation) fortuneAnimation.style.display = 'flex';

            setTimeout(() => {
                if (fortuneAnimation) fortuneAnimation.style.display = 'none';
                const randomIndex = Math.floor(Math.random() * DrawLotsData.length);
                const fortune = DrawLotsData[randomIndex];

                if (fortuneTitle) {
                    fortuneTitle.textContent = fortune.title;
                    fortuneTitle.className = "fortune-title " + fortune.class;
                }
                if (fortuneContent) fortuneContent.textContent = fortune.content;
                if (fortuneExplanation) fortuneExplanation.textContent = fortune.explanation;

                if (fortuneResult) fortuneResult.style.display = 'block';
            }, 3000);
        });
    }

    if (fortuneClose && fortuneResult) {
        fortuneClose.addEventListener('click', function () {
            fortuneResult.style.display = 'none';
            if (fortuneBtn) fortuneBtn.style.display = 'block';
        });
    }
});

// AI助手功能
function clearAIChat() {
    aiConversation = [];
    const aiMessages = document.getElementById('ai-messages');
    if (aiMessages) {
        aiMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-header">
                    <div class="message-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <strong>Super Test AI助手</strong>
                </div>
                <div class="message-content">
                    您好！我是Super Test AI助手助手，我可以帮助您解决测试相关的问题。请告诉我您需要什么帮助？
                </div>
            </div>
        `;
    }
}

// 调用Super Test AI助手
async function getAIResponse(question) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://xcyy1234.github.io/Web_Tools_Test/',
                'X-Title': 'NewTestTool'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    {role: 'system', content: '你是一个专业的游戏测试助手，帮助测试人员解决各种技术问题'},
                    ...aiConversation.map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    {role: 'user', content: question}
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `API错误: ${response.status} - ${errorData.error?.message || '未知错误'}`;
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '未能获取回答';
    } catch (error) {
        console.error('API调用错误:', error);
        return '服务暂时不可用，请稍后再试';
    }
}

// 发送问题到Super Test AI助手
async function askDeepSeek() {
    const aiQuestion = document.getElementById('ai-question');
    if (!aiQuestion) return;

    const question = aiQuestion.value.trim();
    if (!question) {
        alert('请输入问题');
        return;
    }

    addAIMessage('user', question);
    aiConversation.push({sender: 'user', content: question});
    aiQuestion.value = '';
    showTypingIndicator();

    try {
        const response = await getAIResponse(question);
        addAIMessage('ai', response);
        aiConversation.push({sender: 'ai', content: response});
    } catch (error) {
        addAIMessage('ai', '请求AI服务时出错：' + error.message);
    } finally {
        hideTypingIndicator();
        scrollToBottom();
    }
}

function addAIMessage(sender, content) {
    const messagesContainer = document.getElementById('ai-messages');
    if (!messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    const iconColor = sender === 'user' ? 'var(--neon-purple)' : 'initial';
    messageElement.innerHTML = `
        <div class="message-header">
            <div class="message-icon" style="background: ${iconColor};">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <strong>${sender === 'user' ? '您' : 'super Test AI助手'}</strong>
        </div>
        <div class="message-content">${content}</div>
    `;

    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('ai-messages');
    if (!messagesContainer) return;

    messagesContainer.innerHTML += `
        <div class="ai-typing" id="typing-indicator">
            <div class="message-icon">
                <i class="fas fa-robot"></i>
            </div>
            <div>
                <strong>Super Test AI助手</strong> 正在思考...
                <div style="margin-top: 5px;">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    typingElement?.remove();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('ai-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// 汇率转换功能
function initCurrencyConverter() {
    const amountInput = document.getElementById('currency-amount');
    const sourceCurrency = document.getElementById('source-currency');
    const targetCurrencyOptions = document.querySelectorAll('.currency-option');
    const convertBtn = document.getElementById('convert-currency');
    const resultsContainer = document.getElementById('currency-results');
    const updateTime = document.getElementById('currency-update-time');

    if (updateTime) updateTime.textContent = new Date().toLocaleString('zh-CN');

    // 目标货币选择器
    const currencyOptions = document.querySelector('.currency-options');
    if (currencyOptions) {
        currencyOptions.addEventListener('click', function (e) {
            const option = e.target.closest('.currency-option');
            if (!option) return;

            targetCurrencyOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            convertCurrency();
        });
    }

    if (convertBtn) convertBtn.addEventListener('click', convertCurrency);
    if (amountInput) amountInput.addEventListener('input', convertCurrency);
    if (sourceCurrency) sourceCurrency.addEventListener('change', convertCurrency);

    function convertCurrency() {
        if (!resultsContainer) return;

        const amount = parseFloat(amountInput?.value) || 0;
        const source = sourceCurrency?.value || 'CNY';
        const activeTarget = document.querySelector('.currency-option.active');
        const target = activeTarget ? activeTarget.dataset.currency : 'CNY';

        resultsContainer.innerHTML = '';
        const targetCurrencies = [target];
        if (target !== 'CNY') targetCurrencies.push('CNY');
        if (target !== 'USD') targetCurrencies.push('USD');
        if (target !== 'EUR') targetCurrencies.push('EUR');

        targetCurrencies.forEach(currency => {
            const convertedAmount = calculateConversion(amount, source, currency);
            const currencyData = exchangeRates[currency];

            resultsContainer.innerHTML += `
                <div class="currency-result-item">
                    <div class="currency-flag-lg">${currencyData.flag}</div>
                    <div class="currency-value">${convertedAmount.toFixed(2)}</div>
                    <div class="currency-name">${currencyData.name} (${currency})</div>
                </div>
            `;
        });

        if (updateTime) updateTime.textContent = new Date().toLocaleString('zh-CN');
    }

    function calculateConversion(amount, from, to) {
        const cnyAmount = amount / exchangeRates[from].rate;
        return cnyAmount * exchangeRates[to].rate;
    }
}

// COIN金币计算器功能
function calculateCoin() {
    const usdBase = parseFloat(document.getElementById('usd-base')?.value) || 0;
    const vipInflation = parseFloat(document.getElementById('vip-inflation')?.value) || 0;
    const levelInflation = parseFloat(document.getElementById('level-inflation')?.value) || 0;
    const petInflation = parseFloat(document.getElementById('pet-inflation')?.value) || 0;
    const coinFactor = parseFloat(document.getElementById('coin-factor')?.value) || 1;
    const otherParam = parseFloat(document.getElementById('other-param')?.value) || 0;

    const operators = {
        vip: document.getElementById('vip-operator')?.value || '+',
        level: document.getElementById('level-operator')?.value || '+',
        pet: document.getElementById('pet-operator')?.value || '+',
        factor: document.getElementById('factor-operator')?.value || '*',
        other: document.getElementById('other-operator')?.value || '+'
    };

    let result = usdBase;
    let formula = `(${usdBase})`;

    // 依次应用各个操作
    const operations = [
        {value: vipInflation, operator: operators.vip, name: 'vipInflation'},
        {value: levelInflation, operator: operators.level, name: 'levelInflation'},
        {value: petInflation, operator: operators.pet, name: 'petInflation'},
        {value: coinFactor, operator: operators.factor, name: 'coinFactor'},
        {value: otherParam, operator: operators.other, name: 'otherParam'}
    ];

    operations.forEach(op => {
        result = applyOperation(result, op.operator, op.value);
        formula += ` ${getSymbol(op.operator)} ${op.value}`;
    });

    const coinValue = document.querySelector('.coin-value');
    if (coinValue) coinValue.textContent = result.toFixed(2);

    const coinFormula = document.querySelector('.coin-formula');
    if (coinFormula) coinFormula.textContent = `计算公式: ${formula} = ${result.toFixed(2)}`;
}

// 应用运算
function applyOperation(value, operator, operand) {
    switch (operator) {
        case '+': return value + operand;
        case '-': return value - operand;
        case '*': return value * operand;
        case '/': return operand !== 0 ? value / operand : value;
        default: return value;
    }
}

// 获取操作符符号
function getSymbol(operator) {
    const symbols = {'+': '+', '-': '-', '*': '×', '/': '÷'};
    return symbols[operator] || '';
}


// 活动查询功能
function initActivitySearch() {
    const searchInput = document.getElementById('activity-search');
    const resultsContainer = document.getElementById('activity-results');
    const detailContainer = document.getElementById('activity-detail');

    if (!searchInput || !resultsContainer || !detailContainer) return;

    searchInput.addEventListener('input', function () {
        const keyword = this.value.trim();
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = keyword ? 'block' : 'none';
        detailContainer.style.display = 'none';

        if (!keyword) return;

        const matchedActivities = activityData.filter(activity =>
            activity.description.includes(keyword) ||
            activity.activity_name.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchedActivities.length > 0) {
            matchedActivities.forEach(activity => {
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <div class="activity-name">${activity.activity_name}</div>
                    <div class="activity-description">${activity.description}</div>
                `;

                item.addEventListener('click', () => {
                    showActivityDetail(activity);
                    resultsContainer.style.display = 'none';
                });

                resultsContainer.appendChild(item);
            });
        } else {
            resultsContainer.innerHTML = `
                <div class="activity-item">
                    <div style="text-align: center; padding: 15px; color: #a0aec0;">
                        未找到匹配的活动
                    </div>
                </div>
            `;
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.activity-search-container')) {
            resultsContainer.style.display = 'none';
        }
    });
}

// 显示活动详情
function showActivityDetail(activity) {
    const detailContainer = document.getElementById('activity-detail');
    if (!detailContainer) return;

    document.getElementById('detail-name').textContent = activity.activity_name;
    document.getElementById('detail-description').textContent = activity.description;
    detailContainer.style.display = 'block';
}

// 模型查询功能
function initModelSearch() {
    const searchInput = document.getElementById('model-search');
    const resultsContainer = document.getElementById('model-results');
    const detailContainer = document.getElementById('model-detail');

    if (!searchInput || !resultsContainer || !detailContainer) return;

    searchInput.addEventListener('input', function () {
        const keyword = this.value.trim();
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = keyword ? 'block' : 'none';
        detailContainer.style.display = 'none';

        if (!keyword) return;

        const matchedModels = ModelData.filter(model =>
            model.model_key.includes(keyword) ||
            model.model_value.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchedModels.length > 0) {
            matchedModels.forEach(model => {
                const item = document.createElement('div');
                item.className = 'model-item';
                item.innerHTML = `
                    <div class="model-name">${model.model_value}</div>
                    <div class="model-description">${model.model_key}</div>
                `;

                item.addEventListener('click', () => {
                    showModelDetail(model);
                    resultsContainer.style.display = 'none';
                });

                resultsContainer.appendChild(item);
            });
        } else {
            resultsContainer.innerHTML = `
                <div class="model-item">
                    <div style="text-align: center; padding: 15px; color: #a0aec0;">
                        未找到匹配的模型
                    </div>
                </div>
            `;
        }
    });

    document.addEventListener('click', function (e) {
        if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
            resultsContainer.style.display = 'none';
        }
    });
}

function showModelDetail(model) {
    const detailContainer = document.getElementById('model-detail');
    if (!detailContainer) return;

    document.getElementById('model-name').textContent = model.model_key;
    document.getElementById('model-description').textContent = model.model_value;
    detailContainer.style.display = 'block';
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    await init();

    // 安全地更新UI
    setTimeout(() => {
        updateWeather();
        updateCurrentDate();
        updateClock();
    }, 100);
});
//初始化DOM
document.addEventListener("DOMContentLoaded", function() {
    // 添加事件监听器
    const btn = document.querySelector('.btn-gold');
    if(btn) btn.addEventListener('click', calculateCoin);
});
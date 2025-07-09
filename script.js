// 开发者工具检测函数（新增）
function detectDevTools() {
    const element = new Image();

    Object.defineProperty(element, 'id',{
        get: () => {
            // 当开发者工具打开时触发
            document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:100px;">禁止检查源代码</h1>';
            // 阻止后续操作
            window.stop();
        }
    });

    // 触发检测
    console.log(element);
}

// 天气数据
const weatherData = [
    { city: "北京", temp: 28, condition: "sunny", icon: "fa-sun" },
];

// AI助手相关变量
let aiConversation = [];

// DeepSeek API密钥
const OPENROUTER_API_KEY = "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";

//活动查询获取数据
import { activityData } from './Activity.js';

//读取模块数据
import { ModelData } from './model.js';

//读取抽签数据
import { DrawLotsData } from './Drawlots.js';
// 汇率数据
const exchangeRates = {
    CNY: { name: "人民币", rate: 1, flag: "🇨🇳" },
    USD: { name: "美元", rate: 7.27, flag: "🇺🇸" },
    EUR: { name: "欧元", rate: 7.81, flag: "🇪🇺" },
    JPY: { name: "日元", rate: 0.049, flag: "🇯🇵" },
    GBP: { name: "英镑", rate: 8.91, flag: "🇬🇧" },
    HKD: { name: "港币", rate: 0.93, flag: "🇭🇰" },
    KRW: { name: "韩元", rate: 0.0055, flag: "🇰🇷" },
    AUD: { name: "澳元", rate: 4.71, flag: "🇦🇺" },
    CAD: { name: "加元", rate: 5.36, flag: "🇨🇦" }
};

// 初始化函数
function init() {
    //初始化开发者拦截函数
     detectDevTools();


    // 初始化滑块值显示
    document.getElementById('latency').addEventListener('input', function() {
        document.getElementById('latency-value').textContent = this.value + 'ms';
    });

    document.getElementById('packet-loss').addEventListener('input', function() {
        document.getElementById('loss-value').textContent = this.value + '%';
    });

    // 网络预设选择
    const networkItems = document.querySelectorAll('.network-item');
    networkItems.forEach(item => {
        item.addEventListener('click', function() {
            networkItems.forEach(i => i.classList.remove('network-selected'));
            this.classList.add('network-selected');

            if(this.id === 'network-good') {
                document.getElementById('latency').value = 50;
                document.getElementById('packet-loss').value = 0;
            } else if(this.id === 'network-medium') {
                document.getElementById('latency').value = 200;
                document.getElementById('packet-loss').value = 8;
            } else if(this.id === 'network-poor') {
                document.getElementById('latency').value = 800;
                document.getElementById('packet-loss').value = 30;
            }

            document.getElementById('latency-value').textContent =
                document.getElementById('latency').value + 'ms';
            document.getElementById('loss-value').textContent =
                document.getElementById('packet-loss').value + '%';
        });
    });

    // 导航功能
    const navItems = document.querySelectorAll('.tool-nav-item');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool');

            // 更新活动状态
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // 隐藏所有工具内容
            document.querySelectorAll('.tool-content').forEach(tool => {
                tool.classList.remove('active');
            });

            // 显示选中的工具内容
            document.getElementById(toolId).classList.add('active');

            // 在移动端关闭菜单
            if (window.innerWidth < 768) {
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });

    // 菜单切换
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // 点击遮罩层关闭菜单
    overlay.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        this.classList.remove('active');
    });

    // 单位选择器
    const unitOptions = document.querySelectorAll('.unit-option');
    unitOptions.forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.unit-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // 时间戳单位选择器
    const timestampUnitOptions = document.querySelectorAll('.timestamp-unit-option');
    timestampUnitOptions.forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.timestamp-unit-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // 事件监听
    document.getElementById('calculate-remainder').addEventListener('click', calculateRemainder);
    document.getElementById('network-simulator').addEventListener('click', initNetworkSimulator);
    document.getElementById('translate-screenshot').addEventListener('click', translateScreenshot);
    document.getElementById('convert-to-date').addEventListener('click', convertTimestampToDate);
    document.getElementById('convert-to-days').addEventListener('click', convertTimestampToDays);
    document.getElementById('convert-to-timestamp').addEventListener('click', convertDateToTimestamp);
    document.getElementById('convert-cd').addEventListener('click', convertCD);
    document.getElementById('send-ai-question').addEventListener('click', askDeepSeek);
    document.getElementById('clear-ai-chat').addEventListener('click', clearAIChat);
    document.getElementById('zentao-link-btn').addEventListener('click', () => window.open('http://192.168.1.52/zentao/bug-browse-1--assigntome.html', '_blank'));
    document.getElementById('package-download-btn-ct').addEventListener('click', () => window.open('http://192.168.1.150/down/beta/', '_blank'));
    document.getElementById('package-download-btn-jms').addEventListener('click', () => window.open('http://192.168.1.119/download/', '_blank'));
    document.getElementById('bugly-link-btn').addEventListener('click', () => window.open('https://bugly.qq.com/v2/', '_blank'));
    document.getElementById('appstore-link-btn').addEventListener('click', () => window.open('https://appid.naitu.cc/share/nice', '_blank'));
    document.getElementById('iphone-link-btn').addEventListener('click', () => window.open('https://yunduanxin.net/', '_blank'));


    // AI建议
    document.querySelectorAll('.ai-suggestion').forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            document.getElementById('ai-question').value = question;
        });
    });

    // CD示例
    document.querySelectorAll('.cd-example').forEach(example => {
        example.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const unit = this.getAttribute('data-unit');
            document.getElementById('cd-value').value = value;

            document.querySelectorAll('.unit-option').forEach(option => {
                option.classList.remove('active');
                if(option.getAttribute('data-unit') === unit) {
                    option.classList.add('active');
                }
            });
            convertCD();
        });
    });

    // 默认选择良好网络
    document.getElementById('network-status').click();

    // 设置当前时间作为默认值
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('datetime-input').value = `${year}-${month}-${day}T${hours}:${minutes}`;

    // 设置当前时间戳
    document.getElementById('timestamp-input').value = Math.floor(now.getTime() / 1000);

    // 更新当前日期
    updateCurrentDate();
    updateWeather();

    // 初始化时钟
    updateClock();
    setInterval(updateClock, 1000);

    // 初始化截屏功能
    initScreenshot();

    // 初始化汇率转换工具
    initCurrencyConverter();

    // 初始化COIN金币计算器
    calculateCoin();

    // 初始化活动查询功能
    initActivitySearch();

    //初始化模块数据查询功能
    initModelSearch();

    //初始化弱网功能
    initNetworkSimulator();

    // 为常见问题部分添加点击事件
    document.querySelectorAll('[data-tool^="faq"]').forEach(item => {
        item.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool');

            // 更新活动状态
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // 显示选中的工具内容
            document.querySelectorAll('.tool-content').forEach(tool => {
                tool.classList.remove('active');
            });
            document.getElementById(toolId).classList.add('active');
        });
    });
}

// 计算余数
function calculateRemainder() {
    const dividend = parseInt(document.getElementById('dividend').value) || 0;
    const divisor = parseInt(document.getElementById('divisor').value) || 1;

    if(divisor === 0) {
        alert('除数不能为零！');
        return;
    }

    const remainder = dividend % divisor;
    const quotient = Math.floor(dividend / divisor);

    const resultBox = document.getElementById('remainder-result');
    resultBox.innerHTML = `
        <div style="margin-bottom: 10px;">${dividend} ÷ ${divisor} = ${quotient} ... ${remainder}</div>
        <div>计算结果: <strong>${remainder}</strong></div>
        <div style="margin-top: 10px; color: #a0aec0;">
            ${dividend} 除以 ${divisor} 的余数是 ${remainder}
        </div>
    `;
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
    latencyValue.textContent = latencySlider.value + 'ms';
    uploadLatencyValue.textContent = uploadLatencySlider.value + 'ms';
    downloadLatencyValue.textContent = downloadLatencySlider.value + 'ms';
    lossValue.textContent = packetLossSlider.value + '%';
    randomLossValue.textContent = randomPacketLossSlider.value + '%';

    // 更新图表
    function updateGraph() {
        // 更新条形图
        const totalLatency = parseInt(latencySlider.value) +
            parseInt(uploadLatencySlider.value) +
            parseInt(downloadLatencySlider.value);
        const totalLoss = parseInt(packetLossSlider.value) +
            parseInt(randomPacketLossSlider.value);

        // 更新条形图宽度
        latencyBar.style.width = Math.min(100, totalLatency / 20) + '%';
        lossBar.style.width = Math.min(100, totalLoss * 2) + '%';

        // 更新条形图颜色
        if (totalLatency < 100) {
            latencyBar.style.background = 'var(--network-good)';
        } else if (totalLatency < 500) {
            latencyBar.style.background = 'var(--network-medium)';
        } else if (totalLatency < 1000) {
            latencyBar.style.background = 'var(--network-poor)';
        } else {
            latencyBar.style.background = 'var(--network-severe)';
        }

        if (totalLoss < 5) {
            lossBar.style.background = 'var(--network-good)';
        } else if (totalLoss < 15) {
            lossBar.style.background = 'var(--network-medium)';
        } else if (totalLoss < 25) {
            lossBar.style.background = 'var(--network-poor)';
        } else {
            lossBar.style.background = 'var(--network-severe)';
        }

        // 更新折线图数据
        latencyHistory.push(totalLatency);
        if (latencyHistory.length > maxHistoryItems) {
            latencyHistory.shift();
        }

        // 清空图表
        latencyGraph.innerHTML = '';

        // 计算最大值用于缩放
        const maxValue = Math.max(...latencyHistory, 100);

        // 绘制折线
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

    // 滑块事件监听
    latencySlider.addEventListener('input', function() {
        latencyValue.textContent = this.value + 'ms';
        updateNetworkStatus();
        updateGraph();
    });

    uploadLatencySlider.addEventListener('input', function() {
        uploadLatencyValue.textContent = this.value + 'ms';
        updateNetworkStatus();
        updateGraph();
    });

    downloadLatencySlider.addEventListener('input', function() {
        downloadLatencyValue.textContent = this.value + 'ms';
        updateNetworkStatus();
        updateGraph();
    });

    packetLossSlider.addEventListener('input', function() {
        lossValue.textContent = this.value + '%';
        updateNetworkStatus();
        updateGraph();
    });

    randomPacketLossSlider.addEventListener('input', function() {
        randomLossValue.textContent = this.value + '%';
        updateNetworkStatus();
        updateGraph();
    });

    // 更新网络状态显示
    function updateNetworkStatus() {
        const latency = parseInt(latencySlider.value);
        const uploadLatency = parseInt(uploadLatencySlider.value);
        const downloadLatency = parseInt(downloadLatencySlider.value);
        const packetLoss = parseInt(packetLossSlider.value);
        const randomLoss = parseInt(randomPacketLossSlider.value);

        const totalLatency = latency + uploadLatency + downloadLatency;
        const totalLoss = packetLoss + randomLoss;

        // 更新状态标签
        networkStats.textContent = `延迟: ${totalLatency}ms | 丢包: ${totalLoss}%`;

        // 更新网络状态文字
        if (totalLatency === 0 && totalLoss === 0) {
            networkStatus.textContent = "良好";
            networkStatus.style.color = "var(--network-good)";
        } else if (totalLatency < 100 && totalLoss < 5) {
            networkStatus.textContent = "一般";
            networkStatus.style.color = "var(--network-medium)";
        } else if (totalLatency < 500 && totalLoss < 20) {
            networkStatus.textContent = "较差";
            networkStatus.style.color = "var(--network-poor)";
        } else {
            networkStatus.textContent = "极差";
            networkStatus.style.color = "var(--network-severe)";
        }
    }

    // 应用网络设置
    applyBtn.addEventListener('click', function() {
        const latency = parseInt(latencySlider.value);
        const uploadLatency = parseInt(uploadLatencySlider.value);
        const downloadLatency = parseInt(downloadLatencySlider.value);
        const packetLoss = parseInt(packetLossSlider.value);
        const randomLoss = parseInt(randomPacketLossSlider.value);

        // 计算总延迟和丢包率
        const totalLatency = latency + uploadLatency + downloadLatency;
        const totalLoss = packetLoss + randomLoss;

        // 模拟应用网络设置
        applyNetworkSettings(latency, uploadLatency, downloadLatency, packetLoss, randomLoss);

        // 显示网络模拟指示器
        networkIndicator.style.display = 'block';

        // 更新结果框
        const now = new Date();
        networkResult.innerHTML = `
                <div><strong>网络设置已应用 (${now.toLocaleTimeString()}):</strong></div>
                <div>基本延迟: ${latency}ms</div>
                <div>上行延时: ${uploadLatency}ms</div>
                <div>下行延时: ${downloadLatency}ms</div>
                <div>丢包率: ${packetLoss}%</div>
                <div>随机丢包率: ${randomLoss}%</div>
                <div style="margin-top: 10px; color: var(--neon-blue);">
                    <i class="fas fa-info-circle"></i> 总延迟: ${totalLatency}ms | 总丢包率: ${totalLoss}%
                </div>
            `;

        // 开始模拟网络请求
        simulateNetworkRequests(totalLatency, totalLoss);
    });

    // 恢复网络状态
    resetBtn.addEventListener('click', function() {
        // 重置滑块
        latencySlider.value = 0;
        uploadLatencySlider.value = 0;
        downloadLatencySlider.value = 0;
        packetLossSlider.value = 0;
        randomPacketLossSlider.value = 0;

        // 更新显示
        latencyValue.textContent = '0ms';
        uploadLatencyValue.textContent = '0ms';
        downloadLatencyValue.textContent = '0ms';
        lossValue.textContent = '0%';
        randomLossValue.textContent = '0%';

        // 恢复网络设置
        resetNetworkSettings();

        // 隐藏网络模拟指示器
        networkIndicator.style.display = 'none';

        // 更新结果框
        const now = new Date();
        networkResult.innerHTML = `
                <div><strong>网络设置已恢复 (${now.toLocaleTimeString()}):</strong></div>
                <div style="color: var(--network-good); margin-top: 10px;">
                    <i class="fas fa-check-circle"></i> 网络状态已恢复正常
                </div>
            `;

        // 更新网络状态
        updateNetworkStatus();
        updateGraph();
    });

    // 预设场景点击事件
    presetItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他预设的active状态
            presetItems.forEach(i => i.classList.remove('active'));
            // 添加当前预设的active状态
            this.classList.add('active');

            // 根据预设设置值
            const preset = this.getAttribute('data-preset');
            applyPreset(preset);
        });
    });

    // 应用预设
    function applyPreset(preset) {
        let latency = 0;
        let uploadLatency = 0;
        let downloadLatency = 0;
        let packetLoss = 0;
        let randomLoss = 0;

        switch(preset) {
            case 'elevator':
                latency = 500;
                uploadLatency = 300;
                downloadLatency = 300;
                packetLoss = 10;
                randomLoss = 5;
                break;
            case 'subway':
                latency = 300;
                uploadLatency = 200;
                downloadLatency = 200;
                packetLoss = 8;
                randomLoss = 4;
                break;
            case 'tunnel':
                latency = 1000;
                uploadLatency = 500;
                downloadLatency = 500;
                packetLoss = 15;
                randomLoss = 10;
                break;
            case 'rural':
                latency = 800;
                uploadLatency = 400;
                downloadLatency = 400;
                packetLoss = 12;
                randomLoss = 8;
                break;
            case 'stadium':
                latency = 200;
                uploadLatency = 100;
                downloadLatency = 100;
                packetLoss = 10;
                randomLoss = 5;
                break;
            case 'conference':
                latency = 150;
                uploadLatency = 80;
                downloadLatency = 80;
                packetLoss = 8;
                randomLoss = 4;
                break;
        }

        // 设置滑块值
        latencySlider.value = latency;
        uploadLatencySlider.value = uploadLatency;
        downloadLatencySlider.value = downloadLatency;
        packetLossSlider.value = packetLoss;
        randomPacketLossSlider.value = randomLoss;

        // 更新显示
        latencyValue.textContent = latency + 'ms';
        uploadLatencyValue.textContent = uploadLatency + 'ms';
        downloadLatencyValue.textContent = downloadLatency + 'ms';
        lossValue.textContent = packetLoss + '%';
        randomLossValue.textContent = randomLoss + '%';

        // 更新网络状态
        updateNetworkStatus();
        updateGraph();

        // 显示预设信息
        networkResult.innerHTML = `
                <div><strong>已应用${document.querySelector(`[data-preset="${preset}"] .preset-name`).textContent} 预设</strong></div>
                <div>点击"应用网络设置"按钮启用此配置</div>
            `;
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
        // 清除之前的模拟
        clearInterval(window.simulationInterval);

        // 开始新的模拟
        window.simulationInterval = setInterval(() => {
            // 随机决定是否丢包
            const isPacketLoss = Math.random() * 100 < lossRate;

            const now = new Date();
            const timeStr = now.toLocaleTimeString();

            if (isPacketLoss) {
                // 模拟丢包
                networkResult.innerHTML += `
                        <div style="color: var(--danger); margin-top: 5px;">
                            <i class="fas fa-times-circle"></i> ${timeStr}: 网络请求失败 (丢包)
                        </div>
                    `;
            } else {
                // 模拟成功请求
                networkResult.innerHTML += `
                        <div style="color: var(--success); margin-top: 5px;">
                            <i class="fas fa-check-circle"></i> ${timeStr}: 请求成功 (延迟: ${latency}ms)
                        </div>
                    `;
            }

            // 滚动到底部
            networkResult.scrollTop = networkResult.scrollHeight;

            // 限制最多显示20条记录
            const entries = networkResult.querySelectorAll('div');
            if (entries.length > 20) {
                for (let i = 0; i < entries.length - 20; i++) {
                    entries[i].remove();
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
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker 注册成功: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker 注册失败: ', err);
        });
    });
}

// 翻译截图
function translateScreenshot() {
    const preview = document.getElementById('screenshot-preview');
    if (!preview.src) {
        alert('请先上传截图或捕获屏幕');
        return;
    }

    const language = document.getElementById('target-language').value;
    const languages = {
        en: '英语',
        ja: '日语',
        ko: '韩语',
        fr: '法语',
        de: '德语',
        es: '西班牙语'
    };

    const resultBox = document.getElementById('translation-result');
    resultBox.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>翻译结果 (${languages[language]}):</strong>
        </div>
        <div style="line-height: 1.6;">
            <p>"功能暂时无法使用！"</p>
        </div>
        <div style="margin-top: 15px; color: #a0aec0; font-size: 0.9rem;">
            翻译完成时间: ${new Date().toLocaleTimeString()}
        </div>
    `;
}
// 时间戳转换
function convertTimestampToDate() {
    const timestamp = document.getElementById('timestamp-input').value;
    if (!timestamp) {
        alert('请输入时间戳');
        return;
    }

    // 获取选中的时间戳单位
    const unit = document.querySelector('.timestamp-unit-option.active').getAttribute('data-unit');
    let milliseconds;

    if (unit === 'seconds') {
        milliseconds = timestamp * 1000;
    } else {
        milliseconds = parseInt(timestamp);
    }

    const date = new Date(milliseconds);
    const resultBox = document.getElementById('timestamp-result');

    // 隐藏天数结果，显示时间戳结果
    document.getElementById('days-result').style.display = 'none';
    resultBox.style.display = 'block';

    // 计算时区差
    const localOffset = -date.getTimezoneOffset(); // 本地与UTC的分钟差（东区为正）
    const utcMinus8Offset = -480; // 西八区固定偏移（UTC-8）
    const hourDiff = (localOffset - utcMinus8Offset) / 60; // 转换为小时差

    // 格式化时间差描述
    let diffDescription;
    if (hourDiff > 0) {
        diffDescription = `${hourDiff} 小时`;
    } else if (hourDiff < 0) {
        diffDescription = `${-hourDiff} 小时`;
    } else {
        diffDescription = "本地时间与西八区相同";
    }

    // 美国时区转换
    const options = {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    // 西八区时间计算
    const utcMinus8Date = new Date(milliseconds - 8 * 3600000);
    const utcMinus8Time = utcMinus8Date.toISOString().replace('T', ' ').substring(0, 19) + " (UTC-8)";

    const etTime = date.toLocaleString('zh-CN', { ...options, timeZone: 'America/New_York' });


    resultBox.innerHTML = `
        <div><strong>转换结果 (${unit === 'seconds' ? '秒' : '毫秒'} 转日期):</strong></div>
        <div>北京时间: ${date.toLocaleString()}</div>
        <div>美国东部时间(ET): ${etTime}</div>
        <div>西八区时间(UTC-8): ${utcMinus8Time}</div>
        <div>北京与西八区时差: ${diffDescription}</div>
    `;
}

// 时间戳转天数功能
function convertTimestampToDays() {
    const timestamp = document.getElementById('timestamp-input').value;
    if (!timestamp) {
        alert('请输入时间戳');
        return;
    }

    // 获取选中的时间戳单位
    const unit = document.querySelector('.timestamp-unit-option.active').getAttribute('data-unit');
    let seconds;

    if (unit === 'seconds') {
        seconds = timestamp;
    } else {
        seconds = timestamp / 1000;
    }

    const days = seconds / 86400;
    const daysBox = document.getElementById('days-result');
    const resultBox = document.getElementById('timestamp-result');

    // 隐藏时间戳结果，显示天数结果
    resultBox.style.display = 'none';
    daysBox.style.display = 'block';

    document.getElementById('days-value').textContent = days.toFixed(6);
}

function convertDateToTimestamp() {
    const dateString = document.getElementById('datetime-input').value;
    if (!dateString) {
        alert('请选择日期时间');
        return;
    }

    const date = new Date(dateString);
    const timestampSeconds = Math.floor(date.getTime() / 1000);
    const timestampMilliseconds = date.getTime();

    const resultBox = document.getElementById('timestamp-result');

    // 隐藏天数结果，显示时间戳结果
    document.getElementById('days-result').style.display = 'none';
    resultBox.style.display = 'block';

    resultBox.innerHTML = `
        <div><strong>转换结果:</strong></div>
        <div>秒时间戳: ${timestampSeconds}</div>
        <div>毫秒时间戳: ${timestampMilliseconds}</div>
    `;
}

// CD转换功能
function convertCD() {
    const value = parseFloat(document.getElementById('cd-value').value) || 0;
    const unit = document.querySelector('.unit-option.active').getAttribute('data-unit');

    if (value < 0) {
        alert("请输入有效的数值");
        return;
    }

    // 首先转换为毫秒
    let milliseconds = 0;
    switch(unit) {
        case 'milliseconds':
            milliseconds = value;
            break;
        case 'seconds':
            milliseconds = value * 1000;
            break;
        case 'minutes':
            milliseconds = value * 60 * 1000;
            break;
        case 'hours':
            milliseconds = value * 60 * 60 * 1000;
            break;
        case 'days':
            milliseconds = value * 24 * 60 * 60 * 1000;
            break;
    }

    // 计算各个时间单位
    const secondsTotal = milliseconds / 1000;
    const days = Math.floor(secondsTotal / 86400);
    const hours = Math.floor((secondsTotal % 86400) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = Math.floor(secondsTotal % 60);
    const remainingMilliseconds = Math.floor(milliseconds % 1000);

    // 更新结果框
    const resultBox = document.getElementById('cd-result');
    resultBox.innerHTML = `
        <div><strong>转换结果:</strong></div>
        <div>${value} ${getUnitName(unit)} = </div>
        <div>${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒 ${remainingMilliseconds}毫秒</div>
        <div style="margin-top: 10px; color: #a0aec0;">
            总计: ${secondsTotal.toFixed(3)} 秒 (${milliseconds} 毫秒)
        </div>
    `;

    // 更新单元显示
    document.querySelectorAll('.cd-unit .cd-value')[0].textContent = days;
    document.querySelectorAll('.cd-unit .cd-value')[1].textContent = hours;
    document.querySelectorAll('.cd-unit .cd-value')[2].textContent = minutes;
    document.querySelectorAll('.cd-unit .cd-value')[3].textContent = seconds;
    document.querySelectorAll('.cd-unit .cd-value')[4].textContent = remainingMilliseconds;
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

// 更新当前日期
function updateCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];

    const dateStr = `${year}年${month}月${day}日 ${weekday}`;
    document.getElementById('weather-date').textContent = dateStr;
}

// 更新天气信息
function updateWeather() {
    const now = new Date();
    const weatherIndex = Math.floor(Math.random() * weatherData.length);
    const weather = weatherData[weatherIndex];

    document.getElementById('weather-temp').textContent = `${weather.temp}°C`;
    document.getElementById('weather-location').textContent = weather.city;

    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.className = `weather-icon ${weather.condition}`;
    weatherIcon.innerHTML = `<i class="fas ${weather.icon}"></i>`;
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

    if (clockTimeElement && clockSecondsElement && clockDateElement) {
        clockTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
        clockSecondsElement.textContent = `${seconds}秒`;

        // 更新日期
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[now.getDay()];
        clockDateElement.textContent = `${year}年${month}月${day}日 ${weekday}`;
    }
}

// 截屏功能
function initScreenshot() {
    const screenshotArea = document.getElementById('screenshot-area');
    const fileInput = document.getElementById('screenshot-upload');
    const preview = document.getElementById('screenshot-preview');

    // 点击区域触发文件选择
    screenshotArea.addEventListener('click', function() {
        // PC端尝试使用屏幕捕获API
        if(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
            captureScreen();
        } else {
            // 移动端或浏览器不支持时使用文件上传
            fileInput.click();
        }
    });

    // 文件上传处理
    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();

            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
            }

            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

// 屏幕捕获功能
async function captureScreen() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();

            // 创建canvas捕获视频帧
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            setTimeout(() => {
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // 停止所有轨道
                stream.getTracks().forEach(track => track.stop());

                // 显示预览
                const preview = document.getElementById('screenshot-preview');
                preview.src = canvas.toDataURL('image/png');
                preview.style.display = 'block';

            }, 500);
        };
    } catch (err) {
        console.error("屏幕捕获失败:", err);
        // 捕获失败时使用文件上传
        document.getElementById('screenshot-upload').click();
    }
}

//抽签功能
document.addEventListener('DOMContentLoaded', function() {
    const fortuneBtn = document.getElementById('fortune-btn');
    const fortuneAnimation = document.getElementById('fortune-animation');
    const fortuneResult = document.getElementById('fortune-result');
    const fortuneTitle = document.getElementById('fortune-title');
    const fortuneContent = document.getElementById('fortune-content');
    const fortuneExplanation = document.getElementById('fortune-explanation');
    const fortuneClose = document.getElementById('fortune-close');

    // 抽签按钮点击事件
    fortuneBtn.addEventListener('click', function() {
        fortuneBtn.style.display = 'none';
        fortuneAnimation.style.display = 'flex';

        setTimeout(function() {
            fortuneAnimation.style.display = 'none';

            // 使用外部数据 DrawLotsData
            const randomIndex = Math.floor(Math.random() * DrawLotsData.length);
            const fortune = DrawLotsData[randomIndex];

            fortuneTitle.textContent = fortune.title;
            fortuneTitle.className = "fortune-title " + fortune.class;
            fortuneContent.textContent = fortune.content;
            fortuneExplanation.textContent = fortune.explanation;

            fortuneResult.style.display = 'block';
        }, 3000);
    });

    // 关闭按钮事件保持不变
    fortuneClose.addEventListener('click', function() {
        fortuneResult.style.display = 'none';
        fortuneBtn.style.display = 'block';
    });
});

// AI助手功能
function clearAIChat() {
    aiConversation = [];
    document.getElementById('ai-messages').innerHTML = `
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

// 调用Super Test AI助手
async function getAIResponse(question) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://xcyy1234.github.io/Web_Tools_Test/',
                'X-Title': 'NewTestTool' // 使用纯英文标题
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct:free', // 改用免费模型
                messages: [
                    { role: 'system', content: '你是一个专业的游戏测试助手，帮助测试人员解决各种技术问题' },
                    ...aiConversation.map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    { role: 'user', content: question }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        // 检查HTTP状态
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
    const question = document.getElementById('ai-question').value.trim();
    if (!question) {
        alert('请输入问题');
        return;
    }

    // 添加用户消息
    addAIMessage('user', question);
    aiConversation.push({ sender: 'user', content: question });

    // 清空输入框
    document.getElementById('ai-question').value = '';

    // 显示正在输入状态
    showTypingIndicator();

    try {
        // 获取AI回复
        const response = await getAIResponse(question);
        // 添加AI回复
        addAIMessage('ai', response);
        // 添加到对话历史
        aiConversation.push({ sender: 'ai', content: response });
    } catch (error) {
        addAIMessage('ai', '请求AI服务时出错：' + error.message);
    } finally {
        // 移除输入状态
        hideTypingIndicator();
    }

    // 滚动到底部
    scrollToBottom();
}

function addAIMessage(sender, content) {
    const messagesContainer = document.getElementById('ai-messages');

    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    // 创建消息头部
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';

    // 根据发送者设置图标和名称
    if (sender === 'user') {
        messageHeader.innerHTML = `
            <div class="message-icon" style="background: var(--neon-purple);">
                <i class="fas fa-user"></i>
            </div>
            <strong>您</strong>
        `;
    } else {
        messageHeader.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-robot"></i>
            </div>
            <strong>super Test AI助手</strong>
        `;
    }

    // 创建消息内容
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    // 组装消息
    messageElement.appendChild(messageHeader);
    messageElement.appendChild(messageContent);

    // 添加到消息容器
    messagesContainer.appendChild(messageElement);

    // 滚动到底部
    scrollToBottom();
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('ai-messages');

    const typingElement = document.createElement('div');
    typingElement.className = 'ai-typing';
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
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
    `;

    messagesContainer.appendChild(typingElement);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('ai-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 汇率转换功能
function initCurrencyConverter() {
    // 获取DOM元素
    const amountInput = document.getElementById('currency-amount');
    const sourceCurrency = document.getElementById('source-currency');
    const targetCurrencyOptions = document.querySelectorAll('.currency-option');
    const convertBtn = document.getElementById('convert-currency');
    const resultsContainer = document.getElementById('currency-results');
    const updateTime = document.getElementById('currency-update-time');

    // 设置更新时间
    updateTime.textContent = new Date().toLocaleString('zh-CN');

    // 目标货币选择器
    targetCurrencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有active类
            targetCurrencyOptions.forEach(opt => opt.classList.remove('active'));
            // 添加active类到当前选项
            this.classList.add('active');
            // 触发转换
            convertCurrency();
        });
    });

    // 转换按钮事件
    convertBtn.addEventListener('click', convertCurrency);

    // 初始转换
    convertCurrency();

    // 输入框和下拉菜单变化时自动转换
    amountInput.addEventListener('input', convertCurrency);
    sourceCurrency.addEventListener('change', convertCurrency);

    function convertCurrency() {
        const amount = parseFloat(amountInput.value) || 0;
        const source = sourceCurrency.value;
        const activeTarget = document.querySelector('.currency-option.active');
        const target = activeTarget ? activeTarget.dataset.currency : 'CNY';

        // 清空结果容器
        resultsContainer.innerHTML = '';

        // 获取选中的目标货币
        const targetCurrencies = [target];

        // 添加其他主要货币作为参考
        if (target !== 'CNY') targetCurrencies.push('CNY');
        if (target !== 'USD') targetCurrencies.push('USD');
        if (target !== 'EUR') targetCurrencies.push('EUR');

        // 计算并显示结果
        targetCurrencies.forEach(currency => {
            const convertedAmount = calculateConversion(amount, source, currency);
            const currencyData = exchangeRates[currency];

            const resultItem = document.createElement('div');
            resultItem.className = 'currency-result-item';
            resultItem.innerHTML = `
                <div class="currency-flag-lg">${currencyData.flag}</div>
                <div class="currency-value">${convertedAmount.toFixed(2)}</div>
                <div class="currency-name">${currencyData.name} (${currency})</div>
            `;

            resultsContainer.appendChild(resultItem);
        });

        // 更新显示时间
        updateTime.textContent = new Date().toLocaleString('zh-CN');
    }

    function calculateConversion(amount, from, to) {
        // 转换为人民币
        const cnyAmount = amount / exchangeRates[from].rate;
        // 转换为目标货币
        return cnyAmount * exchangeRates[to].rate;
    }
}
// COIN金币计算器功能
function calculateCoin() {
    // 获取输入值
    const usdBase = parseFloat(document.getElementById('usd-base').value) || 0;
    const vipInflation = parseFloat(document.getElementById('vip-inflation').value) || 0;
    const levelInflation = parseFloat(document.getElementById('level-inflation').value) || 0;
    const petInflation = parseFloat(document.getElementById('pet-inflation').value) || 0;
    const coinFactor = parseFloat(document.getElementById('coin-factor').value) || 1;
    const otherParam = parseFloat(document.getElementById('other-param').value) || 0;

    // 获取操作符
    const vipOperator = document.getElementById('vip-operator').value;
    const levelOperator = document.getElementById('level-operator').value;
    const petOperator = document.getElementById('pet-operator').value;
    const factorOperator = document.getElementById('factor-operator').value;
    const otherOperator = document.getElementById('other-operator').value;

    // 初始化计算公式
    let formula = `(${usdBase})`;
    let result = usdBase;

    // 处理VIP膨胀
    result = applyOperation(result, vipOperator, vipInflation);
    formula += ` ${getSymbol(vipOperator)} ${vipInflation}`;

    // 处理等级膨胀
    result = applyOperation(result, levelOperator, levelInflation);
    formula += ` ${getSymbol(levelOperator)} ${levelInflation}`;

    // 处理宠物膨胀
    result = applyOperation(result, petOperator, petInflation);
    formula += ` ${getSymbol(petOperator)} ${petInflation}`;

    // 处理金币系数
    result = applyOperation(result, factorOperator, coinFactor);
    formula += ` ${getSymbol(factorOperator)} ${coinFactor}`;

    // 处理其他参数
    result = applyOperation(result, otherOperator, otherParam);
    formula += ` ${getSymbol(otherOperator)} ${otherParam}`;

    // 显示结果
    const coinValue = document.querySelector('.coin-value');
    coinValue.textContent = result.toFixed(2);

    // 显示计算公式
    const coinFormula = document.querySelector('.coin-formula');
    coinFormula.textContent = `计算公式: ${formula} = ${result.toFixed(2)}`;
}

// 应用运算
function applyOperation(value, operator, operand) {
    switch(operator) {
        case '+': return value + operand;
        case '-': return value - operand;
        case '*': return value * operand;
        case '/': return operand !== 0 ? value / operand : value;
        default: return value;
    }
}

// 获取操作符符号
function getSymbol(operator) {
    switch(operator) {
        case '+': return '+';
        case '-': return '-';
        case '*': return '×';
        case '/': return '÷';
        default: return '';
    }
}

// 活动查询功能
function initActivitySearch() {
    const searchInput = document.getElementById('activity-search');
    const resultsContainer = document.getElementById('activity-results');
    const detailContainer = document.getElementById('activity-detail');

    // 输入事件处理
    searchInput.addEventListener('input', function() {
        const keyword = this.value.trim();
        resultsContainer.innerHTML = '';

        if (keyword.length === 0) {
            resultsContainer.style.display = 'none';
            detailContainer.style.display = 'none';
            return;
        }

        // 模糊搜索匹配
        const matchedActivities = activityData.filter(activity =>
            activity.description.includes(keyword) ||
            activity.activity_name.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchedActivities.length > 0) {
            resultsContainer.style.display = 'block';

            matchedActivities.forEach(activity => {
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <div class="activity-name">${activity.activity_name}</div>
                    <div class="activity-description">${activity.description}</div>
                `;

                item.addEventListener('click', function() {
                    showActivityDetail(activity);
                    resultsContainer.style.display = 'none';
                });

                resultsContainer.appendChild(item);
            });
        } else {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = `
                <div class="activity-item">
                    <div style="text-align: center; padding: 15px; color: #a0aec0;">
                        未找到匹配的活动
                    </div>
                </div>
            `;
        }
    });

    // 点击页面其他区域关闭搜索结果
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.activity-search-container')) {
            resultsContainer.style.display = 'none';
        }
    });
}

// 显示活动详情
function showActivityDetail(activity) {
    const detailContainer = document.getElementById('activity-detail');
    document.getElementById('detail-name').textContent = activity.activity_name;
    document.getElementById('detail-description').textContent = activity.description;
//    document.getElementById('detail-type').textContent = activity.type;
//    document.getElementById('detail-status').textContent = activity.status;
//    document.getElementById('detail-start').textContent = activity.start_date;
//    document.getElementById('detail-end').textContent = activity.end_date;

    detailContainer.style.display = 'block';
}

//新增数据模块查询功能
function initModelSearch() {
    const searchInput = document.getElementById('model-search');
    const resultsContainer = document.getElementById('model-results');
    const detailContainer = document.getElementById('model-detail');

    // 初始隐藏详情容器
    detailContainer.style.display = 'none';

    searchInput.addEventListener('input', function() {
        const keyword = this.value.trim();
        resultsContainer.innerHTML = '';

        if (keyword.length === 0) {
            resultsContainer.style.display = 'none';
            detailContainer.style.display = 'none';
            return;
        }

        // 模糊搜索匹配
        const matchedModels = ModelData.filter(model =>
            model.model_key.includes(keyword) ||
            model.model_value.toLowerCase().includes(keyword.toLowerCase())
        );

        if (matchedModels.length > 0) {
            resultsContainer.style.display = 'block';

            matchedModels.forEach(model => {
                const item = document.createElement('div');
                item.className = 'model-item';

                // 更安全的HTML插入方式
                const name = document.createElement('div');
                name.className = 'model-name';
                name.textContent = model.model_value;

                const desc = document.createElement('div');
                desc.className = 'model-description';
                desc.textContent = model.model_key;

                item.appendChild(name);
                item.appendChild(desc);

                item.addEventListener('click', function() {
                    showModelDetail(model);
                    resultsContainer.style.display = 'none';
                });

                resultsContainer.appendChild(item);
            });
        } else {
            resultsContainer.style.display = 'block';
            const noResult = document.createElement('div');
            noResult.className = 'model-item';
            noResult.innerHTML = `
                <div style="text-align: center; padding: 15px; color: #a0aec0;">
                    未找到匹配的模型
                </div>
            `;
            resultsContainer.appendChild(noResult);
        }
    });

    // 改进的点击关闭逻辑
    document.addEventListener('click', function(e) {
        if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
            resultsContainer.style.display = 'none';
        }
    });
}

function showModelDetail(model) {
    const detailContainer = document.getElementById('model-detail');
    document.getElementById('model-name').textContent = model.model_key;
    document.getElementById('model-description').textContent = model.model_value;
    detailContainer.style.display = 'block';
}



// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init)



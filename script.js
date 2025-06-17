// 星座运势数据
const horoscopeData = {
    '白羊座': {
        date: '3.21-4.19',
        score: '★★★★☆',
        description: '今天工作上有突破性进展，抓住机会展示你的能力。'
    },
    '金牛座': {
        date: '4.20-5.20',
        score: '★★★☆☆',
        description: '财务方面需要谨慎，避免冲动消费。'
    },
    '双子座': {
        date: '5.21-6.21',
        score: '★★★★★',
        description: '社交运极佳，适合拓展人脉和团队合作。'
    },
    '巨蟹座': {
        date: '6.22-7.22',
        score: '★★★☆☆',
        description: '情绪波动较大，需要自我调节。'
    },
    '狮子座': {
        date: '7.23-8.22',
        score: '★★★★☆',
        description: '领导能力凸显，适合主导项目。'
    },
    '处女座': {
        date: '8.23-9.22',
        score: '★★★☆☆',
        description: '细节决定成败，注意检查工作。'
    },
    '天秤座': {
        date: '9.23-10.23',
        score: '★★★★☆',
        description: '人际关系和谐，适合解决矛盾。'
    },
    '天蝎座': {
        date: '10.24-11.22',
        score: '★★★★★',
        description: '直觉敏锐，适合做重要决定。'
    },
    '射手座': {
        date: '11.23-12.21',
        score: '★★★☆☆',
        description: '旅行运佳，适合外出放松。'
    },
    '摩羯座': {
        date: '12.22-1.19',
        score: '★★★★☆',
        description: '事业运上升，努力会有回报。'
    },
    '水瓶座': {
        date: '1.20-2.18',
        score: '★★★☆☆',
        description: '创意灵感丰富，适合头脑风暴。'
    },
    '双鱼座': {
        date: '2.19-3.20',
        score: '★★★★☆',
        description: '情感丰富，适合表达内心感受。'
    }
};

// 天气数据
const weatherData = [
    { city: "北京", temp: 28, condition: "sunny", icon: "fa-sun" },
];

// AI助手相关变量
let aiConversation = [];

// DeepSeek API密钥
const DEEPSEEK_API_KEY = "sk-8790cdaaee5b44b09db701f7b79d10ae";

// 初始化函数
function init() {
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

    // 事件监听器
    document.getElementById('calculate-remainder').addEventListener('click', calculateRemainder);
    document.getElementById('apply-network').addEventListener('click', applyNetworkSettings);
    document.getElementById('translate-screenshot').addEventListener('click', translateScreenshot);
    document.getElementById('convert-to-date').addEventListener('click', convertTimestampToDate);
    document.getElementById('convert-to-days').addEventListener('click', convertTimestampToDays);
    document.getElementById('convert-to-timestamp').addEventListener('click', convertDateToTimestamp);
    document.getElementById('convert-cd').addEventListener('click', convertCD);
    document.getElementById('send-ai-question').addEventListener('click', askDeepSeek);
    document.getElementById('clear-ai-chat').addEventListener('click', clearAIChat);
    document.getElementById('zentao-link-btn').addEventListener('click', () => window.open('http://192.168.1.52/zentao/bug-browse-1--assigntome.html', '_blank'));
    document.getElementById('package-download-btn').addEventListener('click', () => window.open('http://192.168.1.150/down/beta/', '_blank'));
    document.getElementById('bugly-link-btn').addEventListener('click', () => window.open('https://bugly.qq.com/v2/', '_blank'));
    document.getElementById('appstore-link-btn').addEventListener('click', () => window.open('https://appid.naitu.cc/share/nice', '_blank'));
    document.getElementById('iphone-link-btn').addEventListener('click', () => window.open('https://yunduanxin.net/', '_blank'));
    document.getElementById('go-to-zen-tao').addEventListener('click', () => {
        document.querySelectorAll('.tool-nav-item').forEach(item => {
            if(item.getAttribute('data-tool') === 'zentao-link') {
                item.click();
            }
        });
    });

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
    document.getElementById('network-good').click();

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

    // 初始化星座运势
    updateHoroscope();

    // 初始化截屏功能
    initScreenshot();

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

// 应用网络设置
function applyNetworkSettings() {
    const latency = document.getElementById('latency').value;
    const loss = document.getElementById('packet-loss').value;

    alert(`网络设置已应用\n延迟: ${latency}ms\n丢包率: ${loss}%`);
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
            <p>"欢迎来到艾泽拉斯世界！"</p>
            <p>"在这片神秘的土地上，你将开始一段史诗般的冒险旅程。"</p>
            <p>"选择你的阵营：联盟或部落，为荣誉而战！"</p>
        </div>
        <div style="margin-top: 15px; color: #a0aec0; font-size: 0.9rem;">
            翻译完成时间: ${new Date().toLocaleTimeString()}
        </div>
    `;
}

// 时间戳转换功能
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

    resultBox.innerHTML = `
        <div><strong>转换结果 (${unit === 'seconds' ? '秒' : '毫秒'} 转日期):</strong></div>
        <div>本地时间: ${date.toLocaleString()}</div>
        <div>UTC时间: ${date.toUTCString()}</div>
        <div>ISO格式: ${date.toISOString()}</div>
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

// 更新星座运势 - 每天刷新
function updateHoroscope() {
    const horoscopeList = document.getElementById('horoscope-list');
    horoscopeList.innerHTML = '';

    // 获取今天的日期作为随机种子，确保每天运势相同
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // 随机排序星座（但每天相同）
    const signs = Object.keys(horoscopeData);
    const shuffledSigns = shuffleArrayWithSeed(signs, seed);

    // 只显示前6个星座
    shuffledSigns.slice(0, 6).forEach(sign => {
        const data = horoscopeData[sign];
        const item = document.createElement('li');
        item.className = 'horoscope-item';
        item.innerHTML = `
            <div class="horoscope-content">
                <span class="horoscope-sign">${sign} (${data.date}):</span>
                <span class="horoscope-score">${data.score}</span>
                <div>${data.description}</div>
            </div>
        `;
        horoscopeList.appendChild(item);
    });
}

// 使用种子值打乱数组
function shuffleArrayWithSeed(array, seed) {
    let currentSeed = seed;
    const shuffled = [...array];

    // 简单的伪随机算法
    const random = () => {
        const x = Math.sin(currentSeed++) * 10000;
        return x - Math.floor(x);
    };

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

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
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
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

        const data = await response.json();
        return data.choices[0]?.message?.content || '未能获取回答';
    } catch (error) {
        console.error('API调用错误:', error);
        return '没充钱，如果你想使用的话，微信、支付宝可给我转账！！';
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
            <strong>DeepSeek AI助手</strong>
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
            <strong>DeepSeek AI助手</strong> 正在思考...
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

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
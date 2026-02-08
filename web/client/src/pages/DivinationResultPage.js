/**
 * 六爻解析结果页面
 * 参考 MasterChenAI-mp 项目的 pages/result 页面
 */

import { navigateTo } from '../components/Common.js';

// 页面状态
let pageState = {
    question: '',
    lunarDate: '',
    benGuaInfo: null,
    bianGuaInfo: null,
    hasMovingYao: false,
    movingPositions: [],
    yaos: [],
    aiResponse: '',
    professionalVersion: '',
    simpleVersion: '',
    aiPrompt: '',
    isLoading: false,
    showPrompt: false,
    viewMode: 'simple', // 'simple' | 'professional' | 'both'
    remainingTime: 60,
    progressPercent: 0,
    loadingTip: '正在连接服务器...'
};

// 加载提示语
const loadingTips = [
    '正在分析卦象...',
    '推演六亲关系...',
    '计算世应位置...',
    '解读六神含义...',
    '综合动爻变化...',
    '生成专业解读...',
    '整理通俗版本...',
    '即将完成...'
];

/**
 * 渲染页面
 */
export function render(container, params = {}) {
    // 初始化数据
    initPageData(params);
    
    container.innerHTML = `
        <div class="divination-result-page">
            <!-- 问题显示 -->
            <div class="question-card">
                <span class="question-label">所问事项</span>
                <span class="question-text">${pageState.question || '未知问题'}</span>
                <span class="date-text">${pageState.lunarDate || ''}</span>
            </div>

            <!-- 卦象展示区域 -->
            ${renderGuaSection()}

            <!-- 动爻说明 -->
            ${renderMovingInfo()}

            <!-- 解读区域 -->
            <div class="ai-section">
                <div class="section-title">🔮 解读结果</div>
                
                <!-- 视图切换 -->
                <div class="view-mode-tabs">
                    <button class="mode-tab ${pageState.viewMode === 'simple' ? 'active' : ''}" 
                            data-mode="simple">💡 通俗版</button>
                    <button class="mode-tab ${pageState.viewMode === 'professional' ? 'active' : ''}" 
                            data-mode="professional">📚 专业版</button>
                    <button class="mode-tab ${pageState.viewMode === 'both' ? 'active' : ''}" 
                            data-mode="both">📖 双版本</button>
                </div>

                <!-- AI提示词（可折叠） -->
                <div class="prompt-card">
                    <div class="prompt-header" id="toggle-prompt">
                        <span>解读提示词</span>
                        <span class="prompt-arrow">${pageState.showPrompt ? '▼' : '▶'}</span>
                    </div>
                    <div class="prompt-content ${pageState.showPrompt ? 'show' : ''}">
                        <pre class="prompt-text">${escapeHtml(pageState.aiPrompt || '暂无提示词')}</pre>
                        <button class="btn-copy" id="copy-prompt">复制提示词</button>
                    </div>
                </div>

                <!-- 加载状态 -->
                ${renderLoadingState()}

                <!-- AI响应结果 -->
                ${renderAIResponse()}
            </div>

            <!-- 免责声明 -->
            <div class="disclaimer">
                仅供娱乐参考，不作为任何决策依据
            </div>

            <!-- 底部按钮 -->
            <div class="bottom-buttons">
                <button class="btn-restart" id="btn-restart">🔄 重新开始</button>
                <button class="btn-share" id="btn-share">📤 分享结果</button>
            </div>
        </div>
    `;

    // 绑定事件
    bindEvents(container);
}

/**
 * 初始化页面数据
 */
function initPageData(params) {
    // 如果有传入参数，使用参数
    if (params.data) {
        const data = params.data;
        pageState.question = data.question || '';
        pageState.aiResponse = data.result || '';
        pageState.professionalVersion = data.professionalVersion || '';
        pageState.simpleVersion = data.simpleVersion || '';
        pageState.aiPrompt = data.aiPrompt || '';
    }
    
    // 尝试从 localStorage 获取缓存数据
    const cachedResult = localStorage.getItem('divinationResult');
    if (cachedResult && !params.data) {
        try {
            const cached = JSON.parse(cachedResult);
            if (cached.success && cached.data) {
                pageState.aiResponse = cached.data.result || '';
                pageState.professionalVersion = cached.data.professionalVersion || '';
                pageState.simpleVersion = cached.data.simpleVersion || '';
                pageState.aiPrompt = cached.data.aiPrompt || '';
            }
        } catch (e) {
            console.error('解析缓存数据失败:', e);
        }
    }
    
    // 从 aiPrompt 中提取信息
    if (pageState.aiPrompt) {
        extractInfoFromPrompt(pageState.aiPrompt);
    }
}

/**
 * 从提示词中提取信息
 */
function extractInfoFromPrompt(prompt) {
    // 提取问题
    const questionMatch = prompt.match(/我要问"([^"]+)"的问题/);
    if (questionMatch) {
        pageState.question = questionMatch[1];
    }
    
    // 提取农历日期
    const dateMatch = prompt.match(/在农历([^\s]+)问事/);
    if (dateMatch) {
        pageState.lunarDate = dateMatch[1];
    }
    
    // 提取本卦信息
    const benGuaMatch = prompt.match(/得到([^（]+)（([^，]+)，属([^）]+)）为本卦/);
    if (benGuaMatch) {
        pageState.benGuaInfo = {
            name: benGuaMatch[1],
            palace: benGuaMatch[2],
            wuxing: benGuaMatch[3]
        };
    }
    
    // 提取卦辞
    const guaCiMatch = prompt.match(/【卦辞】([^\n]+)/);
    if (guaCiMatch && pageState.benGuaInfo) {
        pageState.benGuaInfo.info = guaCiMatch[1];
    }
    
    // 提取世应信息
    const shiYingMatch = prompt.match(/世爻在第(\d)爻，应爻在第(\d)爻/);
    if (shiYingMatch && pageState.benGuaInfo) {
        pageState.benGuaInfo.shi = parseInt(shiYingMatch[1]);
        pageState.benGuaInfo.ying = parseInt(shiYingMatch[2]);
    }
    
    // 提取六爻信息
    const yaoPattern = /(上爻|五爻|四爻|三爻|二爻|初爻)：([^\s]+)\s+(阳|阴)爻，([^，\n]+)/g;
    const yaos = [];
    let match;
    while ((match = yaoPattern.exec(prompt)) !== null) {
        yaos.push({
            position: match[1],
            liuShen: match[2],
            type: match[3],
            info: match[4]
        });
    }
    if (yaos.length > 0) {
        pageState.yaos = yaos;
    }
    
    // 检查是否有动爻
    pageState.hasMovingYao = prompt.includes('动爻') && !prompt.includes('无动爻');
}

/**
 * 渲染卦象区域
 */
function renderGuaSection() {
    if (!pageState.benGuaInfo) {
        return '';
    }
    
    return `
        <div class="gua-section">
            <!-- 本卦 -->
            <div class="gua-card">
                <div class="gua-title">本卦</div>
                <div class="gua-name">${pageState.benGuaInfo.name || ''}</div>
                <div class="gua-palace">${pageState.benGuaInfo.palace || ''} · ${pageState.benGuaInfo.wuxing || ''}</div>
                
                <!-- 六爻图形 -->
                <div class="gua-diagram">
                    ${renderYaoLines()}
                </div>
                
                <div class="gua-ci">${pageState.benGuaInfo.info || ''}</div>
            </div>

            <!-- 变卦（如果有动爻） -->
            ${pageState.hasMovingYao && pageState.bianGuaInfo ? `
                <div class="gua-card">
                    <div class="gua-title">变卦</div>
                    <div class="gua-name">${pageState.bianGuaInfo.name || ''}</div>
                    <div class="gua-palace">${pageState.bianGuaInfo.palace || ''} · ${pageState.bianGuaInfo.wuxing || ''}</div>
                    <div class="gua-diagram">
                        ${renderBianYaoLines()}
                    </div>
                    <div class="gua-ci">${pageState.bianGuaInfo.info || ''}</div>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * 渲染本卦六爻
 */
function renderYaoLines() {
    if (!pageState.yaos || pageState.yaos.length === 0) {
        return '<div class="no-yao-info">暂无六爻详细信息</div>';
    }
    
    return pageState.yaos.map((yao, index) => {
        const isShi = pageState.benGuaInfo?.shi === (6 - index);
        const isYing = pageState.benGuaInfo?.ying === (6 - index);
        const symbol = yao.type === '阳' ? '▬▬▬' : '▬ ▬';
        
        return `
            <div class="yao-line ${isShi ? 'shi' : ''} ${isYing ? 'ying' : ''}">
                <span class="yao-liushen">${yao.liuShen || ''}</span>
                <span class="yao-symbol">${symbol}</span>
                <span class="yao-info">${yao.info || ''}</span>
                ${isShi ? '<span class="yao-tag shi-tag">世</span>' : ''}
                ${isYing ? '<span class="yao-tag ying-tag">应</span>' : ''}
            </div>
        `;
    }).join('');
}

/**
 * 渲染变卦六爻
 */
function renderBianYaoLines() {
    // 如果没有变卦信息，返回空
    return '<div class="no-yao-info">变卦信息</div>';
}

/**
 * 渲染动爻说明
 */
function renderMovingInfo() {
    if (pageState.hasMovingYao) {
        const movingDesc = pageState.movingPositions.length > 0 
            ? pageState.movingPositions.map(p => `第${p}爻`).join('、')
            : '有动爻';
        return `
            <div class="moving-info">
                <span class="moving-label">动爻：</span>
                <span class="moving-text">${movingDesc}</span>
            </div>
        `;
    } else {
        return `
            <div class="moving-info">
                <span class="moving-text">静卦（无动爻）</span>
            </div>
        `;
    }
}

/**
 * 渲染加载状态
 */
function renderLoadingState() {
    if (!pageState.isLoading) {
        return '';
    }
    
    return `
        <div class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <span class="loading-title">师傅正在推算中...</span>
                <span class="loading-hint">预计需要 ${pageState.remainingTime} 秒</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${pageState.progressPercent}%"></div>
                </div>
                <span class="loading-tip">${pageState.loadingTip}</span>
            </div>
        </div>
    `;
}

/**
 * 渲染AI响应
 */
function renderAIResponse() {
    if (!pageState.aiResponse && !pageState.simpleVersion && !pageState.professionalVersion) {
        return `
            <div class="no-response">
                <p>暂无解读结果</p>
                <button class="btn-ai" id="btn-ask-ai">🔮 开始解读</button>
            </div>
        `;
    }
    
    const showProfessional = pageState.viewMode === 'professional' || pageState.viewMode === 'both';
    const showSimple = pageState.viewMode === 'simple' || pageState.viewMode === 'both';
    
    return `
        <div class="ai-response">
            <!-- 专业版解读 -->
            ${showProfessional ? `
                <div class="version-section professional">
                    <div class="response-title">📚 专业版解读</div>
                    <div class="response-content">${formatContent(pageState.professionalVersion || pageState.aiResponse)}</div>
                </div>
            ` : ''}
            
            <!-- 通俗版解读 -->
            ${showSimple ? `
                <div class="version-section simple">
                    <div class="response-title">💡 通俗版解读</div>
                    <div class="response-content">${formatContent(pageState.simpleVersion || pageState.aiResponse)}</div>
                </div>
            ` : ''}
            
            <!-- 咨询入口 -->
            <div class="consult-section">
                <div class="consult-title">💬 有疑惑？欢迎咨询</div>
                <p class="consult-tip">如需进一步解读，请联系专业顾问</p>
            </div>
        </div>
    `;
}

/**
 * 格式化内容（将markdown转为HTML）
 */
function formatContent(content) {
    if (!content) return '';
    
    let html = escapeHtml(content);
    
    // 转换标题
    html = html.replace(/### (.+)/g, '<h4>$1</h4>');
    html = html.replace(/## (.+)/g, '<h3>$1</h3>');
    html = html.replace(/# (.+)/g, '<h2>$1</h2>');
    
    // 转换加粗
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // 转换列表
    html = html.replace(/^\* (.+)/gm, '<li>$1</li>');
    html = html.replace(/^- (.+)/gm, '<li>$1</li>');
    html = html.replace(/^\d+\.\s+(.+)/gm, '<li>$1</li>');
    
    // 转换分隔线
    html = html.replace(/^---$/gm, '<hr>');
    
    // 转换换行
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    return `<p>${html}</p>`;
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 绑定事件
 */
function bindEvents(container) {
    // 视图模式切换
    container.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            pageState.viewMode = mode;
            render(container, { data: pageState });
        });
    });
    
    // 提示词折叠
    const togglePrompt = container.querySelector('#toggle-prompt');
    if (togglePrompt) {
        togglePrompt.addEventListener('click', () => {
            pageState.showPrompt = !pageState.showPrompt;
            render(container, { data: pageState });
        });
    }
    
    // 复制提示词
    const copyBtn = container.querySelector('#copy-prompt');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(pageState.aiPrompt).then(() => {
                alert('提示词已复制到剪贴板');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        });
    }
    
    // 重新开始
    const restartBtn = container.querySelector('#btn-restart');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (confirm('确定要重新开始吗？')) {
                localStorage.removeItem('divinationResult');
                navigateTo('home');
            }
        });
    }
    
    // 分享结果
    const shareBtn = container.querySelector('#btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shareResult();
        });
    }
    
    // 开始解读按钮
    const askAiBtn = container.querySelector('#btn-ask-ai');
    if (askAiBtn) {
        askAiBtn.addEventListener('click', () => {
            startDivination(container);
        });
    }
}

/**
 * 分享结果
 */
function shareResult() {
    const shareText = `🔮 六爻解读结果\n\n问：${pageState.question}\n\n${pageState.simpleVersion || pageState.aiResponse}`;
    
    if (navigator.share) {
        navigator.share({
            title: '六爻解读结果',
            text: shareText
        }).catch(err => {
            console.log('分享取消:', err);
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

/**
 * 复制到剪贴板
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('结果已复制到剪贴板，可以粘贴分享');
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

/**
 * 开始解卦
 */
async function startDivination(container) {
    pageState.isLoading = true;
    pageState.progressPercent = 0;
    pageState.remainingTime = 60;
    
    // 更新加载状态
    const updateLoading = () => {
        if (!pageState.isLoading) return;
        
        pageState.remainingTime = Math.max(0, pageState.remainingTime - 1);
        pageState.progressPercent = Math.min(95, pageState.progressPercent + 1.5);
        pageState.loadingTip = loadingTips[Math.floor(pageState.progressPercent / 12)] || loadingTips[0];
        
        render(container, { data: pageState });
        
        if (pageState.isLoading) {
            setTimeout(updateLoading, 1000);
        }
    };
    
    render(container, { data: pageState });
    setTimeout(updateLoading, 1000);
    
    try {
        // TODO: 实际调用 API
        // const response = await fetch('/api/divination', { ... });
        
        pageState.isLoading = false;
        pageState.progressPercent = 100;
        render(container, { data: pageState });
    } catch (error) {
        console.error('解卦失败:', error);
        pageState.isLoading = false;
        alert('解卦失败，请重试');
        render(container, { data: pageState });
    }
}

export default { render };

/**
 * 页面渲染器（用于路由系统）
 */
export function DivinationResultPage(container, params = {}) {
    return render(container, params);
}

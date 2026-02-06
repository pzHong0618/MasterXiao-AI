/**
 * 塔罗解读结果加载页
 * 展示解读中动画、进度条、按钮等，并调用后端六爻API进行解读
 */
import { Navbar } from '../components/Common.js';
import { getMatchTypeById } from '../data/matchTypes.js';

// 加载提示语列表（与小程序保持一致）
const LOADING_TIPS = [
    '正在分析卦象...',
    '正在推算用神...',
    '正在分析六亲关系...',
    '正在查看动爻变化...',
    '正在综合分析结果...',
    '肖大师正在认真解读...',
    '即将完成，请稍候...'
];

export class TarotResultLoadingPage {
    constructor(params) {
        // 从 params 获取参数（router已解析query string）
        this.matchType = getMatchTypeById(params.type);
        this.question = decodeURIComponent(params.question || '未指定问题');
        this.estimateSeconds = 90;
        this.progress = 0;
        this.timer = null;
        this.isInterpreting = false;
        this.tipIndex = 0;
        this.currentTip = LOADING_TIPS[0];
        this.retryCount = 0;
        this.maxRetry = 2;
        
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }
    }

    render() {
        // 获取卦象信息用于显示
        const benGuaInfo = window.appState?.get?.('benGuaInfo') || {};
        const bianGuaInfo = window.appState?.get?.('bianGuaInfo') || {};
        const movingPositions = window.appState?.get?.('movingPositions') || [];
        const hasMovingYao = movingPositions.length > 0;

        return `
      <div class="page tarot-result-loading-page">
        ${Navbar({
            title: '解读结果',
            showBack: true,
            showHistory: false,
            showProfile: false
        })}
        <main class="page-content">
          <div class="app-container">
            <!-- 问题卡片 -->
            <section class="result-question-card animate-fade-in-up">
              <div class="result-question-title">所问事项</div>
              <div class="result-question-main">${this.question}</div>
            </section>
            
            <!-- 卦象信息卡片 -->
            ${benGuaInfo.name ? `
            <section class="result-gua-card animate-fade-in-up animate-delay-50">
              <div class="gua-info-row">
                <div class="gua-info-item">
                  <span class="gua-label">本卦</span>
                  <span class="gua-name">${benGuaInfo.name || ''}</span>
                  <span class="gua-palace">${benGuaInfo.palace || ''}宫</span>
                </div>
                ${hasMovingYao && bianGuaInfo.name ? `
                <div class="gua-arrow">→</div>
                <div class="gua-info-item">
                  <span class="gua-label">变卦</span>
                  <span class="gua-name">${bianGuaInfo.name || ''}</span>
                  <span class="gua-palace">${bianGuaInfo.palace || ''}宫</span>
                </div>
                ` : ''}
              </div>
              ${hasMovingYao ? `
              <div class="gua-moving-info">
                动爻：${movingPositions.map(p => ['初爻','二爻','三爻','四爻','五爻','上爻'][p-1]).join('、')}
              </div>
              ` : ''}
            </section>
            ` : ''}
            
            <!-- 加载动画卡片 -->
            <section class="result-loading-card animate-fade-in-up animate-delay-100">
              <div class="result-loading-spinner">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="#E0E0F6" stroke-width="6" fill="none" />
                  <circle cx="24" cy="24" r="20" stroke="#8B7FD8" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="100 100" stroke-dashoffset="${100 - this.progress * 100}"/>
                </svg>
              </div>
              <div class="result-loading-text">
                <div class="result-loading-main" id="loadingTip">${this.currentTip}</div>
                <div class="result-loading-sub">预计需要 <span class="result-loading-sec">${this.estimateSeconds}</span> 秒</div>
              </div>
              <div class="result-loading-bar">
                <div class="result-loading-bar-inner" style="width: ${this.progress * 100}%"></div>
              </div>
            </section>
            
            <section class="result-btns animate-fade-in-up animate-delay-200">
              <button class="btn btn--outline btn--lg result-btn-restart" id="btnRestart">重新开始</button>
            </section>
            <div class="result-tip">本应用基于传统文化体验，仅供娱乐参考，不作为任何决策依据</div>
          </div>
        </main>
      </div>
    `;
    }

    attachEvents() {
        // 返回按钮
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                window.router.back();
            });
        }
        // 重新开始
        const btnRestart = document.getElementById('btnRestart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                window.router.navigate('/');
            });
        }
        
        // 启动进度动画
        this.startProgress();
        
        // 启动解读请求
        this.startInterpret();
    }

    async startInterpret() {
        if (this.isInterpreting) return;
        this.isInterpreting = true;

        try {
            // 从全局状态获取卦象数据
            const guaData = window.appState?.get?.('guaData');
            
            if (!guaData) {
                window.showToast('卦象数据异常', 'error');
                setTimeout(() => window.router.back(), 1500);
                return;
            }

            console.log('[六爻解卦] 开始请求，卦象数据:', guaData);

            // 调用后端六爻API进行解读
            const response = await fetch('/api/divination', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ guaData })
            });

            console.log('[六爻解卦] 响应状态:', response.status);

            // 检查响应状态
            if (!response.ok) {
                const errorText = await response.text();
                console.error('[六爻解卦] 请求失败:', errorText);
                throw new Error(`服务器错误: ${response.status}`);
            }

            // 尝试解析JSON
            const text = await response.text();
            console.log('[六爻解卦] 响应内容长度:', text.length);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('[六爻解卦] JSON解析失败:', e);
                throw new Error('服务器返回格式错误');
            }

            if (!data.success) {
                throw new Error(data.error || '解卦失败');
            }

            console.log('[六爻解卦] 解卦成功');
            
            // 重置重试计数
            this.retryCount = 0;

            // 停止进度条
            this.stopProgress();

            // 清理可能残留的 AI 思考标签
            const cleanThinkTags = (text) => {
                if (!text) return text;
                return text
                    .replace(/<think>[\s\S]*?<\/think>/gi, '')
                    .replace(/<think>[\s\S]*$/gi, '')
                    .replace(/<\/?think>/gi, '')
                    .trim();
            };

            // 保存解读结果到全局状态
            const resultData = {
                question: this.question,
                yaos: window.appState?.get?.('yaos') || [],
                benGuaInfo: window.appState?.get?.('benGuaInfo') || {},
                bianGuaInfo: window.appState?.get?.('bianGuaInfo') || {},
                movingPositions: window.appState?.get?.('movingPositions') || [],
                lunarDate: window.appState?.get?.('lunarDate') || '',
                result: cleanThinkTags(data.data.result),
                professionalVersion: cleanThinkTags(data.data.professionalVersion || data.data.result),
                simpleVersion: cleanThinkTags(data.data.simpleVersion || data.data.result),
                aiPrompt: data.data.aiPrompt || ''
            };

            window.appState.divinationResult = resultData;
            // 同时保存到兼容的 tarotInterpretResult（结果页会用到）
            window.appState.tarotInterpretResult = {
                question: this.question,
                selectedCards: window.appState?.get?.('selectedCards') || [],
                result: resultData.result,
                professionalVersion: resultData.professionalVersion,
                simpleVersion: resultData.simpleVersion,
                benGuaInfo: resultData.benGuaInfo,
                bianGuaInfo: resultData.bianGuaInfo,
                movingPositions: resultData.movingPositions,
                lunarDate: resultData.lunarDate
            };

            // 跳转到结果页面
            setTimeout(() => {
                window.router.navigate(`/test/${this.matchType.id}/tarot/result`);
            }, 500);

        } catch (error) {
            console.error('[六爻解卦] 解卦失败:', error);
            
            // 超时自动重试
            if (error.message && (error.message.includes('超时') || error.message.includes('timeout') || error.message.includes('502') || error.message.includes('504')) && this.retryCount < this.maxRetry) {
                this.retryCount++;
                console.log(`[六爻解卦] 请求失败，自动重试第 ${this.retryCount} 次...`);
                window.showToast && window.showToast(`请求超时，正在重试 (${this.retryCount}/${this.maxRetry})`, 'warning');
                setTimeout(() => {
                    this.isInterpreting = false;
                    this.startInterpret();
                }, 1000);
                return;
            }
            
            this.retryCount = 0;
            
            // 停止进度条
            this.stopProgress();

            window.showToast && window.showToast(error.message || '解卦失败，请稍后重试', 'error');
            
            // 延迟返回
            setTimeout(() => {
                window.router.back();
            }, 2000);
        } finally {
            this.isInterpreting = false;
        }
    }

    startProgress() {
        this.progress = 0;
        this.estimateSeconds = 90;
        this.tipIndex = 0;
        
        const secEl = document.querySelector('.result-loading-sec');
        const barInner = document.querySelector('.result-loading-bar-inner');
        const spinner = document.querySelector('.result-loading-spinner svg circle:last-child');
        const tipEl = document.getElementById('loadingTip');
        
        let elapsed = 0;
        
        this.timer = setInterval(() => {
            elapsed++;
            
            // 计算进度（最多98%，基于180秒）
            this.progress = Math.min(0.98, elapsed / 180);
            
            // 更新剩余时间显示
            this.estimateSeconds = Math.max(0, 90 - elapsed);
            
            // 每隔10秒切换提示语
            if (elapsed % 10 === 0 && elapsed <= 70) {
                this.tipIndex = Math.min(this.tipIndex + 1, LOADING_TIPS.length - 1);
            }
            
            // 根据时间显示不同提示
            let tip = LOADING_TIPS[this.tipIndex];
            if (elapsed > 120) {
                tip = '服务器响应较慢，请再等一会儿...';
            } else if (elapsed > 90) {
                tip = '正在等待响应，请耐心等待...';
            } else if (elapsed > 60) {
                tip = '还在努力解读中，请稍候...';
            }
            this.currentTip = tip;
            
            // 更新DOM
            if (secEl) secEl.textContent = this.estimateSeconds > 0 ? this.estimateSeconds : '继续等待';
            if (barInner) barInner.style.width = (this.progress * 100) + '%';
            if (spinner) spinner.setAttribute('stroke-dashoffset', 100 - this.progress * 100);
            if (tipEl) tipEl.textContent = tip;
            
            // 最长等待180秒后停止进度（但不停止请求）
            if (elapsed >= 180) {
                // 不清除定时器，只是停止更新进度
            }
        }, 1000);
    }
    
    stopProgress() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 设置完成状态
        this.progress = 1;
        this.estimateSeconds = 0;
        this.currentTip = '解卦完成！';
        
        const secEl = document.querySelector('.result-loading-sec');
        const barInner = document.querySelector('.result-loading-bar-inner');
        const spinner = document.querySelector('.result-loading-spinner svg circle:last-child');
        const tipEl = document.getElementById('loadingTip');
        
        if (secEl) secEl.textContent = '0';
        if (barInner) barInner.style.width = '100%';
        if (spinner) spinner.setAttribute('stroke-dashoffset', '0');
        if (tipEl) tipEl.textContent = '解卦完成！';
    }
}

export default TarotResultLoadingPage;

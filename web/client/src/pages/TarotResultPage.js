/**
 * 塔罗解读结果页
 * 展示完整的六爻解读结果
 */
import { Navbar } from '../components/Common.js';
import { getMatchTypeById } from '../data/matchTypes.js';

export class TarotResultPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        this.resultData = window.appState.tarotInterpretResult || null;
        this.showVersion = 'simple'; // 'simple' 或 'professional'
        
        if (!this.matchType || !this.resultData) {
            window.router.navigate('/');
            return;
        }
    }

    render() {
        if (!this.resultData) return '';

        const { question, simpleVersion, professionalVersion, benGuaInfo, bianGuaInfo, movingPositions, lunarDate } = this.resultData;
        const currentVersion = this.showVersion === 'simple' ? simpleVersion : professionalVersion;
        const hasMovingYao = movingPositions && movingPositions.length > 0;

        return `
      <div class="page tarot-result-page">
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
              <div class="result-question-label">所问事项</div>
              <div class="result-question-title">${question}</div>
              ${lunarDate ? `<div class="result-question-date">${lunarDate}</div>` : ''}
            </section>

            <!-- 解读内容卡片 -->
            <section class="result-interpretation-card animate-fade-in-up animate-delay-50">
              <div class="result-interpretation-header">
                <span class="result-interpretation-icon">💡</span>
                <span class="result-interpretation-title">解读</span>
              </div>
              
              <div class="result-interpretation-content" id="resultContent">
                ${this.formatContent(currentVersion)}
              </div>
            </section>

            <!-- 版本切换 -->
            <section class="result-version-switch animate-fade-in-up animate-delay-100">
              <button class="version-btn ${this.showVersion === 'simple' ? 'version-btn--active' : ''}" 
                      data-version="simple">
                通俗版
              </button>
              <button class="version-btn ${this.showVersion === 'professional' ? 'version-btn--active' : ''}" 
                      data-version="professional">
                专业版
              </button>
            </section>

            <div class="result-disclaimer">
              本应用基于传统文化体验，仅供娱乐参考，不作为任何决策依据
            </div>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `;
    }

    formatContent(content) {
        if (!content) return '<p>暂无解读内容</p>';
        // 将换行符转换为段落
        return content
            .split('\n')
            .filter(line => line.trim())
            .map(line => `<p>${line}</p>`)
            .join('');
    }

    attachEvents() {
        // 返回按钮
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.router.navigate('/');
            });
        }

        // 版本切换按钮
        const versionBtns = document.querySelectorAll('.version-btn');
        versionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const version = e.target.dataset.version;
                this.switchVersion(version);
            });
        });

        // 重新开始按钮
        const btnRestart = document.getElementById('btnRestart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                // 清除状态
                delete window.appState.tarotInterpretResult;
                delete window.appState.divinationResult;
                window.appState.set && window.appState.set('selectedCards', null);
                window.appState.set && window.appState.set('yaos', null);
                window.appState.set && window.appState.set('guaData', null);
                window.router.navigate('/');
            });
        }

        // 分享按钮
        const btnShare = document.getElementById('btnShare');
        if (btnShare) {
            btnShare.addEventListener('click', () => {
                this.handleShare();
            });
        }
    }

    switchVersion(version) {
        if (version === this.showVersion) return;
        
        this.showVersion = version;
        
        // 更新按钮状态
        document.querySelectorAll('.version-btn').forEach(btn => {
            if (btn.dataset.version === version) {
                btn.classList.add('version-btn--active');
            } else {
                btn.classList.remove('version-btn--active');
            }
        });

        // 更新内容
        const contentEl = document.getElementById('resultContent');
        if (contentEl) {
            const newContent = version === 'simple' 
                ? this.resultData.simpleVersion 
                : this.resultData.professionalVersion;
            
            contentEl.classList.add('fade-out');
            setTimeout(() => {
                contentEl.innerHTML = this.formatContent(newContent);
                contentEl.classList.remove('fade-out');
                contentEl.classList.add('fade-in');
                setTimeout(() => {
                    contentEl.classList.remove('fade-in');
                }, 300);
            }, 150);
        }
    }

    handleShare() {
        // 构建分享文本
        const { question, benGuaInfo, bianGuaInfo, movingPositions, simpleVersion } = this.resultData;
        const hasMovingYao = movingPositions && movingPositions.length > 0;
        
        let shareText = `【六爻解卦】\n\n`;
        shareText += `问题：${question}\n\n`;
        
        if (benGuaInfo && benGuaInfo.name) {
            shareText += `本卦：${benGuaInfo.name}（${benGuaInfo.palace}宫）\n`;
            if (hasMovingYao && bianGuaInfo && bianGuaInfo.name) {
                shareText += `变卦：${bianGuaInfo.name}（${bianGuaInfo.palace}宫）\n`;
                shareText += `动爻：${movingPositions.map(p => ['初爻','二爻','三爻','四爻','五爻','上爻'][p-1]).join('、')}\n`;
            }
            shareText += '\n';
        }
        
        shareText += `${simpleVersion}\n\n`;
        shareText += `来自小肖AI - 直觉塔罗`;
        
        // 尝试使用 Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText).then(() => {
                window.showToast('结果已复制到剪贴板', 'success');
            }).catch(() => {
                this.fallbackCopyText(shareText);
            });
        } else {
            this.fallbackCopyText(shareText);
        }
    }

    fallbackCopyText(text) {
        // 降级方案：创建临时 textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            window.showToast('结果已复制到剪贴板', 'success');
        } catch (err) {
            window.showToast('复制失败，请手动复制', 'error');
        }
        
        document.body.removeChild(textarea);
    }
}

export default TarotResultPage;

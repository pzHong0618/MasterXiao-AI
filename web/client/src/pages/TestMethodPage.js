/**
 * 测试方式选择页
 * 从 TestSelectPage / XHSTestPage 选完题目后跳转到此页
 * 展示 "生日匹配" 和 "直觉塔罗" 两种测试方式供选择
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar } from '../components/Common.js';
import { getApiBaseUrl } from '../services/api.js';

const API_BASE = getApiBaseUrl();

// 问题分类与规则类型的映射
const CATEGORY_RULE_MAP = {
    '综合': 'nianyun',
    '健康类': 'jiankang',
    '事业类': 'shiye',
    '财运类': 'caiyun',
    '感情类': 'ganqing',
    '感情匹配': 'ganqing',
    '投资类': 'gushi',
    '学业类': 'shengxue',
    '其他类': 'qita'
};

export class TestMethodPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }

        // 从 URL 参数获取兑换码
        const urlParams = new URLSearchParams(window.location.search);
        this.redeemCode = urlParams.get('s') || window.appState?.get?.('redeemCode') || null;
        this.isVerifying = false;
        this.codeVerified = false;
    }

    render() {
        if (!this.matchType) return '';

        return `
      <div class="page test-method-page">
        ${Navbar({
            title: this.matchType.title,
            showBack: true,
            showHistory: false,
            showProfile: false
        })}

        <main class="page-content">
          <div class="app-container">

            <!-- 匹配类型简要信息 -->
            <section class="test-method-header animate-fade-in-up">
              <div class="glass-card" style="text-align:center; padding: 24px 20px;">
                <div style="font-size:40px; margin-bottom:8px;">${this.matchType.icon}</div>
                <h2 class="heading-2" style="margin-bottom:4px;">${this.matchType.title}</h2>
                <p class="small-text" style="color:var(--color-text-tertiary); margin:0;">${this.matchType.description}</p>
              </div>
            </section>

            <!-- 选择测试方式 -->
            <section class="test-method-section animate-fade-in-up animate-delay-100 mt-3">
              <h3 class="heading-3 mb-3 text-center">选择测试方式</h3>

              <div class="glass-card" style="padding: 0; overflow: hidden;">
                <!-- 生日匹配 -->
                <div class="method-card method-card--compact" data-method="birthday" style="padding: 14px 16px; cursor: pointer;">
                  <div class="method-card__icon" style="font-size: 28px;">🎂</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title" style="font-size: 15px; margin-bottom: 2px;">生日匹配</h4>
                    <p class="method-card__description" style="font-size: 12px; margin-bottom: 0;">输入双方生日，通过生日特质分析性格关系</p>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>

                <!-- 渐变色分隔线 -->
                <div style="height: 1.5px; margin: 0 16px; background: linear-gradient(90deg, transparent, var(--color-primary), #f472b6, transparent);"></div>

                <!-- 直觉塔罗测试 -->
                <div class="method-card method-card--compact" data-method="tarot" style="padding: 14px 16px; cursor: pointer;">
                  <div class="method-card__icon" style="font-size: 28px;">🃏</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title" style="font-size: 15px; margin-bottom: 2px;">直觉塔罗</h4>
                    <p class="method-card__description" style="font-size: 12px; margin-bottom: 0;">凭直觉翻牌，通过卡牌符号解析关系</p>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>
              </div>
            </section>

            <!-- 说明提示 -->
            <section class="tips-section mt-3 animate-fade-in-up animate-delay-200">
              <div class="glass-card glass-card--light">
                <div class="tips-header">
                  <span>💡</span>
                  <span class="small-text">选择提示</span>
                </div>
                <ul class="tips-list">
                  <li>如果知道双方准确的出生日期，推荐使用<strong>生日匹配</strong>，结果更精准</li>
                  <li>如果不清楚对方生日，可以使用<strong>直觉塔罗</strong>，凭直觉感应</li>
                  <li>两种方式都是趣味性格测试，仅供娱乐参考</li>
                </ul>
              </div>
            </section>

            <!-- 性别选择弹框 -->
            <div id="genderModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;">
              <div id="genderModalOverlay" style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);"></div>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:85%;max-width:360px;background:#fff;border-radius:20px;padding:30px 20px 32px;box-sizing:border-box;animation:fadeScaleIn 0.3s ease;">
                <h3 style="text-align:center;font-size:18px;font-weight:600;color:var(--color-text-primary);margin-bottom:8px;">请选择您的性别</h3>
                <p style="text-align:center;font-size:13px;color:var(--color-text-tertiary);margin-bottom:24px;">性别信息将帮助更准确解读结果</p>
                <div style="display:flex;justify-content:center;gap:40px;">
                  <div class="ts-gender-option" data-gender="male" style="display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;padding:16px 24px;border-radius:16px;border:2px solid transparent;transition:all 0.2s;">
                    <div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:32px;">👨</div>
                    <span style="font-size:15px;font-weight:500;color:var(--color-text-primary);">男</span>
                  </div>
                  <div class="ts-gender-option" data-gender="female" style="display:flex;flex-direction:column;align-items:center;gap:10px;cursor:pointer;padding:16px 24px;border-radius:16px;border:2px solid transparent;transition:all 0.2s;">
                    <div style="width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,#f472b6,#ec4899);display:flex;align-items:center;justify-content:center;font-size:32px;">👩</div>
                    <span style="font-size:15px;font-weight:500;color:var(--color-text-primary);">女</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `;
    }

    attachEvents() {
        // 返回按钮
        document.querySelector('.navbar__back-btn')?.addEventListener('click', () => {
            window.router.back();
        });

        // 方法卡片点击
        document.querySelectorAll('.method-card').forEach(card => {
            card.addEventListener('click', () => {
                const method = card.dataset.method;
                this.handleMethodSelect(method);
            });
        });

        // 性别选择事件
        document.querySelectorAll('.ts-gender-option').forEach(option => {
            option.addEventListener('click', () => {
                const gender = option.dataset.gender;
                document.querySelectorAll('.ts-gender-option').forEach(opt => {
                    opt.style.borderColor = 'transparent';
                    opt.style.background = '';
                });
                option.style.borderColor = gender === 'male' ? '#3b82f6' : '#ec4899';
                option.style.background = gender === 'male' ? 'rgba(59,130,246,0.08)' : 'rgba(236,72,153,0.08)';

                setTimeout(() => {
                    this.submitTarotWithGender(gender);
                }, 500);
            });
        });

        // 点击遮罩关闭弹框
        document.getElementById('genderModalOverlay')?.addEventListener('click', () => {
            this.hideGenderModal();
        });

        // 添加弹框动画样式
        if (!document.querySelector('#ts-gender-modal-style')) {
            const style = document.createElement('style');
            style.id = 'ts-gender-modal-style';
            style.textContent = `
                @keyframes fadeScaleIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 验证兑换码
     */
    async verifyRedeemCode() {
        if (!this.redeemCode) return { valid: true };
        try {
            const response = await fetch(`${API_BASE}/redeem/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: this.redeemCode })
            });
            return await response.json();
        } catch (error) {
            console.error('验证兑换码失败:', error);
            return { valid: false, message: '网络错误，请稍后重试' };
        }
    }

    showGenderModal() {
        const modal = document.getElementById('genderModal');
        if (modal) modal.style.display = 'block';
    }

    hideGenderModal() {
        const modal = document.getElementById('genderModal');
        if (modal) modal.style.display = 'none';
        document.querySelectorAll('.ts-gender-option').forEach(opt => {
            opt.style.borderColor = 'transparent';
            opt.style.background = '';
        });
    }

    /**
     * 选择性别后保存数据并跳转抽牌页
     */
    submitTarotWithGender(gender) {
        const question = window.appState?.get?.('tarotQuestion') || window.appState?.get?.('selectedQuestion') || '运势指引';
        const categoryName = window.appState?.get?.('tarotCategory') || window.appState?.get?.('questionCategory') || this.matchType.title || '综合';
        const ruleType = CATEGORY_RULE_MAP[categoryName] || 'ganqing';

        if (window.appState) {
            window.appState.set('tarotGender', gender);
            window.appState.set('questionType', ruleType);
        }

        this.hideGenderModal();
        window.router.navigate(`/test/${this.matchType.id}/tarot/pick`);
    }

    /**
     * 选择测试方式
     */
    async handleMethodSelect(method) {
        if (this.isVerifying) return;

        // 兑换码验证流程
        if (this.redeemCode && !this.codeVerified) {
            this.isVerifying = true;

            const clickedCard = document.querySelector(`.method-card[data-method="${method}"]`);
            if (clickedCard) {
                clickedCard.style.opacity = '0.7';
                clickedCard.style.pointerEvents = 'none';
            }

            const verifyResult = await this.verifyRedeemCode();

            if (clickedCard) {
                clickedCard.style.opacity = '';
                clickedCard.style.pointerEvents = '';
            }

            this.isVerifying = false;

            if (!verifyResult.valid && !verifyResult.success) {
                window.showToast && window.showToast(verifyResult.message || '兑换码无效', 'error');
                return;
            }

            if (window.appState) {
                window.appState.set('redeemCode', this.redeemCode);
            }
            this.codeVerified = true;
        }

        const typeId = this.matchType.id;
        if (method === 'birthday') {
            let url = `/test/${typeId}/birthday`;
            if (this.redeemCode) {
                url += `?s=${encodeURIComponent(this.redeemCode)}`;
            }
            window.router.navigate(url);
        } else if (method === 'tarot') {
            this.showGenderModal();
        }
    }
}

export default TestMethodPage;

/**
 * 匹配游戏 测试选择页
 * 选择测试方式：生日匹配或直觉卡牌
 * 
 * 支持URL参数：
 * - /test/love?s=XHS12345678  兑换码，选择测试方式时需要先验证
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar, ProgressBar } from '../components/Common.js';
import { FeatureCardDetail } from '../components/FeatureCard.js';
import { authApi, userApi, getApiBaseUrl } from '../services/api.js';

// API 配置（动态获取）
const API_BASE = getApiBaseUrl();

export class TestSelectPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }
        
        // 解析URL参数获取兑换码
        const urlParams = new URLSearchParams(window.location.search);
        this.redeemCode = urlParams.get('s');
        this.isVerifying = false;
        this.codeVerified = false;  // 是否已验证通过
    }

    render() {
        if (!this.matchType) return '';

        return `
      <div class="page test-select-page">
        ${Navbar({
            title: this.matchType.title,
            showBack: true,
            showHistory: false,
            showProfile: false
        })}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 匹配类型详情 -->
            <section class="mt-4 mb-6 animate-fade-in-up">
              ${FeatureCardDetail(this.matchType)}
            </section>

            <!-- 测试方式选择 -->
            <section class="test-method-section animate-fade-in-up animate-delay-200">
              <h3 class="heading-3 mb-4 text-center">选择测试方式</h3>
              
              <!-- 价格信息（仅在无兑换码时显示）-->
              ${!this.redeemCode ? `
                <div class="price-info mb-4">
                  <div class="price-info__original">原价 <span class="price-info__original-value">¥29.8</span></div>
                  <div class="price-info__discount">
                    <span class="price-info__tag">限时优惠</span>
                    <span class="price-info__discount-value">¥19.8</span>
                  </div>
                </div>
              ` : ''}
              
              <div class="method-cards">
                <!-- 生日匹配 -->
                <div class="glass-card glass-card--interactive method-card" data-method="birthday">
                  <div class="method-card__icon">🎂</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title">生日匹配</h4>
                    <p class="method-card__description">输入双方生日，通过生日特质分析性格关系</p>
                    <div class="method-card__tag">
                      <span class="badge badge--primary">需要双方生日</span>
                    </div>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>

                <!-- 直觉塔罗测试 -->
                <div class="glass-card glass-card--interactive method-card" data-method="tarot">
                  <div class="method-card__icon">🃏</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title">直觉塔罗</h4>
                    <p class="method-card__description">凭直觉翻牌，通过卡牌符号解析关系</p>
                    <div class="method-card__tag">
                      <span class="badge badge--secondary">无需生日</span>
                    </div>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>
              </div>
            </section>

            <!-- 说明提示 -->
            <section class="tips-section mt-6 animate-fade-in-up animate-delay-300">
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

            <div class="mt-8 safe-area-bottom"></div>
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
                window.router.back();
            });
        }

        // 方法卡片点击
        document.querySelectorAll('.method-card').forEach(card => {
            card.addEventListener('click', () => {
                const method = card.dataset.method;
                this.handleMethodSelect(method);
            });
        });
    }

    /**
     * 验证兑换码
     */
    async verifyRedeemCode() {
        if (!this.redeemCode) {
            return { valid: true };  // 没有兑换码参数，跳过验证
        }

        try {
            const response = await fetch(`${API_BASE}/redeem/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: this.redeemCode })
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('验证兑换码失败:', error);
            return { valid: false, message: '网络错误，请稍后重试' };
        }
    }

    /**
     * 使用兑换码（标记已使用）
     */
    async useRedeemCode() {
        if (!this.redeemCode) return true;

        try {
            const response = await fetch(`${API_BASE}/redeem/use`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: this.redeemCode })
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('使用兑换码失败:', error);
            return false;
        }
    }

    /**
     * 显示Toast提示
     */
    showToast(message, type = 'error') {
        // 移除已存在的toast
        const existingToast = document.querySelector('.redeem-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `redeem-toast redeem-toast--${type}`;
        toast.innerHTML = `
            <span class="redeem-toast__icon">${type === 'error' ? '❌' : '✅'}</span>
            <span class="redeem-toast__message">${message}</span>
        `;
        
        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'error' ? 'rgba(220, 38, 38, 0.95)' : 'rgba(34, 197, 94, 0.95)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: toastIn 0.3s ease;
        `;

        // 添加动画样式
        if (!document.querySelector('#redeem-toast-style')) {
            const style = document.createElement('style');
            style.id = 'redeem-toast-style';
            style.textContent = `
                @keyframes toastIn {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes toastOut {
                    from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // 自动移除
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    async handleMethodSelect(method) {
        // 防止重复点击
        if (this.isVerifying) return;
        
        const typeId = this.matchType.id;

        // 测试模式下跳过登录和购买校验
        const serverState = window.appState?.get('serverState');
        if (serverState !== 'test') {
            // === 权限校验流程 ===
            // 1. 检查登录状态
            if (!authApi.isLoggedIn()) {
                // 未登录，保存当前页面状态，跳转登录
                sessionStorage.setItem('redirect_after_login', JSON.stringify({
                    path: `/test/${typeId}`,
                    page: 'detail',
                    testTypeId: typeId,
                    timestamp: Date.now()
                }));
                window.showToast('请先登录', 'default');
                window.router.navigate('/auth?action=login');
                return;
            }

            // 2. 检查服务权限（已登录的情况下）
            try {
                const sessionId = localStorage.getItem('app_session_id') || '';
                const permResult = await userApi.checkPermission(typeId, sessionId);
                
                if (permResult.data && !permResult.data.hasAccess) {
                    if (permResult.data.needsLogin) {
                        sessionStorage.setItem('redirect_after_login', JSON.stringify({
                            path: `/test/${typeId}`,
                            page: 'detail',
                            testTypeId: typeId,
                            timestamp: Date.now()
                        }));
                        window.router.navigate('/auth?action=login');
                        return;
                    }
                    if (permResult.data.needsPurchase) {
                        // 跳转支付页面
                        window.router.navigate(`/pay/${typeId}`);
                        return;
                    }
                }
            } catch (err) {
                // 权限检查失败时不阻塞流程，继续执行
                console.warn('权限检查失败，继续流程:', err.message);
            }
        } else {
            console.log(`[测试模式] 跳过登录和购买校验`);
        }

        // === 兑换码验证流程 ===
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
                this.showToast(verifyResult.message || '兑换码无效', 'error');
                return;
            }

            window.appState.set('redeemCode', this.redeemCode);
            this.codeVerified = true;
        }

        // 导航到下一页
        if (method === 'birthday') {
            window.router.navigate(`/test/${typeId}/birthday`);
        } else if (method === 'tarot') {
            window.router.navigate(`/test/${typeId}/tarot`);
        }
    }
}

export default TestSelectPage;

/**
 * 匹配游戏 首页
 * 展示匹配类型列表
 */

import { matchTypes } from '../data/matchTypes.js';
import { Navbar, HeroBanner } from '../components/Common.js';
import { FeatureCard } from '../components/FeatureCard.js';

export class HomePage {
    constructor() {
        this.matchTypes = matchTypes;
    }

    render() {
        return `
      <div class="page home-page">
        ${Navbar({
            title: '匹配游戏',
            showBack: false,
            showHistory: true,
            showProfile: true
        })}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 欢迎横幅 -->
            ${HeroBanner({
            icon: '✨',
            title: '发现你的性格契合度',
            subtitle: '探索人际关系的奥秘',
            buttonText: '开始匹配...'
        })}

            <!-- 场景测试标题 -->
            <section class="section-header mt-6 mb-4">
              <h2 class="heading-2 text-center" style="color: var(--color-text-secondary);">
                趣味测试
              </h2>
            </section>

            <!-- 功能卡片列表 -->
            <section class="feature-list">
              ${this.matchTypes.map((type, index) => `
                <div class="animate-fade-in-up animate-delay-${Math.min((index + 1) * 100, 500)} animate-hidden">
                  ${FeatureCard(type, { showBadge: true })}
                </div>
              `).join('')}
            </section>

            <!-- 底部间距 -->
            <div class="mt-8 safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `;
    }

    attachEvents() {
        // 初始化动画
        this.initAnimations();

        // 功能卡片点击
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const type = card.dataset.type;
                this.handleFeatureClick(type);
            });
        });

        // 开始测试按钮 —— 跳转到默认匹配类型（感情匹配）
        const heroBtn = document.querySelector('[data-action="hero-start"]');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                window.router.navigate('/test/love');
            });
        }

        // 导航按钮
        document.querySelectorAll('.navbar__icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleNavAction(action);
            });
        });
    }

    initAnimations() {
        const animatedElements = document.querySelectorAll('.animate-hidden');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('animate-hidden');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    handleFeatureClick(type) {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        console.log(`[${timestamp}] 选择了匹配类型: ${type}`);
        // 导航到测试选择页
        window.router.navigate(`/test/${type}`);
    }

    handleNavAction(action) {
        switch (action) {
            case 'history':
                this.goToHistory();
                break;
            case 'profile':
                this.goToProfile();
                break;
        }
    }

    /**
     * 跳转到个人中心
     * 已登录 → 个人详情页，未登录 → 登录注册页
     */
    goToProfile() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            window.router.navigate('/profile');
        } else {
            window.router.navigate('/auth?action=login');
        }
    }

    /**
     * 跳转到历史记录页面
     * 先从本地存储获取 userId 或 sessionId
     */
    goToHistory() {
        // 从本地存储获取 userId
        const userStr = localStorage.getItem('user');
        let userId = null;
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                userId = user.id || user.userId || null;
            } catch (e) { /* ignore */ }
        }

        // 从本地存储获取 sessionId
        const sessionId = localStorage.getItem('sessionId');

        console.log(`[历史记录] userId: ${userId}, sessionId: ${sessionId ? sessionId.slice(0, 8) + '...' : 'null'}`);

        // 至少需要一个标识才能查询
        if (!userId && !sessionId) {
            window.showToast('请先完成一次测试', 'error');
            return;
        }

        // 跳转到历史记录页面
        window.router.navigate('/history');
    }
}

export default HomePage;

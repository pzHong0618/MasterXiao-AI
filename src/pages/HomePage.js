/**
 * MasterXiao-AI 首页
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
            title: '趣测小站',
            showBack: false,
            showHistory: false,
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

        // 开始测试按钮
        const heroBtn = document.querySelector('[data-action="hero-start"]');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                // 滚动到功能列表
                document.querySelector('.feature-list')?.scrollIntoView({
                    behavior: 'smooth'
                });
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
        console.log(`选择了匹配类型: ${type}`);
        // 导航到测试选择页
        window.router.navigate(`/test/${type}`);
    }

    handleNavAction(action) {
        switch (action) {
            case 'history':
                window.showToast('历史记录功能开发中...');
                break;
            case 'profile':
                window.router.navigate('/profile');
                break;
        }
    }
}

export default HomePage;

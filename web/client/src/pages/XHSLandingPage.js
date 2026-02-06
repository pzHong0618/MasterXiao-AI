/**
 * 小红书引流落地页
 * 只显示指定的四个匹配类型：感情匹配、合作匹配、城市匹配、职业匹配
 * 
 * 支持URL参数：
 * - /xhs?t=love  点击"开始测试"直接跳转到感情匹配
 * - /xhs?t=cooperation  点击"开始测试"直接跳转到合作匹配
 * - /xhs?t=city  点击"开始测试"直接跳转到城市匹配
 * - /xhs?t=job  点击"开始测试"直接跳转到职业匹配
 * - /xhs?s=XHS12345678  兑换码参数，会传递到测试选择页面验证
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar, HeroBanner } from '../components/Common.js';
import { FeatureCard } from '../components/FeatureCard.js';

// 小红书引流显示的匹配类型ID
const XHS_MATCH_TYPES = ['love', 'cooperation', 'city', 'job'];

export class XHSLandingPage {
    constructor() {
        // 只获取指定的四个匹配类型
        this.matchTypes = XHS_MATCH_TYPES
            .map(id => getMatchTypeById(id))
            .filter(type => type !== undefined);
        
        // 解析URL参数
        const urlParams = new URLSearchParams(window.location.search);
        this.targetType = urlParams.get('t');
        this.redeemCode = urlParams.get('s');  // 兑换码
        
        // 验证参数是否在允许的类型列表中
        if (this.targetType && !XHS_MATCH_TYPES.includes(this.targetType)) {
            this.targetType = null;
        }
    }

    render() {
        // 根据是否有目标类型，调整按钮文字
        const buttonText = this.targetType ? '开始测试' : '选择测试';
        
        return `
      <div class="page home-page xhs-landing-page">
        ${Navbar({
            title: '趣味性格测试平台',
            showBack: false,
            showHistory: false,
            showProfile: false
        })}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 欢迎横幅 -->
            ${HeroBanner({
            icon: '✨',
            title: '发现你的性格契合度',
            subtitle: '探索人际关系的奥秘',
            buttonText: buttonText
        })}

            <!-- 场景测试标题 -->
            <section class="section-header mt-6 mb-4">
              <h2 class="heading-2 text-center" style="color: var(--color-text-secondary);">
                热门测试
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
                if (this.targetType) {
                    // 有URL参数，直接跳转到对应类型的测试页面
                    this.navigateToTest(this.targetType);
                } else {
                    // 没有参数，滚动到功能列表
                    document.querySelector('.feature-list')?.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
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

    /**
     * 导航到测试页面，如果有兑换码则携带
     */
    navigateToTest(type) {
        let url = `/test/${type}`;
        if (this.redeemCode) {
            url += `?s=${encodeURIComponent(this.redeemCode)}`;
        }
        window.router.navigate(url);
    }

    handleFeatureClick(type) {
        // 导航到测试选择页面，携带兑换码参数
        this.navigateToTest(type);
    }
}

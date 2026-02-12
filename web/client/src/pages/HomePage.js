/**
 * 匹配游戏 首页
 * 展示匹配类型列表
 */

import { matchTypes } from '../data/matchTypes.js';
import { Navbar, HeroBanner } from '../components/Common.js';
import { FeatureCard } from '../components/FeatureCard.js';
import { topicCategoryApi } from '../services/api.js';

export class HomePage {
    constructor() {
        this.matchTypes = matchTypes;
        this.topicCategories = []; // 从服务端获取的主题分类
    }

    render() {
        return `
      <div class="page home-page">
        ${Navbar({
            title: '趣测小站',
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

            <!-- 功能卡片列表（初始使用本地数据，init后会替换） -->
            <section class="feature-list" id="featureListSection">
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

    async init() {
        // 从服务端获取主题分类列表，替换功能卡片
        try {
            const result = await topicCategoryApi.getList();
            if (result.code === 200 && result.data && result.data.length > 0) {
                this.topicCategories = result.data;
                this.renderFeatureCards();
            }
        } catch (e) {
            console.warn('获取主题分类失败，使用本地数据:', e.message);
        }
    }

    /**
     * 根据服务端主题分类重新渲染功能卡片
     */
    renderFeatureCards() {
        const section = document.getElementById('featureListSection');
        if (!section) return;

        // 将服务端分类映射到本地 matchTypes
        const matchTypeMap = {};
        this.matchTypes.forEach(t => { matchTypeMap[t.id] = t; matchTypeMap[t.title] = t; });

        // 用于按服务端分类名称匹配本地数据
        const nameToIdMap = {
            '感情匹配': 'love',
            '合作关系': 'cooperation',
            '职场关系': 'career',
            'TA的想法和态度': 'thoughts',
            '职业发展': 'job',
            '城市方向': 'city',
            '宠物匹配': 'pet',
            '社交魅力': 'peach',
            '人脉分析': 'benefactor',
            'Yes or No': 'yesno',
            '二选一': 'choice'
        };

        const orderedTypes = [];
        for (const cat of this.topicCategories) {
            const id = nameToIdMap[cat.name];
            const matchType = id ? matchTypeMap[id] : matchTypeMap[cat.name];
            if (matchType) {
                orderedTypes.push(matchType);
            } else {
                // 服务端有但本地没有的分类，创建一个临时条目
                orderedTypes.push({
                    id: cat.name,
                    icon: '📂',
                    title: cat.name,
                    description: cat.name,
                    popular: false
                });
            }
        }

        section.innerHTML = orderedTypes.map((type, index) => `
            <div class="animate-fade-in-up animate-delay-${Math.min((index + 1) * 100, 500)}">
              ${FeatureCard(type, { showBadge: true })}
            </div>
        `).join('');

        // 重新绑定卡片点击事件
        section.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                this.handleFeatureClick(type);
            });
        });
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

        // 开始测试按钮 —— 跳转到主题列表页
        const heroBtn = document.querySelector('[data-action="hero-start"]');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                window.router.navigate('/topics');
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

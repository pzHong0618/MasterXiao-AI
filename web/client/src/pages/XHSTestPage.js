/**
 * 小红书测试页
 * 从 XHS 落地页"开始匹配..."按钮进入
 * 
 * 布局：
 * - 上半部分：从后台小红书菜单管理获取显示状态的菜单列表（可点选）
 * - 下半部分：选择测试方式（生日匹配 / 直觉塔罗）
 * 
 * 支持URL参数：
 * - /xhs/test?s=XHS6FTMGXVX  兑换码参数
 */

import { matchTypes as allMatchTypes, getMatchTypeById } from '../data/matchTypes.js';
import { Navbar } from '../components/Common.js';
import { FeatureCard } from '../components/FeatureCard.js';
import { xhsMenuApi, questionApi, getApiBaseUrl } from '../services/api.js';

// API 配置（动态获取）
const API_BASE = getApiBaseUrl();

// 菜单名称 → 本地 matchType id 的映射
const nameToIdMap = {
    '感情匹配': 'love',
    '合作关系': 'cooperation',
    '合作匹配': 'cooperation',
    '职场关系': 'career',
    '职业匹配': 'career',
    'TA的想法和态度': 'thoughts',
    '职业发展': 'job',
    '城市方向': 'city',
    '城市匹配': 'city',
    '宠物匹配': 'pet',
    '社交魅力': 'peach',
    '人脉分析': 'benefactor',
    'Yes or No': 'yesno',
    '二选一': 'choice'
};

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

export class XHSTestPage {
    constructor() {
        this.menuTypes = [];
        this.selectedType = null; // 用户选中的菜单项

        // 解析URL参数
        const urlParams = new URLSearchParams(window.location.search);
        this.redeemCode = urlParams.get('s');
        this.isVerifying = false;
        this.codeVerified = false;
        this.questions = [];
        this.questionInputEnabled = false;
        this.selectedQuestionId = null;
        this.userInputText = '';
    }

    render() {
        return `
      <div class="page xhs-test-page">
        ${Navbar({
            title: '趣味测试',
            showBack: true,
            showHistory: false,
            showProfile: false
        })}

        <main class="page-content">
          <div class="app-container">

            <!-- 菜单列表（从后台小红书菜单管理获取） -->
            <section class="feature-list mt-4" id="xhsMenuListSection">
              <div style="text-align:center;padding:24px;color:var(--color-text-tertiary);">加载中...</div>
            </section>

            <!-- 下一步按钮 -->
            <section class="mt-4 animate-fade-in-up animate-delay-200">
              <button class="btn btn--primary btn--full btn--lg" id="btnNextStep" style="border-radius:50px;letter-spacing:2px;">
                下一步
              </button>
            </section>

            <div class="mt-8 safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `;
    }

    async init() {
        try {
            const result = await xhsMenuApi.getList();
            if (result.code === 200 && result.data && result.data.length > 0) {
                const matchTypeMap = {};
                allMatchTypes.forEach(t => { matchTypeMap[t.id] = t; matchTypeMap[t.title] = t; });

                this.menuTypes = [];
                for (const menu of result.data) {
                    const id = nameToIdMap[menu.name];
                    const matchType = id ? matchTypeMap[id] : matchTypeMap[menu.name];
                    if (matchType) {
                        const item = { ...matchType };
                        // 用后台菜单的 name 作为卡片标题
                        item.title = menu.name;
                        if (menu.description) {
                            item.description = menu.description;
                        }
                        this.menuTypes.push(item);
                    } else {
                        this.menuTypes.push({
                            id: menu.name,
                            icon: '📂',
                            title: menu.name,
                            description: menu.description || menu.name,
                            popular: false
                        });
                    }
                }
                this.renderMenuCards();
            } else {
                const section = document.getElementById('xhsMenuListSection');
                if (section) section.innerHTML = '<div style="text-align:center;padding:24px;color:var(--color-text-tertiary);">暂无测试菜单</div>';
            }
        } catch (e) {
            console.warn('获取小红书菜单列表失败:', e.message);
            const section = document.getElementById('xhsMenuListSection');
            if (section) section.innerHTML = '<div style="text-align:center;padding:24px;color:var(--color-text-tertiary);">加载失败，请刷新重试</div>';
        }
    }

    renderMenuCards() {
        const section = document.getElementById('xhsMenuListSection');
        if (!section) return;

        section.innerHTML = this.menuTypes.map((type, index) => `
            <div class="animate-fade-in-up animate-delay-${Math.min((index + 1) * 100, 500)}">
              ${FeatureCard(type, { showBadge: true })}
            </div>
        `).join('');

        // 绑定卡片点击 → 选中该菜单项
        section.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectMenu(card.dataset.type);
            });
        });

        this.initAnimations();
    }

    /**
     * 选中某个菜单项，高亮并记录，同时加载该分类的题目
     */
    selectMenu(typeId) {
        this.selectedType = typeId;
        this.selectedQuestionId = null;
        this.userInputText = '';

        // 高亮选中项
        document.querySelectorAll('#xhsMenuListSection .feature-card').forEach(card => {
            if (card.dataset.type === typeId) {
                card.classList.add('feature-card--selected');
            } else {
                card.classList.remove('feature-card--selected');
            }
        });

        // 加载该分类下的题目（与 TestSelectPage 同逻辑）
        this.loadQuestions(typeId);
    }

    /**
     * 加载选中菜单对应的题目列表
     */
    async loadQuestions(typeId) {
        // 根据 typeId 获取 matchType 的标题作为分类名
        const matchType = this.menuTypes.find(t => t.id === typeId);
        if (!matchType) return;

        const category = matchType.title;
        try {
            const result = await questionApi.getByCategory(category);
            if (result.code === 200 && result.data) {
                this.questions = result.data.list || [];
                this.questionInputEnabled = !!result.data.questionInputEnabled;
            }
        } catch (e) {
            console.warn('获取题目列表失败:', e.message);
            this.questions = [];
        }
    }

    attachEvents() {
        this.initAnimations();

        // 返回按钮
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.router.back();
            });
        }

        // 菜单卡片点击
        document.querySelectorAll('#xhsMenuListSection .feature-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectMenu(card.dataset.type);
            });
        });

        // 下一步按钮 → 跳转到测试方式选择页
        const btnNext = document.getElementById('btnNextStep');
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.handleNextStep();
            });
        }
    }

    // ==================== 与 TestSelectPage 同样的判断逻辑 ====================

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

    /**
     * 获取最终选定的问题文本
     */
    getSelectedQuestionText() {
        if (this.userInputText && this.userInputText.trim()) {
            return this.userInputText.trim();
        }
        if (this.selectedQuestionId) {
            const selectedQ = this.questions.find(q => q.id === this.selectedQuestionId);
            return selectedQ ? selectedQ.title : '';
        }
        return '';
    }

    /**
     * 点击"下一步"：验证菜单选择，保存数据，跳转到测试方式选择页
     */
    async handleNextStep() {
        if (this.isVerifying) return;

        // 必须先选择一个菜单项
        if (!this.selectedType) {
            window.showToast('请先选择一个测试主题', 'error');
            return;
        }

        // 兑换码验证流程
        if (this.redeemCode && !this.codeVerified) {
            this.isVerifying = true;

            const btn = document.getElementById('btnNextStep');
            if (btn) { btn.disabled = true; btn.textContent = '验证中...'; }

            const verifyResult = await this.verifyRedeemCode();

            if (btn) { btn.disabled = false; btn.textContent = '下一步'; }
            this.isVerifying = false;

            if (!verifyResult.valid && !verifyResult.success) {
                window.showToast(verifyResult.message || '兑换码无效', 'error');
                return;
            }

            if (window.appState) {
                window.appState.set('redeemCode', this.redeemCode);
            }
            this.codeVerified = true;
        }

        // 保存选择的主题信息到全局状态
        const matchType = this.menuTypes.find(t => t.id === this.selectedType);
        const categoryName = matchType ? matchType.title : '综合';

        if (window.appState) {
            window.appState.set('tarotCategory', categoryName);
            window.appState.set('questionCategory', categoryName);
        }

        // 跳转到测试方式选择页
        let url = `/test/${this.selectedType}/method`;
        if (this.redeemCode) {
            url += `?s=${encodeURIComponent(this.redeemCode)}`;
        }
        window.router.navigate(url);
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
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        animatedElements.forEach(el => observer.observe(el));
    }
}

export default XHSTestPage;

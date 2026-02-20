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
import { authApi, userApi, questionApi, getApiBaseUrl } from '../services/api.js';

// API 配置（动态获取）
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
        this.questions = [];  // 动态获取的题目列表
        this.questionInputEnabled = false;  // 系统配置"问题输入"是否开启
        this.selectedQuestionId = null;  // 用户选中的题目ID
        this.userInputText = '';  // 用户输入的文本
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
            <section class="mt-2 mb-3 animate-fade-in-up">
              ${FeatureCardDetail(this.matchType)}
            </section>

            <!-- 测试题目列表（动态加载） -->
            <section class="question-list-section animate-fade-in-up animate-delay-100" id="questionListSection" style="display:none;">
              <div class="glass-card">
                <h3 class="heading-3 mb-4" style="color: var(--color-primary);">📋 选择测试题目</h3>
                <div id="questionListContainer">
                  <div class="loading-text" style="text-align:center;padding:12px;color:var(--color-text-tertiary);">加载中...</div>
                </div>
                <!-- 用户输入框（由系统配置控制） -->
               <div id="questionInputContainer" style="display:none;margin-top:20px;">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
                    <span style="font-size:16px;">💡</span>
                    <span style="font-size:13px;color:var(--color-primary);font-weight:500;">每次问一个准确的问题解答更准确</span>
                  </div>
                  <div style="background:#ffffff;border-radius:12px;">
                    <input type="text" id="userQuestionInput" placeholder="或者，输入你想问的问题..." style="width:100%;padding:14px 16px;border:none;background:transparent;font-size:14px;color:var(--color-text-primary);outline:none;box-sizing:border-box;border-radius:12px;" />
                  </div>
                </div>
              </div>
            </section>

            <!-- 下一步按钮 -->
            <section class="mt-4 animate-fade-in-up animate-delay-200">
              <button class="btn btn--primary btn--full btn--lg" id="btnNextStep" style="border-radius:50px;letter-spacing:2px;">
                下一步
              </button>
            </section>

            <!-- 说明提示 -->
            <section class="tips-section mt-3 animate-fade-in-up animate-delay-300">
              <div class="glass-card glass-card--light">
                <div class="tips-header">
                  <span>💡</span>
                  <span class="small-text">温馨提示</span>
                </div>
                <ul class="tips-list">
                  <li>选择一个你最关心的问题，解答会更精准</li>
                  <li>也可以输入自定义问题</li>
                  <li>仅供娱乐参考，不作为任何决策依据</li>
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

        // 下一步按钮 → 跳转到测试方式选择页
        const btnNext = document.getElementById('btnNextStep');
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.handleNextStep();
            });
        }
    }

    /**
     * 页面初始化：异步加载题目列表
     */
    async init() {
        if (!this.matchType) return;
        try {
            // 用主题标题作为分类名称请求题目
            const category = this.matchType.title;
            const result = await questionApi.getByCategory(category);
            if (result.code === 200 && result.data) {
                this.questions = result.data.list || [];
                this.questionInputEnabled = !!result.data.questionInputEnabled;
                this.renderQuestionList();
            }
        } catch (e) {
            console.warn('获取题目列表失败:', e.message);
        }
    }

    /**
     * 渲染题目列表到页面
     */
    renderQuestionList() {
        const section = document.getElementById('questionListSection');
        const container = document.getElementById('questionListContainer');
        const inputContainer = document.getElementById('questionInputContainer');
        if (!section || !container) return;

        if (this.questions.length === 0 && !this.questionInputEnabled) {
            // 没有题目也没有输入框，隐藏整个区域
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';

        if (this.questions.length > 0) {
            container.innerHTML = `
                <div class="question-radio-list">
                    ${this.questions.map((q, index) => `
                        <label class="question-radio-item glass-card glass-card--light" style="display:flex;align-items:center;gap:12px;padding:14px 16px;margin-bottom:8px;cursor:pointer;border-radius:12px;transition:all 0.2s;">
                            <input type="radio" name="questionSelect" value="${q.id}" style="accent-color:var(--color-primary);width:18px;height:18px;flex-shrink:0;" />
                            <span style="font-size:15px;color:var(--color-text-primary);">${q.title}</span>
                        </label>
                    `).join('')}
                </div>
            `;

            // 绑定单选框事件
            container.querySelectorAll('input[name="questionSelect"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.selectedQuestionId = parseInt(e.target.value);
                    // 选择题目时清空输入框
                    const input = document.getElementById('userQuestionInput');
                    if (input) {
                        input.value = '';
                        this.userInputText = '';
                    }
                    // 高亮选中项
                    container.querySelectorAll('.question-radio-item').forEach(item => {
                        item.style.background = '';
                        item.style.borderColor = '';
                    });
                    const parent = e.target.closest('.question-radio-item');
                    if (parent) {
                        parent.style.background = 'rgba(var(--color-primary-rgb, 124,58,237), 0.08)';
                        parent.style.borderColor = 'var(--color-primary)';
                    }
                });
            });
        } else {
            container.innerHTML = '';
        }

        // 控制用户输入框显示
        if (inputContainer) {
            inputContainer.style.display = this.questionInputEnabled ? 'block' : 'none';
            if (this.questionInputEnabled) {
                const input = document.getElementById('userQuestionInput');
                if (input) {
                    input.addEventListener('focus', () => {
                        this.selectedQuestionId = null;
                        container.querySelectorAll('input[name="questionSelect"]').forEach(radio => {
                            radio.checked = false;
                        });
                        container.querySelectorAll('.question-radio-item').forEach(item => {
                            item.style.background = '';
                            item.style.borderColor = '';
                        });
                    });
                    input.addEventListener('input', (e) => {
                        this.userInputText = e.target.value;
                    });
                }
            }
        }
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
     * 点击"下一步"：验证问题选择，保存数据，跳转到测试方式选择页
     */
    async handleNextStep() {
        if (this.isVerifying) return;

        const typeId = this.matchType.id;

        // === 检查是否已选择或输入问题 ===
        const hasSelectedQuestion = !!this.selectedQuestionId;
        const hasInputQuestion = !!(this.userInputText && this.userInputText.trim());

        if (!hasSelectedQuestion && !hasInputQuestion) {
            this.showToast('请选择或输入你想问的问题', 'error');
            const section = document.getElementById('questionListSection');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // === 兑换码验证流程 ===
        if (this.redeemCode && !this.codeVerified) {
            this.isVerifying = true;

            const btn = document.getElementById('btnNextStep');
            if (btn) { btn.disabled = true; btn.textContent = '验证中...'; }

            const verifyResult = await this.verifyRedeemCode();

            if (btn) { btn.disabled = false; btn.textContent = '下一步'; }
            this.isVerifying = false;

            if (!verifyResult.valid && !verifyResult.success) {
                this.showToast(verifyResult.message || '兑换码无效', 'error');
                return;
            }

            window.appState.set('redeemCode', this.redeemCode);
            this.codeVerified = true;
        }

        // 保存用户选择的题目到全局状态
        const question = this.getSelectedQuestionText();
        const categoryName = this.matchType.title || '综合';

        if (window.appState) {
            window.appState.set('tarotQuestion', question);
            window.appState.set('selectedQuestion', question);
            window.appState.set('tarotCategory', categoryName);
            window.appState.set('questionCategory', categoryName);
        }

        // 跳转到测试方式选择页
        let url = `/test/${typeId}/method`;
        if (this.redeemCode) {
            url += `?s=${encodeURIComponent(this.redeemCode)}`;
        }
        window.router.navigate(url);
    }
}

export default TestSelectPage;

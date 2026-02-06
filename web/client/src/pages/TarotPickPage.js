/**
 * 直觉卡牌 抽牌页
 * 选择6张牌放入槽位
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar, ProgressBar } from '../components/Common.js';

// 卡槽配置 - 两行布局：每行3个
const cardSlots = [
    { id: 1, label: '目标', row: 1 },
    { id: 2, label: '动力', row: 1 },
    { id: 3, label: '障碍', row: 1 },
    { id: 4, label: '资源', row: 2 },
    { id: 5, label: '支持', row: 2 },
    { id: 6, label: '结果', row: 2 }
];

export class TarotPickPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }
        
        // 从全局状态恢复已选择的卡牌
        const savedCards = window.appState.selectedTarotCards || [];
        this.selectedCards = [null, null, null, null, null, null];
        
        // 复制已保存的卡牌到本地状态
        savedCards.forEach((card, index) => {
            if (card && index < 6) {
                this.selectedCards[index] = card;
            }
        });
        
        // 计算当前应该选择的槽位（第一个空槽位）
        this.currentPickIndex = this.selectedCards.findIndex(card => card === null);
        if (this.currentPickIndex === -1) {
            this.currentPickIndex = 6; // 所有槽位都已填满
        }
    }

    render() {
        if (!this.matchType) return '';

        const allFilled = this.currentPickIndex >= 6;
        const currentSlot = cardSlots[this.currentPickIndex];
        
        return `
      <div class="page tarot-pick-page">
        ${Navbar({
            title: '',
            showBack: true,
            showHistory: false,
            showProfile: false
        })}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示器 -->
            <div class="tarot-progress">
              ${ProgressBar(6, 6, {
                  showText: false,
                  showSteps: true,
                  stepLabel: ''
              })}
            </div>

            <!-- 页面标题 -->
            <section class="pick-header animate-fade-in-up">
              <p class="pick-step">${allFilled ? '选牌完成' : `抽第 ${this.currentPickIndex + 1} 张牌`}</p>
              <h1 class="pick-title">未来一月运势的核心方向</h1>
            </section>

            <!-- 卡槽区域 -->
            <section class="pick-slots animate-fade-in-up animate-delay-100">
              <!-- 第一行：3个槽位 -->
              <div class="pick-slots-row">
                ${cardSlots.filter(s => s.row === 1).map((slot, idx) => this.renderSlot(slot, idx)).join('')}
              </div>
              <!-- 第二行：3个槽位 -->
              <div class="pick-slots-row">
                ${cardSlots.filter(s => s.row === 2).map((slot, idx) => this.renderSlot(slot, idx + 3)).join('')}
              </div>
            </section>

            <!-- 底部按钮 -->
            <section class="pick-footer animate-fade-in-up animate-delay-200">
              <button class="btn btn--primary btn--full btn--lg pick-btn" id="pickBtn">
                ${allFilled ? '查看结果' : '点击选牌'}
              </button>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `;
    }

    renderSlot(slot, index) {
        const isActive = index === this.currentPickIndex;
        const isFilled = this.selectedCards[index] !== null;
        const isPending = index > this.currentPickIndex;
        
        return `
            <div class="pick-slot ${isActive ? 'pick-slot--active' : ''} ${isFilled ? 'pick-slot--filled' : ''} ${isPending ? 'pick-slot--pending' : ''}"
                 data-slot-index="${index}">
                <div class="pick-slot__card">
                    ${isFilled ? '<div class="pick-slot__card-back"></div>' : ''}
                </div>
                <span class="pick-slot__label">${slot.label}</span>
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

        // 选牌按钮
        const pickBtn = document.getElementById('pickBtn');
        if (pickBtn) {
            pickBtn.addEventListener('click', () => {
                if (this.currentPickIndex >= 6) {
                    // 所有牌选完，查看结果
                    this.handleComplete();
                } else {
                    this.handlePick();
                }
            });
        }
    }

    handlePick() {
        if (this.currentPickIndex >= 6) return;

        // 跳转到卡牌选择页面
        window.router.navigate(`/test/${this.matchType.id}/tarot/select/${this.currentPickIndex}`);
    }

    handleComplete() {
        // 记录日志
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        console.log(`[${timestamp}] 抽牌完成，选中的牌:`, this.selectedCards);

        // 跳转到解读loading页面
        window.router.navigate(`/test/${this.matchType.id}/tarot/result-loading?question=未来一月运势的核心方向`);
    }
}

export default TarotPickPage;

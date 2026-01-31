/**
 * MasterXiao-AI 六爻塔罗牌页面
 * 翻牌起卦，每次翻3张牌，共翻6次
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { getYaoType, Hexagram, YAO_TYPES } from '../data/liuyao.js';
import { Navbar, ProgressBar } from '../components/Common.js';

export class TarotPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }

        this.currentRound = 0;  // 当前第几次翻牌 (0-5)
        this.totalRounds = 6;   // 共6次
        this.results = [];      // 每次翻牌的结果
        this.isFlipping = false;
        this.cardStates = [false, false, false]; // 3张牌的翻转状态
    }

    render() {
        if (!this.matchType) return '';

        return `
      <div class="page tarot-page">
        ${Navbar({
            title: '六爻塔罗牌',
            showBack: true,
            showHistory: false,
            showProfile: false
        })}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示 -->
            <section class="progress-section mt-4 mb-4">
              ${ProgressBar(this.currentRound, this.totalRounds, { showText: true })}
            </section>

            <!-- 指引说明 -->
            <section class="instruction-section mb-6 animate-fade-in-up">
              <div class="glass-card text-center">
                <div class="instruction-icon animate-float">🌙</div>
                <h3 class="heading-3 mb-2">第 ${this.currentRound + 1} 爻</h3>
                <p class="body-text-secondary">
                  ${this.getInstructionText()}
                </p>
              </div>
            </section>

            <!-- 问题展示 -->
            <section class="question-section mb-6 animate-fade-in-up animate-delay-100">
              <div class="glass-card glass-card--light text-center">
                <p class="small-text" style="color: var(--color-primary);">占卜问题</p>
                <p class="body-text mt-2">
                  ${this.getQuestionText()}
                </p>
              </div>
            </section>

            <!-- 翻牌区域 -->
            <section class="cards-section mb-6 animate-fade-in-up animate-delay-200">
              <div class="flip-cards-container">
                ${this.renderFlipCards()}
              </div>
              <p class="text-center small-text mt-3">
                点击卡牌翻转，翻完3张后自动计算结果
              </p>
            </section>

            <!-- 已完成的爻展示 -->
            ${this.results.length > 0 ? this.renderCompletedYaos() : ''}

          </div>
        </main>

        <!-- 底部操作栏 -->
        ${this.renderBottomBar()}
      </div>
    `;
    }

    getInstructionText() {
        const instructions = [
            '静下心来，想着你的问题，然后翻开3张牌',
            '保持专注，凭直觉选择',
            '相信你的第一感觉',
            '让内心指引你的选择',
            '即将得出卦象，继续翻牌',
            '最后一爻，完成占卜'
        ];
        return instructions[this.currentRound] || instructions[0];
    }

    getQuestionText() {
        const typeTexts = {
            'love': '你和TA的感情如何发展？',
            'career': '你和同事/领导的关系如何？',
            'cooperation': '这次合作是否值得？',
            'thoughts': 'TA对你的真实想法是什么？',
            'job': '你的职业发展方向如何？',
            'city': '哪个方向更适合你发展？',
            'peach': '你的桃花运势如何？',
            'benefactor': '谁是你的贵人？',
            'yesno': '这件事应该做吗？',
            'choice': '两个选择哪个更好？'
        };
        return typeTexts[this.matchType.id] || '你面临的问题将如何发展？';
    }

    renderFlipCards() {
        return `
      <div class="flip-cards-row">
        ${[0, 1, 2].map(index => `
          <div class="flip-card-wrapper" data-card-index="${index}">
            <div class="flip-card ${this.cardStates[index] ? 'flipped' : ''}">
              <!-- 背面 -->
              <div class="flip-card__face flip-card__back">
                <div class="flip-card__pattern">
                  <span class="pattern-symbol">☯</span>
                  <span class="pattern-number">${index + 1}</span>
                </div>
              </div>
              <!-- 正面 -->
              <div class="flip-card__face flip-card__front">
                <div class="flip-card__result ${this.cardStates[index] ? (this.getCardResult(index) ? 'face-up' : 'face-down') : ''}">
                  ${this.cardStates[index] ? (this.getCardResult(index) ? '☯' : '◯') : ''}
                </div>
                <div class="flip-card__label">
                  ${this.cardStates[index] ? (this.getCardResult(index) ? '正' : '反') : ''}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    }

    getCardResult(index) {
        // 如果卡片已翻转，返回随机结果（模拟正反面）
        if (!this.currentFlipResults) {
            this.currentFlipResults = [];
        }
        if (this.currentFlipResults[index] === undefined) {
            this.currentFlipResults[index] = Math.random() > 0.5;
        }
        return this.currentFlipResults[index];
    }

    renderCompletedYaos() {
        return `
      <section class="completed-yaos mt-4 animate-fade-in">
        <h4 class="small-text text-center mb-3" style="color: var(--color-text-tertiary);">
          已完成的爻
        </h4>
        <div class="yaos-display">
          ${this.results.map((result, index) => `
            <div class="yao-item">
              <span class="yao-position">${index + 1}爻</span>
              <span class="yao-symbol">${result.yaoType.symbol}</span>
              <span class="yao-name">${result.yaoType.name}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;
    }

    renderBottomBar() {
        const allFlipped = this.cardStates.every(s => s);

        if (allFlipped) {
            return `
        <div class="bottom-action-bar safe-area-bottom">
          <div class="action-bar__buttons">
            <button class="btn btn--primary btn--full" data-action="confirm-round">
              ${this.currentRound < this.totalRounds - 1 ? '确认，继续下一爻' : '完成起卦'}
            </button>
          </div>
        </div>
      `;
        }

        return `
      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__info text-center">
          <span class="small-text">已翻 ${this.cardStates.filter(s => s).length}/3 张</span>
        </div>
      </div>
    `;
    }

    attachEvents() {
        // 返回按钮
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.currentRound > 0) {
                    if (confirm('确定要退出吗？当前进度将丢失。')) {
                        window.router.back();
                    }
                } else {
                    window.router.back();
                }
            });
        }

        // 卡牌翻转
        document.querySelectorAll('.flip-card-wrapper').forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                const index = parseInt(wrapper.dataset.cardIndex);
                this.flipCard(index);
            });
        });

        // 确认按钮
        const confirmBtn = document.querySelector('[data-action="confirm-round"]');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.confirmRound();
            });
        }
    }

    flipCard(index) {
        if (this.cardStates[index] || this.isFlipping) return;

        this.isFlipping = true;
        this.cardStates[index] = true;

        // 更新卡牌UI
        const cardWrapper = document.querySelector(`[data-card-index="${index}"]`);
        const card = cardWrapper.querySelector('.flip-card');
        card.classList.add('flipped');

        // 更新结果显示
        setTimeout(() => {
            const resultEl = card.querySelector('.flip-card__result');
            const labelEl = card.querySelector('.flip-card__label');
            const isFaceUp = this.getCardResult(index);

            resultEl.textContent = isFaceUp ? '☯' : '◯';
            resultEl.classList.add(isFaceUp ? 'face-up' : 'face-down');
            labelEl.textContent = isFaceUp ? '正' : '反';

            this.isFlipping = false;

            // 检查是否全部翻完
            if (this.cardStates.every(s => s)) {
                this.rerender();
            }
        }, 300);
    }

    confirmRound() {
        // 计算本轮结果
        const faceUpCount = this.currentFlipResults.filter(r => r).length;
        const yaoType = getYaoType(faceUpCount);

        this.results.push({
            round: this.currentRound + 1,
            faceUpCount,
            yaoType
        });

        // 重置卡牌状态
        this.cardStates = [false, false, false];
        this.currentFlipResults = [];

        if (this.currentRound < this.totalRounds - 1) {
            // 继续下一爻
            this.currentRound++;
            this.rerender();
        } else {
            // 完成所有6爻，生成卦象
            this.completeHexagram();
        }
    }

    rerender() {
        const container = document.getElementById('app');
        container.innerHTML = this.render();
        this.attachEvents();
    }

    completeHexagram() {
        // 从结果中提取爻类型
        const yaos = this.results.map(r => r.yaoType);

        // 生成卦象
        const hexagram = new Hexagram(yaos);

        // 保存到状态
        window.appState.set('currentTest', {
            type: this.matchType.id,
            method: 'tarot',
            results: this.results,
            hexagram: hexagram.getDescription(),
            timestamp: Date.now()
        });

        // 跳转到结果页
        window.router.navigate(`/result/tarot`);
    }
}

export default TarotPage;

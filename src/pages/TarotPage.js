/**
 * MasterXiao-AI 直觉卡牌测试页面
 * 翻牌测试，每轮展示6张牌，选择3张翻开
 * 仅供娱乐参考
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { drawCards, generateTarotReading } from '../data/tarot.js';
import { Navbar, ProgressBar } from '../components/Common.js';

export class TarotPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }

        this.currentRound = 0;  // 当前轮次 (0-2)，共3轮
        this.totalRounds = 3;   // 共3轮
        this.cardsPerRound = 6; // 每轮展示6张牌
        this.selectCount = 3;   // 每轮选择3张
        this.results = [];      // 每轮翻牌的结果
        this.isFlipping = false;
        this.cardStates = new Array(this.cardsPerRound).fill(false); // 6张牌的翻转状态
        this.currentCards = []; // 当前轮的牌
        this.selectedCards = []; // 本轮已选择的牌
        this.allSelectedCards = []; // 所有选中的牌
        
        // 初始化第一轮的牌
        this.initRoundCards();
    }

    initRoundCards() {
        // 排除已选的牌，抽取新的牌
        const excludeIds = this.allSelectedCards.map(c => c.id);
        this.currentCards = drawCards(this.cardsPerRound);
        this.cardStates = new Array(this.cardsPerRound).fill(false);
        this.selectedCards = [];
    }

    render() {
        if (!this.matchType) return '';

        return `
      <div class="page tarot-page">
        ${Navbar({
            title: '直觉卡牌测试',
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
            <section class="instruction-section mb-4 animate-fade-in-up">
              <div class="glass-card text-center">
                <div class="instruction-icon animate-float">🃏</div>
                <h3 class="heading-3 mb-2">第 ${this.currentRound + 1} 轮抽牌</h3>
                <p class="body-text-secondary">
                  ${this.getInstructionText()}
                </p>
              </div>
            </section>

            <!-- 问题展示 -->
            <section class="question-section mb-4 animate-fade-in-up animate-delay-100">
              <div class="glass-card glass-card--light text-center">
                <p class="small-text" style="color: var(--color-primary);">测试问题</p>
                <p class="body-text mt-2">
                  ${this.getQuestionText()}
                </p>
              </div>
            </section>

            <!-- 翻牌区域 -->
            <section class="cards-section mb-4 animate-fade-in-up animate-delay-200">
              <div class="flip-cards-container">
                ${this.renderFlipCards()}
              </div>
              <p class="text-center small-text mt-3" id="card-hint">
                ${this.getCardHint()}
              </p>
            </section>

            <!-- 已完成的轮次展示 -->
            ${this.results.length > 0 ? this.renderCompletedRounds() : ''}

            <!-- 免责声明 -->
            <section class="disclaimer-section mt-4 mb-4">
              <p class="text-center small-text" style="color: var(--color-text-tertiary);">
                本测试仅供娱乐参考，不构成任何专业建议
              </p>
            </section>

          </div>
        </main>

        <!-- 底部操作栏 -->
        ${this.renderBottomBar()}
      </div>
    `;
    }

    getInstructionText() {
        const instructions = [
            '静下心来，凭直觉从下方6张牌中选择3张翻开',
            '继续保持专注，再选择3张牌',
            '最后一轮，完成你的选择'
        ];
        return instructions[this.currentRound] || instructions[0];
    }

    getQuestionText() {
        const typeTexts = {
            'love': '你和TA的性格契合度如何？',
            'career': '你和同事/领导的关系如何？',
            'cooperation': '这次合作是否值得？',
            'thoughts': 'TA对你的真实想法是什么？',
            'job': '你的职业发展方向如何？',
            'city': '哪个方向更适合你发展？',
            'peach': '你的社交魅力如何？',
            'benefactor': '谁是你身边的助力者？',
            'yesno': '这件事应该做吗？',
            'choice': '两个选择哪个更好？'
        };
        return typeTexts[this.matchType.id] || '你面临的问题将如何发展？';
    }

    getCardHint() {
        const selected = this.cardStates.filter(s => s).length;
        if (selected >= this.selectCount) {
            return '本轮选择完成，点击下方按钮继续';
        }
        return `请选择 ${this.selectCount - selected} 张牌`;
    }

    renderFlipCards() {
        return `
      <div class="flip-cards-grid">
        ${this.currentCards.map((card, index) => `
          <div class="flip-card-wrapper ${this.cardStates[index] ? 'selected' : ''}" data-card-index="${index}">
            <div class="flip-card ${this.cardStates[index] ? 'flipped' : ''}">
              <!-- 背面 -->
              <div class="flip-card__face flip-card__back">
                <div class="flip-card__pattern">
                  <span class="pattern-symbol">✦</span>
                  <span class="pattern-number">${index + 1}</span>
                </div>
              </div>
              <!-- 正面 -->
              <div class="flip-card__face flip-card__front">
                <div class="flip-card__result">
                  ${this.cardStates[index] ? card.symbol : ''}
                </div>
                <div class="flip-card__name">
                  ${this.cardStates[index] ? card.name : ''}
                </div>
                <div class="flip-card__label ${this.cardStates[index] ? (card.isUpright ? 'upright' : 'reversed') : ''}">
                  ${this.cardStates[index] ? card.position : ''}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    }

    renderCompletedRounds() {
        return `
      <section class="completed-rounds mt-4 animate-fade-in">
        <h4 class="small-text text-center mb-3" style="color: var(--color-text-tertiary);">
          已翻开的牌
        </h4>
        <div class="selected-cards-display">
          ${this.allSelectedCards.map((card, index) => `
            <div class="selected-card-item">
              <span class="card-symbol">${card.symbol}</span>
              <span class="card-name">${card.name}</span>
              <span class="card-position ${card.isUpright ? 'upright' : 'reversed'}">${card.position}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;
    }

    renderBottomBar() {
        const selected = this.cardStates.filter(s => s).length;
        const isRoundComplete = selected >= this.selectCount;

        if (isRoundComplete) {
            const isLastRound = this.currentRound >= this.totalRounds - 1;
            return `
      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__buttons">
          <button class="btn btn--primary btn--full" data-action="next-round">
            ${isLastRound ? '查看结果' : '下一轮'}
          </button>
        </div>
      </div>
    `;
        }

        return `
      <div class="bottom-action-bar safe-area-bottom">
        <div class="action-bar__info text-center">
          <span class="small-text">已选 ${selected}/${this.selectCount} 张 · 第 ${this.currentRound + 1}/${this.totalRounds} 轮</span>
        </div>
      </div>
    `;
    }

    attachEvents() {
        // 返回按钮
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.currentRound > 0 || this.allSelectedCards.length > 0) {
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

        // 下一轮按钮
        const nextRoundBtn = document.querySelector('[data-action="next-round"]');
        if (nextRoundBtn) {
            nextRoundBtn.addEventListener('click', () => {
                this.handleNextRound();
            });
        }
    }

    flipCard(index) {
        // 检查是否可以翻牌
        const selected = this.cardStates.filter(s => s).length;
        if (this.cardStates[index] || this.isFlipping || selected >= this.selectCount) return;

        this.isFlipping = true;
        this.cardStates[index] = true;

        // 更新卡牌UI
        const cardWrapper = document.querySelector(`[data-card-index="${index}"]`);
        const card = cardWrapper.querySelector('.flip-card');
        card.classList.add('flipped');
        cardWrapper.classList.add('selected');

        // 保存选中的牌
        this.selectedCards.push(this.currentCards[index]);

        // 更新结果显示
        setTimeout(() => {
            const selectedCard = this.currentCards[index];
            const resultEl = card.querySelector('.flip-card__result');
            const nameEl = card.querySelector('.flip-card__name');
            const labelEl = card.querySelector('.flip-card__label');

            resultEl.textContent = selectedCard.symbol;
            nameEl.textContent = selectedCard.name;
            labelEl.textContent = selectedCard.position;
            labelEl.classList.add(selectedCard.isUpright ? 'upright' : 'reversed');

            this.isFlipping = false;

            // 更新提示
            const hintEl = document.getElementById('card-hint');
            if (hintEl) {
                hintEl.textContent = this.getCardHint();
            }

            // 更新底部栏
            this.updateBottomBar();

            // 检查是否完成本轮选择
            const currentSelected = this.cardStates.filter(s => s).length;
            if (currentSelected >= this.selectCount) {
                this.completeRound();
            }
        }, 300);
    }

    updateBottomBar() {
        const bottomBar = document.querySelector('.bottom-action-bar');
        if (bottomBar) {
            const selected = this.cardStates.filter(s => s).length;
            const isRoundComplete = selected >= this.selectCount;

            if (isRoundComplete) {
                const isLastRound = this.currentRound >= this.totalRounds - 1;
                bottomBar.innerHTML = `
          <div class="action-bar__buttons">
            <button class="btn btn--primary btn--full" data-action="next-round">
              ${isLastRound ? '查看结果' : '下一轮'}
            </button>
          </div>
        `;
                // 重新绑定事件
                const nextRoundBtn = bottomBar.querySelector('[data-action="next-round"]');
                if (nextRoundBtn) {
                    nextRoundBtn.addEventListener('click', () => {
                        this.handleNextRound();
                    });
                }
            } else {
                bottomBar.innerHTML = `
          <div class="action-bar__info text-center">
            <span class="small-text">已选 ${selected}/${this.selectCount} 张 · 第 ${this.currentRound + 1}/${this.totalRounds} 轮</span>
          </div>
        `;
            }
        }
    }

    completeRound() {
        // 将本轮选中的牌添加到总选择中
        this.allSelectedCards.push(...this.selectedCards);

        // 保存本轮结果
        this.results.push({
            round: this.currentRound + 1,
            cards: [...this.selectedCards]
        });

        // 更新底部栏显示下一步按钮
        this.updateBottomBar();
    }

    handleNextRound() {
        if (this.currentRound < this.totalRounds - 1) {
            // 进入下一轮
            this.currentRound++;
            this.initRoundCards();
            this.rerender();
        } else {
            // 完成所有轮次，显示结果
            this.completeTest();
        }
    }

    rerender() {
        const container = document.getElementById('app');
        container.innerHTML = this.render();
        this.attachEvents();
    }

    completeTest() {
        // 生成卡牌解读
        const reading = generateTarotReading(this.allSelectedCards, this.matchType.id);

        // 保存到状态
        window.appState.set('currentTest', {
            type: this.matchType.id,
            method: 'tarot',
            results: this.results,
            allCards: this.allSelectedCards,
            reading: reading,
            timestamp: Date.now()
        });

        // 跳转到结果页
        window.router.navigate(`/result/tarot`);
    }
}

export default TarotPage;

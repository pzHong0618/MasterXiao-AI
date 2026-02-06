/**
 * 直觉塔罗 摇牌页
 * 6张牌排列（2行×3列），点击摇牌从6张中随机选3张
 * 每张牌正反随机（字=正面，背=反面），与铜钱抛掷规则一致
 * 正面显示塔罗牌图案（symbol + name），反面显示牌背
 * 摇6次后根据爻数据计算卦象，跳转到解读页
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar } from '../components/Common.js';
import { getGuaInfo, generateGuaCode, generateBianGuaCode, getMovingYaoPositions, getLunarDate } from '../utils/guaData.js';

const TOTAL_SHAKES = 6;
const COINS_PER_SHAKE = 3; // 每次摇3张牌（=3枚铜钱）
const YAO_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

export class TarotCardSelectionPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) { window.router.navigate('/'); return; }

        this.selectedCards = window.appState?.selectedTarotCards || [];
        this.shakeCount = 0;
        this.yaos = [];           // 6次爻数据
        this.collectedCards = []; // 正面（字）的牌
        this.isShaking = false;
    }

    render() {
        if (!this.matchType) return '';

        const cardsHtml = this.selectedCards.map((card, i) => `
          <div class="cs-card" data-idx="${i}" id="csCard${i}">
            <div class="cs-card__inner">
              <div class="cs-card__back">
                <span class="cs-card__star">✦</span>
              </div>
              <div class="cs-card__front">
                <span class="cs-card__symbol">${card.symbol || '✦'}</span>
                <span class="cs-card__name">${card.name || ''}</span>
              </div>
            </div>
          </div>
        `).join('');

        return `
      <div class="page tarot-card-selection-page">
        ${Navbar({ title: '摇牌', showBack: true, showHistory: false, showProfile: false })}
        <main class="page-content">
          <div class="cs-page-wrap">

            <div class="cs-title">命运之牌</div>
            <div class="cs-status" id="csStatus">第 1 / ${TOTAL_SHAKES} 次摇牌</div>

            <!-- 6张大牌 -->
            <div class="cs-card-grid" id="csCardGrid">
              ${cardsHtml}
            </div>

            <!-- 摇牌按钮 -->
            <div class="cs-shake-bar">
              <button class="btn btn--primary btn--full btn--lg" id="csShakeBtn">摇牌</button>
            </div>

            <!-- 底部收集区 -->
            <div class="cs-collect-area" id="csCollectArea">
              <div class="cs-collect-label">已获得的正面牌</div>
              <div class="cs-collect-slots" id="csCollectSlots"></div>
            </div>

          </div>
        </main>
      </div>`;
    }

    attachEvents() {
        document.querySelector('.navbar__back-btn')?.addEventListener('click', () => window.router.back());
        document.getElementById('csShakeBtn')?.addEventListener('click', () => this.doShake());
    }

    doShake() {
        if (this.isShaking || this.shakeCount >= TOTAL_SHAKES) return;
        this.isShaking = true;

        const cards = document.querySelectorAll('.cs-card');

        // 1. 重置所有牌
        cards.forEach(c => {
            c.classList.remove('cs-card--face-up', 'cs-card--face-down', 'cs-card--picked', 'cs-card--shake', 'cs-card--not-picked');
        });

        // 2. 晃动动画
        cards.forEach(c => c.classList.add('cs-card--shake'));

        // 3. 随机选3张（= 3枚铜钱）
        const indices = [0, 1, 2, 3, 4, 5];
        const picked = [];
        for (let i = 0; i < COINS_PER_SHAKE; i++) {
            const ri = Math.floor(Math.random() * indices.length);
            picked.push(indices[ri]);
            indices.splice(ri, 1);
        }

        // 4. 每张牌随机正面（字）或反面（背）
        const coins = picked.map(() => Math.random() > 0.5 ? '字' : '背');
        const backCount = coins.filter(c => c === '背').length;

        // 5. 根据背面数量计算爻（与小程序铜钱规则完全一致）
        const yao = this.calculateYao(backCount, this.shakeCount + 1, coins);

        // 6. 晃动结束后翻牌
        setTimeout(() => {
            cards.forEach(c => c.classList.remove('cs-card--shake'));

            // 未被选中的牌暗化
            cards.forEach((c, i) => {
                if (!picked.includes(i)) {
                    c.classList.add('cs-card--not-picked');
                }
            });

            picked.forEach((idx, pi) => {
                const isFaceUp = coins[pi] === '字';
                const cardEl = document.getElementById(`csCard${idx}`);
                if (!cardEl) return;

                setTimeout(() => {
                    cardEl.classList.add('cs-card--picked');
                    cardEl.classList.add(isFaceUp ? 'cs-card--face-up' : 'cs-card--face-down');

                    if (isFaceUp) {
                        this.collectedCards.push({
                            cardIndex: idx,
                            shakeRound: this.shakeCount,
                            cardData: this.selectedCards[idx]
                        });
                    }
                }, pi * 200);
            });

            // 7. 翻完后更新
            setTimeout(() => {
                this.yaos.push(yao);
                this.shakeCount++;
                this.updateCollectSlots();
                this.updateStatus();
                this.isShaking = false;

                if (this.shakeCount >= TOTAL_SHAKES) {
                    this.onAllShakesDone();
                }
            }, COINS_PER_SHAKE * 200 + 400);

        }, 600);
    }

    /**
     * 根据背面数量计算爻（与小程序铜钱规则完全一致）
     * 3背=老阳(动) / 2背=少阳 / 1背=少阴 / 0背=老阴(动)
     */
    calculateYao(backCount, step, coins) {
        let value, isMoving, name, symbol;

        switch (backCount) {
            case 3: // 三背 - 老阳 - 阳动
                value = 1; isMoving = true;
                name = '老阳（三背）'; symbol = '○';
                break;
            case 2: // 二背一字 - 少阳 - 阳静
                value = 1; isMoving = false;
                name = '少阳（二背一字）'; symbol = '⚊';
                break;
            case 1: // 一背二字 - 少阴 - 阴静
                value = 0; isMoving = false;
                name = '少阴（一背二字）'; symbol = '⚋';
                break;
            case 0: // 三字 - 老阴 - 阴动
            default:
                value = 0; isMoving = true;
                name = '老阴（三字）'; symbol = '×';
                break;
        }

        return {
            value, isMoving, name, symbol,
            position: YAO_NAMES[step - 1],
            step, backCount, coins
        };
    }

    updateStatus() {
        const el = document.getElementById('csStatus');
        if (!el) return;
        if (this.shakeCount >= TOTAL_SHAKES) {
            el.textContent = `摇牌完成！共获得 ${this.collectedCards.length} 张正面牌`;
        } else {
            el.textContent = `第 ${this.shakeCount + 1} / ${TOTAL_SHAKES} 次摇牌`;
        }
    }

    updateCollectSlots() {
        const container = document.getElementById('csCollectSlots');
        if (!container) return;
        container.innerHTML = this.collectedCards.map((item, i) => {
            const card = item.cardData || {};
            return `
              <div class="cs-mini-card cs-mini-card--enter" style="animation-delay: ${i * 0.05}s">
                <div class="cs-mini-card__face">
                  <span class="cs-mini-card__symbol">${card.symbol || '✦'}</span>
                  <span class="cs-mini-card__name">${card.name || ''}</span>
                </div>
              </div>`;
        }).join('');
    }

    onAllShakesDone() {
        const btn = document.getElementById('csShakeBtn');
        if (!btn) return;

        // 计算卦象
        try {
            const guaCode = generateGuaCode(this.yaos);
            const benGuaInfo = getGuaInfo(guaCode);
            const bianGuaCode = generateBianGuaCode(this.yaos);
            const bianGuaInfo = getGuaInfo(bianGuaCode);
            const movingPositions = getMovingYaoPositions(this.yaos);
            const lunarDate = getLunarDate();

            // 获取问题信息
            const question = window.appState?.get?.('tarotQuestion') || '运势指引';
            const questionCategory = window.appState?.get?.('questionCategory') || '综合';
            const gender = window.appState?.get?.('gender') || '';

            // 组装 guaData（与小程序完全一致的结构）
            const guaData = {
                question,
                benGuaInfo,
                bianGuaInfo,
                yaos: this.yaos,
                movingPositions,
                questionCategory,
                gender
            };

            console.log('[摇牌完成] 卦象数据:', {
                本卦: benGuaInfo.name,
                变卦: bianGuaInfo.name,
                动爻: movingPositions,
                爻数据: this.yaos.map(y => `${y.position}: ${y.name} ${y.symbol}`),
                正面牌: this.collectedCards.map(c => c.cardData?.name)
            });

            // 保存到全局状态
            if (window.appState) {
                window.appState.set('guaData', guaData);
                window.appState.set('yaos', this.yaos);
                window.appState.set('benGuaInfo', benGuaInfo);
                window.appState.set('bianGuaInfo', bianGuaInfo);
                window.appState.set('movingPositions', movingPositions);
                window.appState.set('lunarDate', lunarDate);
            }

            btn.textContent = '开始解读';
            btn.onclick = () => {
                const q = encodeURIComponent(question);
                window.router.navigate(`/test/${this.matchType.id}/tarot/result-loading?question=${q}`);
            };

        } catch (error) {
            console.error('[摇牌] 卦象计算失败:', error);
            btn.textContent = '重新摇牌';
            btn.onclick = () => {
                this.shakeCount = 0;
                this.yaos = [];
                this.collectedCards = [];
                this.isShaking = false;
                this.updateStatus();
                this.updateCollectSlots();
                document.querySelectorAll('.cs-card').forEach(c => {
                    c.classList.remove('cs-card--face-up', 'cs-card--face-down', 'cs-card--picked', 'cs-card--not-picked');
                });
                btn.textContent = '摇牌';
                btn.onclick = () => this.doShake();
            };
        }
    }
}

export default TarotCardSelectionPage;
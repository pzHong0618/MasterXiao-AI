/**
 * 直觉塔罗 抽牌页
 * 圆环牌轮排列，手指上下滑动旋转牌轮
 * 点击牌 → 生成爻数据 → 单数牌背面/双数牌正面 → 放入槽框
 * 抽满6张后点击"开始解读"跳转到解读页
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar } from '../components/Common.js';
import { getGuaInfo, generateGuaCode, generateBianGuaCode, getMovingYaoPositions, getLunarDate } from '../utils/guaData.js';
import { matchRecordApi } from '../services/api.js';
import { getSessionId } from '../scripts/state.js';

const TOTAL_CARDS = 72;
const CARDS_TO_DRAW = 6;
const SLOT_LABELS = ['目标', '动力', '障碍', '资源', '支持', '结果'];

// 爻位置名称（与小程序保持一致）
const YAO_POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

/**
 * 生成单张牌的爻数据（模拟抛掷铜钱）
 * @param {number} step - 当前步骤 (1-6)
 * @returns {object} yao 对象
 */
function generateYaoData(step) {
    const coin1 = Math.random() > 0.5 ? '背' : '字';
    const coin2 = Math.random() > 0.5 ? '背' : '字';
    const coin3 = Math.random() > 0.5 ? '背' : '字';
    const coins = [coin1, coin2, coin3];
    const backCount = coins.filter(c => c === '背').length;
    
    let value, isMoving, name, symbol;
    
    switch (backCount) {
        case 3:
            value = 1;
            isMoving = true;
            name = '老阳（三背）';
            symbol = '○';
            break;
        case 2:
            value = 1;
            isMoving = false;
            name = '少阳（二背一字）';
            symbol = '⚊';
            break;
        case 1:
            value = 0;
            isMoving = false;
            name = '少阴（一背二字）';
            symbol = '⚋';
            break;
        case 0:
        default:
            value = 0;
            isMoving = true;
            name = '老阴（三字）';
            symbol = '×';
            break;
    }
    
    const position = YAO_POSITION_NAMES[step - 1];
    
    return {
        value,
        isMoving,
        name,
        symbol,
        position,
        step,
        backCount,
        coins
    };
}

// 响应式半径
function getWheelRadius() {
    const vw = window.innerWidth;
    const size = Math.max(vw * 1.4, 600);
    const mobileSize = vw * 1.6;
    const wheelSize = vw <= 500 ? mobileSize : size;
    return wheelSize / 2 - 20;
}

export class TarotPickPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) { window.router.navigate('/'); return; }

        this.currentRotation = 0;
        this.isDragging = false;
        this.hasMoved = false;
        this.startY = 0;
        this.lastRotation = 0;
        this.velocity = 0;
        this.lastMoveTime = 0;
        this.lastMoveY = 0;
        this.animFrameId = null;
        this._cleanups = [];

        // 已选的牌：数组长度6，null=空槽
        this.pickedCards = new Array(CARDS_TO_DRAW).fill(null);
        this.usedCardIndices = new Set(); // 已抽过的牌索引
        this.isShowingPreview = false;

        // 六爻记录
        this.yaos = [];
        this.yaoHistory = [];
        this.currentStep = 0;

        // 解读状态
        this.isLoading = false;
    }

    get pickedCount() {
        return this.pickedCards.filter(c => c !== null).length;
    }

    render() {
        if (!this.matchType) return '';

        const angleStep = 360 / TOTAL_CARDS;
        const radius = getWheelRadius();
        let cardsHtml = '';
        for (let i = 0; i < TOTAL_CARDS; i++) {
            const angle = i * angleStep;
            cardsHtml += `
                <div class="wheel-card" data-idx="${i}"
                     style="transform: rotate(${angle}deg) translateY(-${radius}px)">
                  <div class="wheel-card__face"></div>
                </div>`;
        }

        // 顶部6个槽框
        const slotsHtml = SLOT_LABELS.map((label, i) => `
          <div class="pick-slot" id="pickSlot${i}" data-slot="${i}">
            <div class="pick-slot__empty">
              <span class="pick-slot__label">${label}</span>
            </div>
          </div>
        `).join('');

        return `
      <div class="page tarot-pick-page">
        ${Navbar({ title: '抽牌', showBack: true, showHistory: false, showProfile: false })}
        <main class="page-content">
          <div class="pick-page-wrap">
            <!-- 顶部槽框 -->
            <div class="pick-slots-bar" id="pickSlotsBar">
              ${slotsHtml}
            </div>
            <div class="pick-hint-bar">
              <span class="pick-hint-text">点击牌轮中的牌抽取，共需抽 ${CARDS_TO_DRAW} 张</span>
            </div>
            <div class="pick-wheel-viewport" id="wheelViewport">
              <div class="pick-wheel" id="pickWheel">
                ${cardsHtml}
              </div>
            </div>
            <!-- 底部开始解读按钮 -->
            <div class="pick-bottom-bar">
              <button class="btn btn--primary btn--full btn--lg pick-next-btn" id="pickNextBtn">
                开始解读
              </button>
            </div>
          </div>
        </main>
      </div>`;
    }

    attachEvents() {
        document.querySelector('.navbar__back-btn')?.addEventListener('click', () => window.router.back());

        // 卡牌点击抽牌
        document.getElementById('pickWheel')?.addEventListener('click', (e) => {
            if (this.hasMoved || this.isShowingPreview || this.isLoading) return;
            const card = e.target.closest('.wheel-card');
            if (card) {
                const idx = parseInt(card.dataset.idx);
                this.handleDrawOne(idx, card);
            }
        });

        // 开始解读
        document.getElementById('pickNextBtn')?.addEventListener('click', () => this.handleStartDivination());

        const vp = document.getElementById('wheelViewport');
        if (!vp) return;

        // touch
        vp.addEventListener('touchstart', (e) => {
            this.stopInertia();
            this.hasMoved = false;
            this.onDragStart(e.touches[0].clientY);
        }, { passive: true });
        vp.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.hasMoved = true;
            this.onDragMove(e.touches[0].clientY);
        }, { passive: false });
        vp.addEventListener('touchend', () => this.onDragEnd());

        // mouse
        vp.addEventListener('mousedown', (e) => {
            this.stopInertia();
            this.hasMoved = false;
            this.onDragStart(e.clientY);
        });
        const onMM = (e) => { if (this.isDragging) { this.hasMoved = true; this.onDragMove(e.clientY); } };
        const onMU = () => { if (this.isDragging) this.onDragEnd(); };
        document.addEventListener('mousemove', onMM);
        document.addEventListener('mouseup', onMU);
        this._cleanups.push(() => {
            document.removeEventListener('mousemove', onMM);
            document.removeEventListener('mouseup', onMU);
        });
    }

    /* ---- 拖动 ---- */
    onDragStart(y) {
        this.isDragging = true;
        this.startY = y;
        this.lastRotation = this.currentRotation;
        this.velocity = 0;
        this.lastMoveTime = Date.now();
        this.lastMoveY = y;
    }
    onDragMove(y) {
        if (!this.isDragging) return;
        this.currentRotation = this.lastRotation + (y - this.startY) * 0.45;
        this.applyRotation();
        const now = Date.now(), dt = now - this.lastMoveTime;
        if (dt > 0) this.velocity = ((y - this.lastMoveY) / dt) * 0.45;
        this.lastMoveTime = now;
        this.lastMoveY = y;
    }
    onDragEnd() {
        this.isDragging = false;
        if (Math.abs(this.velocity) > 0.02) this.startInertia();
    }
    startInertia() {
        const step = () => {
            this.velocity *= 0.96;
            if (Math.abs(this.velocity) < 0.005) { this.animFrameId = null; return; }
            this.currentRotation += this.velocity * 16;
            this.applyRotation();
            this.animFrameId = requestAnimationFrame(step);
        };
        this.animFrameId = requestAnimationFrame(step);
    }
    stopInertia() {
        if (this.animFrameId) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
    }
    applyRotation() {
        const el = document.getElementById('pickWheel');
        if (el) el.style.transform = `rotate(${this.currentRotation}deg)`;
    }

    /* ---- 抽一张牌 ---- */
    handleDrawOne(cardIdx, cardElement) {
        if (this.pickedCount >= CARDS_TO_DRAW) {
            window.showToast && window.showToast('已抽满6张牌，请点击开始解读', 'default');
            return;
        }

        if (this.usedCardIndices.has(cardIdx)) {
            window.showToast && window.showToast('这张牌已被抽过，请选其他牌', 'default');
            return;
        }

        this.stopInertia();
        this.usedCardIndices.add(cardIdx);

        if (cardElement) {
            cardElement.classList.add('wheel-card--used');
        }

        // 当前步骤 +1（1-6）
        this.currentStep++;
        const stepNum = this.currentStep;

        // 生成爻数据
        const yaoData = generateYaoData(stepNum);

        // 记录爻
        const newYao = {
            value: yaoData.value,
            isMoving: yaoData.isMoving,
            name: yaoData.name,
            symbol: yaoData.symbol,
            position: yaoData.position
        };
        this.yaos.push(newYao);

        // 记录历史
        const historyItem = {
            step: yaoData.step,
            position: yaoData.position,
            name: yaoData.name,
            symbol: yaoData.symbol,
            isMoving: yaoData.isMoving,
            backCount: yaoData.backCount,
            cardIdx: cardIdx
        };
        this.yaoHistory.push(historyItem);

        // 找到第一个空槽
        const slotIdx = this.pickedCards.findIndex(c => c === null);

        // 单数牌(1,3,5)背面，双数牌(2,4,6)正面
        const isReversed = (stepNum % 2 === 1);
        const cardData = {
            id: cardIdx,
            step: stepNum,
            yao: newYao,
            isReversed: isReversed,
            label: SLOT_LABELS[slotIdx],
            symbol: yaoData.symbol,
            positionName: yaoData.position
        };

        this.pickedCards[slotIdx] = cardData;
        this.fillSlot(slotIdx, cardData);

        console.log(`[抽牌] 第${stepNum}张 ${yaoData.position}：${yaoData.name} (${yaoData.symbol}) ${isReversed ? '【背面/逆位】' : '【正面/正位】'}`);
    }

    /* ---- 填充槽框 ---- */
    fillSlot(slotIdx, cardData) {
        const slotEl = document.getElementById(`pickSlot${slotIdx}`);
        if (!slotEl) return;

        const faceClass = cardData.isReversed ? 'pick-slot__back' : 'pick-slot__front';
        const faceIcon = cardData.isReversed ? '✦' : cardData.symbol;
        const rotateStyle = cardData.isReversed ? 'transform: rotate(180deg);' : '';

        slotEl.innerHTML = `
          <div class="pick-slot__filled ${faceClass}" style="${rotateStyle}">
            <span class="pick-slot__symbol">${faceIcon}</span>
            <span class="pick-slot__name">${cardData.positionName}</span>
          </div>
        `;
        slotEl.classList.add('pick-slot--filled');
        if (cardData.isReversed) {
            slotEl.classList.add('pick-slot--reversed');
        }

        const remaining = CARDS_TO_DRAW - this.pickedCount;
        const hint = document.querySelector('.pick-hint-text');
        if (hint) {
            if (remaining > 0) {
                hint.textContent = `还需抽 ${remaining} 张牌`;
            } else {
                hint.textContent = '已抽满 6 张牌，点击开始解读';
            }
        }
    }

    /* ---- 开始解读 ---- */
    async handleStartDivination() {
        const remaining = CARDS_TO_DRAW - this.pickedCount;
        if (remaining > 0) {
            window.showToast && window.showToast(`请再抽 ${remaining} 张牌`, 'error');
            return;
        }

        if (this.isLoading) return;
        this.isLoading = true;

        const btn = document.getElementById('pickNextBtn');
        if (btn) {
            btn.disabled = true;
            btn.classList.add('disabled');
            btn.textContent = '正在准备...';
        }

        try {
            // 计算卦象
            const guaCode = generateGuaCode(this.yaos);
            const benGuaInfo = getGuaInfo(guaCode);
            const bianGuaCode = generateBianGuaCode(this.yaos);
            const bianGuaInfo = getGuaInfo(bianGuaCode);
            const movingPositions = getMovingYaoPositions(this.yaos);
            const lunarDate = getLunarDate();

            // 获取问题信息
            const question = window.appState?.get?.('tarotQuestion') || window.appState?.get?.('selectedQuestion') || '运势指引';
            const questionCategory = window.appState?.get?.('questionCategory') || window.appState?.get?.('tarotCategory') || '综合';
            const gender = window.appState?.get?.('tarotGender') || window.appState?.get?.('gender') || '';

            // 组装 guaData（与 TarotCardSelectionPage 完全一致的结构）
            const guaData = {
                question,
                benGuaInfo,
                bianGuaInfo,
                yaos: this.yaos,
                movingPositions,
                questionCategory,
                gender
            };

            console.log('[抽牌完成] 卦象数据:', {
                本卦: benGuaInfo.name,
                变卦: bianGuaInfo.name,
                动爻: movingPositions,
                爻数据: this.yaos.map(y => `${y.position}: ${y.name} ${y.symbol}`)
            });

            // 保存到全局状态
            if (window.appState) {
                window.appState.set('guaData', guaData);
                window.appState.set('yaos', this.yaos);
                window.appState.set('yaoHistory', this.yaoHistory);
                window.appState.set('benGuaInfo', benGuaInfo);
                window.appState.set('bianGuaInfo', bianGuaInfo);
                window.appState.set('movingPositions', movingPositions);
                window.appState.set('lunarDate', lunarDate);
                window.appState.set('drawnTarotCards', this.pickedCards);
            }

            // 创建匹配记录
            const sessionId = getSessionId();
            const testData = {
                type: this.matchType.id,
                method: 'tarot',
                guaData: {
                    question,
                    questionCategory,
                    gender,
                    benGua: benGuaInfo.name,
                    bianGua: bianGuaInfo.name,
                    movingPositions,
                    yaos: this.yaos.map(y => ({ position: y.position, name: y.name, symbol: y.symbol }))
                },
                pickedCards: this.pickedCards.map(c => ({
                    step: c.step,
                    label: c.label,
                    isReversed: c.isReversed,
                    positionName: c.positionName,
                    symbol: c.symbol
                })),
                timestamp: Date.now()
            };

            try {
                let userId = null;
                try {
                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        userId = user.id || user.userId || null;
                    }
                } catch (e) { /* ignore */ }

                const result = await matchRecordApi.create(sessionId, testData, userId);
                console.log('匹配记录创建成功:', result);
                testData.recordId = result.data?.recordId;
                testData.sessionId = sessionId;
            } catch (error) {
                console.error('创建匹配记录失败:', error);
                testData.sessionId = sessionId;
            }

            window.appState?.set('currentTest', testData);

            // 跳转到解读加载页（由该页面发起解读请求）
            const q = encodeURIComponent(question);
            window.router.navigate(`/test/${this.matchType.id}/tarot/result-loading?question=${q}`);

        } catch (error) {
            console.error('[解读准备失败]', error);
            window.showToast && window.showToast('卦象计算失败，请重试', 'error');
            this.isLoading = false;
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('disabled');
                btn.textContent = '开始解读';
            }
        }
    }

    destroy() {
        this.stopInertia();
        this._cleanups.forEach(fn => fn());
    }
}

export default TarotPickPage;

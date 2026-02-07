/**
 * 直觉塔罗 抽牌页
 * 圆环牌轮排列，手指上下滑动旋转牌轮
 * 每次点击一张牌 → 悬浮放大显示 → 重选/确定 → 确定后翻开放入顶部槽框
 * 抽满6张后点击下一步进入摇牌页
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar } from '../components/Common.js';
import { drawFromFullDeck, FULL_DECK } from '../data/tarot.js';

const TOTAL_CARDS = 72;
const CARDS_TO_DRAW = 6;
const SLOT_LABELS = ['目标', '动力', '障碍', '资源', '支持', '结果'];

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
        this.usedCardIds = new Set(); // 已抽过的牌ID，避免重复
        this.isShowingPreview = false;
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
            <!-- 底部下一步 -->
            <div class="pick-bottom-bar">
              <button class="btn btn--primary btn--full btn--lg pick-next-btn" id="pickNextBtn">
                下一步
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
            if (this.hasMoved || this.isShowingPreview) return;
            const card = e.target.closest('.wheel-card');
            if (card) this.handleDrawOne();
        });

        // 下一步
        document.getElementById('pickNextBtn')?.addEventListener('click', () => this.handleNext());

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
    handleDrawOne() {
        if (this.pickedCount >= CARDS_TO_DRAW) {
            window.showToast && window.showToast('已抽满6张牌，请点击下一步', 'default');
            return;
        }
        this.stopInertia();

        // 从78张牌中随机抽一张（排除已选的）
        const available = FULL_DECK.filter(c => !this.usedCardIds.has(c.id));
        const card = { ...available[Math.floor(Math.random() * available.length)] };

        // 显示悬浮预览
        this.showCardPreview(card);
    }

    /* ---- 悬浮预览 ---- */
    showCardPreview(card) {
        this.isShowingPreview = true;

        const overlay = document.createElement('div');
        overlay.className = 'pick-preview-overlay';
        overlay.innerHTML = `
          <div class="pick-preview-wrap">
            <div class="pick-preview-card">
              <div class="pick-preview-card__inner">
                <div class="pick-preview-card__back">
                  <span class="pick-preview-star">✦</span>
                </div>
                <div class="pick-preview-card__front">
                  <span class="pick-preview-symbol">${card.symbol || '✦'}</span>
                  <span class="pick-preview-name">${card.name || ''}</span>
                </div>
              </div>
            </div>
            <div class="pick-preview-btns">
              <button class="btn btn--secondary pick-preview-btn" id="previewReselect">重选</button>
              <button class="btn btn--primary pick-preview-btn" id="previewConfirm">确定</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        // 重选
        overlay.querySelector('#previewReselect').addEventListener('click', () => {
            overlay.remove();
            this.isShowingPreview = false;
        });

        // 确定 → 翻开 → 飞入槽框
        overlay.querySelector('#previewConfirm').addEventListener('click', () => {
            // 翻开牌
            const cardInner = overlay.querySelector('.pick-preview-card__inner');
            cardInner.classList.add('flipped');

            // 找到第一个空槽
            const slotIdx = this.pickedCards.findIndex(c => c === null);
            this.pickedCards[slotIdx] = card;
            this.usedCardIds.add(card.id);

            // 翻开动画完成后飞入槽
            setTimeout(() => {
                overlay.remove();
                this.isShowingPreview = false;
                this.fillSlot(slotIdx, card);
            }, 500);
        });
    }

    /* ---- 填充槽框 ---- */
    fillSlot(slotIdx, card) {
        const slotEl = document.getElementById(`pickSlot${slotIdx}`);
        if (!slotEl) return;

        slotEl.innerHTML = `
          <div class="pick-slot__filled">
            <span class="pick-slot__symbol">${card.symbol || '✦'}</span>
            <span class="pick-slot__name">${card.name || ''}</span>
          </div>
        `;
        slotEl.classList.add('pick-slot--filled');

        // 更新提示文字
        const remaining = CARDS_TO_DRAW - this.pickedCount;
        const hint = document.querySelector('.pick-hint-text');
        if (hint) {
            if (remaining > 0) {
                hint.textContent = `还需抽 ${remaining} 张牌`;
            } else {
                hint.textContent = '已抽满 6 张牌，点击下一步继续';
            }
        }
    }

    /* ---- 下一步 ---- */
    handleNext() {
        const remaining = CARDS_TO_DRAW - this.pickedCount;
        if (remaining > 0) {
            window.showToast && window.showToast(`请再抽 ${remaining} 张牌`, 'error');
            return;
        }

        // 保存牌面数据
        if (window.appState) {
            const selected = this.pickedCards.map(c => c.id);
            window.appState.set('selectedCards', selected);
            window.appState.set('drawnTarotCards', this.pickedCards);
            window.appState.selectedTarotCards = this.pickedCards.map((card, i) => ({
                ...card, slot: i, label: SLOT_LABELS[i]
            }));
        }

        window.router.navigate(`/test/${this.matchType.id}/tarot/card-selection`);
    }

    destroy() {
        this.stopInertia();
        this._cleanups.forEach(fn => fn());
        document.querySelectorAll('.pick-preview-overlay').forEach(el => el.remove());
    }
}

export default TarotPickPage;

/**
 * 直觉塔罗 抽牌页
 * 圆环牌轮排列，手指上下滑动旋转牌轮
 * 点击单张牌可放大预览，点击摇牌抽6张并播放飞牌动画
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar } from '../components/Common.js';
import { drawFromFullDeck } from '../data/tarot.js';

const TOTAL_CARDS = 72;
const CARDS_TO_DRAW = 6;
const SLOT_LABELS = ['目标', '动力', '障碍', '资源', '支持', '结果'];

// 响应式半径：与 CSS --wheel-size 的一半对应
function getWheelRadius() {
    const vw = window.innerWidth;
    // CSS: max(140vw, 600px) / 2，再稍微缩进一点留内边距
    const size = Math.max(vw * 1.4, 600);
    // 手机端用 160vw
    const mobileSize = vw * 1.6;
    const wheelSize = vw <= 500 ? mobileSize : size;
    return wheelSize / 2 - 20; // 半径 = 半径 - 一点内边距
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

        return `
      <div class="page tarot-pick-page">
        ${Navbar({ title: '抽牌', showBack: true, showHistory: false, showProfile: false })}
        <main class="page-content">
          <div class="pick-page-wrap">
            <div class="pick-hint-bar">
              <span class="pick-hint-text">手指可放大牌轮，滑动牌轮，点击选牌</span>
            </div>
            <div class="pick-wheel-viewport" id="wheelViewport">
              <div class="pick-wheel" id="pickWheel">
                ${cardsHtml}
              </div>
            </div>
          </div>
        </main>
      </div>`;
    }

    attachEvents() {
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) backBtn.addEventListener('click', () => window.router.back());

        // 卡牌点击直接抽牌
        document.getElementById('pickWheel')?.addEventListener('click', (e) => {
            if (this.hasMoved) return;
            const card = e.target.closest('.wheel-card');
            if (card) this.handleDraw();
        });

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

    /* ---- 摇牌 ---- */
    handleDraw() {
        this.stopInertia();

        // 从78张塔罗牌中随机抽6张
        const drawnCards = drawFromFullDeck(CARDS_TO_DRAW);
        const selected = drawnCards.map(c => c.id);

        // 保存完整牌面数据
        if (window.appState) {
            window.appState.set('selectedCards', selected);
            window.appState.set('drawnTarotCards', drawnCards);
            window.appState.selectedTarotCards = drawnCards.map((card, i) => ({
                ...card, slot: i, label: SLOT_LABELS[i]
            }));
        }

        // 创建浮层
        this.showDrawOverlay(selected);
    }

    showDrawOverlay(selected) {
        const overlay = document.createElement('div');
        overlay.className = 'draw-overlay';

        // 标题
        const title = document.createElement('div');
        title.className = 'draw-overlay-title';
        title.textContent = '命运之牌';
        overlay.appendChild(title);

        // 6个槽框
        const grid = document.createElement('div');
        grid.className = 'draw-slots';
        const slotEls = [];
        for (let i = 0; i < CARDS_TO_DRAW; i++) {
            const slot = document.createElement('div');
            slot.className = 'draw-slot';
            slot.innerHTML = `<span class="draw-slot__label">${SLOT_LABELS[i]}</span>`;
            grid.appendChild(slot);
            slotEls.push(slot);
        }
        overlay.appendChild(grid);

        // 下一步按钮（先隐藏）
        const btnWrap = document.createElement('div');
        btnWrap.className = 'draw-overlay-btn';
        btnWrap.innerHTML = `<button class="btn btn--primary btn--full btn--lg" id="drawNextBtn">下一步</button>`;
        overlay.appendChild(btnWrap);

        document.body.appendChild(overlay);

        // 创建飞牌并依次飞入
        const screenCX = window.innerWidth / 2;
        const screenCY = window.innerHeight / 2;

        selected.forEach((cardId, i) => {
            const flyCard = document.createElement('div');
            flyCard.className = 'draw-flying-card';
            // 初始位置：屏幕中央偏上
            flyCard.style.left = `${screenCX - 40}px`;
            flyCard.style.top = `${screenCY - 200}px`;
            flyCard.style.opacity = '0';
            flyCard.style.transform = 'scale(0.4) rotate(' + (Math.random() * 40 - 20) + 'deg)';
            document.body.appendChild(flyCard);

            // 延迟依次飞入
            setTimeout(() => {
                flyCard.style.opacity = '1';
                const slotRect = slotEls[i].getBoundingClientRect();
                flyCard.style.left = `${slotRect.left}px`;
                flyCard.style.top = `${slotRect.top}px`;
                flyCard.style.width = `${slotRect.width}px`;
                flyCard.style.height = `${slotRect.height}px`;
                flyCard.style.transform = 'scale(1) rotate(0deg)';
                flyCard.classList.add('landed');
            }, 300 + i * 250);
        });

        // 全部飞完后显示按钮
        setTimeout(() => {
            btnWrap.classList.add('show');
        }, 300 + CARDS_TO_DRAW * 250 + 400);

        // 点击下一步
        btnWrap.addEventListener('click', () => {
            // 清理飞牌和浮层
            overlay.remove();
            document.querySelectorAll('.draw-flying-card').forEach(el => el.remove());
            window.router.navigate(`/test/${this.matchType.id}/tarot/card-selection`);
        });
    }

    destroy() {
        this.stopInertia();
        this._cleanups.forEach(fn => fn());
        document.querySelectorAll('.card-zoom-overlay, .draw-overlay, .draw-flying-card').forEach(el => el.remove());
    }
}

export default TarotPickPage;

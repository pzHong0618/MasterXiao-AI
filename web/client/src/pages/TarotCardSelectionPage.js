/**
 * 直觉卡牌 卡牌选择页
 * 圆环形排列的卡牌轮，可旋转选择
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar, ProgressBar } from '../components/Common.js';

export class TarotCardSelectionPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        this.currentSlotIndex = parseInt(params.slot) || 0; // 当前要选择的槽位索引
        this.rotation = 0; // 卡牌轮的旋转角度
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.lastRotation = 0;
        this.velocity = 0; // 旋转速度（用于惯性效果）
        this.animationId = null;
        
        // 槽位标签
        this.slotLabels = ['目标', '动力', '障碍', '资源', '支持', '结果'];
        
        // 卡牌总数
        this.totalCards = 78;
        
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }
    }

    render() {
        if (!this.matchType) return '';

        const currentSlotLabel = this.slotLabels[this.currentSlotIndex] || '选牌';
        
        return `
      <div class="page tarot-card-selection-page">
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
            <section class="card-selection-header animate-fade-in-up">
              <p class="card-selection-step">抽第 ${this.currentSlotIndex + 1} 张牌</p>
              <h1 class="card-selection-title">未来一月运势的核心方向</h1>
              <p class="card-selection-subtitle">手指可放大牌轮，滑动牌轮，点击选牌</p>
            </section>

            <!-- 卡牌轮容器 -->
            <section class="card-wheel-container animate-fade-in-up animate-delay-100">
              <div class="card-wheel-wrapper" id="cardWheelWrapper">
                <div class="card-wheel" id="cardWheel">
                  ${this.renderCards()}
                </div>
              </div>
            </section>

            <div class="safe-area-bottom"></div>
          </div>
        </main>
      </div>
    `;
    }

    renderCards() {
        const cards = [];
        const angleStep = 360 / this.totalCards; // 每张牌的角度间隔
        
        for (let i = 0; i < this.totalCards; i++) {
            // 计算角度（从顶部开始，顺时针排列）
            const angle = i * angleStep - 90; // -90 使第一张牌在顶部
            
            cards.push(`
                <div class="wheel-card" 
                     style="--angle: ${angle}deg; --index: ${i};"
                     data-card-id="${i}"
                     data-index="${i}">
                    <div class="wheel-card-inner">
                        <div class="wheel-card-back">
                            <div class="card-pattern"></div>
                            <div class="card-symbol"></div>
                        </div>
                    </div>
                </div>
            `);
        }
        
        return cards.join('');
    }

    attachEvents() {
        // 返回按钮
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.cleanup();
                window.router.back();
            });
        }

        // 卡牌轮事件
        this.initCardWheelEvents();
    }

    initCardWheelEvents() {
        const wrapper = document.getElementById('cardWheelWrapper');
        const cardWheel = document.getElementById('cardWheel');
        if (!wrapper || !cardWheel) return;

        // 触摸事件
        wrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        wrapper.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        wrapper.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

        // 鼠标事件（用于桌面调试）
        wrapper.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // 点击事件（用于选牌）
        cardWheel.addEventListener('click', this.handleCardClick.bind(this));

        // 初始渲染
        this.updateWheelTransform();
    }

    getAngleFromCenter(clientX, clientY) {
        const wrapper = document.getElementById('cardWheelWrapper');
        if (!wrapper) return 0;
        
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            this.isDragging = true;
            this.velocity = 0;
            this.cancelAnimation();
            
            const touch = e.touches[0];
            this.startX = touch.clientX;
            this.startY = touch.clientY;
            this.lastRotation = this.rotation;
            this.lastTime = Date.now();
            this.lastAngle = this.getAngleFromCenter(touch.clientX, touch.clientY);
        }
    }

    handleTouchMove(e) {
        if (!this.isDragging || e.touches.length !== 1) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const currentAngle = this.getAngleFromCenter(touch.clientX, touch.clientY);
        let deltaAngle = currentAngle - this.lastAngle;
        
        // 处理角度跨越 -180/180 的情况
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        
        const now = Date.now();
        const dt = now - this.lastTime;
        if (dt > 0) {
            this.velocity = deltaAngle / dt * 16; // 归一化到约60fps
        }
        
        this.rotation += deltaAngle;
        this.lastAngle = currentAngle;
        this.lastTime = now;
        
        this.updateWheelTransform();
    }

    handleTouchEnd() {
        this.isDragging = false;
        // 启动惯性动画
        this.startInertiaAnimation();
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.isDragging = true;
        this.velocity = 0;
        this.cancelAnimation();
        
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.lastRotation = this.rotation;
        this.lastTime = Date.now();
        this.lastAngle = this.getAngleFromCenter(e.clientX, e.clientY);
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;
        
        const currentAngle = this.getAngleFromCenter(e.clientX, e.clientY);
        let deltaAngle = currentAngle - this.lastAngle;
        
        // 处理角度跨越 -180/180 的情况
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        
        const now = Date.now();
        const dt = now - this.lastTime;
        if (dt > 0) {
            this.velocity = deltaAngle / dt * 16;
        }
        
        this.rotation += deltaAngle;
        this.lastAngle = currentAngle;
        this.lastTime = now;
        
        this.updateWheelTransform();
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.startInertiaAnimation();
        }
    }

    startInertiaAnimation() {
        const friction = 0.95; // 摩擦系数
        const minVelocity = 0.1;
        
        const animate = () => {
            if (Math.abs(this.velocity) < minVelocity) {
                this.velocity = 0;
                return;
            }
            
            this.rotation += this.velocity;
            this.velocity *= friction;
            this.updateWheelTransform();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    cancelAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    updateWheelTransform() {
        const cardWheel = document.getElementById('cardWheel');
        if (cardWheel) {
            cardWheel.style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    handleCardClick(e) {
        // 如果正在拖拽或有明显速度，不响应点击
        if (this.isDragging || Math.abs(this.velocity) > 1) return;

        const cardItem = e.target.closest('.wheel-card');
        if (!cardItem) return;

        const cardId = cardItem.dataset.cardId;
        console.log(`选择了卡牌 ${cardId}`);

        // 添加选中效果
        cardItem.classList.add('card-selected');

        // 延迟返回，显示选中效果
        setTimeout(() => {
            this.onCardSelected(parseInt(cardId));
        }, 600);
    }

    onCardSelected(cardId) {
        // 保存选中的卡牌
        if (!window.appState.selectedTarotCards) {
            window.appState.selectedTarotCards = [];
        }
        
        window.appState.selectedTarotCards[this.currentSlotIndex] = {
            id: cardId,
            slot: this.currentSlotIndex,
            label: this.slotLabels[this.currentSlotIndex]
        };

        console.log('已选择卡牌:', window.appState.selectedTarotCards);

        this.cleanup();
        // 返回到选牌页面
        window.router.navigate(`/test/${this.matchType.id}/tarot/pick`);
    }

    cleanup() {
        this.cancelAnimation();
        document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    }
}

export default TarotCardSelectionPage;
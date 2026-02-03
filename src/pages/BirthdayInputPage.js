/**
 * 匹配游戏 生日输入页
 * 输入双方生日进行生日特质匹配
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar, ProgressBar, BottomActionBar } from '../components/Common.js';
import { formatLunarDate } from '../scripts/lunar.js';

export class BirthdayInputPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }

        this.formData = {
            personA: { name: '', gender: '', birthDate: '' },
            personB: { name: '', gender: '', birthDate: '' }
        };

        this.currentStep = 1; // 1: 输入A的信息, 2: 输入B的信息
    }

    render() {
        if (!this.matchType) return '';

        return `
      <div class="page birthday-input-page">
        ${Navbar({
            title: '生日匹配',
            showBack: true,
            showHistory: false,
            showProfile: false
        })}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 进度指示 -->
            <section class="progress-section mt-4 mb-6">
              ${ProgressBar(this.currentStep, 2, { showText: false, showSteps: true })}
              <p class="text-center small-text mt-2">
                步骤 ${this.currentStep}/2：输入${this.currentStep === 1 ? '你的' : '对方的'}信息
              </p>
            </section>

            <!-- 表单区域 -->
            <section class="form-section animate-fade-in-up">
              <div class="glass-card">
                <h3 class="heading-3 mb-4">
                  ${this.currentStep === 1 ? '👤 你的信息' : '👥 对方的信息'}
                </h3>
                
                <form id="birthday-form" class="form">
                  <!-- 称呼 -->
                  <div class="input-group mb-4">
                    <label class="input-label" for="name">称呼</label>
                    <input 
                      type="text" 
                      id="name" 
                      class="input" 
                      placeholder="${this.currentStep === 1 ? '你的称呼' : '对方的称呼'}"
                      maxlength="10"
                    >
                  </div>

                  <!-- 性别 -->
                  <div class="input-group mb-4">
                    <label class="input-label">性别</label>
                    <div class="gender-selector">
                      <button type="button" class="gender-btn" data-gender="male">
                        <span class="gender-icon">👨</span>
                        <span>男</span>
                      </button>
                      <button type="button" class="gender-btn" data-gender="female">
                        <span class="gender-icon">👩</span>
                        <span>女</span>
                      </button>
                    </div>
                  </div>

                  <!-- 出生日期 -->
                  <div class="input-group mb-4">
                    <label class="input-label" for="birthDate">出生日期</label>
                    <div class="date-input-wrapper" id="date-input-wrapper">
                      <input 
                        type="date" 
                        id="birthDate" 
                        class="input"
                        max="${new Date().toISOString().split('T')[0]}"
                        min="1920-01-01"
                      >
                    </div>
                    <p class="input-helper">请选择阳历（公历）生日</p>
                    <div id="lunar-date" class="lunar-date-display" style="display: none;">
                      <span class="lunar-icon">🌙</span>
                      <span class="lunar-text"></span>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            <!-- 已输入的A信息展示（步骤2时显示）-->
            ${this.currentStep === 2 ? this.renderPersonAInfo() : ''}

          </div>
        </main>

        <!-- 底部操作栏 -->
        <div class="bottom-action-bar safe-area-bottom">
          <div class="action-bar__buttons">
            ${this.currentStep === 2 ? `
              <button class="btn btn--secondary" data-action="back-step">上一步</button>
            ` : ''}
            <button class="btn btn--primary btn--full" data-action="next" disabled>
              ${this.currentStep === 1 ? '下一步' : '开始分析'}
            </button>
          </div>
        </div>
      </div>
    `;
    }

    renderPersonAInfo() {
        const { name, gender, birthDate } = this.formData.personA;
        const genderEmoji = gender === 'male' ? '👨' : '👩';

        return `
      <section class="person-a-info mt-4 animate-fade-in">
        <div class="glass-card glass-card--light glass-card--compact">
          <div class="flex items-center gap-3">
            <span class="person-avatar">${genderEmoji}</span>
            <div>
              <p class="body-text">${name || '你'}</p>
              <p class="small-text">${birthDate}</p>
            </div>
            <span class="badge badge--success ml-auto">已填写</span>
          </div>
        </div>
      </section>
    `;
    }

    attachEvents() {
        // 返回按钮
        const backBtn = document.querySelector('.navbar__back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.currentStep === 2) {
                    this.goBackStep();
                } else {
                    window.router.back();
                }
            });
        }

        // 性别选择
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectGender(btn.dataset.gender);
            });
        });

        // 表单输入
        const nameInput = document.getElementById('name');
        const birthDateInput = document.getElementById('birthDate');
        const dateInputWrapper = document.getElementById('date-input-wrapper');

        if (nameInput) {
            nameInput.addEventListener('input', () => this.validateForm());
        }
        if (birthDateInput) {
            birthDateInput.addEventListener('change', () => {
                this.updateLunarDate(birthDateInput.value);
                this.validateForm();
            });
        }
        
        // 点击整个日期输入区域触发日期选择器
        if (dateInputWrapper) {
            dateInputWrapper.addEventListener('click', () => {
                birthDateInput?.showPicker?.();
                birthDateInput?.focus();
            });
        }

        // 下一步按钮
        const nextBtn = document.querySelector('[data-action="next"]');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.handleNext());
        }

        // 返回上一步按钮
        const backStepBtn = document.querySelector('[data-action="back-step"]');
        if (backStepBtn) {
            backStepBtn.addEventListener('click', () => this.goBackStep());
        }
    }

    selectGender(gender) {
        // 更新UI
        document.querySelectorAll('.gender-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.gender === gender);
        });

        // 保存数据
        if (this.currentStep === 1) {
            this.formData.personA.gender = gender;
        } else {
            this.formData.personB.gender = gender;
        }

        this.validateForm();
    }

    validateForm() {
        const name = document.getElementById('name')?.value.trim();
        const birthDate = document.getElementById('birthDate')?.value;
        const gender = this.currentStep === 1
            ? this.formData.personA.gender
            : this.formData.personB.gender;

        const isValid = name && birthDate && gender;

        const nextBtn = document.querySelector('[data-action="next"]');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
        }

        return isValid;
    }

    updateLunarDate(dateStr) {
        const lunarContainer = document.getElementById('lunar-date');
        const lunarText = lunarContainer?.querySelector('.lunar-text');
        
        if (!lunarContainer || !lunarText) return;

        if (dateStr) {
            const lunarStr = formatLunarDate(dateStr);
            lunarText.textContent = `农历：${lunarStr}`;
            lunarContainer.style.display = 'flex';
        } else {
            lunarContainer.style.display = 'none';
        }
    }

    handleNext() {
        if (!this.validateForm()) return;

        // 保存当前步骤数据
        const name = document.getElementById('name').value.trim();
        const birthDate = document.getElementById('birthDate').value;

        if (this.currentStep === 1) {
            this.formData.personA.name = name;
            this.formData.personA.birthDate = birthDate;

            // 切换到步骤2
            this.currentStep = 2;
            this.rerender();
        } else {
            this.formData.personB.name = name;
            this.formData.personB.birthDate = birthDate;

            // 保存数据并跳转到结果页
            this.submitTest();
        }
    }

    goBackStep() {
        if (this.currentStep === 2) {
            this.currentStep = 1;
            this.rerender();
        }
    }

    rerender() {
        const container = document.getElementById('app');
        container.innerHTML = this.render();
        this.attachEvents();

        // 如果是步骤1，还原已输入的数据
        if (this.currentStep === 1 && this.formData.personA.name) {
            document.getElementById('name').value = this.formData.personA.name;
            document.getElementById('birthDate').value = this.formData.personA.birthDate;
            if (this.formData.personA.gender) {
                this.selectGender(this.formData.personA.gender);
            }
            if (this.formData.personA.birthDate) {
                this.updateLunarDate(this.formData.personA.birthDate);
            }
        }
    }

    submitTest() {
        // 保存测试数据到状态
        window.appState.set('currentTest', {
            type: this.matchType.id,
            method: 'birthday',
            personA: this.formData.personA,
            personB: this.formData.personB,
            timestamp: Date.now()
        });

        // 跳转到结果页（或付款页）
        window.router.navigate(`/result/birthday`);
    }
}

export default BirthdayInputPage;

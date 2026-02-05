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
            personA: { name: '', gender: '', birthDate: '', lunarDate: '' },
            personB: { name: '', gender: '', birthDate: '', lunarDate: '' }
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
              ${ProgressBar(this.currentStep, 2, { 
                showText: false, 
                showSteps: false,
                stepLabel: `步骤 ${this.currentStep}/2：输入${this.currentStep === 1 ? '你的' : '对方的'}信息`
              })}
            </section>

            <!-- 表单区域 -->
            <section class="form-section animate-fade-in-up">
              <div class="glass-card">
                <h3 class="heading-3 mb-4">
                  ${this.currentStep === 1 ? '👤 你的信息' : '👥 对方的信息'}
                </h3>
                
                <form id="birthday-form" class="form">
                  <!-- 性别 -->
                  <div class="input-group mb-4">
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

                  <!-- 称呼 -->
                  <div class="input-group mb-4">
                    <input 
                      type="text" 
                      id="name" 
                      class="input" 
                      placeholder="称呼"
                      maxlength="10"
                    >
                  </div>

                  <!-- 出生日期 -->
                  <div class="input-group mb-4">
                    <div class="date-input-wrapper" id="date-input-wrapper">
                      <input 
                        type="text" 
                        id="birthDate" 
                        class="input date-input-placeholder"
                        placeholder="请选择阳历（公历）生日"
                        readonly
                        max="${new Date().toISOString().split('T')[0]}"
                        min="1920-01-01"
                      >
                    </div>
                    <div id="lunar-date" class="lunar-date-display" style="display: none;">
                      <span class="lunar-icon">🌙</span>
                      <span class="lunar-text"></span>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            <!-- 已输入的A信息展示（步骤2时显示）-->
            ${this.renderPersonAInfo()}

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
        const personA = this.formData.personA;
        const personB = this.formData.personB;
        const genderEmojiA = personA.gender === 'male' ? '👨' : (personA.gender === 'female' ? '👩' : '👤');
        const genderEmojiB = personB.gender === 'male' ? '👨' : (personB.gender === 'female' ? '👩' : '👤');

        return `
      <section class="persons-info mt-4 animate-fade-in">
        <div class="persons-info__cards">
          <!-- 甲方信息卡片 -->
          <div class="person-card ${this.currentStep === 1 ? 'person-card--active' : ''}" data-person="A">
            <div class="person-card__top">
              <span class="person-avatar">${genderEmojiA}</span>
              <div class="person-card__info">
                <p class="person-card__name">${personA.name || '甲方'}</p>
                <div class="person-card__date-row">
                  <span class="person-card__date">${personA.birthDate || '未填写'}</span>
                  <span class="badge ${personA.name ? 'badge--success' : 'badge--secondary'}">
                    ${personA.name ? '已填写' : '待填写'}
                  </span>
                </div>
              </div>
            </div>
            ${personA.lunarDate ? `<p class="person-card__lunar">${personA.lunarDate}</p>` : ''}
          </div>
          
          <!-- 乙方信息卡片 -->
          <div class="person-card ${this.currentStep === 2 ? 'person-card--active' : ''}" data-person="B">
            <div class="person-card__top">
              <span class="person-avatar">${genderEmojiB}</span>
              <div class="person-card__info">
                <p class="person-card__name">${personB.name || '乙方'}</p>
                <div class="person-card__date-row">
                  <span class="person-card__date">${personB.birthDate || '未填写'}</span>
                  <span class="badge ${personB.name ? 'badge--success' : 'badge--secondary'}">
                    ${personB.name ? '已填写' : '待填写'}
                  </span>
                </div>
              </div>
            </div>
            ${personB.lunarDate ? `<p class="person-card__lunar">${personB.lunarDate}</p>` : ''}
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

        // 人员卡片点击切换
        document.querySelectorAll('.person-card').forEach(card => {
            card.addEventListener('click', () => {
                const person = card.dataset.person;
                this.switchToPerson(person);
            });
        });

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
        if (dateInputWrapper && birthDateInput) {
            dateInputWrapper.addEventListener('click', () => {
                // 如果还是text类型，先切换成date类型
                if (birthDateInput.type === 'text') {
                    birthDateInput.type = 'date';
                    birthDateInput.removeAttribute('readonly');
                }
                // 延迟一帧后打开选择器，确保类型切换完成
                setTimeout(() => {
                    birthDateInput.showPicker?.();
                    birthDateInput.focus();
                }, 0);
            });
        }

        // 下一步按钮 - 使用简单的 click 事件，移动端 click 事件是可靠的
        const nextBtn = document.querySelector('[data-action="next"]');
        if (nextBtn) {
            nextBtn.onclick = (e) => {
                console.log('点击了下一步/开始分析按钮');
                console.log('当前步骤:', this.currentStep);
                console.log('表单数据:', JSON.stringify(this.formData));
                this.handleNext();
            };
        }

        // 返回上一步按钮
        const backStepBtn = document.querySelector('[data-action="back-step"]');
        if (backStepBtn) {
            backStepBtn.onclick = () => {
                console.log('点击了上一步按钮');
                this.goBackStep();
            };
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

        // 实时更新底部卡片的头像
        this.updatePersonCards();
        
        this.validateForm();
    }
    
    // 更新底部人员卡片显示
    updatePersonCards() {
        const personCards = document.querySelectorAll('.person-card');
        if (personCards.length === 0) return;
        
        // 更新甲方卡片头像
        const cardA = document.querySelector('[data-person="A"] .person-avatar');
        if (cardA) {
            const genderA = this.formData.personA.gender;
            cardA.textContent = genderA === 'male' ? '👨' : (genderA === 'female' ? '👩' : '👤');
        }
        
        // 更新乙方卡片头像
        const cardB = document.querySelector('[data-person="B"] .person-avatar');
        if (cardB) {
            const genderB = this.formData.personB.gender;
            cardB.textContent = genderB === 'male' ? '👨' : (genderB === 'female' ? '👩' : '👤');
        }
    }

    validateForm() {
        const name = document.getElementById('name')?.value.trim();
        const birthDate = document.getElementById('birthDate')?.value;
        const gender = this.currentStep === 1
            ? this.formData.personA.gender
            : this.formData.personB.gender;

        const isValid = name && birthDate && gender;
        
        console.log('validateForm:', { name, birthDate, gender, isValid, step: this.currentStep });

        const nextBtn = document.querySelector('[data-action="next"]');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
        }
        
        // 实时更新当前人员的卡片信息
        this.updateCurrentPersonCard(name, birthDate, gender);
        
        // 如果三个字段都填写完成，自动跳转
        if (isValid) {
            this.autoNavigateNext();
        }

        return isValid;
    }
    
    // 自动跳转到下一步
    autoNavigateNext() {
        // 使用防抖，避免重复触发
        if (this.autoNavTimer) {
            clearTimeout(this.autoNavTimer);
        }
        
        this.autoNavTimer = setTimeout(() => {
            // 再次检查表单是否完整
            const name = document.getElementById('name')?.value.trim();
            const birthDate = document.getElementById('birthDate')?.value;
            const gender = this.currentStep === 1
                ? this.formData.personA.gender
                : this.formData.personB.gender;
            
            if (name && birthDate && gender) {
                // 保存当前数据
                const lunarDate = birthDate ? formatLunarDate(birthDate) : '';
                const person = this.currentStep === 1 ? 'personA' : 'personB';
                this.formData[person].name = name;
                this.formData[person].birthDate = birthDate;
                this.formData[person].lunarDate = lunarDate;
                
                // 只有当另一方未填写时才自动跳转
                const otherPerson = this.currentStep === 1 ? 'personB' : 'personA';
                const otherData = this.formData[otherPerson];
                const isOtherComplete = otherData.name && otherData.birthDate && otherData.gender;

                if (this.currentStep === 1 && !isOtherComplete) {
                    // 跳转到步骤2
                    this.currentStep = 2;
                    this.rerender();
                }
                // 如果两方都已填写，不自动跳转，让用户可以自由编辑
            }
        }, 500); // 500ms 延迟，给用户时间确认
    }
    
    // 实时更新当前人员的卡片信息
    updateCurrentPersonCard(name, birthDate, gender) {
        const person = this.currentStep === 1 ? 'A' : 'B';
        const card = document.querySelector(`[data-person="${person}"]`);
        if (!card) return;
        
        // 更新头像
        const avatar = card.querySelector('.person-avatar');
        if (avatar) {
            avatar.textContent = gender === 'male' ? '👨' : (gender === 'female' ? '👩' : '👤');
        }
        
        // 更新名字
        const nameEl = card.querySelector('.person-card__name');
        if (nameEl) {
            nameEl.textContent = name || (person === 'A' ? '甲方' : '乙方');
        }
        
        // 更新日期
        const dateEl = card.querySelector('.person-card__date');
        if (dateEl) {
            dateEl.textContent = birthDate || '未填写';
        }
        
        // 更新农历
        const lunarEl = card.querySelector('.person-card__lunar');
        if (birthDate) {
            const lunarDate = formatLunarDate(birthDate);
            if (lunarEl) {
                lunarEl.textContent = lunarDate;
            } else {
                // 创建农历元素（添加到卡片底部）
                const newLunarEl = document.createElement('p');
                newLunarEl.className = 'person-card__lunar';
                newLunarEl.textContent = lunarDate;
                card.appendChild(newLunarEl);
            }
        } else if (lunarEl) {
            // 如果没有日期，移除农历元素
            lunarEl.remove();
        }
        
        // 更新状态标签
        const badge = card.querySelector('.badge');
        if (badge) {
            const isComplete = name && birthDate && gender;
            badge.className = `badge ${isComplete ? 'badge--success' : 'badge--secondary'}`;
            badge.textContent = isComplete ? '已填写' : '待填写';
        }
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
        console.log('handleNext 被调用');
        
        if (!this.validateForm()) {
            console.log('表单验证未通过，返回');
            return;
        }

        // 保存当前步骤数据
        const name = document.getElementById('name').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const lunarDate = birthDate ? formatLunarDate(birthDate) : '';
        
        console.log('表单数据:', { name, birthDate, lunarDate });

        if (this.currentStep === 1) {
            this.formData.personA.name = name;
            this.formData.personA.birthDate = birthDate;
            this.formData.personA.lunarDate = lunarDate;

            // 切换到步骤2
            this.currentStep = 2;
            this.rerender();
        } else {
            this.formData.personB.name = name;
            this.formData.personB.birthDate = birthDate;
            this.formData.personB.lunarDate = lunarDate;
            
            console.log('准备提交测试，跳转到结果页');

            // 保存数据并跳转到结果页
            this.submitTest();
        }
    }

    goBackStep() {
        if (this.currentStep === 2) {
            // 保存当前乙方数据
            this.saveCurrentFormData();
            this.currentStep = 1;
            this.rerender();
        }
    }
    
    // 保存当前表单数据到对应人员
    saveCurrentFormData() {
        const name = document.getElementById('name')?.value.trim() || '';
        const birthDate = document.getElementById('birthDate')?.value || '';
        const lunarDate = birthDate ? formatLunarDate(birthDate) : '';
        const person = this.currentStep === 1 ? 'personA' : 'personB';
        
        this.formData[person].name = name;
        this.formData[person].birthDate = birthDate;
        this.formData[person].lunarDate = lunarDate;
    }
    
    // 点击卡片切换人员
    switchToPerson(person) {
        const targetStep = person === 'A' ? 1 : 2;
        
        if (targetStep === this.currentStep) return;
        
        // 先保存当前表单数据
        this.saveCurrentFormData();
        
        // 切换步骤
        this.currentStep = targetStep;
        this.rerender();
    }

    rerender() {
        const container = document.getElementById('app');
        const formSection = document.querySelector('.form-section');
        
        // 添加淡出动画
        if (formSection) {
            formSection.classList.add('fade-out');
        }
        
        // 延迟更新内容，等待淡出动画完成
        setTimeout(() => {
            container.innerHTML = this.render();
            this.attachEvents();

            const currentPerson = this.currentStep === 1 ? this.formData.personA : this.formData.personB;
            
            // 恢复当前步骤对应人员的数据
            if (currentPerson.name) {
                document.getElementById('name').value = currentPerson.name;
            }
            if (currentPerson.birthDate) {
                document.getElementById('birthDate').value = currentPerson.birthDate;
                this.updateLunarDate(currentPerson.birthDate);
            }
            if (currentPerson.gender) {
                this.selectGender(currentPerson.gender);
            } else if (this.currentStep === 2 && !this.formData.personB.gender) {
                // 步骤2且乙方未选性别：自动选择相反性别
                const oppositeGender = this.formData.personA.gender === 'male' ? 'female' : 'male';
                this.selectGender(oppositeGender);
            }
            
            // 验证表单状态
            this.validateForm();
            
            // 添加淡入动画
            const newFormSection = document.querySelector('.form-section');
            if (newFormSection) {
                newFormSection.classList.add('fade-in');
            }
        }, 150); // 150ms 过渡时间
    }

    submitTest() {
        console.log('submitTest 被调用');
        
        // 保存测试数据到状态
        const testData = {
            type: this.matchType.id,
            method: 'birthday',
            personA: {
                name: this.formData.personA.name,
                gender: this.formData.personA.gender === 'male' ? '男' : '女',
                birthDate: this.formData.personA.birthDate
            },
            personB: {
                name: this.formData.personB.name,
                gender: this.formData.personB.gender === 'male' ? '男' : '女',
                birthDate: this.formData.personB.birthDate
            },
            timestamp: Date.now()
        };
        
        console.log('测试数据:', JSON.stringify(testData));
        
        window.appState.set('currentTest', testData);

        // 跳转到结果页（或付款页）
        console.log('准备跳转到 /result/birthday');
        window.router.navigate(`/result/birthday`);
    }
}

export default BirthdayInputPage;


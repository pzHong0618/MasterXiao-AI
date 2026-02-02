/**
 * MasterXiao-AI 测试选择页
 * 选择测试方式：生日匹配或直觉卡牌
 */

import { getMatchTypeById } from '../data/matchTypes.js';
import { Navbar, ProgressBar } from '../components/Common.js';
import { FeatureCardDetail } from '../components/FeatureCard.js';

export class TestSelectPage {
    constructor(params) {
        this.matchType = getMatchTypeById(params.type);
        if (!this.matchType) {
            window.router.navigate('/');
            return;
        }
    }

    render() {
        if (!this.matchType) return '';

        return `
      <div class="page test-select-page">
        ${Navbar({
            title: this.matchType.title,
            showBack: true,
            showHistory: false,
            showProfile: false
        })}
        
        <main class="page-content">
          <div class="app-container">
            
            <!-- 匹配类型详情 -->
            <section class="mt-4 mb-6 animate-fade-in-up">
              ${FeatureCardDetail(this.matchType)}
            </section>

            <!-- 测试方式选择 -->
            <section class="test-method-section animate-fade-in-up animate-delay-200">
              <h3 class="heading-3 mb-4 text-center">选择测试方式</h3>
              
              <div class="method-cards">
                <!-- 生日匹配 -->
                <div class="glass-card glass-card--interactive method-card" data-method="birthday">
                  <div class="method-card__icon">🎂</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title">生日匹配</h4>
                    <p class="method-card__description">输入双方生日，通过生日特质分析性格关系</p>
                    <div class="method-card__tag">
                      <span class="badge badge--primary">需要双方生日</span>
                    </div>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>

                <!-- 直觉卡牌测试 -->
                <div class="glass-card glass-card--interactive method-card" data-method="tarot">
                  <div class="method-card__icon">🃏</div>
                  <div class="method-card__content">
                    <h4 class="method-card__title">直觉卡牌</h4>
                    <p class="method-card__description">凭直觉翻牌，通过卡牌符号解析关系</p>
                    <div class="method-card__tag">
                      <span class="badge badge--secondary">无需生日</span>
                    </div>
                  </div>
                  <span class="method-card__arrow">→</span>
                </div>
              </div>
            </section>

            <!-- 说明提示 -->
            <section class="tips-section mt-6 animate-fade-in-up animate-delay-300">
              <div class="glass-card glass-card--light">
                <div class="tips-header">
                  <span>💡</span>
                  <span class="small-text">选择提示</span>
                </div>
                <ul class="tips-list">
                  <li>如果知道双方准确的出生日期，推荐使用<strong>生日匹配</strong>，结果更精准</li>
                  <li>如果不清楚对方生日，可以使用<strong>直觉卡牌</strong>，凭直觉感应</li>
                  <li>两种方式都是趣味性格测试，仅供娱乐参考</li>
                </ul>
              </div>
            </section>

            <div class="mt-8 safe-area-bottom"></div>
          </div>
        </main>
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

        // 方法卡片点击
        document.querySelectorAll('.method-card').forEach(card => {
            card.addEventListener('click', () => {
                const method = card.dataset.method;
                this.handleMethodSelect(method);
            });
        });
    }

    handleMethodSelect(method) {
        const typeId = this.matchType.id;

        if (method === 'birthday') {
            // 跳转到生日输入页
            window.router.navigate(`/test/${typeId}/birthday`);
        } else if (method === 'tarot') {
            // 跳转到卡牌测试页
            window.router.navigate(`/test/${typeId}/tarot`);
        }
    }
}

export default TestSelectPage;

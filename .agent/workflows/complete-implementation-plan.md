---
description: MasterXiao-AI 完整开发实施计划
---

# MasterXiao-AI 完整开发实施计划

## 📋 项目总览

### 项目定位
**MasterXiao-AI** 是一个命理匹配分析平台，采用 Quin 风格的现代化交互界面，提供基于生辰八字和六爻塔罗的智能匹配分析服务。

### 核心价值
- 🎯 **10种匹配分析**：感情、职场、合作、城市、职业等全方位分析
- 🔮 **双重测试方式**：生日匹配 + 塔罗翻牌
- 💰 **多渠道变现**：小红书验证码 + 网站内支付 + 推荐奖励
- 👥 **用户增长闭环**：推荐机制 + 社交互动奖励

### 目标用户
- 学生（15-22岁）：职业和城市匹配 - 30%
- 年轻职场人员（23-35岁）：职场关系、交友、行业选择 - 50%
- 职场管理者（35+岁）：职场关系分析 - 20%

---

## 🏗️ 技术架构

### 前端技术栈
```
- 构建工具: Vite 7.x
- 框架: Vanilla JavaScript (轻量、快速)
- 样式: CSS3 + CSS Variables
- 字体: Google Fonts (Inter, Outfit)
- 图标: 自定义 SVG + Emoji
- 动画: CSS Animations + Web Animations API
- 状态管理: 原生 JavaScript (localStorage)
- 路由: 自定义 SPA 路由
```

### 后端技术栈
```
- 运行时: Node.js 20+
- 框架: Express.js
- 数据库: MongoDB (用户、订单、验证码)
- 认证: JWT
- 支付: 支付宝/微信 SDK
- AI 分析: OpenAI API / 自建模型
- 部署: Vercel (前后端一体化)
```

### 数据库设计
```javascript
// 用户表
User {
  _id: ObjectId,
  phone: String,
  nickname: String,
  avatar: String,
  birthDate: Date,
  gender: String,
  city: String,
  credits: Number,          // 剩余权益
  referralCode: String,     // 推荐码
  referredBy: ObjectId,     // 推荐人
  createdAt: Date
}

// 订单表
Order {
  _id: ObjectId,
  userId: ObjectId,
  matchType: String,        // 匹配类型
  testMethod: String,       // 测试方式
  amount: Number,
  paymentMethod: String,
  status: String,           // pending/paid/completed
  verificationCode: String, // 验证码
  createdAt: Date
}

// 测试记录表
TestRecord {
  _id: ObjectId,
  userId: ObjectId,
  orderId: ObjectId,
  matchType: String,
  testMethod: String,
  inputData: Object,        // 输入数据（生日/卦象）
  result: Object,           // 分析结果
  createdAt: Date
}

// 推荐记录表
Referral {
  _id: ObjectId,
  referrerId: ObjectId,     // 推荐人
  refereeId: ObjectId,      // 被推荐人
  rewardGiven: Boolean,
  createdAt: Date
}

// 验证码表
VerificationCode {
  _id: ObjectId,
  code: String,
  matchType: String,
  isUsed: Boolean,
  usedBy: ObjectId,
  expiresAt: Date,
  createdAt: Date
}
```

---

## 📱 页面架构

### 页面列表（7个核心页面）
1. **首页** (`/`) - 功能展示与选择
2. **测试选择页** (`/test/:type`) - 选择测试方式
3. **生日输入页** (`/test/:type/birthday`) - 生日匹配输入
4. **塔罗翻牌页** (`/test/:type/tarot`) - 六爻翻牌
5. **验证/支付页** (`/payment`) - 验证码或支付
6. **分析结果页** (`/result/:id`) - AI 分析展示
7. **个人中心页** (`/profile`) - 用户信息与历史

### 路由设计
```javascript
const routes = {
  '/': HomePage,
  '/test/:type': TestSelectPage,
  '/test/:type/birthday': BirthdayInputPage,
  '/test/:type/tarot': TarotCardsPage,
  '/payment': PaymentPage,
  '/result/:id': ResultPage,
  '/profile': ProfilePage,
  '/login': LoginPage
};
```

---

## 🎯 开发阶段（共8个阶段，预计15-20天）

### 阶段 1: 项目初始化与基础设施 (1天)

#### 任务清单
- [x] 初始化 Git 仓库
- [x] 创建 Vite 项目
- [ ] 配置项目结构
- [ ] 设置 ESLint + Prettier
- [ ] 创建 .gitignore
- [ ] 编写 README.md
- [ ] 配置环境变量

#### 目录结构
```
MasterXiao-AI/
├── .agent/
│   └── workflows/          # 工作流文档
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg
│   └── assets/
│       ├── images/         # 图片资源
│       └── icons/          # 图标资源
├── src/
│   ├── index.html          # 主 HTML
│   ├── main.js             # 入口文件
│   ├── styles/
│   │   ├── reset.css       # 样式重置
│   │   ├── variables.css   # CSS 变量
│   │   ├── global.css      # 全局样式
│   │   ├── components.css  # 组件样式
│   │   └── animations.css  # 动画效果
│   ├── scripts/
│   │   ├── router.js       # 路由管理
│   │   ├── state.js        # 状态管理
│   │   ├── api.js          # API 调用
│   │   └── utils.js        # 工具函数
│   ├── components/
│   │   ├── GlassCard.js
│   │   ├── MessageBubble.js
│   │   ├── TarotCard.js
│   │   ├── ProgressBar.js
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── TestSelectPage.js
│   │   ├── BirthdayInputPage.js
│   │   ├── TarotCardsPage.js
│   │   ├── PaymentPage.js
│   │   ├── ResultPage.js
│   │   └── ProfilePage.js
│   └── data/
│       ├── matchTypes.js   # 匹配类型数据
│       ├── hexagrams.js    # 64卦数据
│       └── prompts.js      # AI 提示词模板
├── server/                 # 后端代码
│   ├── index.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

#### 配置文件

**vite.config.js**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

**.env.example**
```
VITE_API_URL=http://localhost:3000
VITE_OPENAI_API_KEY=your_openai_key
VITE_ALIPAY_APP_ID=your_alipay_app_id
VITE_WECHAT_APP_ID=your_wechat_app_id
```

---

### 阶段 2: 设计系统构建 (2天)

#### 2.1 CSS 变量定义 (variables.css)
```css
:root {
  /* 色彩系统 */
  --color-bg-gradient-start: #E8D5FF;
  --color-bg-gradient-mid: #FFE5F0;
  --color-bg-gradient-end: #E5F0FF;
  
  --color-primary: #8B7FD8;
  --color-primary-light: #A78BFA;
  --color-secondary: #FFB5D8;
  --color-accent: #B5D8FF;
  
  --color-text-primary: #2D2D3D;
  --color-text-secondary: #6B6B7B;
  --color-text-tertiary: #9B9BAB;
  
  --color-glass-bg: rgba(255, 255, 255, 0.7);
  --color-glass-border: rgba(255, 255, 255, 0.3);
  
  /* 排版系统 */
  --font-family-base: 'Inter', -apple-system, sans-serif;
  --font-family-heading: 'Outfit', 'Inter', sans-serif;
  
  --font-size-h1: 28px;
  --font-size-h2: 20px;
  --font-size-h3: 18px;
  --font-size-body: 15px;
  --font-size-small: 13px;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.8;
  
  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* 阴影 */
  --shadow-sm: 0 2px 8px rgba(139, 127, 216, 0.08);
  --shadow-md: 0 4px 16px rgba(139, 127, 216, 0.12);
  --shadow-lg: 0 8px 32px rgba(139, 127, 216, 0.15);
  --shadow-xl: 0 12px 40px rgba(139, 127, 216, 0.25);
  
  /* 过渡 */
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 毛玻璃效果 */
  --glass-blur: blur(20px);
}
```

#### 2.2 通用组件样式 (components.css)
```css
/* 毛玻璃卡片 */
.glass-card {
  background: var(--color-glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

/* 按钮 */
.primary-btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-size: var(--font-size-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 127, 216, 0.4);
}

.primary-btn:active {
  transform: translateY(0);
}

/* 输入框 */
.input-field {
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  transition: all var(--transition-base);
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 127, 216, 0.1);
}
```

#### 2.3 动画效果 (animations.css)
```css
/* 打字机效果 */
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

.typewriter {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(40, end);
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* 卡片翻转 */
@keyframes cardFlip {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

.card-flip {
  animation: cardFlip 0.6s ease-in-out;
}

/* 脉冲效果 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* 思考指示器 */
@keyframes thinking {
  0%, 20% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

.thinking-dot {
  animation: thinking 1.4s ease-in-out infinite;
}

.thinking-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dot:nth-child(3) {
  animation-delay: 0.4s;
}
```

---

### 阶段 3: 核心组件开发 (3天)

#### 3.1 基础组件

**GlassCard.js**
```javascript
export function GlassCard({ children, className = '', onClick }) {
  return `
    <div class="glass-card ${className}" ${onClick ? 'role="button" tabindex="0"' : ''}>
      ${children}
    </div>
  `;
}
```

**TarotCard.js**
```javascript
export class TarotCard {
  constructor(index, hexagram) {
    this.index = index;
    this.hexagram = hexagram;
    this.isFlipped = false;
  }

  render() {
    return `
      <div class="card-wrapper" data-index="${this.index}">
        <div class="tarot-card ${this.isFlipped ? 'flipped' : ''}">
          <div class="card-back">
            <div class="card-pattern">
              <div class="star">✨</div>
              <div class="moon">🌙</div>
              <div class="mystical-symbol">☯</div>
            </div>
          </div>
          <div class="card-front">
            <div class="hexagram-symbol">${this.hexagram.symbol}</div>
            <div class="hexagram-name">${this.hexagram.name}</div>
          </div>
        </div>
      </div>
    `;
  }

  flip() {
    this.isFlipped = true;
    // 触发翻牌动画
    const element = document.querySelector(`[data-index="${this.index}"] .tarot-card`);
    element.classList.add('flipped');
  }
}
```

**ProgressBar.js**
```javascript
export function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;
  
  return `
    <div class="progress-bar">
      <div class="progress-track">
        <div class="progress-fill" style="width: ${percentage}%"></div>
      </div>
      <div class="progress-text">${current} / ${total}</div>
    </div>
  `;
}
```

#### 3.2 业务组件

**MatchTypeCard.js**
```javascript
export function MatchTypeCard({ type, icon, title, description }) {
  return `
    <div class="feature-card glass-card" data-type="${type}">
      <div class="card-icon">${icon}</div>
      <h3 class="card-title">${title}</h3>
      <p class="card-description">${description}</p>
      <div class="card-arrow">→</div>
    </div>
  `;
}
```

**VerificationCodeInput.js**
```javascript
export class VerificationCodeInput {
  constructor(length = 6) {
    this.length = length;
    this.values = new Array(length).fill('');
  }

  render() {
    return `
      <div class="code-input-group">
        ${Array.from({ length: this.length }, (_, i) => `
          <input 
            type="text" 
            maxlength="1" 
            class="code-digit" 
            data-index="${i}"
            autocomplete="off"
          >
        `).join('')}
      </div>
    `;
  }

  attachEvents() {
    const inputs = document.querySelectorAll('.code-digit');
    
    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        if (value.length === 1) {
          this.values[index] = value;
          // 自动跳转到下一个输入框
          if (index < this.length - 1) {
            inputs[index + 1].focus();
          }
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });
  }

  getValue() {
    return this.values.join('');
  }
}
```

---

### 阶段 4: 页面开发 (4天)

#### 4.1 首页 (HomePage.js)
```javascript
import { MatchTypeCard } from '../components/MatchTypeCard.js';
import { matchTypes } from '../data/matchTypes.js';

export class HomePage {
  render() {
    return `
      <div class="home-page">
        <header class="navbar">
          <div class="logo">MasterXiao</div>
          <div class="nav-icons">
            <button class="icon-btn" data-action="history">🕐</button>
            <button class="icon-btn" data-action="profile">👤</button>
          </div>
        </header>

        <main class="content">
          <section class="hero-banner fade-in">
            <div class="banner-card glass-card">
              <div class="banner-icon">🔮</div>
              <h1>发现你的命运连接</h1>
              <p>让星辰为你指引前路</p>
              <button class="primary-btn" data-action="start">开始占卜</button>
            </div>
          </section>

          <section class="features-grid">
            ${matchTypes.map(type => MatchTypeCard(type)).join('')}
          </section>
        </main>
      </div>
    `;
  }

  attachEvents() {
    // 功能卡片点击
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.dataset.type;
        window.router.navigate(`/test/${type}`);
      });
    });

    // 导航按钮
    document.querySelector('[data-action="profile"]').addEventListener('click', () => {
      window.router.navigate('/profile');
    });
  }
}
```

#### 4.2 塔罗翻牌页 (TarotCardsPage.js)
```javascript
import { TarotCard } from '../components/TarotCard.js';
import { getRandomHexagrams } from '../data/hexagrams.js';

export class TarotCardsPage {
  constructor(matchType) {
    this.matchType = matchType;
    this.cards = [];
    this.selectedCards = [];
    this.hexagrams = getRandomHexagrams(6);
  }

  render() {
    return `
      <div class="tarot-page">
        <div class="page-header">
          <button class="back-btn">←</button>
          <h2>凭直觉选择6张牌</h2>
        </div>

        <div class="instruction-card glass-card">
          <p>🌙 静下心来，让内心指引你的选择</p>
          <div class="selected-count">
            已选择: <span id="count">0</span>/6
          </div>
        </div>

        <div class="cards-container">
          ${this.hexagrams.map((hex, i) => {
            const card = new TarotCard(i, hex);
            this.cards.push(card);
            return card.render();
          }).join('')}
        </div>

        <button class="primary-btn full-width" id="analyze-btn" disabled>
          开始分析
        </button>
      </div>
    `;
  }

  attachEvents() {
    const cards = document.querySelectorAll('.card-wrapper');
    const countEl = document.getElementById('count');
    const analyzeBtn = document.getElementById('analyze-btn');

    cards.forEach((cardEl, index) => {
      cardEl.addEventListener('click', () => {
        if (this.selectedCards.length < 6 && !this.cards[index].isFlipped) {
          this.cards[index].flip();
          this.selectedCards.push(this.hexagrams[index]);
          
          countEl.textContent = this.selectedCards.length;
          
          if (this.selectedCards.length === 6) {
            analyzeBtn.disabled = false;
          }
        }
      });
    });

    analyzeBtn.addEventListener('click', () => {
      this.submitTest();
    });
  }

  async submitTest() {
    // 保存选择的卦象
    const testData = {
      matchType: this.matchType,
      method: 'tarot',
      hexagrams: this.selectedCards
    };

    // 跳转到支付/验证页面
    window.router.navigate('/payment', { testData });
  }
}
```

#### 4.3 分析结果页 (ResultPage.js)
```javascript
export class ResultPage {
  constructor(resultId) {
    this.resultId = resultId;
    this.result = null;
  }

  async loadResult() {
    const response = await fetch(`/api/results/${this.resultId}`);
    this.result = await response.json();
  }

  render() {
    if (!this.result) {
      return '<div class="loading">加载中...</div>';
    }

    return `
      <div class="result-page">
        <div class="chat-container">
          <!-- AI 分析消息 -->
          <div class="message ai-message fade-in">
            <div class="avatar">🔮</div>
            <div class="bubble glass-card">
              <p class="typewriter" id="analysis-text"></p>
            </div>
          </div>

          <!-- 结果卡片 -->
          <div class="result-card glass-card fade-in">
            <div class="match-score">
              <div class="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none"
                    stroke="#E8D5FF"
                    stroke-width="8"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none"
                    stroke="url(#gradient)"
                    stroke-width="8"
                    stroke-dasharray="${this.result.score * 2.83} 283"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient">
                      <stop offset="0%" stop-color="#8B7FD8" />
                      <stop offset="100%" stop-color="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
                <span class="score">${this.result.score}%</span>
              </div>
              <p>匹配度</p>
            </div>

            <div class="analysis-sections">
              <div class="section">
                <h3>✨ 优势分析</h3>
                <p>${this.result.advantages}</p>
              </div>
              <div class="section">
                <h3>⚠️ 注意事项</h3>
                <p>${this.result.warnings}</p>
              </div>
              <div class="section">
                <h3>💡 建议</h3>
                <p>${this.result.suggestions}</p>
              </div>
            </div>

            <div class="action-buttons">
              <button class="secondary-btn" data-action="download">
                <span>📥</span> 下载报告
              </button>
              <button class="secondary-btn" data-action="share">
                <span>📤</span> 分享结果
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    // 打字机效果显示分析文本
    this.typewriterEffect(
      document.getElementById('analysis-text'),
      this.result.analysisText
    );

    // 下载报告
    document.querySelector('[data-action="download"]').addEventListener('click', () => {
      this.downloadReport();
    });

    // 分享
    document.querySelector('[data-action="share"]').addEventListener('click', () => {
      this.shareResult();
    });
  }

  typewriterEffect(element, text, speed = 50) {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }
}
```

---

### 阶段 5: 后端 API 开发 (3天)

#### 5.1 服务器设置 (server/index.js)
```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import paymentRoutes from './routes/payment.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/user', userRoutes);

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 5.2 测试分析 API (server/routes/test.js)
```javascript
import express from 'express';
import { analyzeMatch } from '../controllers/testController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 提交测试并获取分析
router.post('/analyze', authMiddleware, async (req, res) => {
  try {
    const { matchType, method, data } = req.body;
    const userId = req.user.id;

    // 检查用户权益
    const user = await User.findById(userId);
    if (user.credits <= 0) {
      return res.status(403).json({ error: '权益不足，请购买' });
    }

    // 执行分析
    const result = await analyzeMatch(matchType, method, data);

    // 保存记录
    const testRecord = new TestRecord({
      userId,
      matchType,
      testMethod: method,
      inputData: data,
      result
    });
    await testRecord.save();

    // 扣除权益
    user.credits -= 1;
    await user.save();

    res.json({ success: true, resultId: testRecord._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取分析结果
router.get('/result/:id', authMiddleware, async (req, res) => {
  try {
    const result = await TestRecord.findById(req.params.id);
    
    if (!result || result.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: '结果不存在' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

#### 5.3 AI 分析逻辑 (server/controllers/testController.js)
```javascript
import OpenAI from 'openai';
import { getPromptTemplate } from '../utils/prompts.js';
import { calculateBazi } from '../utils/bazi.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeMatch(matchType, method, data) {
  let analysisInput;

  if (method === 'birthday') {
    // 生日匹配：计算八字
    const person1Bazi = calculateBazi(data.person1.birthDate);
    const person2Bazi = calculateBazi(data.person2.birthDate);
    
    analysisInput = {
      person1: {
        ...data.person1,
        bazi: person1Bazi,
        wuxing: analyzeWuxing(person1Bazi)
      },
      person2: {
        ...data.person2,
        bazi: person2Bazi,
        wuxing: analyzeWuxing(person2Bazi)
      }
    };
  } else if (method === 'tarot') {
    // 塔罗牌：六爻分析
    analysisInput = {
      hexagrams: data.hexagrams,
      interpretation: interpretHexagrams(data.hexagrams)
    };
  }

  // 获取提示词模板
  const prompt = getPromptTemplate(matchType, method, analysisInput);

  // 调用 OpenAI API
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: '你是一位专业的命理分析师...' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  const analysisText = completion.choices[0].message.content;

  // 解析分析结果
  const result = parseAnalysisResult(analysisText);

  return result;
}

function parseAnalysisResult(text) {
  // 从 AI 返回的文本中提取结构化数据
  // 这里需要根据实际返回格式进行解析
  return {
    score: 85, // 匹配度
    analysisText: text,
    advantages: '...',
    warnings: '...',
    suggestions: '...'
  };
}
```

---

### 阶段 6: 支付与验证码系统 (2天)

#### 6.1 验证码生成与验证
```javascript
// server/controllers/verificationController.js
import crypto from 'crypto';
import VerificationCode from '../models/VerificationCode.js';

export async function generateVerificationCode(matchType) {
  // 生成6位随机码
  const code = crypto.randomBytes(3).toString('hex').toUpperCase();

  const verificationCode = new VerificationCode({
    code,
    matchType,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天有效
  });

  await verificationCode.save();

  return code;
}

export async function verifyCode(code, userId) {
  const verification = await VerificationCode.findOne({
    code,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });

  if (!verification) {
    throw new Error('验证码无效或已过期');
  }

  // 标记为已使用
  verification.isUsed = true;
  verification.usedBy = userId;
  await verification.save();

  // 给用户增加权益
  const user = await User.findById(userId);
  user.credits += 1;
  await user.save();

  return true;
}
```

#### 6.2 支付宝集成
```javascript
// server/controllers/paymentController.js
import AlipaySdk from 'alipay-sdk';

const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID,
  privateKey: process.env.ALIPAY_PRIVATE_KEY,
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY
});

export async function createAlipayOrder(userId, matchType, amount) {
  const order = new Order({
    userId,
    matchType,
    amount,
    paymentMethod: 'alipay',
    status: 'pending'
  });
  await order.save();

  const formData = new AlipayFormData();
  formData.setMethod('get');
  formData.addField('notifyUrl', 'https://yoursite.com/api/payment/alipay/notify');
  formData.addField('returnUrl', 'https://yoursite.com/payment/success');
  formData.addField('bizContent', {
    outTradeNo: order._id.toString(),
    productCode: 'FAST_INSTANT_TRADE_PAY',
    totalAmount: amount,
    subject: `${matchType}匹配分析`,
    body: '命理匹配分析服务'
  });

  const result = await alipaySdk.exec('alipay.trade.page.pay', {}, { formData });

  return result;
}
```

---

### 阶段 7: 用户系统与推荐机制 (2天)

#### 7.1 用户注册与登录
```javascript
// server/routes/auth.js
router.post('/register', async (req, res) => {
  const { phone, code, referralCode } = req.body;

  // 验证短信验证码
  const isValid = await verifySmsCode(phone, code);
  if (!isValid) {
    return res.status(400).json({ error: '验证码错误' });
  }

  // 创建用户
  const user = new User({
    phone,
    referralCode: generateReferralCode(),
    credits: 0 // 初始无权益
  });

  // 处理推荐关系
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (referrer) {
      user.referredBy = referrer._id;
      
      // 创建推荐记录
      const referral = new Referral({
        referrerId: referrer._id,
        refereeId: user._id
      });
      await referral.save();
    }
  }

  await user.save();

  // 生成 JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
});
```

#### 7.2 推荐奖励逻辑
```javascript
// 当被推荐人首次消费时触发
export async function handleReferralReward(userId) {
  const user = await User.findById(userId);
  
  if (user.referredBy) {
    const referral = await Referral.findOne({
      referrerId: user.referredBy,
      refereeId: userId,
      rewardGiven: false
    });

    if (referral) {
      // 给推荐人奖励
      const referrer = await User.findById(user.referredBy);
      referrer.credits += 1; // 奖励1次免费测试
      await referrer.save();

      // 标记奖励已发放
      referral.rewardGiven = true;
      await referral.save();

      // 发送通知
      await sendNotification(referrer._id, '推荐奖励', '您的好友已完成首次测试，获得1次免费测试机会！');
    }
  }
}
```

---

### 阶段 8: 测试、优化与部署 (2天)

#### 8.1 测试清单
- [ ] 单元测试（核心功能）
- [ ] 集成测试（API 接口）
- [ ] E2E 测试（用户流程）
- [ ] 性能测试（加载速度）
- [ ] 兼容性测试（多浏览器）
- [ ] 移动端测试（响应式）

#### 8.2 性能优化
```javascript
// 图片懒加载
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// Service Worker 缓存
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

#### 8.3 部署到 Vercel
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

**部署步骤**：
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel --prod

# 4. 配置环境变量
vercel env add MONGODB_URI
vercel env add OPENAI_API_KEY
vercel env add ALIPAY_APP_ID
```

---

## 📊 数据与内容准备

### 匹配类型数据 (src/data/matchTypes.js)
```javascript
export const matchTypes = [
  {
    type: 'love',
    icon: '💑',
    title: '感情匹配',
    description: '预知你的正缘何时降临',
    price: 29.9
  },
  {
    type: 'career',
    icon: '💼',
    title: '职场关系',
    description: '解析职场人际关系',
    price: 29.9
  },
  {
    type: 'cooperation',
    icon: '🤝',
    title: '合作关系',
    description: '看清合作对象，早做决定',
    price: 29.9
  },
  {
    type: 'villain',
    icon: '👿',
    title: '小人识别',
    description: '揭示隐藏的真实想法',
    price: 29.9
  },
  {
    type: 'job',
    icon: '📈',
    title: '职业发展',
    description: '找到最适合你的职业方向',
    price: 29.9
  },
  {
    type: 'city',
    icon: '🗺️',
    title: '城市方向',
    description: '哪座城市是你的命运之地',
    price: 29.9
  },
  {
    type: 'peach',
    icon: '🌸',
    title: '桃花运势',
    description: '桃花何时盛开',
    price: 29.9
  },
  {
    type: 'benefactor',
    icon: '⭐',
    title: '贵人匹配',
    description: '谁是你生命中的贵人',
    price: 29.9
  },
  {
    type: 'color',
    icon: '🎨',
    title: '颜色匹配',
    description: '找到属于你的幸运色',
    price: 19.9
  },
  {
    type: 'friend',
    icon: '👭',
    title: '闺蜜匹配',
    description: '是否还有更合拍的朋友',
    price: 29.9
  }
];
```

### 六十四卦数据 (src/data/hexagrams.js)
```javascript
export const hexagrams = [
  { id: 1, name: '乾', symbol: '☰', meaning: '刚健中正' },
  { id: 2, name: '坤', symbol: '☷', meaning: '柔顺伸展' },
  { id: 3, name: '屯', symbol: '☳☵', meaning: '起始艰难' },
  // ... 共64卦
];

export function getRandomHexagrams(count) {
  const shuffled = [...hexagrams].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
```

### AI 提示词模板 (server/utils/prompts.js)
```javascript
export function getPromptTemplate(matchType, method, data) {
  const templates = {
    love: {
      birthday: `
        请作为专业命理师，分析以下两人的感情匹配度：
        
        男方信息：
        - 生辰八字：${data.person1.bazi}
        - 五行：${data.person1.wuxing}
        
        女方信息：
        - 生辰八字：${data.person2.bazi}
        - 五行：${data.person2.wuxing}
        
        请从以下角度分析：
        1. 整体匹配度（0-100分）
        2. 性格互补性
        3. 优势分析（3点）
        4. 需要注意的问题（3点）
        5. 相处建议（3点）
        
        请用温暖、专业的语气，给出详细分析。
      `,
      tarot: `
        用户通过直觉选择了以下6张塔罗牌进行感情匹配分析：
        ${data.hexagrams.map(h => `${h.name}（${h.meaning}）`).join('、')}
        
        请基于六爻占卜原理，结合塔罗牌的象征意义，分析：
        1. 这段感情的整体运势
        2. 双方的情感状态
        3. 关系发展的趋势
        4. 需要注意的事项
        5. 给出的建议
      `
    },
    // 其他匹配类型的模板...
  };

  return templates[matchType][method];
}
```

---

## 🎯 里程碑与交付物

### 第一周（阶段1-3）
**交付物**：
- ✅ 完整的项目结构
- ✅ 设计系统（CSS 变量、组件样式）
- ✅ 核心组件库
- ✅ 首页原型

### 第二周（阶段4-5）
**交付物**：
- ✅ 所有7个页面完成
- ✅ 前端路由系统
- ✅ 后端 API 框架
- ✅ 数据库模型

### 第三周（阶段6-8）
**交付物**：
- ✅ 支付系统集成
- ✅ AI 分析功能
- ✅ 用户系统完整
- ✅ 测试通过
- ✅ 部署上线

---

## 📈 成功指标

### 技术指标
- [ ] 首屏加载时间 < 2秒
- [ ] Lighthouse 性能分数 > 90
- [ ] 移动端适配完美
- [ ] 浏览器兼容性 > 95%

### 业务指标
- [ ] 用户注册转化率 > 30%
- [ ] 支付转化率 > 15%
- [ ] 推荐分享率 > 20%
- [ ] 用户满意度 > 4.5/5

---

## 🚀 下一步行动

### 立即开始
1. ✅ Git 仓库已初始化
2. ✅ Vite 项目已创建
3. ⏳ 配置项目结构
4. ⏳ 实现设计系统
5. ⏳ 开发首页

### 本周目标
- 完成设计系统
- 实现核心组件
- 完成首页和测试选择页

---

## 📞 需要确认的事项

1. **AI 分析方案**：使用 OpenAI API 还是自建模型？
2. **支付方式**：优先集成支付宝还是微信？
3. **小红书集成**：验证码如何生成和分发？
4. **定价策略**：各项测试的具体价格？
5. **推荐奖励**：具体奖励规则（几次免费测试）？

---

## 📚 参考资源

- Quin 设计参考：已提供截图
- Vite 文档：https://vitejs.dev
- MongoDB 文档：https://docs.mongodb.com
- OpenAI API：https://platform.openai.com/docs
- 支付宝开放平台：https://opendocs.alipay.com

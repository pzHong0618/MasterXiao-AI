---
description: MasterXiao-AI 页面设计规范 - 基于 Quin 风格
---

# 页面设计规范

## 设计风格参考

### 色彩方案（从 Quin 调整）
**主色调**：
- 背景渐变：`linear-gradient(180deg, #E8D5FF 0%, #FFE5F0 50%, #E5F0FF 100%)`
- 卡片背景：`rgba(255, 255, 255, 0.7)` + `backdrop-filter: blur(20px)`
- 主要紫色：`#8B7FD8` → `#A78BFA`
- 粉色强调：`#FFB5D8` → `#FCA5D4`
- 蓝色辅助：`#B5D8FF` → `#93C5FD`

**文字颜色**：
- 主标题：`#2D2D3D`
- 副标题：`#6B6B7B`
- 描述文字：`#9B9BAB`

### 排版系统
- **主字体**：Inter, -apple-system, sans-serif
- **标题字体**：Outfit, Inter, sans-serif
- **字号**：
  - H1: 28px (页面标题)
  - H2: 20px (卡片标题)
  - Body: 15px (正文)
  - Small: 13px (辅助信息)

### 间距系统
- 基础单位：8px
- 卡片间距：16px
- 卡片内边距：20px
- 圆角：20px (卡片), 12px (按钮)

### 视觉效果
- 阴影：`0 8px 32px rgba(139, 127, 216, 0.15)`
- 毛玻璃：`backdrop-filter: blur(20px)`
- 过渡：`all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

---

## 页面结构

### 1. 首页 (index.html)

#### 布局结构
```html
<div class="app">
  <!-- 顶部导航 -->
  <header class="navbar">
    <div class="logo">MasterXiao</div>
    <div class="nav-icons">
      <button class="icon-btn">🕐</button>
      <button class="icon-btn">👤</button>
    </div>
  </header>

  <!-- 主内容区 -->
  <main class="content">
    <!-- 欢迎横幅 -->
    <section class="hero-banner">
      <div class="banner-card glass-card">
        <div class="banner-icon">🔮</div>
        <h1>发现你的命运连接</h1>
        <p>让星辰为你指引前路</p>
        <button class="primary-btn">开始占卜</button>
      </div>
    </section>

    <!-- 功能卡片网格 -->
    <section class="features-grid">
      <div class="feature-card glass-card">
        <div class="card-icon">💑</div>
        <h3>感情匹配</h3>
        <p>预知你的正缘何时降临</p>
      </div>
      <!-- 更多卡片... -->
    </section>
  </main>
</div>
```

#### 功能卡片列表（10种）
1. **感情匹配** 💑
   - 图标：心形塔罗牌
   - 描述：预知你的正缘何时降临

2. **职场关系** 💼
   - 图标：公文包 + 塔罗牌
   - 描述：解析职场人际关系

3. **合作关系** 🤝
   - 图标：握手 + 星星
   - 描述：看清合作对象，早做决定

4. **小人识别** 👿
   - 图标：面具塔罗牌
   - 描述：揭示隐藏的真实想法

5. **职业发展** 📈
   - 图标：上升箭头 + 水晶球
   - 描述：找到最适合你的职业方向

6. **城市方向** 🗺️
   - 图标：指南针 + 地图
   - 描述：哪座城市是你的命运之地

7. **桃花运势** 🌸
   - 图标：樱花 + 塔罗牌
   - 描述：桃花何时盛开

8. **贵人匹配** ⭐
   - 图标：星星 + 人物
   - 描述：谁是你生命中的贵人

9. **颜色匹配** 🎨
   - 图标：调色板
   - 描述：找到属于你的幸运色

10. **闺蜜匹配** 👭
    - 图标：两个女孩 + 心形
    - 描述：是否还有更合拍的朋友

---

### 2. 测试选择页 (test-select.html)

#### 流程设计
```
┌─────────────────────────────┐
│  ← 返回    感情匹配          │
├─────────────────────────────┤
│                             │
│  [功能介绍卡片]              │
│  感情匹配可以帮助你...       │
│                             │
├─────────────────────────────┤
│  选择测试方式                │
│                             │
│  ┌───────────────────────┐  │
│  │  🎂 生日匹配          │  │
│  │  通过生辰八字分析     │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  🔮 塔罗牌测试        │  │
│  │  凭直觉选择塔罗牌     │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

---

### 3. 生日输入页 (birthday-input.html)

#### 表单设计
```html
<div class="input-page">
  <div class="progress-bar">
    <div class="progress" style="width: 33%"></div>
  </div>

  <div class="input-card glass-card">
    <h2>请输入双方信息</h2>
    
    <!-- 自己的信息 -->
    <div class="person-section">
      <h3>你的信息</h3>
      <div class="form-group">
        <label>性别</label>
        <div class="gender-selector">
          <button class="gender-btn active">👨 男</button>
          <button class="gender-btn">👩 女</button>
        </div>
      </div>
      <div class="form-group">
        <label>出生日期</label>
        <input type="date" class="date-input">
      </div>
      <div class="form-group">
        <label>出生时间（可选）</label>
        <input type="time" class="time-input">
      </div>
    </div>

    <!-- 对方的信息 -->
    <div class="person-section">
      <h3>对方信息</h3>
      <!-- 同上 -->
    </div>

    <button class="primary-btn full-width">下一步</button>
  </div>
</div>
```

---

### 4. 塔罗翻牌页 (tarot-cards.html)

#### 卡牌布局
```html
<div class="tarot-page">
  <div class="instruction-card">
    <p>🌙 静下心来，凭直觉选择 6 张牌</p>
    <div class="selected-count">已选择: <span>0</span>/6</div>
  </div>

  <div class="cards-container">
    <!-- 6张卡牌，3行2列布局 -->
    <div class="card-wrapper">
      <div class="tarot-card" data-index="0">
        <div class="card-back">
          <!-- 卡牌背面设计：神秘图案 -->
          <div class="card-pattern">
            <div class="star">✨</div>
            <div class="moon">🌙</div>
          </div>
        </div>
        <div class="card-front">
          <!-- 卡牌正面：卦象 -->
          <div class="hexagram">☰</div>
          <div class="hexagram-name">乾</div>
        </div>
      </div>
    </div>
    <!-- 重复 6 次 -->
  </div>

  <button class="primary-btn" disabled>开始分析</button>
</div>
```

#### 翻牌动画
```css
.tarot-card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.tarot-card.flipped {
  transform: rotateY(180deg);
}

.card-back, .card-front {
  backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
}
```

---

### 5. 验证码/支付页 (payment.html)

#### 两种场景

**场景 A：小红书验证码**
```html
<div class="verification-page">
  <div class="verification-card glass-card">
    <div class="icon">🔐</div>
    <h2>输入验证码</h2>
    <p>请输入从小红书获得的验证码</p>
    
    <div class="code-input-group">
      <input type="text" maxlength="1" class="code-digit">
      <input type="text" maxlength="1" class="code-digit">
      <input type="text" maxlength="1" class="code-digit">
      <input type="text" maxlength="1" class="code-digit">
      <input type="text" maxlength="1" class="code-digit">
      <input type="text" maxlength="1" class="code-digit">
    </div>

    <button class="primary-btn">验证并开始</button>
    
    <div class="help-text">
      <a href="#">还没有验证码？去小红书购买</a>
    </div>
  </div>
</div>
```

**场景 B：网站内支付**
```html
<div class="payment-page">
  <div class="payment-card glass-card">
    <h2>选择支付方式</h2>
    
    <div class="price-info">
      <div class="service-name">感情匹配分析</div>
      <div class="price">¥ 29.9</div>
    </div>

    <div class="payment-methods">
      <button class="payment-btn">
        <img src="alipay.svg">
        <span>支付宝</span>
      </button>
      <button class="payment-btn">
        <img src="wechat.svg">
        <span>微信支付</span>
      </button>
    </div>

    <div class="discount-tip">
      💝 推荐好友可获得免费测试机会
    </div>
  </div>
</div>
```

---

### 6. AI 分析页 (analysis.html)

#### 对话式分析界面
```html
<div class="analysis-page">
  <div class="chat-container">
    <!-- AI 消息气泡 -->
    <div class="message ai-message">
      <div class="avatar">🔮</div>
      <div class="bubble glass-card">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
        <!-- 或显示文字内容 -->
        <p class="typewriter">正在为你解读命运...</p>
      </div>
    </div>

    <!-- 分析结果卡片 -->
    <div class="result-card glass-card">
      <div class="match-score">
        <div class="score-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" />
          </svg>
          <span class="score">85%</span>
        </div>
        <p>匹配度</p>
      </div>

      <div class="analysis-sections">
        <div class="section">
          <h3>✨ 优势分析</h3>
          <p>你们在性格上...</p>
        </div>
        <div class="section">
          <h3>⚠️ 注意事项</h3>
          <p>需要注意...</p>
        </div>
        <div class="section">
          <h3>💡 建议</h3>
          <p>建议你们...</p>
        </div>
      </div>

      <div class="action-buttons">
        <button class="secondary-btn">
          <span>📥</span> 下载报告
        </button>
        <button class="secondary-btn">
          <span>📤</span> 分享结果
        </button>
      </div>
    </div>
  </div>
</div>
```

---

### 7. 个人中心页 (profile.html)

#### 布局结构
```html
<div class="profile-page">
  <!-- 用户信息卡片 -->
  <div class="user-card glass-card">
    <div class="avatar-large">👤</div>
    <h2>用户昵称</h2>
    <div class="user-stats">
      <div class="stat">
        <span class="number">5</span>
        <span class="label">测试次数</span>
      </div>
      <div class="stat">
        <span class="number">3</span>
        <span class="label">剩余权益</span>
      </div>
      <div class="stat">
        <span class="number">2</span>
        <span class="label">推荐人数</span>
      </div>
    </div>
  </div>

  <!-- 推荐链接卡片 -->
  <div class="referral-card glass-card">
    <h3>🎁 邀请好友，获得免费测试</h3>
    <div class="referral-code">
      <input type="text" value="XIAO2026" readonly>
      <button class="copy-btn">复制</button>
    </div>
    <div class="referral-link">
      <input type="text" value="https://masterxiao.ai/r/XIAO2026" readonly>
      <button class="copy-btn">复制链接</button>
    </div>
  </div>

  <!-- 历史记录 -->
  <div class="history-section">
    <h3>测试历史</h3>
    <div class="history-list">
      <div class="history-item glass-card">
        <div class="item-icon">💑</div>
        <div class="item-info">
          <h4>感情匹配</h4>
          <p>2026-01-30 14:23</p>
        </div>
        <button class="view-btn">查看</button>
      </div>
      <!-- 更多历史记录 -->
    </div>
  </div>

  <!-- 设置选项 -->
  <div class="settings-section">
    <div class="setting-item">
      <span>个人信息</span>
      <span>→</span>
    </div>
    <div class="setting-item">
      <span>隐私设置</span>
      <span>→</span>
    </div>
    <div class="setting-item">
      <span>关于我们</span>
      <span>→</span>
    </div>
  </div>
</div>
```

---

## 交互动画

### 1. 页面切换
```css
.page-enter {
  animation: slideInRight 0.3s ease-out;
}

.page-exit {
  animation: slideOutLeft 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### 2. 卡片悬停
```css
.feature-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(139, 127, 216, 0.25);
}
```

### 3. 打字机效果
```javascript
function typewriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}
```

### 4. 进度条动画
```css
.progress {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 响应式设计

### 断点
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 移动端优化
```css
@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .feature-card {
    padding: 16px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .navbar {
    padding: 12px 16px;
  }
}
```

---

## 组件复用

### 通用组件
1. **glass-card** - 毛玻璃卡片
2. **primary-btn** - 主要按钮
3. **secondary-btn** - 次要按钮
4. **input-field** - 输入框
5. **progress-bar** - 进度条
6. **loading-spinner** - 加载动画
7. **toast-message** - 提示消息

---

## SEO 优化

### Meta 标签
```html
<meta name="description" content="MasterXiao AI - 智能命理匹配分析平台">
<meta name="keywords" content="感情匹配,职场关系,塔罗牌,命理分析">
<meta property="og:title" content="MasterXiao AI">
<meta property="og:image" content="/og-image.jpg">
```

### 语义化 HTML
- 使用 `<header>`, `<main>`, `<section>`, `<article>`
- 正确的标题层级 (h1 → h2 → h3)
- 有意义的 alt 文本

---

## 性能优化

1. **图片优化**
   - 使用 WebP 格式
   - 懒加载非首屏图片
   - 响应式图片

2. **代码分割**
   - 按页面分割 JavaScript
   - 动态导入组件

3. **缓存策略**
   - Service Worker
   - 本地存储用户数据

4. **CDN 加速**
   - 静态资源 CDN
   - 字体 CDN (Google Fonts)

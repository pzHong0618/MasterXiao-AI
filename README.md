# MasterXiao-AI 🔮

> 智能命理匹配分析平台 - 采用 Quin 风格的现代化交互界面

## 📖 项目简介

**MasterXiao-AI** 是一个基于命理学和 AI 技术的智能匹配分析平台，提供多维度的人际关系、职业发展、城市方向等分析服务。

### ✨ 核心功能

- 🎯 **10种匹配分析**
  - 💑 感情匹配
  - 💼 职场关系
  - 🤝 合作关系
  - 👿 小人识别
  - 📈 职业发展
  - 🗺️ 城市方向
  - 🌸 桃花运势
  - ⭐ 贵人匹配
  - 🎨 颜色匹配
  - 👭 闺蜜匹配

- 🔮 **双重测试方式**
  - 生辰八字匹配分析
  - 六爻塔罗翻牌测试

- 💰 **多渠道变现**
  - 小红书验证码系统
  - 支付宝/微信支付
  - 推荐奖励机制

- 👥 **用户系统**
  - 个人信息档案
  - 测试历史记录
  - 推荐链接生成
  - 积分权益管理

## 🎨 设计风格

采用 **Quin** 风格的现代化设计：
- 梦幻渐变背景（紫色→粉色→蓝色）
- 毛玻璃效果卡片
- 流畅的动画过渡
- 优雅的打字机效果
- 3D 塔罗牌翻转动画

## 🛠️ 技术栈

### 前端
- **构建工具**: Vite 7.x
- **框架**: Vanilla JavaScript
- **样式**: CSS3 + CSS Variables
- **字体**: Google Fonts (Inter, Outfit)
- **动画**: CSS Animations + Web Animations API

### 后端
- **运行时**: Node.js 20+
- **框架**: Express.js
- **数据库**: MongoDB
- **认证**: JWT
- **AI**: OpenAI API

### 部署
- **平台**: Vercel
- **CDN**: Vercel Edge Network

## 📁 项目结构

```
MasterXiao-AI/
├── .agent/
│   └── workflows/              # 开发工作流文档
│       ├── development-plan.md
│       ├── page-design.md
│       └── complete-implementation-plan.md
├── public/
│   └── assets/                 # 静态资源
├── src/
│   ├── index.html              # 主页面
│   ├── main.js                 # 入口文件
│   ├── styles/                 # 样式文件
│   ├── scripts/                # JavaScript 模块
│   ├── components/             # UI 组件
│   ├── pages/                  # 页面组件
│   └── data/                   # 数据文件
├── server/                     # 后端代码
│   ├── routes/                 # API 路由
│   ├── controllers/            # 控制器
│   ├── models/                 # 数据模型
│   └── utils/                  # 工具函数
└── package.json
```

## 🚀 快速开始

### 环境要求
- Node.js 20+
- npm 或 yarn
- MongoDB 6+

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/xiaolongde/MasterXiao-AI.git
cd MasterXiao-AI

# 安装前端依赖
npm install

# 安装后端依赖（待开发）
cd server
npm install
```

### 开发模式

```bash
# 启动前端开发服务器
npm run dev

# 启动后端服务器（待开发）
cd server
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build
```

## 📱 页面结构

1. **首页** (`/`) - 功能展示与选择
2. **测试选择页** (`/test/:type`) - 选择测试方式
3. **生日输入页** (`/test/:type/birthday`) - 生日匹配输入
4. **塔罗翻牌页** (`/test/:type/tarot`) - 六爻翻牌
5. **验证/支付页** (`/payment`) - 验证码或支付
6. **分析结果页** (`/result/:id`) - AI 分析展示
7. **个人中心页** (`/profile`) - 用户信息与历史

## 🎯 开发计划

详细的开发计划请查看：
- [基础开发计划](.agent/workflows/development-plan.md)
- [页面设计规范](.agent/workflows/page-design.md)
- [完整实施计划](.agent/workflows/complete-implementation-plan.md)

### 开发阶段（预计 15-20 天）

- [x] 阶段 1: 项目初始化与基础设施 (1天)
- [ ] 阶段 2: 设计系统构建 (2天)
- [ ] 阶段 3: 核心组件开发 (3天)
- [ ] 阶段 4: 页面开发 (4天)
- [ ] 阶段 5: 后端 API 开发 (3天)
- [ ] 阶段 6: 支付与验证码系统 (2天)
- [ ] 阶段 7: 用户系统与推荐机制 (2天)
- [ ] 阶段 8: 测试、优化与部署 (2天)

## 🎨 设计参考

项目采用 Quin 风格设计，参考截图已保存在项目文档中。

### 色彩方案
- 背景渐变：`#E8D5FF` → `#FFE5F0` → `#E5F0FF`
- 主要紫色：`#8B7FD8` → `#A78BFA`
- 粉色强调：`#FFB5D8` → `#FCA5D4`
- 蓝色辅助：`#B5D8FF` → `#93C5FD`

## 🔐 环境变量

创建 `.env` 文件并配置以下变量：

```env
# API
VITE_API_URL=http://localhost:3000

# OpenAI
VITE_OPENAI_API_KEY=your_openai_key

# 支付宝
VITE_ALIPAY_APP_ID=your_alipay_app_id

# 微信支付
VITE_WECHAT_APP_ID=your_wechat_app_id

# MongoDB
MONGODB_URI=mongodb://localhost:27017/masterxiao

# JWT
JWT_SECRET=your_jwt_secret
```

## 📊 数据库设计

### 主要数据模型

- **User** - 用户信息
- **Order** - 订单记录
- **TestRecord** - 测试记录
- **Referral** - 推荐关系
- **VerificationCode** - 验证码

详细的数据库设计请查看 [完整实施计划](.agent/workflows/complete-implementation-plan.md)

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**MasterXiao Team**

- GitHub: [@xiaolongde](https://github.com/xiaolongde)

## 🙏 致谢

- 设计灵感来自 [Quin](https://quin.design)
- AI 技术支持：OpenAI
- 开发工具：Vite, Express, MongoDB

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至：[您的邮箱]
- 小红书：[您的小红书账号]

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！

/**
 * 匹配游戏 后端服务器
 * Express.js 入口文件
 */

// ==================== 时间格式化工具 ====================
function getTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

// 将时间戳工具添加到global以便其他模块使用
global.getTimestamp = getTimestamp;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 路由统一入口
import apiRoutes from './routes/index.js';

// 中间件导入
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

// 加载环境变量
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== 中间件配置 ====================

// CORS 跨域配置
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // 允许无 origin 的请求（如 curl）
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS not allowed'), false);
    },
    credentials: true
}));

// JSON 解析
app.use(express.json());

// URL 编码解析
app.use(express.urlencoded({ extended: true }));

// 请求日志
app.use(requestLogger);

// ==================== API 路由 ====================

// 统一 API 路由
app.use('/api', apiRoutes);

// ==================== 静态文件服务 ====================

// 管理后台静态文件（开发和生产环境都可访问）
app.use('/admin', express.static(join(__dirname, '../admin')));

// 生产环境下提供前端静态文件
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '../dist')));

    // SPA 回退（排除 /admin 路径）
    app.get(/^(?!\/admin).*/, (req, res) => {
      res.sendFile(join(__dirname, "../dist/index.html"));
    });
}

// ==================== 错误处理 ====================

app.use(errorHandler);

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
    console.log(`[${getTimestamp()}] 🚀 匹配游戏 服务器启动成功`);
    console.log(`[${getTimestamp()}] 📍 地址: http://localhost:${PORT}`);
    console.log(`[${getTimestamp()}] 🔧 环境: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 根据 NODE_ENV 加载对应的环境变量文件
// 优先级: .env.production > .env (生产环境)
//         .env > .env.development (开发环境)
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env';
dotenv.config({ path: join(__dirname, '..', envFile) });

// 路由统一入口
import apiRoutes from './routes/index.js';

// 中间件导入
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

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
app.use('/admin', express.static(join(__dirname, '../web/backend')));

// 前端静态文件（所有环境）- 构建输出在 web/client/dist
app.use(express.static(join(__dirname, '../web/client/dist')));

// SPA 回退（排除 /api 和 /admin 路径）
app.get(/^(?!\/(api|admin)).*/, (req, res, next) => {
    const indexPath = join(__dirname, '../web/client/dist/index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // 如果 dist/index.html 不存在，继续下一个处理器
            next();
        }
    });
});

// ==================== 错误处理 ====================

app.use(errorHandler);

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
    console.log(`[${getTimestamp()}] 🚀 匹配游戏 服务器启动成功`);
    console.log(`[${getTimestamp()}] 📍 地址: http://localhost:${PORT}`);
    console.log(`[${getTimestamp()}] 🔧 环境: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

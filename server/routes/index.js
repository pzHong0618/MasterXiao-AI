/**
 * 路由统一入口
 */

import express from 'express';

// 路由导入
import authRoutes from './auth.js';
import testRoutes from './test.js';
import analysisRoutes from './analysis.js';
import birthdayMatchRoutes from './birthdayMatch.js';
import verificationRoutes from './verification.js';
import userRoutes from './user.js';
import paymentRoutes from './payment.js';
import redeemRoutes from './redeem.js';

import matchRecordRoutes from './matchRecord.js';
import tarotRoutes from './tarot.js';
import divinationRoutes from './divination.js';

const router = express.Router();

// 健康检查
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 认证路由
router.use('/auth', authRoutes);

// 测试记录路由
router.use('/test', testRoutes);

// AI 分析路由
// router.use('/analysis', analysisRoutes);

// Deepseek 生日匹配分析路由
router.use('/analysis', birthdayMatchRoutes);

// 验证码路由
router.use('/verification', verificationRoutes);

// 用户路由
router.use('/user', userRoutes);

// 支付路由
router.use('/payment', paymentRoutes);

// 兑换码路由
router.use('/redeem', redeemRoutes);

// 匹配记录路由（核销码兑换匹配流程）
router.use('/match/record', matchRecordRoutes);

// 塔罗牌路由
// router.use('/tarot', tarotRoutes);

// 六爻/卦象解读路由
router.use('/divination', divinationRoutes);

export default router;

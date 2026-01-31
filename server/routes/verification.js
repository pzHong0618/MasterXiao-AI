/**
 * 验证码路由（图形验证、行为验证等）
 */

import express from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// 存储图形验证码
const captchas = new Map();

/**
 * GET /api/verification/captcha
 * 获取图形验证码
 */
router.get('/captcha', asyncHandler(async (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        throw new AppError('缺少会话ID', 400, 'MISSING_SESSION');
    }

    // 生成简单的数学验证码
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = Math.random() > 0.5 ? '+' : '-';
    const answer = operator === '+' ? num1 + num2 : num1 - num2;

    // 存储答案
    captchas.set(sessionId, {
        answer: Math.abs(answer),
        expires: Date.now() + 5 * 60 * 1000
    });

    res.json({
        success: true,
        data: {
            question: `${num1} ${operator} ${num2} = ?`,
            sessionId
        }
    });
}));

/**
 * POST /api/verification/captcha
 * 验证图形验证码
 */
router.post('/captcha', asyncHandler(async (req, res) => {
    const { sessionId, answer } = req.body;

    if (!sessionId || answer === undefined) {
        throw new AppError('缺少必要参数', 400, 'MISSING_FIELDS');
    }

    const stored = captchas.get(sessionId);

    if (!stored) {
        throw new AppError('验证码不存在或已过期', 400, 'CAPTCHA_EXPIRED');
    }

    if (Date.now() > stored.expires) {
        captchas.delete(sessionId);
        throw new AppError('验证码已过期', 400, 'CAPTCHA_EXPIRED');
    }

    if (parseInt(answer) !== stored.answer) {
        throw new AppError('验证码错误', 400, 'CAPTCHA_INVALID');
    }

    // 验证成功，删除验证码
    captchas.delete(sessionId);

    res.json({
        success: true,
        message: '验证成功'
    });
}));

/**
 * POST /api/verification/behavior
 * 行为验证（滑动验证等）- 预留接口
 */
router.post('/behavior', asyncHandler(async (req, res) => {
    const { token, data } = req.body;

    // TODO: 接入第三方行为验证服务
    // 如：极验、网易易盾等

    res.json({
        success: true,
        message: '验证通过'
    });
}));

export default router;

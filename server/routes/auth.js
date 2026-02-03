/**
 * 用户认证路由
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { users, verificationCodes } from '../services/dataStore.js';

const router = express.Router();

/**
 * POST /api/auth/send-code
 * 发送验证码
 */
router.post('/send-code', asyncHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        throw new AppError('请输入有效的手机号', 400, 'INVALID_PHONE');
    }

    // 生成6位验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // 存储验证码（5分钟有效）
    verificationCodes.set(phone, {
        code,
        expires: Date.now() + 5 * 60 * 1000,
        attempts: 0
    });

    // TODO: 实际发送短信
    console.log(`[${global.getTimestamp()}] 📱 验证码发送到 ${phone}: ${code}`);

    res.json({
        success: true,
        message: '验证码已发送',
        // 开发环境返回验证码
        ...(process.env.NODE_ENV === 'development' && { code })
    });
}));

/**
 * POST /api/auth/login
 * 验证码登录
 */
router.post('/login', asyncHandler(async (req, res) => {
    const { phone, code } = req.body;

    if (!phone || !code) {
        throw new AppError('请输入手机号和验证码', 400, 'MISSING_FIELDS');
    }

    // 验证验证码
    const storedCode = verificationCodes.get(phone);

    if (!storedCode || storedCode.code !== code) {
        throw new AppError('验证码错误', 400, 'INVALID_CODE');
    }

    if (Date.now() > storedCode.expires) {
        verificationCodes.delete(phone);
        throw new AppError('验证码已过期', 400, 'CODE_EXPIRED');
    }

    // 清除使用过的验证码
    verificationCodes.delete(phone);

    // 查找或创建用户
    let user = users.get(phone);

    if (!user) {
        // 新用户
        user = {
            id: uuidv4(),
            phone,
            nickname: `用户${phone.slice(-4)}`,
            avatar: null,
            createdAt: new Date().toISOString(),
            testCount: 0,
            inviteCode: generateInviteCode(),
            invitedBy: null,
            credits: 1 // 新用户赠送1次免费测试
        };
        users.set(phone, user);
        console.log(`[${global.getTimestamp()}] 🎉 新用户注册: ${phone}`);
    }

    // 生成 JWT
    const token = generateToken({
        userId: user.id,
        phone: user.phone
    });

    res.json({
        success: true,
        message: '登录成功',
        data: {
            token,
            user: {
                id: user.id,
                phone: user.phone,
                nickname: user.nickname,
                avatar: user.avatar,
                credits: user.credits
            }
        }
    });
}));

/**
 * GET /api/auth/me
 * 获取当前用户信息
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
    const user = users.get(req.user.phone);

    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            phone: user.phone,
            nickname: user.nickname,
            avatar: user.avatar,
            credits: user.credits,
            testCount: user.testCount,
            inviteCode: user.inviteCode
        }
    });
}));

/**
 * 生成邀请码
 */
function generateInviteCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default router;

/**
 * 用户路由
 */

import express from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { users } from '../services/dataStore.js';

const router = express.Router();

/**
 * PUT /api/user/profile
 * 更新用户资料
 */
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
    const { nickname, avatar, gender, birthDate } = req.body;

    const user = users.get(req.user.phone);

    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }

    // 更新字段
    if (nickname !== undefined) {
        if (nickname.length > 20) {
            throw new AppError('昵称不能超过20个字符', 400, 'NICKNAME_TOO_LONG');
        }
        user.nickname = nickname;
    }

    if (avatar !== undefined) {
        user.avatar = avatar;
    }

    if (gender !== undefined) {
        user.gender = gender;
    }

    if (birthDate !== undefined) {
        user.birthDate = birthDate;
    }

    user.updatedAt = new Date().toISOString();
    users.set(req.user.phone, user);

    res.json({
        success: true,
        message: '资料更新成功',
        data: {
            id: user.id,
            nickname: user.nickname,
            avatar: user.avatar,
            gender: user.gender,
            birthDate: user.birthDate
        }
    });
}));

/**
 * GET /api/user/invite
 * 获取邀请信息
 */
router.get('/invite', authenticate, asyncHandler(async (req, res) => {
    const user = users.get(req.user.phone);

    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }

    // 统计邀请人数
    let inviteCount = 0;
    users.forEach(u => {
        if (u.invitedBy === user.inviteCode) {
            inviteCount++;
        }
    });

    res.json({
        success: true,
        data: {
            inviteCode: user.inviteCode,
            inviteCount,
            inviteReward: inviteCount * 1, // 每邀请1人奖励1次免费测试
            inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}?invite=${user.inviteCode}`
        }
    });
}));

/**
 * POST /api/user/invite/apply
 * 使用邀请码
 */
router.post('/invite/apply', authenticate, asyncHandler(async (req, res) => {
    const { inviteCode } = req.body;

    if (!inviteCode) {
        throw new AppError('请输入邀请码', 400, 'MISSING_INVITE_CODE');
    }

    const user = users.get(req.user.phone);

    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }

    if (user.invitedBy) {
        throw new AppError('您已使用过邀请码', 400, 'ALREADY_INVITED');
    }

    // 查找邀请人
    let inviter = null;
    users.forEach(u => {
        if (u.inviteCode === inviteCode.toUpperCase()) {
            inviter = u;
        }
    });

    if (!inviter) {
        throw new AppError('邀请码无效', 400, 'INVALID_INVITE_CODE');
    }

    if (inviter.id === user.id) {
        throw new AppError('不能使用自己的邀请码', 400, 'SELF_INVITE');
    }

    // 建立邀请关系
    user.invitedBy = inviteCode.toUpperCase();
    users.set(req.user.phone, user);

    // 给邀请人增加奖励
    inviter.credits = (inviter.credits || 0) + 1;

    res.json({
        success: true,
        message: '邀请码使用成功，你和邀请人各获得1次免费测试'
    });
}));

/**
 * GET /api/user/credits
 * 获取用户积分/免费次数
 */
router.get('/credits', authenticate, asyncHandler(async (req, res) => {
    const user = users.get(req.user.phone);

    if (!user) {
        throw new AppError('用户不存在', 404, 'USER_NOT_FOUND');
    }

    res.json({
        success: true,
        data: {
            credits: user.credits || 0,
            testCount: user.testCount || 0
        }
    });
}));

export default router;

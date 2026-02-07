/**
 * 内存数据存储
 * 开发阶段使用，后续替换为数据库
 */

// 用户数据 Map<phone, user>
export const users = new Map();

// 验证码数据 Map<phone, { code, expires, attempts, type }>
export const verificationCodes = new Map();

// 用户会话数据 Map<sessionId, { userId, token, expiresAt, createdAt }>
export const userSessions = new Map();

// 用户购买记录 Map<`${userId}_${testTypeId}`, purchase>
export const userPurchases = new Map();

// 测试记录 Map<testId, test>
export const tests = new Map();

// 订单记录 Map<orderId, order>
export const orders = new Map();

// 验证码发送频率记录 Map<phone, { count, lastSentAt, dailyCount, dailyResetAt }>
export const smsRateLimit = new Map();

// 清理过期数据的定时任务
setInterval(() => {
    const now = Date.now();

    // 清理过期验证码
    verificationCodes.forEach((value, key) => {
        if (now > value.expires) {
            verificationCodes.delete(key);
        }
    });

    // 清理过期会话
    userSessions.forEach((value, key) => {
        if (now > new Date(value.expiresAt).getTime()) {
            userSessions.delete(key);
        }
    });
}, 60 * 1000); // 每分钟执行一次

export default { users, verificationCodes, userSessions, userPurchases, tests, orders, smsRateLimit };

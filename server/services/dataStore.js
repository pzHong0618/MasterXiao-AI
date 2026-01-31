/**
 * 内存数据存储
 * 开发阶段使用，后续替换为 MongoDB
 */

// 用户数据 Map<phone, user>
export const users = new Map();

// 验证码数据 Map<phone, { code, expires, attempts }>
export const verificationCodes = new Map();

// 测试记录 Map<testId, test>
export const tests = new Map();

// 订单记录 Map<orderId, order>
export const orders = new Map();

// 清理过期数据的定时任务
setInterval(() => {
    const now = Date.now();

    // 清理过期验证码
    verificationCodes.forEach((value, key) => {
        if (now > value.expires) {
            verificationCodes.delete(key);
        }
    });
}, 60 * 1000); // 每分钟执行一次

export default { users, verificationCodes, tests, orders };

/**
 * 匹配游戏 API 服务层
 * 封装所有后端 API 调用
 */

// 动态获取 API 基础地址（自动适配当前访问域名）
export const getApiBaseUrl = () => {
    // 优先使用环境变量配置
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // 自动检测：如果是通过 IP/域名访问，使用当前域名
    const currentHost = window.location.host; // 包含端口的完整host
    if (currentHost && !currentHost.includes('localhost') && !currentHost.includes('127.0.0.1')) {
        // 云服务器或域名访问，使用当前协议和host
        return `${window.location.protocol}//${currentHost}/api`;
    }
    
    // 本地开发默认
    return 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * 通用请求方法
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    // 添加认证令牌
    const token = localStorage.getItem('auth_token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(data.error?.message || '请求失败', data.error?.code, response.status);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('网络连接失败，请检查网络', 'NETWORK_ERROR', 0);
    }
}

/**
 * API 错误类
 */
export class ApiError extends Error {
    constructor(message, code, status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

// ==================== 认证 API ====================

export const authApi = {
    /**
     * 发送验证码（新接口，支持类型）
     */
    async sendSms(phone, type = 'login') {
        return request('/auth/send-sms', {
            method: 'POST',
            body: JSON.stringify({ phone, type })
        });
    },

    /**
     * 发送验证码（兼容旧接口）
     */
    async sendCode(phone) {
        return request('/auth/send-code', {
            method: 'POST',
            body: JSON.stringify({ phone })
        });
    },

    /**
     * 用户注册
     */
    async register(data) {
        const result = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (result.success && result.data?.token) {
            localStorage.setItem('auth_token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            if (result.data.user?.id) {
                localStorage.setItem('userId', result.data.user.id);
            }
        }

        return result;
    },

    /**
     * 验证码登录
     */
    async login(phone, code) {
        const result = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone, code })
        });

        if (result.success && result.data?.token) {
            localStorage.setItem('auth_token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            if (result.data.user?.id) {
                localStorage.setItem('userId', result.data.user.id);
            }
        }

        return result;
    },

    /**
     * 密码登录
     */
    async loginWithPassword(phone, password, rememberMe = false) {
        const result = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone, password, rememberMe })
        });

        if (result.success && result.data?.token) {
            localStorage.setItem('auth_token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user));
            if (result.data.user?.id) {
                localStorage.setItem('userId', result.data.user.id);
            }
        }

        return result;
    },

    /**
     * 重置密码
     */
    async resetPassword(data) {
        return request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * 获取当前用户信息
     */
    async getMe() {
        return request('/auth/me');
    },

    /**
     * 退出登录
     */
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
    },

    /**
     * 检查是否已登录
     */
    isLoggedIn() {
        return !!localStorage.getItem('auth_token');
    },

    /**
     * 获取本地用户信息
     */
    getLocalUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

// ==================== 测试 API ====================

export const testApi = {
    /**
     * 创建测试记录
     */
    async create(data) {
        return request('/test/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * 获取测试详情
     */
    async get(testId) {
        return request(`/test/${testId}`);
    },

    /**
     * 获取测试历史
     */
    async getHistory() {
        return request('/test/user/history');
    }
};

// ==================== 分析 API ====================

export const analysisApi = {
    /**
     * 生日匹配分析
     */
    async birthday(data) {
        return request('/analysis/birthday', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * 生日匹配分析 - 流式响应 (Deepseek AI)
     * @param {Object} data - { partyA, partyB }
     * @param {Object} options - 回调选项
     * @param {Function} options.onChunk - 每次收到数据时的回调
     * @param {Function} options.onDone - 完成时的回调
     * @param {Function} options.onError - 错误时的回调
     * @param {AbortSignal} options.signal - 用于取消请求的信号
     */
    async birthMatchStream(data, { onChunk, onDone, onError, signal }) {
        try {
            const response = await fetch(`${API_BASE_URL}/analysis/birthMatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal // 支持取消请求
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new ApiError(errorData.error?.message || '请求失败', errorData.error?.code, response.status);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                const lines = text.split('\n\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            onDone?.(fullContent);
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                fullContent += parsed.content;
                                onChunk?.(parsed.content, fullContent);
                            }
                            if (parsed.error) {
                                throw new ApiError(parsed.error, 'STREAM_ERROR', 500);
                            }
                        } catch (e) {
                            if (e instanceof ApiError) throw e;
                            // 忽略 JSON 解析错误
                        }
                    }
                }
            }
            
            onDone?.(fullContent);
        } catch (error) {
            onError?.(error);
            throw error;
        }
    },

    /**
     * 卡牌符号分析
     */
    async hexagram(data) {
        return request('/analysis/hexagram', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * 获取分析结果
     */
    async getResult(testId) {
        return request(`/analysis/result/${testId}`);
    }
};

// ==================== 用户 API ====================

export const userApi = {
    /**
     * 检查用户权限（登录状态 + 购买状态）
     */
    async checkPermission(testTypeId, sessionId) {
        return request('/user/check-permission', {
            method: 'POST',
            body: JSON.stringify({ testTypeId, sessionId })
        });
    },

    /**
     * 更新用户资料
     */
    async updateProfile(data) {
        return request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    /**
     * 获取邀请信息
     */
    async getInviteInfo() {
        return request('/user/invite');
    },

    /**
     * 使用邀请码
     */
    async applyInviteCode(inviteCode) {
        return request('/user/invite/apply', {
            method: 'POST',
            body: JSON.stringify({ inviteCode })
        });
    },

    /**
     * 获取用户积分
     */
    async getCredits() {
        return request('/user/credits');
    }
};

// ==================== 验证 API ====================

export const verificationApi = {
    /**
     * 获取图形验证码
     */
    async getCaptcha(sessionId) {
        return request(`/verification/captcha?sessionId=${sessionId}`);
    },

    /**
     * 验证图形验证码
     */
    async verifyCaptcha(sessionId, answer) {
        return request('/verification/captcha', {
            method: 'POST',
            body: JSON.stringify({ sessionId, answer })
        });
    }
};

// ==================== 支付 API ====================

export const paymentApi = {
    /**
     * 创建订单
     */
    async createOrder(data) {
        return request('/payment/create-order', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * 获取订单状态
     */
    async getOrderStatus(orderId) {
        return request(`/payment/order/${orderId}`);
    },

    /**
     * 模拟支付（开发环境）
     */
    async simulatePay(orderId) {
        return request('/payment/simulate-pay', {
            method: 'POST',
            body: JSON.stringify({ orderId })
        });
    },

    /**
     * 使用核销码
     */
    async redeem(redeemCode) {
        return request('/payment/redeem', {
            method: 'POST',
            body: JSON.stringify({ redeemCode })
        });
    },

    /**
     * 获取订单列表
     */
    async getOrders() {
        return request('/payment/orders');
    }
};

// ==================== 匹配记录 API ====================

export const matchRecordApi = {
    /**
     * 创建匹配记录
     * @param {string} sessionId - 会话ID
     * @param {object} reqData - 用户提交的表单数据
     * @param {string} userId - 用户ID（可选）
     * @returns {Promise<{code, message, data: {recordId, sessionId}}>}
     */
    async create(sessionId, reqData, userId = null) {
        return request('/match/record/create', {
            method: 'POST',
            body: JSON.stringify({ sessionId, reqData, userId })
        });
    },

    /**
     * 更新匹配记录状态
     * @param {string} sessionId - 会话ID
     * @param {number} status - 状态（1=成功, 2=失败）
     * @param {object} resultData - 结果数据（可选）
     * @returns {Promise<{code, message, data}>}
     */
    async updateStatus(sessionId, userId, status, resultData = null) {
        return request('/match/record/update-status', {
            method: 'PUT',
            body: JSON.stringify({ sessionId, userId, status, resultData })
        });
    },

    /**
     * 查询匹配记录状态
     * @param {string} sessionId - 会话ID
     * @returns {Promise<{code, message, data: {sessionId, status, updateDate}}>}
     */
    async getStatus(sessionId) {
        return request(`/match/record/status?sessionId=${encodeURIComponent(sessionId)}`);
    },

    /**
     * 查询匹配记录详情
     * @param {string} sessionId - 会话ID
     * @returns {Promise<{code, message, data}>}
     */
    async getDetail(sessionId) {
        return request(`/match/record/detail?sessionId=${encodeURIComponent(sessionId)}`);
    }
};

// ==================== 历史记录 API ====================

export const historyApi = {
    /**
     * 获取历史记录列表
     * @param {object} params - { sessionId, userId, page, pageSize }
     * @returns {Promise<{success, data: {records, total, page, pageSize}}>}
     */
    async getRecords(params = {}) {
        const query = new URLSearchParams();
        if (params.sessionId) query.append('sessionId', params.sessionId);
        if (params.userId) query.append('userId', params.userId);
        if (params.page) query.append('page', params.page);
        if (params.pageSize) query.append('pageSize', params.pageSize);
        return request(`/history/records?${query.toString()}`);
    },

    /**
     * 获取单条记录详情
     * @param {number|string} recordId - 记录ID
     * @param {object} params - { sessionId, userId }
     * @returns {Promise<{success, data}>}
     */
    async getRecordDetail(recordId, params = {}) {
        const query = new URLSearchParams();
        if (params.sessionId) query.append('sessionId', params.sessionId);
        if (params.userId) query.append('userId', params.userId);
        return request(`/history/record/${recordId}?${query.toString()}`);
    }
};

// ==================== 配置 API ====================

export const configApi = {
    /**
     * 获取服务端状态（test / production）
     */
    async getServerState() {
        return request('/config/server-state');
    }
};

// 导出默认对象
export default {
    auth: authApi,
    test: testApi,
    analysis: analysisApi,
    user: userApi,
    verification: verificationApi,
    payment: paymentApi,
    matchRecord: matchRecordApi,
    history: historyApi,
    config: configApi
};


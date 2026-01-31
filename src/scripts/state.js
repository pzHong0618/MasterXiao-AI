/**
 * MasterXiao-AI 状态管理
 * 简单的全局状态管理器，支持持久化
 */

class State {
    constructor() {
        this.state = {};
        this.listeners = new Map();
        this.storageKey = 'masterxiao_state';

        // 从 localStorage 恢复状态
        this.loadFromStorage();
    }

    /**
     * 获取状态
     * @param {string} key - 状态键
     * @param {any} defaultValue - 默认值
     */
    get(key, defaultValue = null) {
        return key in this.state ? this.state[key] : defaultValue;
    }

    /**
     * 设置状态
     * @param {string} key - 状态键
     * @param {any} value - 状态值
     * @param {boolean} persist - 是否持久化到 localStorage
     */
    set(key, value, persist = false) {
        const oldValue = this.state[key];
        this.state[key] = value;

        // 通知监听器
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(callback => {
                callback(value, oldValue);
            });
        }

        // 持久化
        if (persist) {
            this.saveToStorage();
        }
    }

    /**
     * 更新状态（合并对象）
     * @param {string} key - 状态键
     * @param {object} updates - 更新内容
     * @param {boolean} persist - 是否持久化
     */
    update(key, updates, persist = false) {
        const current = this.get(key, {});
        this.set(key, { ...current, ...updates }, persist);
    }

    /**
     * 删除状态
     * @param {string} key - 状态键
     */
    delete(key) {
        delete this.state[key];
        this.saveToStorage();
    }

    /**
     * 订阅状态变化
     * @param {string} key - 状态键
     * @param {Function} callback - 回调函数
     * @returns {Function} - 取消订阅函数
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);

        // 返回取消订阅函数
        return () => {
            this.listeners.get(key).delete(callback);
        };
    }

    /**
     * 保存到 localStorage
     */
    saveToStorage() {
        try {
            // 只保存需要持久化的数据
            const persistData = {
                user: this.state.user,
                testHistory: this.state.testHistory,
                settings: this.state.settings
            };
            localStorage.setItem(this.storageKey, JSON.stringify(persistData));
        } catch (e) {
            console.warn('保存状态失败:', e);
        }
    }

    /**
     * 从 localStorage 加载
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.state = { ...this.state, ...data };
            }
        } catch (e) {
            console.warn('加载状态失败:', e);
        }
    }

    /**
     * 清除所有状态
     */
    clear() {
        this.state = {};
        localStorage.removeItem(this.storageKey);
    }
}

// 创建全局状态实例
const state = new State();

// 初始化默认状态
state.set('currentTest', null);
state.set('testProgress', { step: 0, total: 0 });

// 暴露到全局
window.appState = state;

export default state;

/**
 * 会话匹配记录模型
 * 用于追踪核销码兑换后的匹配流程状态
 * 
 * 状态说明：
 * - 0: 请求中（初始状态）
 * - 1: 成功
 * - 2: 失败
 */
import { queryAll, queryOne, execute } from '../index.js';

export const SessionMatchRecord = {
    /**
     * 创建匹配记录
     * @param {object} recordData - { sessionId, reqData, userId }
     * @returns {object} - { id, sessionId }
     */
    create(recordData) {
        const {
            sessionId,
            reqData,
            userId = null
        } = recordData;

        // 校验 sessionId 格式（UUID v4 格式）
        if (!sessionId || typeof sessionId !== 'string' || sessionId.length < 16) {
            throw new Error('无效的 sessionId 格式');
        }

        // 序列化 reqData
        const reqDataStr = typeof reqData === 'string' ? reqData : JSON.stringify(reqData);

        const result = execute(
            `INSERT INTO session_match_records (session_id, user_id, status, req_data) 
            VALUES (?, ?, 0, ?)`,
            [sessionId, userId, reqDataStr]
        );

        return {
            id: result.lastInsertRowid,
            sessionId,
            status: 0
        };
    },

    /**
     * 根据 sessionId 查找记录
     * @param {string} sessionId
     * @returns {object|null}
     */
    findBySessionId(sessionId) {
        const record = queryOne(
            'SELECT * FROM session_match_records WHERE session_id = ?',
            [sessionId]
        );
        if (record && record.req_data) {
            try {
                record.req_data = JSON.parse(record.req_data);
            } catch (e) {
                // 保持原始字符串
            }
        }
        return record;
    },

    /**
     * 根据 ID 查找记录
     * @param {number} id
     * @returns {object|null}
     */
    findById(id) {
        const record = queryOne(
            'SELECT * FROM session_match_records WHERE id = ?',
            [id]
        );
        if (record && record.req_data) {
            try {
                record.req_data = JSON.parse(record.req_data);
            } catch (e) {
                // 保持原始字符串
            }
        }
        return record;
    },

    /**
     * 更新匹配记录状态
     * @param {string} sessionId - 会话ID
     * @param {number} status - 新状态（1=成功, 2=失败）
     * @param {object} resultData - 匹配结果数据（可选）
     * @returns {boolean}
     */
    updateStatus(sessionId, status, resultData = null) {
        // 校验状态值
        if (![1, 2].includes(status)) {
            throw new Error('无效的状态值，只能为 1（成功）或 2（失败）');
        }

        const record = this.findBySessionId(sessionId);
        if (!record) {
            return false;
        }

        let sql = 'UPDATE session_match_records SET status = ?, update_date = CURRENT_TIMESTAMP';
        const params = [status];

        if (resultData) {
            const resultDataStr = typeof resultData === 'string' ? resultData : JSON.stringify(resultData);
            sql += ', result_data = ?';
            params.push(resultDataStr);
        }

        sql += ' WHERE session_id = ?';
        params.push(sessionId);

        const result = execute(sql, params);
        return result.changes > 0;
    },

    /**
     * 查询记录状态
     * @param {string} sessionId
     * @returns {object|null} - { sessionId, status, update_date }
     */
    getStatus(sessionId) {
        return queryOne(
            'SELECT session_id, status, update_date FROM session_match_records WHERE session_id = ?',
            [sessionId]
        );
    },

    /**
     * 获取记录详情
     * @param {string} sessionId
     * @returns {object|null}
     */
    getDetail(sessionId) {
        const record = queryOne(
            'SELECT * FROM session_match_records WHERE session_id = ?',
            [sessionId]
        );
        if (record) {
            try {
                if (record.req_data) record.req_data = JSON.parse(record.req_data);
            } catch (e) { /* ignore */ }
            try {
                if (record.result_data) record.result_data = JSON.parse(record.result_data);
            } catch (e) { /* ignore */ }
        }
        return record;
    },

    /**
     * 获取所有记录（管理用途）
     * @param {object} options - { limit, offset, status }
     * @returns {Array}
     */
    findAll(options = {}) {
        const { limit = 100, offset = 0, status } = options;
        let sql = 'SELECT * FROM session_match_records';
        const params = [];

        if (status !== undefined && status !== null) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY create_date DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return queryAll(sql, params).map(record => {
            try {
                if (record.req_data) record.req_data = JSON.parse(record.req_data);
            } catch (e) { /* ignore */ }
            try {
                if (record.result_data) record.result_data = JSON.parse(record.result_data);
            } catch (e) { /* ignore */ }
            return record;
        });
    },

    /**
     * 统计记录数
     * @param {object} options - { status }
     * @returns {number}
     */
    count(options = {}) {
        const { status } = options;
        let sql = 'SELECT COUNT(*) as count FROM session_match_records';
        const params = [];

        if (status !== undefined && status !== null) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        return queryOne(sql, params)?.count || 0;
    },

    /**
     * 删除记录
     * @param {number} id
     */
    delete(id) {
        execute('DELETE FROM session_match_records WHERE id = ?', [id]);
    }
};

export default SessionMatchRecord;

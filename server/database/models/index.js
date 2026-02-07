/**
 * 数据库模型统一导出
 */
import { User } from './User.js';
import { MatchRecord } from './MatchRecord.js';
import { Payment } from './Payment.js';
import { Setting } from './Setting.js';
import { RedeemCode } from './RedeemCode.js';
import { SessionMatchRecord } from './SessionMatchRecord.js';

export { User, MatchRecord, Payment, Setting, RedeemCode, SessionMatchRecord };

export default {
    User,
    MatchRecord,
    Payment,
    Setting,
    RedeemCode,
    SessionMatchRecord
};

/**
 * 数据库模型统一导出
 */
import { User } from './User.js';
import { MatchRecord } from './MatchRecord.js';
import { Payment } from './Payment.js';
import { Setting } from './Setting.js';
import { RedeemCode } from './RedeemCode.js';
import { SessionMatchRecord } from './SessionMatchRecord.js';
import { Admin } from './Admin.js';
import { Permission } from './Permission.js';
import { Role } from './Role.js';
import { OperationLog } from './OperationLog.js';
import { Question } from './Question.js';

export { User, MatchRecord, Payment, Setting, RedeemCode, SessionMatchRecord, Admin, Permission, Role, OperationLog, Question };

export default {
    User,
    MatchRecord,
    Payment,
    Setting,
    RedeemCode,
    SessionMatchRecord,
    Admin,
    Permission,
    Role,
    OperationLog,
    Question
};

/**
 * SQLite 数据库配置和初始化
 * 使用 sql.js 作为 SQLite 驱动
 */
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * 获取当前本地时间字符串（北京时间 UTC+8）
 * 格式：YYYY-MM-DD HH:mm:ss
 */
export function getNowLocal() {
    const now = new Date();
    const offset = 8 * 60; // UTC+8
    const local = new Date(now.getTime() + offset * 60 * 1000);
    return local.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库文件路径
const DB_PATH = path.join(__dirname, 'data', 'app.db');

// 数据库实例
let db = null;

/**
 * 初始化数据库
 */
export async function initDatabase() {
    try {
        // 确保数据目录存在
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // 初始化 SQL.js
        const SQL = await initSqlJs();

        // 检查是否存在已有的数据库文件
        if (fs.existsSync(DB_PATH)) {
            const fileBuffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(fileBuffer);
            console.log('✅ 已加载现有数据库:', DB_PATH);
        } else {
            db = new SQL.Database();
            console.log('✅ 已创建新数据库:', DB_PATH);
        }

        // 包装 db.run，使 DEFAULT CURRENT_TIMESTAMP 在 CREATE TABLE 时使用本地时间
        const originalRun = db.run.bind(db);
        db.run = function(sql, params) {
            // 将建表中的 DEFAULT CURRENT_TIMESTAMP 替换为带时区的本地时间
            const processed = sql.replace(/DEFAULT\s+CURRENT_TIMESTAMP/gi, "DEFAULT (datetime('now', '+8 hours'))");
            return originalRun(processed, params);
        };

        // 初始化数据库表
        await initTables();

        // 初始化基础数据
        await initInitialData();

        // 定期保存数据库到文件
        setInterval(() => {
            saveDatabase();
        }, 30000); // 每30秒保存一次

        return db;
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
        throw error;
    }
}

/**
 * 初始化数据库表
 */
async function initTables() {
    // 用户表（扩展字段，兼容前端用户体系）
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid TEXT UNIQUE,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            password_hash TEXT,
            email TEXT,
            phone TEXT UNIQUE,
            avatar TEXT,
            nickname TEXT,
            gender TEXT,
            birth_date TEXT,
            role TEXT DEFAULT 'user',
            status INTEGER DEFAULT 1,
            credits INTEGER DEFAULT 0,
            test_count INTEGER DEFAULT 0,
            invite_code TEXT UNIQUE,
            invited_by TEXT,
            register_source TEXT DEFAULT 'web',
            register_session_id TEXT,
            last_login_time DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 匹配记录表
    db.run(`
        CREATE TABLE IF NOT EXISTS match_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            person1_name TEXT,
            person1_birthday TEXT,
            person2_name TEXT,
            person2_birthday TEXT,
            match_type TEXT,
            result TEXT,
            score INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // 支付记录表
    db.run(`
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            order_no TEXT UNIQUE NOT NULL,
            amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            payment_method TEXT,
            payment_time DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // 系统配置表
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            value TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 兑换码表
    db.run(`
        CREATE TABLE IF NOT EXISTS redeem_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            type TEXT DEFAULT 'single',
            max_uses INTEGER DEFAULT 1,
            used_count INTEGER DEFAULT 0,
            expires_at DATETIME,
            status TEXT DEFAULT 'active',
            source TEXT DEFAULT 'admin',
            remark TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 会话匹配记录表（核销码兑换匹配流程追踪）
    db.run(`
        CREATE TABLE IF NOT EXISTS session_match_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            user_id TEXT DEFAULT NULL,
            status INTEGER NOT NULL DEFAULT 0,
            req_data TEXT,
            result_data TEXT,
            create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            update_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 管理员表
    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            is_super_admin INTEGER DEFAULT 0,
            status INTEGER DEFAULT 1,
            failed_login_count INTEGER DEFAULT 0,
            last_login_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 权限表
    db.run(`
        CREATE TABLE IF NOT EXISTS permissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            parent_id INTEGER,
            route_path TEXT,
            component_path TEXT,
            icon TEXT,
            is_visible INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES permissions(id)
        )
    `);

    // 角色表
    db.run(`
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            data_scope TEXT DEFAULT 'all',
            is_system_role INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 操作记录表
    db.run(`
        CREATE TABLE IF NOT EXISTS operation_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_id INTEGER,
            module TEXT,
            action TEXT,
            request_data TEXT,
            response_data TEXT,
            ip_address TEXT,
            user_agent TEXT,
            status TEXT DEFAULT 'success',
            error_message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES admins(id)
        )
    `);

    // 管理员角色关联表
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_roles (
            admin_id INTEGER NOT NULL,
            role_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (admin_id, role_id),
            FOREIGN KEY (admin_id) REFERENCES admins(id),
            FOREIGN KEY (role_id) REFERENCES roles(id)
        )
    `);

    // 角色权限关联表
    db.run(`
        CREATE TABLE IF NOT EXISTS role_permissions (
            role_id INTEGER NOT NULL,
            permission_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (role_id, permission_id),
            FOREIGN KEY (role_id) REFERENCES roles(id),
            FOREIGN KEY (permission_id) REFERENCES permissions(id)
        )
    `);

    // 问题管理表
    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            category TEXT DEFAULT 'general',
            status INTEGER DEFAULT 1,
            sort_order INTEGER DEFAULT 0,
            created_by INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES admins(id)
        )
    `);

    // 主题分类表
    db.run(`
        CREATE TABLE IF NOT EXISTS topic_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            status INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 系统配置表（自定义配置项）
    db.run(`
        CREATE TABLE IF NOT EXISTS system_configs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 验证码表（替代内存 verificationCodes Map）
    db.run(`
        CREATE TABLE IF NOT EXISTS verification_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT NOT NULL,
            code TEXT NOT NULL,
            type TEXT DEFAULT 'login',
            attempts INTEGER DEFAULT 0,
            used INTEGER DEFAULT 0,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 短信频率限制表（替代内存 smsRateLimit Map）
    db.run(`
        CREATE TABLE IF NOT EXISTS sms_rate_limits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE NOT NULL,
            last_sent_at INTEGER DEFAULT 0,
            daily_count INTEGER DEFAULT 0,
            daily_reset_at INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 测试记录表（替代内存 tests Map）
    db.run(`
        CREATE TABLE IF NOT EXISTS tests (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            type TEXT,
            method TEXT,
            person_a TEXT,
            person_b TEXT,
            hexagram TEXT,
            status TEXT DEFAULT 'pending',
            result TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME
        )
    `);

    // 前端订单表（替代内存 orders Map）
    db.run(`
        CREATE TABLE IF NOT EXISTS client_orders (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            product_id TEXT,
            product_name TEXT,
            amount REAL,
            credits INTEGER DEFAULT 0,
            payment_method TEXT,
            test_type TEXT,
            status TEXT DEFAULT 'pending',
            redeem_code TEXT,
            payment_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            paid_at DATETIME,
            redeemed_at DATETIME,
            expires_at DATETIME
        )
    `);

    // 用户购买记录表（替代内存 userPurchases Map）
    db.run(`
        CREATE TABLE IF NOT EXISTS user_purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            test_type_id TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            payment_status INTEGER DEFAULT 0,
            order_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, test_type_id)
        )
    `);

    // 用户会话表（替代内存 userSessions Map）
    db.run(`
        CREATE TABLE IF NOT EXISTS user_sessions (
            session_id TEXT PRIMARY KEY,
            user_id TEXT,
            token TEXT,
            expires_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 迁移：去掉 session_match_records 表 session_id 的 UNIQUE 约束
    try {
        const tableInfo = db.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='session_match_records'");
        if (tableInfo.length > 0 && tableInfo[0].values[0][0].includes('UNIQUE')) {
            console.log('🔄 迁移：去掉 session_match_records.session_id 的 UNIQUE 约束...');
            db.run(`DROP INDEX IF EXISTS idx_smr_session_id`);
            db.run(`DROP INDEX IF EXISTS idx_smr_status`);
            db.run(`DROP INDEX IF EXISTS idx_smr_create_date`);
            db.run(`ALTER TABLE session_match_records RENAME TO session_match_records_old`);
            db.run(`
                CREATE TABLE session_match_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    user_id TEXT DEFAULT NULL,
                    status INTEGER NOT NULL DEFAULT 0,
                    req_data TEXT,
                    result_data TEXT,
                    create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    update_date DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            db.run(`INSERT INTO session_match_records SELECT * FROM session_match_records_old`);
            db.run(`DROP TABLE session_match_records_old`);
            console.log('✅ 迁移完成：session_id UNIQUE 约束已移除');
        }
    } catch (e) {
        console.warn('迁移检查跳过:', e.message);
    }

    // 迁移：为 session_match_records 添加 method 和 type 字段
    try {
        const smrColumns = db.exec("PRAGMA table_info(session_match_records)");
        if (smrColumns.length > 0) {
            const columnNames = smrColumns[0].values.map(col => col[1]);
            let migrated = false;
            if (!columnNames.includes('method')) {
                db.run(`ALTER TABLE session_match_records ADD COLUMN method TEXT DEFAULT NULL`);
                console.log('✅ 迁移：session_match_records 添加 method 字段');
                migrated = true;
            }
            if (!columnNames.includes('type')) {
                db.run(`ALTER TABLE session_match_records ADD COLUMN type TEXT DEFAULT NULL`);
                console.log('✅ 迁移：session_match_records 添加 type 字段');
                migrated = true;
            }
            if (migrated) {
                saveDatabase();
            }
        }
    } catch (e) {
        console.warn('session_match_records 字段迁移跳过:', e.message);
    }

    // 回填历史记录的 method/type 字段（从 req_data JSON 中提取）
    try {
        const needFill = queryAll("SELECT id, req_data FROM session_match_records WHERE req_data IS NOT NULL AND (method IS NULL OR method = '' OR type IS NULL OR type = '')");
        if (needFill.length > 0) {
            let filled = 0;
            for (const record of needFill) {
                try {
                    const parsed = JSON.parse(record.req_data);
                    const m = parsed.method || null;
                    const t = parsed.type || null;
                    if (m || t) {
                        db.run('UPDATE session_match_records SET method = ?, type = ? WHERE id = ?', [m, t, record.id]);
                        filled++;
                    }
                } catch (e) { /* ignore parse error */ }
            }
            if (filled > 0) {
                console.log(`✅ 已回填 ${filled} 条历史记录的 method/type 字段`);
                saveDatabase();
            }
        }
    } catch (e) {
        console.warn('回填 method/type 失败:', e.message);
    }

    // 为 session_match_records 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_session_id ON session_match_records(session_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_status ON session_match_records(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_create_date ON session_match_records(create_date)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_type ON session_match_records(type)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_method ON session_match_records(method)`);

    // 为 admins 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_admins_status ON admins(status)`);

    // 为 permissions 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_permissions_code ON permissions(code)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_permissions_type ON permissions(type)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_permissions_parent_id ON permissions(parent_id)`);

    // 为 roles 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_roles_code ON roles(code)`);

    // 为 operation_logs 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_operation_logs_admin_id ON operation_logs(admin_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_operation_logs_module ON operation_logs(module)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_operation_logs_created_at ON operation_logs(created_at)`);

    // 为 questions 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status)`);

    // 为 topic_categories 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_topic_categories_status ON topic_categories(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_topic_categories_sort ON topic_categories(sort_order)`);

    // 为 system_configs 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_system_configs_status ON system_configs(status)`);

    // 为 users 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)`);

    // 为 redeem_codes 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_redeem_codes_code ON redeem_codes(code)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_redeem_codes_status ON redeem_codes(status)`);

    // 为 verification_codes 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_vc_phone ON verification_codes(phone)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_vc_phone_type ON verification_codes(phone, type)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_vc_expires_at ON verification_codes(expires_at)`);

    // 为 sms_rate_limits 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_srl_phone ON sms_rate_limits(phone)`);

    // 为 tests 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_tests_status ON tests(status)`);

    // 为 client_orders 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_co_user_id ON client_orders(user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_co_status ON client_orders(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_co_redeem_code ON client_orders(redeem_code)`);

    // 为 user_purchases 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_up_user_id ON user_purchases(user_id)`);

    // 为 user_sessions 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_us_user_id ON user_sessions(user_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_us_expires_at ON user_sessions(expires_at)`);

    // 迁移 users 表：为已有表添加新字段（必须在创建新索引之前）
    try {
        const userColumns = db.exec("PRAGMA table_info(users)");
        if (userColumns.length > 0) {
            const columnNames = userColumns[0].values.map(row => row[1]);
            const newColumns = [
                { name: 'uid', type: 'TEXT' },
                { name: 'password_hash', type: 'TEXT' },
                { name: 'nickname', type: 'TEXT' },
                { name: 'gender', type: 'TEXT' },
                { name: 'birth_date', type: 'TEXT' },
                { name: 'credits', type: 'INTEGER DEFAULT 0' },
                { name: 'test_count', type: 'INTEGER DEFAULT 0' },
                { name: 'invite_code', type: 'TEXT' },
                { name: 'invited_by', type: 'TEXT' },
                { name: 'register_source', type: "TEXT DEFAULT 'web'" },
                { name: 'register_session_id', type: 'TEXT' },
                { name: 'last_login_time', type: 'DATETIME' }
            ];
            for (const col of newColumns) {
                if (!columnNames.includes(col.name)) {
                    try {
                        db.run(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                        console.log(`✅ users 表新增字段: ${col.name}`);
                    } catch (e) {
                        // 字段已存在，忽略
                    }
                }
            }
        }
    } catch (e) {
        console.warn('users 表迁移检查跳过:', e.message);
    }

    // 为 users 创建扩展索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_uid ON users(uid)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code)`);

    // ==================== 迁移：将已有 UTC 时间数据转换为北京时间 (UTC+8) ====================
    try {
        // 使用一个标记来避免重复迁移
        const migrated = queryOne("SELECT value FROM settings WHERE key = 'time_migrated_to_beijing'");
        if (!migrated) {
            console.log('🔄 迁移：将所有时间字段从 UTC 转换为北京时间 (UTC+8)...');

            // session_match_records
            db.run(`UPDATE session_match_records SET 
                create_date = datetime(create_date, '+8 hours'),
                update_date = datetime(update_date, '+8 hours')
                WHERE create_date IS NOT NULL AND create_date LIKE '____-__-__%'`);

            // users
            db.run(`UPDATE users SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours'),
                last_login_time = datetime(last_login_time, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // admins
            db.run(`UPDATE admins SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours'),
                last_login_at = datetime(last_login_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // payments
            db.run(`UPDATE payments SET 
                created_at = datetime(created_at, '+8 hours'),
                payment_time = datetime(payment_time, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // redeem_codes
            db.run(`UPDATE redeem_codes SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // match_records
            db.run(`UPDATE match_records SET 
                created_at = datetime(created_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // settings
            db.run(`UPDATE settings SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // permissions
            db.run(`UPDATE permissions SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // roles
            db.run(`UPDATE roles SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // operation_logs
            db.run(`UPDATE operation_logs SET 
                created_at = datetime(created_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // questions
            db.run(`UPDATE questions SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // tests
            db.run(`UPDATE tests SET 
                created_at = datetime(created_at, '+8 hours'),
                completed_at = datetime(completed_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // client_orders
            db.run(`UPDATE client_orders SET 
                created_at = datetime(created_at, '+8 hours'),
                paid_at = datetime(paid_at, '+8 hours'),
                redeemed_at = datetime(redeemed_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // verification_codes
            db.run(`UPDATE verification_codes SET 
                created_at = datetime(created_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // user_purchases
            db.run(`UPDATE user_purchases SET 
                created_at = datetime(created_at, '+8 hours'),
                updated_at = datetime(updated_at, '+8 hours')
                WHERE created_at IS NOT NULL AND created_at LIKE '____-__-__%'`);

            // 标记迁移已完成
            const existingSetting = queryOne("SELECT id FROM settings WHERE key = 'time_migrated_to_beijing'");
            if (existingSetting) {
                db.run("UPDATE settings SET value = '1' WHERE key = 'time_migrated_to_beijing'");
            } else {
                db.run("INSERT INTO settings (key, value, description) VALUES ('time_migrated_to_beijing', '1', '时间字段已从UTC迁移到北京时间')");
            }

            saveDatabase();
            console.log('✅ 迁移完成：所有时间字段已转换为北京时间 (UTC+8)');
        }
    } catch (e) {
        console.warn('时间迁移检查跳过:', e.message);
    }

    console.log('✅ 数据库表初始化完成');
}

/**
 * 初始化基础数据
 */
async function initInitialData() {
    try {
        // 检查是否已有超级管理员
        const existingAdmin = queryOne('SELECT id FROM admins WHERE username = ?', ['admin']);
        if (!existingAdmin) {
            // 创建超级管理员 (密码: admin123, 临时明文)
            execute(
                'INSERT INTO admins (username, password, is_super_admin, status) VALUES (?, ?, 1, 1)',
                ['admin', 'admin123']
            );
            console.log('✅ 已创建超级管理员账户: admin');
        }

        // 检查是否已有基础权限
        const existingPermissions = queryAll('SELECT id FROM permissions');
        if (existingPermissions.length === 0) {
            // 插入基础权限
            const permissions = [
                { code: 'dashboard', name: '仪表盘', type: 'menu', route_path: '/admin/dashboard', component_path: 'Dashboard', icon: 'dashboard' },
                { code: 'system', name: '系统管理', type: 'menu', route_path: '/admin/system', component_path: 'System', icon: 'setting' },
                { code: 'system:admin', name: '管理员管理', type: 'menu', route_path: '/admin/system/admin', component_path: 'AdminManage', icon: 'user' },
                { code: 'system:role', name: '角色管理', type: 'menu', route_path: '/admin/system/role', component_path: 'RoleManage', icon: 'team' },
                { code: 'system:permission', name: '权限管理', type: 'menu', route_path: '/admin/system/permission', component_path: 'PermissionManage', icon: 'lock' },
                { code: 'system:log', name: '操作日志', type: 'menu', route_path: '/admin/system/log', component_path: 'OperationLog', icon: 'file-text' },
                { code: 'user', name: '用户管理', type: 'menu', route_path: '/admin/user', component_path: 'UserManage', icon: 'user' },
                { code: 'user:list', name: '用户列表', type: 'operation', parent_id: null },
                { code: 'user:view', name: '查看用户', type: 'operation', parent_id: null },
                { code: 'user:edit', name: '编辑用户', type: 'operation', parent_id: null },
                { code: 'user:delete', name: '删除用户', type: 'operation', parent_id: null }
            ];

            for (const perm of permissions) {
                const parentId = perm.parent_id || null;
                execute(
                    'INSERT INTO permissions (code, name, type, parent_id, route_path, component_path, icon, is_visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [perm.code, perm.name, perm.type, parentId, perm.route_path, perm.component_path, perm.icon, 1]
                );
            }
            console.log('✅ 已创建基础权限');
        }

        // 检查是否已有基础角色
        const existingRoles = queryAll('SELECT id FROM roles');
        if (existingRoles.length === 0) {
            // 插入基础角色
            const roles = [
                { code: 'super_admin', name: '超级管理员', description: '系统最高权限管理员', data_scope: 'all', is_system_role: 1 },
                { code: 'admin', name: '普通管理员', description: '普通管理员权限', data_scope: 'department', is_system_role: 0 },
                { code: 'operator', name: '操作员', description: '基础操作权限', data_scope: 'personal', is_system_role: 0 }
            ];

            for (const role of roles) {
                execute(
                    'INSERT INTO roles (code, name, description, data_scope, is_system_role) VALUES (?, ?, ?, ?, ?)',
                    [role.code, role.name, role.description, role.data_scope, role.is_system_role]
                );
            }
            console.log('✅ 已创建基础角色');
        }

        // 为超级管理员分配超级管理员角色
        const superAdmin = queryOne('SELECT id FROM admins WHERE username = ?', ['admin']);
        const superAdminRole = queryOne('SELECT id FROM roles WHERE code = ?', ['super_admin']);
        if (superAdmin && superAdminRole) {
            const existingRelation = queryOne('SELECT * FROM admin_roles WHERE admin_id = ? AND role_id = ?', [superAdmin.id, superAdminRole.id]);
            if (!existingRelation) {
                execute('INSERT INTO admin_roles (admin_id, role_id) VALUES (?, ?)', [superAdmin.id, superAdminRole.id]);
                console.log('✅ 已为超级管理员分配角色');
            }
        }

        // 为超级管理员角色分配所有权限
        if (superAdminRole) {
            const allPermissions = queryAll('SELECT id FROM permissions');
            for (const perm of allPermissions) {
                const existingRelation = queryOne('SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?', [superAdminRole.id, perm.id]);
                if (!existingRelation) {
                    execute('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [superAdminRole.id, perm.id]);
                }
            }
            console.log('✅ 已为超级管理员角色分配权限');
        }

        // 初始化主题分类数据（按序号添加）
        const existingTopicCategories = queryAll('SELECT id FROM topic_categories');
        if (existingTopicCategories.length === 0) {
            const now = getNowLocal();
            const topicCategories = [
                { name: '感情匹配', sort_order: 1 },
                { name: '合作关系', sort_order: 2 },
                { name: '职场关系', sort_order: 3 },
                { name: 'TA的想法和态度', sort_order: 4 },
                { name: '职业发展', sort_order: 5 },
                { name: '城市方向', sort_order: 6 },
                { name: '宠物匹配', sort_order: 7 }
            ];
            for (const tc of topicCategories) {
                execute(
                    'INSERT INTO topic_categories (name, sort_order, status, created_at, updated_at) VALUES (?, ?, 1, ?, ?)',
                    [tc.name, tc.sort_order, now, now]
                );
            }
            console.log('✅ 已创建主题分类初始数据');
        }

    } catch (error) {
        console.error('❌ 初始化基础数据失败:', error);
    }
}

/**
 * 保存数据库到文件
 */
export function saveDatabase() {
    if (db) {
        try {
            const data = db.export();
            const buffer = Buffer.from(data);
            fs.writeFileSync(DB_PATH, buffer);
            // console.log('💾 数据库已保存');
        } catch (error) {
            console.error('❌ 保存数据库失败:', error);
        }
    }
}

/**
 * 获取数据库实例
 */
export function getDatabase() {
    if (!db) {
        throw new Error('数据库未初始化，请先调用 initDatabase()');
    }
    return db;
}

/**
 * 执行查询并返回所有结果
 */
export function queryAll(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

/**
 * 执行查询并返回第一条结果
 */
export function queryOne(sql, params = []) {
    const results = queryAll(sql, params);
    return results.length > 0 ? results[0] : null;
}

export function execute(sql, params = []) {
    // 在 INSERT/UPDATE 语句中将 CURRENT_TIMESTAMP 替换为本地时间（北京时间 UTC+8）
    let processedSql = sql;
    const sqlUpper = sql.trim().toUpperCase();
    if (sqlUpper.startsWith('INSERT') || sqlUpper.startsWith('UPDATE')) {
        processedSql = processedSql.replace(/CURRENT_TIMESTAMP/gi, `'${getNowLocal()}'`);
    }

    // 手动替换参数，因为sql.js的run不支持参数化查询
    params.forEach((param) => {
        const placeholderIndex = processedSql.indexOf('?');
        if (placeholderIndex !== -1) {
            // 处理不同类型的参数
            let escapedParam;
            if (param === null || param === undefined) {
                escapedParam = 'NULL';
            } else if (typeof param === 'string') {
                escapedParam = `'${param.replace(/'/g, "''")}'`;
            } else {
                escapedParam = param;
            }
            processedSql = processedSql.substring(0, placeholderIndex) + escapedParam + processedSql.substring(placeholderIndex + 1);
        }
    });

    db.run(processedSql);
    return {
        lastInsertRowid: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0],
        changes: db.getRowsModified()
    };
}

/**
 * 关闭数据库连接
 */
export function closeDatabase() {
    if (db) {
        saveDatabase();
        db.close();
        db = null;
        console.log('✅ 数据库连接已关闭');
    }
}

export default {
    initDatabase,
    getDatabase,
    saveDatabase,
    queryAll,
    queryOne,
    execute,
    closeDatabase,
    getNowLocal
};

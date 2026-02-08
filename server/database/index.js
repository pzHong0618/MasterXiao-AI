/**
 * SQLite 数据库配置和初始化
 * 使用 sql.js 作为 SQLite 驱动
 */
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
    // 用户表
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            avatar TEXT,
            role TEXT DEFAULT 'user',
            status INTEGER DEFAULT 1,
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

    // 为 session_match_records 创建索引
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_session_id ON session_match_records(session_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_status ON session_match_records(status)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_smr_create_date ON session_match_records(create_date)`);

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
    // 手动替换参数，因为sql.js的run不支持参数化查询
    let processedSql = sql;
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
    closeDatabase
};

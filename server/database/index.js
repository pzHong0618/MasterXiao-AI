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

    console.log('✅ 数据库表初始化完成');
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

/**
 * 执行更新/插入/删除操作
 */
export function execute(sql, params = []) {
    db.run(sql, params);
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

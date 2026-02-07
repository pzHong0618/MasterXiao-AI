import express from 'express';

const router = express.Router();

// 测试路由
router.get('/test', (req, res) => {
    res.json({ message: 'Admin routes working' });
});

// JWT密钥
const JWT_SECRET = 'admin-jwt-secret-key';
const JWT_EXPIRES_IN = '24h';

/**
 * POST /api/admin/login
 * 管理员登录
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
        }

        // 临时返回成功
        res.json({
            code: 200,
            message: '登录成功',
            data: {
                token: 'test-token',
                admin: {
                    id: 1,
                    username: 'admin',
                    is_super_admin: 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

/**
 * GET /api/admin/profile
 * 获取管理员信息
 */
router.get('/profile', (req, res) => {
    // 临时返回管理员信息
    res.json({
        code: 200,
        data: {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            phone: '13800138000',
            is_super_admin: 1,
            roles: [{
                id: 1,
                code: 'super_admin',
                name: '超级管理员'
            }],
            permissions: [{
                id: 1,
                code: 'system:all',
                name: '所有权限',
                type: 'menu'
            }]
        }
    });
});

/**
 * GET /api/admin/menu
 * 获取菜单数据
 */
router.get('/menu', (req, res) => {
    // 临时返回菜单数据
    const menuData = [
        {
            id: 1,
            code: 'dashboard',
            name: '仪表盘',
            type: 'menu',
            route_path: '/dashboard',
            component_path: 'dashboard.html',
            icon: '📊',
            children: []
        },
        {
            id: 2,
            code: 'system',
            name: '系统管理',
            type: 'menu',
            route_path: '/system',
            component_path: 'system.html',
            icon: '⚙️',
            children: [
                {
                    id: 3,
                    code: 'system:admin',
                    name: '管理员管理',
                    type: 'menu',
                    route_path: '/system/admin-users',
                    component_path: 'admin-users.html',
                    icon: '👥',
                    children: []
                },
                {
                    id: 4,
                    code: 'system:role',
                    name: '角色管理',
                    type: 'menu',
                    route_path: '/system/roles',
                    component_path: 'roles.html',
                    icon: '🏷️',
                    children: []
                },
                {
                    id: 5,
                    code: 'system:permission',
                    name: '权限管理',
                    type: 'menu',
                    route_path: '/system/permissions',
                    component_path: 'permissions.html',
                    icon: '🔐',
                    children: []
                }
            ]
        },
        {
            id: 6,
            code: 'system:log',
            name: '操作日志',
            type: 'menu',
            route_path: '/logs',
            component_path: 'logs.html',
            icon: '📝',
            children: []
        }
    ];

    res.json({
        code: 200,
        data: menuData
    });
});

/**
 * GET /api/admin/admins
 * 获取管理员列表
 */
router.get('/admins', (req, res) => {
    // 临时返回管理员列表
    const admins = [
        {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            phone: '13800138000',
            status: 1,
            is_super_admin: 1,
            created_at: '2024-01-01 00:00:00',
            roles: [{ id: 1, name: '超级管理员' }]
        }
    ];

    res.json({
        code: 200,
        data: {
            list: admins,
            pagination: {
                page: 1,
                limit: 20,
                total: 1
            }
        }
    });
});

/**
 * GET /api/admin/roles
 * 获取角色列表
 */
router.get('/roles', (req, res) => {
    // 临时返回角色列表
    const roles = [
        {
            id: 1,
            code: 'super_admin',
            name: '超级管理员',
            description: '拥有所有权限',
            data_scope: 'all',
            created_at: '2024-01-01 00:00:00',
            permissions: [{ id: 1, name: '所有权限' }]
        }
    ];

    res.json({
        code: 200,
        data: roles
    });
});

/**
 * GET /api/admin/permissions
 * 获取权限列表
 */
router.get('/permissions', (req, res) => {
    // 临时返回权限列表
    const permissions = [
        {
            id: 1,
            code: 'system:all',
            name: '所有权限',
            type: 'menu',
            parent_id: null,
            route_path: '/',
            component_path: 'index.html',
            icon: '⚙️',
            is_visible: 1,
            sort_order: 1
        }
    ];

    const permissionTree = [
        {
            id: 1,
            code: 'system',
            name: '系统管理',
            type: 'menu',
            children: [
                {
                    id: 2,
                    code: 'system:admin',
                    name: '管理员管理',
                    type: 'menu'
                }
            ]
        }
    ];

    res.json({
        code: 200,
        data: {
            list: permissions,
            tree: permissionTree
        }
    });
});

export default router;
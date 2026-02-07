/**
 * 管理后台主逻辑
 */

document.addEventListener('DOMContentLoaded', () => {
    // 检查登录状态
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 初始化
    initAdmin();
});

function initAdmin() {
    // 加载管理员信息
    loadAdminInfo();

    // 加载菜单
    loadMenu();

    // 启动时钟
    startClock();

    // 初始化导航
    initNavigation();

    // 初始化菜单切换
    initMenuToggle();

    // 初始化退出登录
    initLogout();

    // 加载默认页面
    loadPage('dashboard');
}

// 加载管理员信息
async function loadAdminInfo() {
    try {
        const response = await fetch('/api/admin/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        const result = await response.json();
        if (result.code === 200) {
            const adminData = result.data;
            localStorage.setItem('adminInfo', JSON.stringify(adminData));

            const adminName = document.getElementById('adminName');
            if (adminName) {
                adminName.textContent = adminData.username;
            }
        } else {
            console.error('加载管理员信息失败:', result.message);
        }
    } catch (error) {
        console.error('加载管理员信息出错:', error);
    }
}

// 加载菜单
async function loadMenu() {
    try {
        const response = await fetch('/api/admin/menu', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        const result = await response.json();
        if (result.code === 200) {
            renderMenu(result.data);
        } else {
            console.error('加载菜单失败:', result.message);
        }
    } catch (error) {
        console.error('加载菜单出错:', error);
    }
}

// 渲染菜单
function renderMenu(menuData) {
    const navMenu = document.getElementById('navMenu');
    navMenu.innerHTML = '';

    function createMenuItem(item) {
        const li = document.createElement('li');
        li.className = 'nav-item';

        if (item.children && item.children.length > 0) {
            li.classList.add('has-submenu');
            li.innerHTML = `
                <a href="#" class="nav-link" data-page="${item.code}">
                    <span class="nav-icon">${item.icon || '📁'}</span>
                    <span class="nav-text">${item.name}</span>
                    <span class="submenu-arrow">▼</span>
                </a>
                <ul class="submenu">
                    ${item.children.map(child => `
                        <li>
                            <a href="#" class="nav-link" data-page="${child.code}">
                                <span class="nav-icon">${child.icon || '📄'}</span>
                                <span class="nav-text">${child.name}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            `;
        } else {
            li.innerHTML = `
                <a href="#" class="nav-link" data-page="${item.code}">
                    <span class="nav-icon">${item.icon || '📄'}</span>
                    <span class="nav-text">${item.name}</span>
                </a>
            `;
        }

        return li;
    }

    menuData.forEach(item => {
        navMenu.appendChild(createMenuItem(item));
    });
}

// 启动时钟
function startClock() {
    const timeElement = document.getElementById('currentTime');
    
    function updateTime() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const MM = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}

// 初始化导航
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    
    // 点击导航链接
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // 如果是父级菜单，只展开/折叠子菜单
            const parent = link.parentElement;
            const submenu = link.nextElementSibling;
            if (parent && parent.classList.contains('has-submenu') && submenu && submenu.classList.contains('submenu')) {
                parent.classList.toggle('open');
                return;
            }
            
            // 移除所有active状态
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // 加载页面
            loadPage(page);
            
            // 移动端关闭侧边栏
            document.querySelector('.sidebar').classList.remove('open');
        });
    });
}

// 初始化菜单切换（移动端）
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // 点击菜单按钮切换侧边栏
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });
    
    // 点击遮罩层关闭侧边栏
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
    
    // 点击内容区关闭侧边栏
    document.querySelector('.main-content').addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
}

// 初始化退出登录
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            window.location.href = 'login.html';
        }
    });
}

// 加载页面内容
function loadPage(page) {
    const content = document.getElementById('content');
    const pageTitle = document.getElementById('pageTitle');
    
    const titles = {
        'dashboard': '仪表盘',
        'system': '系统管理',
        'system:admin': '管理员管理',
        'system:role': '角色管理',
        'system:permission': '权限管理',
        'system:log': '操作日志',
        'user': '用户管理',
        'users': '人员管理',
        'orders': '订单管理',
        'info': '信息管理',
        'birthday-match': '生日匹配',
        'card-match': '卡牌匹配',
        'statistics': '数据统计',
        'user-stats': '用户统计',
        'match-stats': '信息统计'
    };
    
    pageTitle.textContent = titles[page] || '管理后台';
    
    switch (page) {
        case 'dashboard':
            content.innerHTML = renderDashboard();
            break;
        case 'system:admin':
            content.innerHTML = renderAdminManage();
            break;
        case 'system:role':
            content.innerHTML = renderRoleManage();
            break;
        case 'system:permission':
            content.innerHTML = renderPermissionManage();
            break;
        case 'system:log':
            content.innerHTML = renderOperationLog();
            break;
        case 'user':
            content.innerHTML = renderUserManage();
            break;
        case 'users':
            content.innerHTML = renderUsers();
            break;
        case 'orders':
            content.innerHTML = renderOrders();
            break;
        case 'birthday-match':
            content.innerHTML = renderBirthdayMatch();
            break;
        case 'card-match':
            content.innerHTML = renderCardMatch();
            break;
        case 'user-stats':
            content.innerHTML = renderUserStats();
            break;
        case 'match-stats':
            content.innerHTML = renderMatchStats();
            break;
        default:
            content.innerHTML = renderDashboard();
    }
}

// 渲染管理员管理页面
async function renderAdminManage() {
    try {
        const response = await fetch('/api/admin/admins', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        const result = await response.json();
        if (result.code !== 200) {
            return `<div class="error">加载管理员列表失败: ${result.message}</div>`;
        }

        const admins = result.data.list;

        return `
            <div class="admin-manage">
                <div class="page-header">
                    <h2>管理员管理</h2>
                    <button class="btn btn-primary" onclick="showCreateAdminModal()">添加管理员</button>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>用户名</th>
                                <th>邮箱</th>
                                <th>手机</th>
                                <th>超级管理员</th>
                                <th>状态</th>
                                <th>最后登录</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${admins.map(admin => `
                                <tr>
                                    <td>${admin.id}</td>
                                    <td>${admin.username}</td>
                                    <td>${admin.email || '-'}</td>
                                    <td>${admin.phone || '-'}</td>
                                    <td>${admin.is_super_admin ? '是' : '否'}</td>
                                    <td><span class="status ${admin.status ? 'active' : 'inactive'}">${admin.status ? '正常' : '禁用'}</span></td>
                                    <td>${admin.last_login_at ? new Date(admin.last_login_at).toLocaleString() : '从未登录'}</td>
                                    <td>
                                        <button class="btn btn-sm btn-edit" onclick="editAdmin(${admin.id})">编辑</button>
                                        ${!admin.is_super_admin ? `<button class="btn btn-sm btn-danger" onclick="deleteAdmin(${admin.id})">删除</button>` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (error) {
        return `<div class="error">加载管理员列表出错: ${error.message}</div>`;
    }
}

// 渲染角色管理页面
function renderRoleManage() {
    return `
        <div class="role-manage">
            <div class="page-header">
                <h2>角色管理</h2>
                <button class="btn btn-primary" onclick="showCreateRoleModal()">添加角色</button>
            </div>
            <div class="coming-soon">角色管理功能开发中...</div>
        </div>
    `;
}

// 渲染权限管理页面
function renderPermissionManage() {
    return `
        <div class="permission-manage">
            <div class="page-header">
                <h2>权限管理</h2>
                <button class="btn btn-primary" onclick="showCreatePermissionModal()">添加权限</button>
            </div>
            <div class="coming-soon">权限管理功能开发中...</div>
        </div>
    `;
}

// 渲染操作日志页面
function renderOperationLog() {
    return `
        <div class="operation-log">
            <div class="page-header">
                <h2>操作日志</h2>
            </div>
            <div class="coming-soon">操作日志功能开发中...</div>
        </div>
    `;
}

// 渲染用户管理页面
function renderUserManage() {
    return `
        <div class="user-manage">
            <div class="page-header">
                <h2>用户管理</h2>
            </div>
            <div class="coming-soon">用户管理功能开发中...</div>
        </div>
    `;
}

// 渲染仪表盘
function renderDashboard() {
    const stats = MockData.stats;
    return `
        <div class="dashboard-stats">
            <div class="stat-card">
                <div class="stat-icon users">👥</div>
                <div class="stat-info">
                    <h3>${stats.totalUsers.toLocaleString()}</h3>
                    <p>注册用户</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orders">📋</div>
                <div class="stat-info">
                    <h3>${stats.totalOrders.toLocaleString()}</h3>
                    <p>总订单数</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon revenue">💰</div>
                <div class="stat-info">
                    <h3>¥${stats.totalRevenue.toLocaleString()}</h3>
                    <p>总收入</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon matches">✨</div>
                <div class="stat-info">
                    <h3>${stats.totalMatches.toLocaleString()}</h3>
                    <p>匹配次数</p>
                </div>
            </div>
        </div>
        
        <div class="data-card">
            <div class="card-header">
                <h2>最近订单</h2>
                <a href="#orders" class="btn btn-secondary" onclick="loadPage('orders')">查看全部</a>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>订单号</th>
                            <th>用户</th>
                            <th>类型</th>
                            <th>金额</th>
                            <th>时间</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.orders.slice(0, 5).map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${order.user}</td>
                                <td>${order.type}</td>
                                <td>¥${order.amount}</td>
                                <td>${order.payTime}</td>
                                <td><span class="status-badge ${order.status}">${getStatusText(order.status)}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// 渲染用户管理
function renderUsers() {
    return `
        <div class="data-card">
            <div class="card-header">
                <h2>用户列表</h2>
                <div class="card-actions">
                    <div class="search-box">
                        <span>🔍</span>
                        <input type="text" placeholder="搜索用户...">
                    </div>
                    <button class="btn btn-primary">+ 添加用户</button>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>姓名</th>
                            <th>手机号</th>
                            <th>邮箱</th>
                            <th>注册时间</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.users.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.phone}</td>
                                <td>${user.email}</td>
                                <td>${user.registerTime}</td>
                                <td><span class="status-badge ${user.status}">${user.status === 'active' ? '正常' : '待审核'}</span></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn view">查看</button>
                                        <button class="action-btn edit">编辑</button>
                                        <button class="action-btn delete">删除</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <div class="pagination-info">显示 1-8 条，共 ${MockData.users.length} 条</div>
                <div class="pagination-btns">
                    <button class="page-btn">上一页</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">下一页</button>
                </div>
            </div>
        </div>
    `;
}

// 渲染订单管理
function renderOrders() {
    return `
        <div class="data-card">
            <div class="card-header">
                <h2>订单列表</h2>
                <div class="card-actions">
                    <div class="search-box">
                        <span>🔍</span>
                        <input type="text" placeholder="搜索订单...">
                    </div>
                    <button class="btn btn-secondary">导出数据</button>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>订单号</th>
                            <th>用户</th>
                            <th>类型</th>
                            <th>金额</th>
                            <th>支付时间</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.orders.map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${order.user}</td>
                                <td>${order.type}</td>
                                <td>¥${order.amount}</td>
                                <td>${order.payTime}</td>
                                <td><span class="status-badge ${order.status}">${getStatusText(order.status)}</span></td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn view">详情</button>
                                        <button class="action-btn edit">退款</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <div class="pagination-info">显示 1-8 条，共 ${MockData.orders.length} 条</div>
                <div class="pagination-btns">
                    <button class="page-btn">上一页</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">下一页</button>
                </div>
            </div>
        </div>
    `;
}

// 渲染生日匹配
function renderBirthdayMatch() {
    return `
        <div class="data-card">
            <div class="card-header">
                <h2>生日匹配记录</h2>
                <div class="card-actions">
                    <div class="search-box">
                        <span>🔍</span>
                        <input type="text" placeholder="搜索...">
                    </div>
                    <button class="btn btn-secondary">导出数据</button>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>用户1</th>
                            <th>生日1</th>
                            <th>用户2</th>
                            <th>生日2</th>
                            <th>匹配分数</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.birthdayMatches.map(match => `
                            <tr>
                                <td>${match.id}</td>
                                <td>${match.user1}</td>
                                <td>${match.birthday1}</td>
                                <td>${match.user2}</td>
                                <td>${match.birthday2}</td>
                                <td><span class="status-badge ${match.matchScore >= 90 ? 'success' : match.matchScore >= 80 ? 'pending' : 'active'}">${match.matchScore}分</span></td>
                                <td>${match.createTime}</td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn view">查看详情</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <div class="pagination-info">显示 1-5 条，共 ${MockData.birthdayMatches.length} 条</div>
                <div class="pagination-btns">
                    <button class="page-btn">上一页</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">下一页</button>
                </div>
            </div>
        </div>
    `;
}

// 渲染卡牌匹配
function renderCardMatch() {
    return `
        <div class="data-card">
            <div class="card-header">
                <h2>卡牌匹配记录</h2>
                <div class="card-actions">
                    <div class="search-box">
                        <span>🔍</span>
                        <input type="text" placeholder="搜索...">
                    </div>
                    <button class="btn btn-secondary">导出数据</button>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>用户</th>
                            <th>卡牌类型</th>
                            <th>抽取卡牌</th>
                            <th>解读结果</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${MockData.cardMatches.map(match => `
                            <tr>
                                <td>${match.id}</td>
                                <td>${match.user}</td>
                                <td>${match.cardType}</td>
                                <td>${match.cards}</td>
                                <td>${match.result}</td>
                                <td>${match.createTime}</td>
                                <td>
                                    <div class="action-btns">
                                        <button class="action-btn view">查看详情</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <div class="pagination-info">显示 1-5 条，共 ${MockData.cardMatches.length} 条</div>
                <div class="pagination-btns">
                    <button class="page-btn">上一页</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">下一页</button>
                </div>
            </div>
        </div>
    `;
}

// 渲染用户统计
function renderUserStats() {
    const monthlyData = MockData.userGrowthMonthly;
    const dailyData = MockData.userGrowthDaily;
    
    // 计算月度最大值用于图表高度
    const maxMonthly = Math.max(...monthlyData.map(d => d.newUsers));
    const maxDaily = Math.max(...dailyData.map(d => d.newUsers));
    
    return `
        <div class="stats-container">
            <!-- 月度增长统计 -->
            <div class="data-card">
                <div class="card-header">
                    <h2>📅 月度用户增长</h2>
                    <div class="stats-summary">
                        <span class="summary-item">本月新增: <strong>${monthlyData[monthlyData.length - 1].newUsers}</strong> 人</span>
                        <span class="summary-item">累计用户: <strong>${monthlyData[monthlyData.length - 1].totalUsers.toLocaleString()}</strong> 人</span>
                    </div>
                </div>
                <div class="chart-container">
                    <div class="bar-chart">
                        ${monthlyData.map(item => `
                            <div class="bar-item">
                                <div class="bar-wrapper">
                                    <div class="bar" style="height: ${(item.newUsers / maxMonthly) * 100}%">
                                        <span class="bar-value">${item.newUsers}</span>
                                    </div>
                                </div>
                                <span class="bar-label">${item.month.split('-')[1]}月</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="table-container" style="margin-top: 20px;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>月份</th>
                                <th>新增用户</th>
                                <th>累计用户</th>
                                <th>环比增长</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${monthlyData.map((item, index) => {
                                const prevNew = index > 0 ? monthlyData[index - 1].newUsers : item.newUsers;
                                const growth = ((item.newUsers - prevNew) / prevNew * 100).toFixed(1);
                                const growthClass = growth >= 0 ? 'success' : 'failed';
                                return `
                                    <tr>
                                        <td>${item.month}</td>
                                        <td>${item.newUsers}</td>
                                        <td>${item.totalUsers.toLocaleString()}</td>
                                        <td><span class="status-badge ${growthClass}">${growth >= 0 ? '+' : ''}${growth}%</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 日增长统计 -->
            <div class="data-card" style="margin-top: 24px;">
                <div class="card-header">
                    <h2>📆 最近7天用户增长</h2>
                    <div class="stats-summary">
                        <span class="summary-item">今日新增: <strong>${dailyData[dailyData.length - 1].newUsers}</strong> 人</span>
                        <span class="summary-item">7日总计: <strong>${dailyData.reduce((sum, d) => sum + d.newUsers, 0)}</strong> 人</span>
                    </div>
                </div>
                <div class="chart-container">
                    <div class="bar-chart daily-chart">
                        ${dailyData.map(item => `
                            <div class="bar-item">
                                <div class="bar-wrapper">
                                    <div class="bar daily" style="height: ${(item.newUsers / maxDaily) * 100}%">
                                        <span class="bar-value">${item.newUsers}</span>
                                    </div>
                                </div>
                                <span class="bar-label">${item.date.split('-')[2]}日</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染信息统计（匹配类型统计）
function renderMatchStats() {
    const matchStats = MockData.matchTypeStats;
    const totalAllUsers = matchStats.reduce((sum, m) => sum + m.totalUsers, 0);
    
    return `
        <div class="stats-container">
            <div class="data-card">
                <div class="card-header">
                    <h2>📊 匹配类型使用统计</h2>
                    <div class="stats-summary">
                        <span class="summary-item">总使用次数: <strong>${totalAllUsers.toLocaleString()}</strong></span>
                    </div>
                </div>
                
                <!-- 统计概览卡片 -->
                <div class="match-stats-grid">
                    ${matchStats.map(stat => {
                        const malePercent = ((stat.maleCount / stat.totalUsers) * 100).toFixed(1);
                        const femalePercent = ((stat.femaleCount / stat.totalUsers) * 100).toFixed(1);
                        return `
                            <div class="match-stat-card">
                                <div class="match-stat-header">
                                    <span class="match-icon">${stat.icon}</span>
                                    <div class="match-info">
                                        <h4>${stat.title}</h4>
                                        <p class="match-total">${stat.totalUsers.toLocaleString()} 人使用</p>
                                    </div>
                                </div>
                                <div class="gender-bar">
                                    <div class="gender-male" style="width: ${malePercent}%"></div>
                                    <div class="gender-female" style="width: ${femalePercent}%"></div>
                                </div>
                                <div class="gender-legend">
                                    <span class="legend-male">♂ 男 ${malePercent}%</span>
                                    <span class="legend-female">♀ 女 ${femalePercent}%</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- 详细数据表格 -->
                <div class="table-container" style="margin-top: 24px;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>匹配类型</th>
                                <th>使用人数</th>
                                <th>男性用户</th>
                                <th>女性用户</th>
                                <th>男性占比</th>
                                <th>女性占比</th>
                                <th>使用占比</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${matchStats.map(stat => {
                                const malePercent = ((stat.maleCount / stat.totalUsers) * 100).toFixed(1);
                                const femalePercent = ((stat.femaleCount / stat.totalUsers) * 100).toFixed(1);
                                const usagePercent = ((stat.totalUsers / totalAllUsers) * 100).toFixed(1);
                                return `
                                    <tr>
                                        <td><span style="margin-right: 8px;">${stat.icon}</span>${stat.title}</td>
                                        <td><strong>${stat.totalUsers.toLocaleString()}</strong></td>
                                        <td>${stat.maleCount.toLocaleString()}</td>
                                        <td>${stat.femaleCount.toLocaleString()}</td>
                                        <td><span class="status-badge" style="background: #dbeafe; color: #2563eb;">${malePercent}%</span></td>
                                        <td><span class="status-badge" style="background: #fce7f3; color: #db2777;">${femalePercent}%</span></td>
                                        <td><span class="status-badge active">${usagePercent}%</span></td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'success': '已完成',
        'pending': '处理中',
        'failed': '已失败',
        'active': '正常'
    };
    return statusMap[status] || status;
}

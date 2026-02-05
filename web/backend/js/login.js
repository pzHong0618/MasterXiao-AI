/**
 * 管理员登录页面逻辑
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    // 检查是否已登录
    const token = localStorage.getItem('adminToken');
    if (token) {
        window.location.href = 'index.html';
        return;
    }

    // 恢复记住的用户名
    const savedUsername = localStorage.getItem('adminUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }

    // 登录表单提交
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const loginBtn = loginForm.querySelector('.login-btn');

        if (!username || !password) {
            showError('请填写用户名和密码');
            return;
        }

        // 显示加载状态
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        try {
            // 模拟登录验证（实际项目中应调用后端API）
            await simulateLogin(username, password);

            // 记住用户名
            if (rememberCheckbox.checked) {
                localStorage.setItem('adminUsername', username);
            } else {
                localStorage.removeItem('adminUsername');
            }

            // 保存登录状态
            localStorage.setItem('adminToken', 'mock-token-' + Date.now());
            localStorage.setItem('adminInfo', JSON.stringify({
                username: username,
                name: username === 'admin' ? '超级管理员' : username,
                role: 'admin',
                loginTime: new Date().toISOString()
            }));

            // 跳转到管理页面
            window.location.href = 'index.html';
        } catch (error) {
            showError(error.message);
        } finally {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    });

    // 模拟登录
    function simulateLogin(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟验证：用户名 admin，密码 123456
                if (username === 'admin' && password === '123456') {
                    resolve({ success: true });
                } else {
                    reject(new Error('用户名或密码错误'));
                }
            }, 800);
        });
    }

    // 显示错误信息
    function showError(message) {
        // 检查是否已存在错误提示
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            loginForm.insertBefore(errorDiv, loginForm.firstChild);
        }
        
        errorDiv.innerHTML = `⚠️ ${message}`;
        errorDiv.classList.add('show');

        // 3秒后自动隐藏
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
    }
});

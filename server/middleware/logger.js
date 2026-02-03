/**
 * 请求日志中间件
 */

export function requestLogger(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

        if (res.statusCode >= 400) {
            console.log(`[${global.getTimestamp()}] ⚠️ ${log}`);
        } else {
            console.log(`[${global.getTimestamp()}] ✅ ${log}`);
        }
    });

    next();
}

export default requestLogger;

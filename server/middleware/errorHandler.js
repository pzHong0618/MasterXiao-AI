/**
 * 错误处理中间件
 */

export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || '服务器内部错误';
    const code = err.code || 'INTERNAL_ERROR';

    // 开发环境输出详细错误
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            message,
            code,
            stack: err.stack
        });
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
}

export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export default { AppError, errorHandler, asyncHandler };

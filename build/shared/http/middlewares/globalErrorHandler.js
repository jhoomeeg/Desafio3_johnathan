"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
const AppError_1 = require("../../errors/AppError");
function globalErrorHandler(err, _req, res, _next) {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    return res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error' });
}

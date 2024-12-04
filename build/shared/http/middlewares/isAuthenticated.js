"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAuthenticated;
const AppError_1 = require("../../errors/AppError");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../../../config/auth"));
function isAuthenticated(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.AppError('Authorization token is missing!');
    }
    const token = authHeader.split(' ')[1];
    try {
        (0, jsonwebtoken_1.verify)(token, auth_1.default.jwt.secret);
        return next();
    }
    catch (_a) {
        throw new AppError_1.AppError('Invalid authorization token!');
    }
}

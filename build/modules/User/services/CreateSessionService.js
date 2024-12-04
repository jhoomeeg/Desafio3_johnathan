"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../../../config/auth"));
const AppError_1 = require("../../../shared/errors/AppError");
class CreateSessionService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield User_1.default.findOne({ where: { email }, raw: true });
            if (!user) {
                throw new AppError_1.AppError('Incorrect email and password combination. Please try again!', 401);
            }
            const passwordMatchs = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatchs) {
                throw new AppError_1.AppError('Incorrect email and password combination. Please try again!', 401);
            }
            const token = (0, jsonwebtoken_1.sign)({}, auth_1.default.jwt.secret, {
                subject: user.id,
                expiresIn: auth_1.default.jwt.expiresIn,
            });
            const data = {
                id: user.id,
                name: user.name,
                email: user.email,
            };
            return {
                data,
                token,
            };
        });
    }
}
exports.default = CreateSessionService;

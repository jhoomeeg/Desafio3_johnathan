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
const AppError_1 = require("../../../shared/errors/AppError");
const bcryptjs_1 = require("bcryptjs");
class CreateUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password }) {
            const userExists = yield User_1.default.findOne({ where: { email } });
            if (userExists) {
                throw new AppError_1.AppError('An account with this email already exists.', 409);
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, 8);
            const user = yield User_1.default.create({
                name: name,
                email: email,
                password: hashedPassword,
            });
            const id = user.id;
            return id;
        });
    }
}
exports.default = CreateUserService;

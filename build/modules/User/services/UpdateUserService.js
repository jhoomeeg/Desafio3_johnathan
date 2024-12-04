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
class UpdateUserService {
    execute(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { name, email, password }) {
            const userExists = yield User_1.default.findOne({ where: { id } });
            if (!userExists) {
                throw new AppError_1.AppError('User not found!', 404);
            }
            if (email) {
                const userWithEmail = yield User_1.default.findOne({ where: { email } });
                if (userWithEmail && userWithEmail.id != userExists.id) {
                    throw new AppError_1.AppError('An account with this email already exists.', 409);
                }
            }
            const updatedValues = {};
            if (email) {
                updatedValues.email = email;
            }
            if (name) {
                updatedValues.name = name;
            }
            if (password) {
                updatedValues.password = password;
            }
            yield User_1.default.update(updatedValues, { where: { id } });
            return;
        });
    }
}
exports.default = UpdateUserService;

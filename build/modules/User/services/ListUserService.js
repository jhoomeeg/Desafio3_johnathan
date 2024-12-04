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
const AppError_1 = require("../../../shared/errors/AppError");
const User_1 = __importDefault(require("../models/User"));
const sequelize_1 = require("sequelize");
class ListUserService {
    execute(_a, _b, _c) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, justActive }, { nameOrder, createOrder, deleteOrder }, { page, limit }) {
            const whereFilter = {};
            if (name) {
                whereFilter.name = { [sequelize_1.Op.like]: `%${name}%` };
            }
            if (email) {
                whereFilter.email = { [sequelize_1.Op.like]: `%${email}%` };
            }
            const countUsers = yield User_1.default.count({
                where: Object.assign({}, whereFilter),
                paranoid: justActive,
            });
            const pages = Math.ceil(countUsers / limit);
            const users = yield User_1.default.findAll({
                attributes: {
                    exclude: ['password'],
                },
                where: Object.assign({}, whereFilter),
                paranoid: justActive,
                order: [
                    ['name', `${nameOrder}`],
                    ['createdAt', `${createOrder}`],
                    ['deletedAt', `${deleteOrder}`],
                ],
                raw: true,
                offset: page * limit - limit,
                limit: limit,
            });
            if (countUsers == 0) {
                throw new AppError_1.AppError('No results match your search.', 404);
            }
            return { users, pages };
        });
    }
}
exports.default = ListUserService;

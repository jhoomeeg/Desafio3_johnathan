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
const ReadAllOrderService_1 = __importDefault(require("../services/ReadAllOrderService"));
const AppError_1 = require("../../../shared/errors/AppError");
const ReadAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, CPF, DataInicial, DataFinal, page, pageSize } = req.query;
    const orders = yield ReadAllOrderService_1.default.getOrders({
        status: status,
        CPF: CPF,
        DataInicial: DataInicial,
        DataFinal: DataFinal,
        page: parseInt(page) || 1,
        pageSize: parseInt(pageSize) || 10,
    });
    if (orders.totalOrders === 0) {
        throw new AppError_1.AppError('Nem um resultado encontrado', 404);
    }
    return res.status(200).json(orders);
});
exports.default = ReadAll;

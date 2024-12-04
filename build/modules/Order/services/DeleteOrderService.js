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
const Order_1 = __importDefault(require("../models/Order"));
const AppError_1 = require("../../../shared/errors/AppError");
class DeleteOrderService {
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const OrderExist = yield Order_1.default.findOne({
                where: { id },
            });
            if (!OrderExist) {
                throw new AppError_1.AppError("Pedido não encontrado!", 404);
            }
            if (OrderExist.status != "Aberto") {
                throw new AppError_1.AppError('Apenas pedidos com status "Aberto" podem ser cancelados', 403);
            }
            OrderExist.status = "Cancelado";
            yield OrderExist.save();
            yield OrderExist.destroy();
            return;
        });
    }
}
exports.default = DeleteOrderService;

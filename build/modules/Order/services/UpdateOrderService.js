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
const axios_1 = __importDefault(require("axios"));
const AppError_1 = require("../../../shared/errors/AppError");
class UpdateOrderService {
    static execute(orderData) {
        throw new Error("Method not implemented.");
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, DataInicial, DataFinal, CEP, status, }) {
            // Verificar se o pedido existe
            const order = yield Order_1.default.findByPk(id);
            if (!order) {
                throw new AppError_1.AppError("Pedido não encontrado!", 404);
            }
            // Verificar se a DataInicial é menor que a data de hoje
            const today = new Date();
            if (DataInicial < today) {
                throw new AppError_1.AppError("O pedido deve estar em aberto para ser aprovado", 400);
            }
            // Verificar se a DataFinal é menor que a DataInicial
            if (DataFinal < DataInicial) {
                throw new AppError_1.AppError("A data final não pode ser anterior à data inicial", 400);
            }
            // Update do CEP
            let Cidade = null;
            let UF = null;
            if (CEP) {
                const response = yield axios_1.default.get(`https://viacep.com.br/ws/${CEP}/json/`);
                const data = response.data;
                if (data && !data.erro) {
                    const ufs = [
                        "AL",
                        "BA",
                        "CE",
                        "MA",
                        "PB",
                        "PE",
                        "PI",
                        "RN",
                        "SE",
                        "SP",
                    ];
                    if (!ufs.includes(data.uf)) {
                        throw new AppError_1.AppError(`${data.uf} no momento não temos filiais nessa região`, 400);
                    }
                    Cidade = data.localidade;
                    UF = data.uf;
                }
                if (data.erro) {
                    throw new AppError_1.AppError("CEP inválido", 400);
                }
            }
            // Verificação de status
            if (status === "Aprovado") {
                if (order.status !== "Aberto") {
                    throw new AppError_1.AppError("O pedido deve estar em aberto para ser aprovado", 400);
                }
                if (!id || !DataInicial || !DataFinal || !CEP || !status) {
                    throw new AppError_1.AppError("Todos os campos devem estar preenchidos para aprovar o pedido", 400);
                }
            }
            if (status === "Cancelado") {
                if (order.status !== "Aberto") {
                    throw new AppError_1.AppError("O pedido deve estar em aberto para ser cancelado", 400);
                }
                order.DataCancelamento = today;
            }
            // Atualizar pedido
            yield order.update({
                DataInicial,
                DataFinal,
                CEP,
                Cidade,
                UF,
                status,
                DataCancelamento: status === "Cancelado" ? order.DataCancelamento : null,
            });
            return order;
        });
    }
}
exports.default = UpdateOrderService;

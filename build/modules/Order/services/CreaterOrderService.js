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
const Order_1 = __importDefault(require("../models/Order"));
const car_model_1 = __importDefault(require("../../car/models/car.model"));
const Customer_1 = __importDefault(require("../../customer/models/Customer"));
const axios_1 = __importDefault(require("axios"));
class CreaterOrderService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, plate, CEP }) {
            //verificar se o cliente existe
            const customers = yield Customer_1.default.findOne({
                where: { email },
            });
            if (!customers) {
                throw new AppError_1.AppError("Cliente não encontrado", 404);
            }
            //verificar se o carro existe
            const searchCar = yield car_model_1.default.findOne({
                where: { plate },
            });
            if (!searchCar) {
                throw new AppError_1.AppError("Carro não encontrado", 404);
            }
            //verificar se o cliente já possui pedido em aberto
            const searchOrder = yield Order_1.default.findOne({
                where: { cliente: customers.id, Status: "Aberto" },
            });
            if (searchOrder) {
                throw new AppError_1.AppError("Cliente já possui pedido em aberto", 400);
            }
            let Cidade = null;
            let UF = null;
            if (CEP) {
                const response = yield axios_1.default.get(`https://viacep.com.br/ws/${CEP}/json/`);
                const data = response.data;
                if (data && !data.erro) {
                    const ufs = ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"];
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
            //criar pedido
            const order = yield Order_1.default.create({
                cliente: customers.id,
                CarroPedido: searchCar.id,
                CEP,
                Cidade, // pegar da API externa
                UF, // pegar da API externa
                ValorTotal: searchCar.price, // Usar o preço do carro encontrado
                dataFinal: null,
                dataCancelamento: null,
                status: "Aberto",
            });
            return order;
        });
    }
}
exports.default = CreaterOrderService;

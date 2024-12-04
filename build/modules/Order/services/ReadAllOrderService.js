"use strict";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
const Customer_1 = __importDefault(require("../../customer/models/Customer"));
const sequelize_1 = require("sequelize");
const getOrders = (_a) => __awaiter(void 0, [_a], void 0, function* ({ status, CPF, DataInicial, DataFinal, page, pageSize, }) {
    const where = {};
    let ordenacao = "ASC";
    let ordem = "DataInicial";
    if (status) {
        where.status = status;
    }
    if (CPF) {
        const searchCPF = yield Customer_1.default.findOne({
            where: { CPF },
        });
        where.Cliente = searchCPF.id;
    }
    if (DataInicial || DataFinal) {
        where.DataInicial = {};
        where.DataFinal = {};
        if (DataInicial) {
            where.DataInicial = { [sequelize_1.Op.gte]: new Date(DataInicial) };
        }
        if (DataFinal) {
            where.DataFinal = { [sequelize_1.Op.gte]: new Date(DataFinal) };
            ordenacao = "DESC";
            ordem = "DataFinal";
        }
    }
    const { count, rows } = yield Order_1.default.findAndCountAll({
        where,
        order: [[ordem, ordenacao]],
        limit: pageSize,
        offset: (page - 1) * pageSize,
        atributes: [
            "id",
            "status",
            "DataInicial",
            "DataFinal",
            "DataCancelamento",
            "ValorTotal",
            "CEP",
            "Cidade",
            "UF",
        ],
        include: [
            {
                model: Customer_1.default,
                attributes: ["id", "nome", "cpf"],
            },
        ],
    });
    return {
        totalOrders: count,
        totalPages: Math.ceil(count / pageSize),
        orders: rows,
    };
});
exports.default = { getOrders };

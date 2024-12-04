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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Customer_1 = __importDefault(require("../models/Customer")); // Importa o modelo Customer
const AppError_1 = require("../../../shared/errors/AppError"); // Importa a classe de erro personalizada
const uuid_1 = require("uuid"); // Importa a função para gerar UUIDs
const sequelize_1 = require("sequelize"); // Importa operadores do Sequelize para consultas
// Classe de serviço para gerenciar operações relacionadas a clientes
class CustomerService {
    // Método estático para criar um novo cliente
    static createCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validação de dados
            const { nome, dataNascimento, cpf, email, telefone } = data;
            if (!nome || !dataNascimento || !cpf || !email || !telefone) {
                throw new AppError_1.AppError("Todos os campos são obrigatórios");
            }
            // Verifica se o cliente já existe
            const existingCustomer = yield Customer_1.default.findOne({
                where: {
                    [sequelize_1.Op.or]: [{ cpf }, { email }],
                    deletedAt: null, // Considera apenas clientes ativos
                },
            });
            if (existingCustomer) {
                throw new AppError_1.AppError("Cliente com CPF ou email já cadastrado");
            }
            // Criação do cliente
            const customer = yield Customer_1.default.create(Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, data), { dataRegistro: new Date() }));
            return customer;
        });
    }
    // Método estático para obter um cliente pelo ID
    static getCustomerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer_1.default.findOne({
                where: { id, deletedAt: null },
            });
            if (!customer) {
                throw new AppError_1.AppError("Cliente não encontrado");
            }
            return customer;
        });
    }
    // Método estático para obter uma lista de clientes com filtros e paginação
    static getCustomers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = query, filters = __rest(query, ["page", "limit"]);
            const whereFilter = {};
            if (filters.nome) {
                whereFilter.nome = { [sequelize_1.Op.like]: `%${filters.nome}%` };
            }
            if (filters.cpf) {
                whereFilter.cpf = { [sequelize_1.Op.like]: `%${filters.cpf}%` };
            }
            if (filters.email) {
                whereFilter.email = { [sequelize_1.Op.like]: `%${filters.email}%` };
            }
            const countCustomers = yield Customer_1.default.count({
                where: Object.assign({ deletedAt: null }, whereFilter),
            });
            const pages = Math.ceil(countCustomers / limit);
            const customers = yield Customer_1.default.findAll({
                where: Object.assign({ deletedAt: null }, whereFilter),
                limit,
                offset: (page - 1) * limit,
            });
            if (countCustomers === 0) {
                throw new AppError_1.AppError("Nenhum cliente encontrado", 404);
            }
            return {
                customers,
                pages,
            };
        });
    }
    // Método estático para atualizar os dados de um cliente
    static updateCustomer(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer_1.default.findOne({
                where: { id, deletedAt: null },
            });
            if (!customer) {
                throw new AppError_1.AppError("Cliente não encontrado");
            }
            yield customer.update(data);
            return customer;
        });
    }
    // Método estático para deletar um cliente
    static deleteCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer_1.default.findOne({
                where: { id, deletedAt: null },
            });
            if (!customer) {
                throw new AppError_1.AppError("Cliente não encontrado");
            }
            yield customer.update({ deletedAt: new Date() });
            return customer;
        });
    }
}
exports.default = CustomerService; // Exporta a classe CustomerService para uso em outras partes da aplicação

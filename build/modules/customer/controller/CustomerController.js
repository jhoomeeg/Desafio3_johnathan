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
const CustomerServices_1 = __importDefault(require("../services/CustomerServices"));
const AppError_1 = require("../../../shared/errors/AppError");
// Controlador para gerenciar operações relacionadas a clientes
class CustomerController {
    // Método para criar um novo cliente
    static createCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Chama o serviço para criar um cliente com os dados do corpo da requisição
                const customer = yield CustomerServices_1.default.createCustomer(req.body);
                return res.status(201).json(customer); // Retorna o cliente criado com status 201
            }
            catch (error) {
                // Trata erros, utilizando AppError para padronizar a resposta
                if (error instanceof Error) {
                    return next(new AppError_1.AppError(error.message, 400)); // Erro do cliente
                }
                else {
                    return next(new AppError_1.AppError('Um erro inesperado ocorreu', 500)); // Erro inesperado
                }
            }
        });
    }
    // Método para buscar um cliente pelo ID
    static getCustomerById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Chama o serviço para obter um cliente pelo ID
                const customer = yield CustomerServices_1.default.getCustomerById(req.params.id);
                return res.status(200).json(customer); // Retorna o cliente encontrado com status 200
            }
            catch (error) {
                // Tratamento de erro semelhante ao método anterior
                if (error instanceof Error) {
                    return next(new AppError_1.AppError(error.message, 404)); // Cliente não encontrado
                }
                else {
                    return next(new AppError_1.AppError('Um erro inesperado ocorreu', 500));
                }
            }
        });
    }
    // Método para obter uma lista de clientes com suporte a paginação e filtros
    static getCustomers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extração de parâmetros de consulta e definição de valores padrão
                const { page, limit, nome, cpf, email } = req.query;
                const query = {
                    page: parseInt(page, 10) || 1,
                    limit: parseInt(limit, 10) || 10,
                    nome: nome || undefined,
                    cpf: cpf || undefined,
                    email: email || undefined,
                };
                const result = yield CustomerServices_1.default.getCustomers(query); // Chama o serviço para obter clientes
                return res.status(200).json(result); // Retorna a lista de clientes
            }
            catch (error) {
                // Tratamento de erro padronizado
                if (error instanceof Error) {
                    return next(new AppError_1.AppError(error.message, 500));
                }
                else {
                    return next(new AppError_1.AppError('Um erro inesperado ocorreu', 500));
                }
            }
        });
    }
    // Método para atualizar os dados de um cliente
    static updateCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield CustomerServices_1.default.updateCustomer(req.params.id, req.body); // Atualiza o cliente
                return res.status(200).json(customer); // Retorna o cliente atualizado
            }
            catch (error) {
                // Tratamento de erro semelhante aos métodos anteriores
                if (error instanceof Error) {
                    return next(new AppError_1.AppError(error.message, 400)); // Erro do cliente
                }
                else {
                    return next(new AppError_1.AppError('Um erro inesperado ocorreu', 500));
                }
            }
        });
    }
    // Método para excluir um cliente
    static deleteCustomer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield CustomerServices_1.default.deleteCustomer(req.params.id); // Exclui o cliente
                return res
                    .status(200)
                    .json({ message: 'Cliente excluído com sucesso', customer }); // Retorna mensagem de sucesso
            }
            catch (error) {
                // Tratamento de erro padronizado
                if (error instanceof Error) {
                    return next(new AppError_1.AppError(error.message, 404)); // Cliente não encontrado
                }
                else {
                    return next(new AppError_1.AppError('Um erro inesperado ocorreu', 500));
                }
            }
        });
    }
}
exports.default = CustomerController; // Exporta o controlador para uso em outras partes da aplicação

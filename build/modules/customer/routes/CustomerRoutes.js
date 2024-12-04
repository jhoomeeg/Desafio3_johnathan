"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const express_1 = require("express");
const CustomerController_1 = __importDefault(require("../controller/CustomerController"));
const isAuthenticated_1 = __importDefault(require("../../../shared/http/middlewares/isAuthenticated"));
const celebrate_1 = require("celebrate");
const router = (0, express_1.Router)();
// Validações para criação de clientes
const createCustomerValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        nome: celebrate_1.Joi.string().required(), // Nome completo obrigatório
        dataNascimento: celebrate_1.Joi.date().required(), // Data de nascimento obrigatória
        cpf: celebrate_1.Joi.string().length(11).required(), // CPF obrigatório (considerando que você irá validar o CPF depois)
        email: celebrate_1.Joi.string().email().required(), // E-mail obrigatório
        telefone: celebrate_1.Joi.string().required(), // Telefone obrigatório
        createdAt: celebrate_1.Joi.date().default(Date.now), // Data do Cadastro padrão para agora
        updatedAt: celebrate_1.Joi.date().default(Date.now),
        deletedAt: celebrate_1.Joi.date().allow(null), // Data de exclusão pode ser nula
    }),
});
// Validações para atualização de clientes
const updateCustomerValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object().keys({
        id: celebrate_1.Joi.string().guid().required(), // ID do cliente obrigatório
    }),
    [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
        nome: celebrate_1.Joi.string().optional(),
        dataNascimento: celebrate_1.Joi.date().optional(),
        cpf: celebrate_1.Joi.string().length(11).optional(),
        email: celebrate_1.Joi.string().email().optional(),
        telefone: celebrate_1.Joi.string().optional(),
    }),
});
// Validações para obter um cliente pelo ID
const getCustomerByIdValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: celebrate_1.Joi.object().keys({
        id: celebrate_1.Joi.string().guid().required(), // ID do cliente obrigatório
    }),
});
// Validações para listar clientes (pode incluir parâmetros de consulta)
const listCustomersValidation = (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.QUERY]: celebrate_1.Joi.object().keys({
        nome: celebrate_1.Joi.string().optional(),
        email: celebrate_1.Joi.string().optional(),
        cpf: celebrate_1.Joi.string().length(11).optional(),
        excluido: celebrate_1.Joi.boolean().optional(),
        pagina: celebrate_1.Joi.number().integer().default(1), // Página padrão
        tamanho: celebrate_1.Joi.number().integer().default(10), // Tamanho padrão
    }),
});
// middleware de autenticação
router.use(isAuthenticated_1.default);
// Rota para criar um cliente
router.post('/', createCustomerValidation, CustomerController_1.default.createCustomer);
// Rota para obter um cliente pelo ID
router.get('/:id', getCustomerByIdValidation, CustomerController_1.default.getCustomerById);
// Rota para listar todos os clientes
router.get('/', listCustomersValidation, CustomerController_1.default.getCustomers);
// Rota para atualizar um cliente
router.put('/:id', updateCustomerValidation, CustomerController_1.default.updateCustomer);
// Rota para deletar um cliente (soft delete)
router.delete('/:id', getCustomerByIdValidation, CustomerController_1.default.deleteCustomer);
exports.default = router;

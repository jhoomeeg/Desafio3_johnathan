"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize"); // Importação das classes necessárias do Sequelize
const sequelize_2 = __importDefault(require("../../../config/sequelize")); // Importa a instância do Sequelize configurada
// Definição da classe Customer, que estende a classe Model do Sequelize
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
// Inicialização do modelo Customer
Customer.init({
    id: {
        type: sequelize_1.DataTypes.UUID, // Tipo de dado UUID para o ID
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Gera um novo UUID por padrão
        primaryKey: true, // Define como chave primária
    },
    nome: { type: sequelize_1.DataTypes.STRING, allowNull: false }, // Nome do cliente, não pode ser nulo
    dataNascimento: { type: sequelize_1.DataTypes.DATE, allowNull: false }, // Data de nascimento, não pode ser nula
    cpf: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true }, // CPF, único e não pode ser nulo
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true }, // Email, único e não pode ser nulo
    telefone: { type: sequelize_1.DataTypes.STRING, allowNull: false }, // Telefone, não pode ser nulo
    dataRegistro: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW }, // Data de registro, valor padrão é a data atual
    createdAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW }, // Data de criação, valor padrão é a data atual
    updatedAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW }, // Data de atualização, valor padrão é a data atual
    deletedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true }, // Data de exclusão, pode ser nula
}, {
    sequelize: sequelize_2.default, // Instância do Sequelize
    tableName: 'customers', // Nome da tabela no banco de dados
    paranoid: true, // Habilita o soft delete
    timestamps: true, // Habilita as colunas createdAt e updatedAt
});
exports.default = Customer; // Exporta o modelo Customer para uso em outras partes da aplicação

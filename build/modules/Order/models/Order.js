"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../../../config/sequelize"));
const Customer_1 = __importDefault(require("../../customer/models/Customer"));
const car_model_1 = __importDefault(require("../../car/models/car.model"));
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    cliente: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: Customer_1.default, // nome do model cliente
            key: "id",
        },
    },
    DataInicial: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
        validate: {
            isDate: true, // validação para garantir que seja válida
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("Aberto", "Aprovado", "Cancelado"),
        allowNull: false,
        defaultValue: "Aberto",
    },
    CEP: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    Cidade: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    UF: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    ValorTotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    CarroPedido: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: car_model_1.default, // nome do model cliente
            key: "id",
        },
    },
    DataFinal: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        validate: {
            isDate: true, // validação para garantir que seja válida
        },
    },
    DataCancelamento: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        validate: {
            isDate: true, // validação para garantir que seja válida
        },
    },
}, {
    sequelize: sequelize_2.default,
    paranoid: true,
    timestamps: true,
    tableName: "orders",
});
Order.belongsTo(car_model_1.default, { foreignKey: "CarroPedido" });
Order.belongsTo(Customer_1.default, { foreignKey: "cliente" });
exports.default = Order;

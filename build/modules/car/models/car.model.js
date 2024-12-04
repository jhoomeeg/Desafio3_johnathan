"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("../../../config/sequelize"));
const sequelize_2 = require("sequelize");
class Car extends sequelize_2.Model {
}
Car.init({
    id: {
        type: sequelize_2.DataTypes.UUID,
        defaultValue: sequelize_2.DataTypes.UUIDV4,
        primaryKey: true,
    },
    plate: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    brand: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    model: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    km: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: true,
    },
    year: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isRecentYear(value) {
                const currentYear = new Date().getFullYear();
                if (value < currentYear - 11) {
                    throw new Error("O carro não pode ter mais de 11 anos.");
                }
            },
        },
    },
    items: {
        type: sequelize_2.DataTypes.ARRAY(sequelize_2.DataTypes.STRING),
        allowNull: false,
        validate: {
            arrayLength(value) {
                if (value.length < 1 || value.length > 5) {
                    throw new Error("Items must contain between 1 and 5 unique items");
                }
            },
            isUnique(value) {
                if (new Set(value).size !== value.length) {
                    throw new Error("Items cannot contain duplicates");
                }
            },
        },
    },
    price: {
        type: sequelize_2.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
        },
    },
    registrationDate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.DataTypes.NOW,
    },
    status: {
        type: sequelize_2.DataTypes.ENUM("active", "inactive", "deleted"),
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.default,
    paranoid: true,
    timestamps: true,
    tableName: "cars",
});
exports.default = Car;

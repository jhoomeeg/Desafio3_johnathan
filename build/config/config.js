"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    username: process.env.POSTGRES_USER, // Nome do usuário
    password: process.env.POSTGRES_PASSWORD, // Senha do banco
    database: process.env.POSTGRES_DB, // Nome do banco
    host: process.env.POSTGRES_HOST, // Host do banco
    dialect: "postgres", // Dialeto ajustado para PostgreSQL
    port: parseInt(process.env.POSTGRES_PORT, 10), // Porta do banco
    logging: false, // Opcional: desativa logs de queries
});
exports.default = sequelize;

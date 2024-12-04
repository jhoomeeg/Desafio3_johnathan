"use strict";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const celebrate_1 = require("celebrate");
const isAuthenticated_1 = __importDefault(require("../../../shared/http/middlewares/isAuthenticated"));
const userRoutes = (0, express_1.Router)();
const userController = new UserController_1.default();
userRoutes.use(isAuthenticated_1.default);
userRoutes.post('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    },
}), userController.create);
userRoutes.get('/', userController.List);
userRoutes.get('/:id', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: {
        id: celebrate_1.Joi.string().uuid().required(),
    },
}), userController.show);
userRoutes.patch('/:id', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: {
        id: celebrate_1.Joi.string().uuid().required(),
    },
    [celebrate_1.Segments.BODY]: {
        name: celebrate_1.Joi.string().optional(),
        email: celebrate_1.Joi.string().email().optional(),
        password: celebrate_1.Joi.string().optional(),
    },
}), userController.update);
userRoutes.delete('/:id', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.PARAMS]: {
        id: celebrate_1.Joi.string().uuid().required(),
    },
}), userController.remove);
exports.default = userRoutes;

"use strict";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionsController_1 = __importDefault(require("../controllers/SessionsController"));
const celebrate_1 = require("celebrate");
const sessionRoutes = (0, express_1.Router)();
const sessionController = new SessionsController_1.default();
sessionRoutes.post('/', (0, celebrate_1.celebrate)({
    [celebrate_1.Segments.BODY]: {
        email: celebrate_1.Joi.string().email().required(),
        password: celebrate_1.Joi.string().required(),
    },
}), sessionController.create);
exports.default = sessionRoutes;

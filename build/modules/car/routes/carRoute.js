"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const express_1 = require("express");
const carController_1 = __importDefault(require("../controllers/carController"));
const isAuthenticated_1 = __importDefault(require("../../../shared/http/middlewares/isAuthenticated"));
const carRoute = (0, express_1.Router)();
carRoute.post('/create', isAuthenticated_1.default, carController_1.default.create);
carRoute.get('/', isAuthenticated_1.default, carController_1.default.getAll);
carRoute.get('/:id', isAuthenticated_1.default, carController_1.default.getById);
carRoute.put('/:id', isAuthenticated_1.default, carController_1.default.update);
carRoute.delete('/:id', isAuthenticated_1.default, carController_1.default.deleteCar);
exports.default = carRoute;

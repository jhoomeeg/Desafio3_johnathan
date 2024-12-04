"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRoutes_1 = __importDefault(require("../../../modules/User/Routes/UserRoutes"));
const SessionRoutes_1 = __importDefault(require("../../../modules/User/Routes/SessionRoutes"));
const createOrderRoute_1 = __importDefault(require("../../../modules/Order/routes/createOrderRoute"));
const carRoute_1 = __importDefault(require("../../../modules/car/routes/carRoute"));
const CustomerRoutes_1 = __importDefault(require("../../../modules/customer/routes/CustomerRoutes"));
const express_1 = require("express");
const routes = (0, express_1.Router)();
routes.use('/login', SessionRoutes_1.default);
routes.use('/users', UserRoutes_1.default);
routes.use('/customers', CustomerRoutes_1.default);
routes.use('/cars', carRoute_1.default);
routes.use('/Order', createOrderRoute_1.default);
exports.default = routes;

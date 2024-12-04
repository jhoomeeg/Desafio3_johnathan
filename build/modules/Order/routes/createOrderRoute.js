"use strict";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CreaterOrder_1 = __importDefault(require("../controller/CreaterOrder"));
const ReadOrder_1 = __importDefault(require("../controller/ReadOrder"));
const ReadAllOrder_1 = __importDefault(require("../controller/ReadAllOrder"));
const DeleteOrder_1 = __importDefault(require("../controller/DeleteOrder"));
const updateOrder_1 = __importDefault(require("../controller/updateOrder"));
const isAuthenticated_1 = __importDefault(require("../../../shared/http/middlewares/isAuthenticated"));
const orderRoute = (0, express_1.Router)();
const createrOrderController = new CreaterOrder_1.default();
const readOrderController = new ReadOrder_1.default();
const deleteOrderController = new DeleteOrder_1.default();
const updateOrderController = new updateOrder_1.default();
orderRoute.use(isAuthenticated_1.default);
orderRoute.post("/create", createrOrderController.createOrder);
orderRoute.get("/:id", readOrderController.readOrder);
orderRoute.get("/", ReadAllOrder_1.default);
orderRoute.delete("/:id", deleteOrderController.delete);
orderRoute.patch("/:id", updateOrderController.updateOrder);
exports.default = orderRoute;

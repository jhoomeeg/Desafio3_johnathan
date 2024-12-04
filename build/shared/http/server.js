"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const sequelize_1 = __importDefault(require("../../config/sequelize"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const routes_1 = __importDefault(require("./routes"));
const celebrate_1 = require("celebrate");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/healthcheck", (_req, res) => {
    res.status(200).send({ message: "Server is up and running!" });
});
app.use("/api/v1/", routes_1.default);
app.use((0, celebrate_1.errors)());
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize_1.default.authenticate();
        console.log("Connection has been established successfully.");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
startServer();

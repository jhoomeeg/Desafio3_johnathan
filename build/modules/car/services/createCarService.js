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
exports.default = createCar;
const AppError_1 = require("../../../shared/errors/AppError");
const car_model_1 = __importDefault(require("../models/car.model"));
const uuid_1 = require("uuid");
function createCar(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { plate, brand, model, km, year, items, price, status } = data;
        if (!plate || !brand || !model || !year || !items || !price || !status) {
            throw new AppError_1.AppError('All required fields must be filled.');
        }
        if (items.length > 5 || new Set(items).size !== items.length) {
            throw new AppError_1.AppError('Items must be unique and cannot exceed five.');
        }
        if (year < new Date().getFullYear() + 1 - 11) {
            throw new AppError_1.AppError('The year of the car must be within the last 11 years.');
        }
        const existingCar = yield car_model_1.default.findOne({
            where: { plate, status: ['active', 'inactive'] },
        });
        if (existingCar) {
            throw new AppError_1.AppError('A car with this plate already exists.');
        }
        const newCar = yield car_model_1.default.create({
            id: (0, uuid_1.v4)(),
            plate,
            brand,
            model,
            km,
            year,
            items,
            price,
            registrationDate: new Date(),
            status,
        });
        return newCar;
    });
}

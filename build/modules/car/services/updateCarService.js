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
const car_model_1 = __importDefault(require("../models/car.model"));
const AppError_1 = require("../../../shared/errors/AppError");
class UpdateCarService {
    execute(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { plate, brand, model, km, year, items, price, status, }) {
            const car = yield car_model_1.default.findOne({ where: { id } });
            if (!car) {
                throw new AppError_1.AppError('Car not found', 404);
            }
            if (car.status === 'deleted') {
                throw new AppError_1.AppError('Cannot update a car with status deleted', 400);
            }
            if (status && status !== 'active' && status !== 'inactive') {
                throw new AppError_1.AppError('Status can only be updated to active or inactive', 400);
            }
            if (items) {
                if (items.length > 5 || new Set(items).size !== items.length) {
                    throw new AppError_1.AppError('Items must be unique and cannot exceed five.', 400);
                }
            }
            if (year && year < new Date().getFullYear() + 1 - 11) {
                throw new AppError_1.AppError('The year of the car must be within the last 11 years.', 400);
            }
            if (plate) {
                const existingCar = yield car_model_1.default.findOne({
                    where: { plate, status: ['active', 'inactive'] },
                });
                if (existingCar && existingCar.id !== id) {
                    throw new AppError_1.AppError('A car with this plate already exists.', 400);
                }
            }
            const updatedValues = {};
            if (plate)
                updatedValues.plate = plate;
            if (brand)
                updatedValues.brand = brand;
            if (model)
                updatedValues.model = model;
            if (km)
                updatedValues.km = km;
            if (year)
                updatedValues.year = year;
            if (items)
                updatedValues.items = items;
            if (price)
                updatedValues.price = price;
            if (status)
                updatedValues.status = status;
            yield car.update(updatedValues);
        });
    }
}
exports.default = UpdateCarService;

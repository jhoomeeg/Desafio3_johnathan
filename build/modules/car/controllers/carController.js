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
const createCarService_1 = __importDefault(require("../services/createCarService"));
const listCarService_1 = __importDefault(require("../services/listCarService"));
const showCarService_1 = __importDefault(require("../services/showCarService"));
const updateCarService_1 = __importDefault(require("../services/updateCarService"));
const deleteCarService_1 = __importDefault(require("../services/deleteCarService"));
class CarController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCar = yield (0, createCarService_1.default)(req.body);
                return res.status(201).json(newCar);
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(400).json({ message: 'Unknown error occurred.' });
            }
        });
    }
    static getAll(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cars = yield (0, listCarService_1.default)();
                return res.status(200).json(cars);
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: 'Unknown error occurred.' });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const car = yield (0, showCarService_1.default)(req.params.id);
                return res.status(200).json(car);
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(404).json({ message: 'Unknown error occurred.' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateCarService = new updateCarService_1.default();
                const updatedCar = yield updateCarService.execute(req.params.id, req.body);
                return res.status(200).json({
                    message: 'Car updated successfully',
                    data: updatedCar,
                });
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(400).json({ message: 'Unknown error occurred.' });
            }
        });
    }
    static deleteCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, deleteCarService_1.default)(req.params.id);
                return res.status(200).json(result);
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(404).json({ message: 'Unknown error occurred.' });
            }
        });
    }
}
exports.default = CarController;

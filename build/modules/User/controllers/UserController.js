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
const CreateUserService_1 = __importDefault(require("../services/CreateUserService"));
const DeleteUserService_1 = __importDefault(require("../services/DeleteUserService"));
const ListUserService_1 = __importDefault(require("../services/ListUserService"));
const ShowUserService_1 = __importDefault(require("../services/ShowUserService"));
const UpdateUserService_1 = __importDefault(require("../services/UpdateUserService"));
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            const createUser = new CreateUserService_1.default();
            const newUserId = yield createUser.execute({ name, email, password });
            return res.status(201).json({ id: newUserId });
        });
    }
    List(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, excludeds } = req.query;
            const { nameOrder, createOrder, deleteOrder } = req.query;
            const { page, limit } = req.query;
            let justActive = false;
            console.log(deleteOrder);
            const listUser = new ListUserService_1.default();
            if (excludeds === 'no') {
                justActive = true;
            }
            const filter = {
                name: name || undefined,
                email: email || undefined,
                justActive,
            };
            const order = {
                nameOrder: nameOrder || 'ASC',
                createOrder: createOrder || 'DESC',
                deleteOrder: deleteOrder || 'DESC',
            };
            const paginate = {
                page: parseInt(page, 10) || 1,
                limit: parseInt(limit, 10) || 10,
            };
            const data = yield listUser.execute(filter, order, paginate);
            return res.status(200).json({
                pages: data.pages,
                limitPerPage: parseInt(limit, 10) || 10,
                page: page || 1,
                users: data.users,
            });
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const showUser = new ShowUserService_1.default();
            const user = yield showUser.execute(id);
            return res.status(200).json({ user });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { name, email, password } = req.body;
            const updateUser = new UpdateUserService_1.default();
            yield updateUser.execute(id, { name, email, password });
            return res.status(204).json({});
        });
    }
    remove(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const deleteUser = new DeleteUserService_1.default();
            yield deleteUser.execute(id);
            return res.status(204).json({});
        });
    }
}
exports.default = UserController;

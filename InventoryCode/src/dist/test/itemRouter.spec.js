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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const ItemRouter_1 = __importDefault(require("../Router/ItemRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(ItemRouter_1.default);
describe('Confirmation account routes', () => {
    it('should return all items', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/');
        expect(res.status).toBe(200);
    }));
    it('should get an item by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/1');
        expect(res.status).toBe(200);
    }));
    it('should update an item', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/1').send({ ItemName: 'test', Description: 'test', Category: 'test', Available: 'Y', Damaged: 'N', Picture: 'test' });
        expect(res.status).toBe(200);
    }));
    it('should add an item', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/').send({ ItemName: 'test', Description: 'test', Category: 'test', Available: 'Y', Damaged: 'N', Picture: 'test' });
        expect(res.status).toBe(201);
    }));
    it('should delete an item', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/1');
        expect(res.status).toBe(200);
    }));
    it('should return an error if the item name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/').send({});
        expect(res.status).toBe(400);
    }));
    it('should return an error if item id is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/').send({ name: 'test' });
        expect(res.status).toBe(404);
    }));
    it('should return an error if the item id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/test').send({ name: 'test' });
        expect(res.status).toBe(400);
    }));
    it('should return an error if the item id is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/').send({ name: 'test' });
        expect(res.status).toBe(404);
    }));
});

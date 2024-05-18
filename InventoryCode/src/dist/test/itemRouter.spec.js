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
const ItemRouter_1 = require("../Router/ItemRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(ItemRouter_1.itemRouter);
describe('Confirmation account routes', () => {
    it('should return all categories', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/');
        expect(res.status).toBe(200);
    }));
    it('should add a category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/').send({ name: 'test' });
        expect(res.status).toBe(201);
    }));
    it('should update a category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/1').send({ name: 'test' });
        expect(res.status).toBe(200);
    }));
    it('should delete a category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/1');
        expect(res.status).toBe(200);
    }));
    it('should return an error if the category name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/').send({});
        expect(res.status).toBe(400);
    }));
    it('should return an error if the category id is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/').send({ name: 'test' });
        expect(res.status).toBe(400);
    }));
    it('should return an error if the category id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/test').send({ name: 'test' });
        expect(res.status).toBe(400);
    }));
    it('should return an error if the category name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).put('/1').send({});
        expect(res.status).toBe(400);
    }));
    it('should return an error if the category id is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/').send({ name: 'test' });
        expect(res.status).toBe(400);
    }));
});

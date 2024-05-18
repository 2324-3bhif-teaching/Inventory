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
exports.itemRouter = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const items_1 = require("../data/items");
exports.itemRouter = express_1.default.Router();
exports.itemRouter.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield items_1.DB.createDBConnection();
        const allItems = yield db.all('SELECT * FROM Item');
        yield db.close();
        res.status(http_status_codes_1.StatusCodes.OK).json(allItems);
    }
    catch (error) {
        console.error("error getting items:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
}));
exports.itemRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield items_1.DB.createDBConnection();
        const { itemName, description, category, available, damaged, picture } = req.body;
        yield db.run(`INSERT INTO Item (ItemName, Description, Category, Available, Damaged, Picture) VALUES (?, ?, ?, ?, ?, ?)`, [itemName, description, category, available, damaged, picture]);
        yield db.close();
        res.status(http_status_codes_1.StatusCodes.CREATED).send("Item added.");
    }
    catch (error) {
        console.error("error adding item:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
}));
exports.itemRouter.put('/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield items_1.DB.createDBConnection();
        const itemId = parseInt(req.params.itemId, 10);
        const { itemName, description, category, available, damaged, picture } = req.body;
        yield db.run(`UPDATE Item SET ItemName = ?, Description = ?, Category = ?, Available = ?, Damaged = ?, Picture = ? WHERE ItemNumber = ?`, [itemName, description, category, available, damaged, picture, itemId]);
        yield db.close();
        res.status(http_status_codes_1.StatusCodes.OK).send("Item updated successfully.");
    }
    catch (error) {
        console.error("Error updating item:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error updating item.");
    }
}));
exports.itemRouter.delete('/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield items_1.DB.createDBConnection();
        const itemId = parseInt(req.params.itemId, 10);
        yield db.run(`DELETE FROM Item WHERE ItemNumber = ?`, [itemId]);
        yield db.close();
        res.status(http_status_codes_1.StatusCodes.OK).send("Item deleted successfully.");
    }
    catch (error) {
        console.error("Error deleting item:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error deleting item.");
    }
}));

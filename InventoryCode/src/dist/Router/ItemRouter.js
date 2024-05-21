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
// import modules
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const items_1 = require("../data/items");
// create router
const itemRouter = express_1.default.Router();
function getItemById(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield items_1.DB.createDBConnection();
        const item = yield db.get('SELECT * FROM Item WHERE ItemNumber = ?', [itemId]);
        yield db.close();
        return item;
    });
}
itemRouter.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
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
itemRouter.get('/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.itemId, 10);
        if (isNaN(id) || id < 0 || id.toString().length === 0) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Invalid item id.");
            return;
        }
        const item = getItemById(id);
        if (!item) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Item not found.");
            return;
        }
        res.status(http_status_codes_1.StatusCodes.OK).json(item);
    }
    catch (error) {
        console.error("error getting item by id:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
}));
itemRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield items_1.DB.createDBConnection();
        const { itemName, description, category, available, damaged, picture } = req.body;
        yield db.run(`INSERT INTO Item (ItemName, Description, Category, Available, Damaged, Picture) VALUES (?, ?, ?, ?, ?, ?)`, [itemName, description, category, available, damaged, picture]);
        // Log the request body to debug the issue
        console.log('Request Body:', req.body);
        // Validate the presence of itemName
        if (!itemName) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Item name is required' });
        }
        // Insert the item into the database
        const result = yield db.run(`INSERT INTO Item (ItemName, Description, Category, Available, Damaged, Picture) VALUES (?, ?, ?, ?, ?, ?)`, [itemName, description, category, available, damaged, picture]);
        yield db.close();
        // Send back the ID of the newly created item
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ itemId: result.lastID, message: 'Item added.' });
    }
    catch (error) {
        console.error("error adding item:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
}));
exports.default = itemRouter;
itemRouter.put('/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield items_1.DB.createDBConnection();
        const id = parseInt(req.params.itemId, 10);
        if (isNaN(id) || id < 0 || id.toString().length === 0) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Invalid item id.");
            return;
        }
        const { itemName, description, category, available, damaged, picture } = req.body;
        yield db.run(`UPDATE Item SET ItemName = ?, Description = ?, Category = ?, Available = ?, Damaged = ?, Picture = ? WHERE ItemNumber = ?`, [itemName, description, category, available, damaged, picture, id]);
        yield db.close();
        res.status(http_status_codes_1.StatusCodes.OK).send("Item updated successfully.");
    }
    catch (error) {
        console.error("Error updating item:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error updating item.");
    }
}));
itemRouter.delete('/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const db = yield items_1.DB.createDBConnection();
        const id = (_a = parseInt(req.params.itemId, 10)) !== null && _a !== void 0 ? _a : 0;
        if (isNaN(id) || id < 0 || id === 0) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Invalid item id.");
            return;
        }
        yield db.run(`DELETE FROM Item WHERE ItemNumber = ?`, [id]);
        yield db.close();
        res.status(http_status_codes_1.StatusCodes.OK).send("Item deleted successfully.");
    }
    catch (error) {
        console.error("Error deleting item:", error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error deleting item.");
    }
}));

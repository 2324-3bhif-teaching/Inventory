"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = require("../data/category");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    (0, category_1.getCategories)((err, categories) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching categories' });
        }
        else {
            res.json(categories);
        }
    });
});
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: 'Category name is required' });
        return;
    }
    (0, category_1.addCategory)(name, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error adding category' });
        }
        else {
            res.status(201).json({ message: 'Category added' });
        }
    });
});
exports.default = router;

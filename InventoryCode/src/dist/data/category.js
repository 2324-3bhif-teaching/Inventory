"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.addCategory = exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
exports.db = new sqlite3_1.default.Database('category.db');
exports.db.serialize(() => {
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);
});
function addCategory(name, callback) {
    const query = `INSERT INTO categories (name) VALUES (?)`;
    exports.db.run(query, [name], callback);
}
exports.addCategory = addCategory;
function getCategories(callback) {
    const query = `SELECT * FROM categories`;
    exports.db.all(query, [], (err, rows) => {
        if (err) {
            callback(err, []);
        }
        else {
            callback(null, rows);
        }
    });
}
exports.getCategories = getCategories;
function updateCategory(categoryId, newName, callback) {
    const query = 'UPDATE categories SET name = ? WHERE id = ?';
    exports.db.run(query, [newName, categoryId], callback);
}
exports.updateCategory = updateCategory;
function deleteCategory(categoryId, callback) {
    const query = 'DELETE FROM categories WHERE id = ?';
    exports.db.run(query, [categoryId], callback);
}
exports.deleteCategory = deleteCategory;

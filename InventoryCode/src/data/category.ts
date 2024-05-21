import sqlite3 from 'sqlite3';
import { Category } from '../ts/types';

export const db = new sqlite3.Database('category.db');

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);
});

export function addCategory(name: string, callback: (err: any) => void): void {
    const query = `INSERT INTO categories (name) VALUES (?)`;
    db.run(query, [name], callback);
}

export function getCategories(callback: (err: any, categories: any) => void): void {
    const query = `SELECT * FROM categories`;
    db.all(query, [], (err, rows) => {
        if (err) {
            callback(err, []);
        } else {
            callback(null, rows as Category[]);
        }
    });
}

export function updateCategory(categoryId: number, newName: any, callback: (err: any) => void) {
    const query = 'UPDATE categories SET name = ? WHERE id = ?';
    db.run(query, [newName, categoryId], callback);
}

export function deleteCategory(categoryId: number, callback: (err: any) => void) {
    const query = 'DELETE FROM categories WHERE id = ?';
    db.run(query, [categoryId], callback);
}

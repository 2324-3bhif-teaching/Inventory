import sqlite3 from 'sqlite3';
import { ErrorCallback, GetCategoriesCallback, Category } from '../ts/types';

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

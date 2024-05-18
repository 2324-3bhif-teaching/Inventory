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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = exports.dbFileName = void 0;
const sqlite3_1 = require("sqlite3");
const sqlite_1 = require("sqlite");
exports.dbFileName = 'items.db';
class DB {
    static createDBConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, sqlite_1.open)({
                filename: `./${exports.dbFileName}`,
                driver: sqlite3_1.Database
            });
            yield db.run('PRAGMA foreign_keys = ON');
            yield DB.ensureTablesCreated(db);
            return db;
        });
    }
    static beginTransaction(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.run('begin transaction;');
        });
    }
    static commitTransaction(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.run('commit;');
        });
    }
    static rollbackTransaction(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.run('rollback;');
        });
    }
    static ensureTablesCreated(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection.run(`
        CREATE TABLE IF NOT EXISTS Item (
            ItemNumber INTEGER PRIMARY KEY AUTOINCREMENT,
            ItemName VARCHAR2(15) NOT NULL,
            Description VARCHAR2(100),
            Available VARCHAR2(1) DEFAULT 'Y',
            Damaged VARCHAR2(1) DEFAULT 'N',
            Category VARCHAR2(15),
            Picture BLOB
        )
    `);
        });
    }
}
exports.DB = DB;

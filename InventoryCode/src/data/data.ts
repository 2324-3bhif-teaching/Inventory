import { Database as Driver} from 'sqlite3';
import { open, Database } from 'sqlite';

export const dbFileName = 'items.db';

export class DB {
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${dbFileName}`,
            driver: Driver
        });
		await db.run('PRAGMA foreign_keys = ON');

        await DB.ensureTablesCreated(db);

        return db;
    }

    public static async beginTransaction(connection: Database): Promise<void> {
        await connection.run('begin transaction;');
    }

    public static async commitTransaction(connection: Database): Promise<void> {
        await connection.run('commit;');
    }

    public static async rollbackTransaction(connection: Database): Promise<void> {
        await connection.run('rollback;');
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        await connection.run(`
        CREATE TABLE IF NOT EXISTS Item (
            ItemNumber INTEGER PRIMARY KEY AUTOINCREMENT,
            ItemName VARCHAR2(15) NOT NULL,
            Description VARCHAR2(100),
            Available VARCHAR2(1) DEFAULT 'N',
            Damaged VARCHAR2(1) DEFAULT 'N',
            Category VARCHAR2(15),
            Picture BLOB
        )
    `);

    }
}


// import modules
import express from "express";
import { StatusCodes } from "http-status-codes";
import { DB } from "../data/items";

// create router
export const itemRouter = express.Router();

itemRouter.get('/', async (_, res) => {
    try {
        const db = await DB.createDBConnection();
        const allItems = await db.all('SELECT * FROM Item');
        await db.close();

        res.status(StatusCodes.OK).json(allItems);
    } catch (error) {
        console.error("error getting items:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
});

itemRouter.post('/', async (req, res) => {
    try {
        const db = await DB.createDBConnection();
        const {itemName, description, category, available, damaged, picture} = req.body;
        await db.run(`INSERT INTO Item (ItemName, Description, Category, Available, Damaged, Picture) VALUES (?, ?, ?, ?, ?, ?)`, [itemName, description, category, available, damaged, picture]);
        await db.close();

        res.status(StatusCodes.CREATED).send("Item added.");
    } catch (error) {
        console.error("error adding item:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
});


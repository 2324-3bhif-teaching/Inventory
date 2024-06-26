import express, {Request, Response} from "express";
import { StatusCodes } from "http-status-codes";
import { DB } from "../data/items";
import upload from "../public/scripts/multerConfig";
import {uploadRouter} from "./uploadRouter";

export const itemRouter = express.Router();

async function getItemById(itemId: number): Promise<ItemUpdatePayload> {
    const db = await DB.createDBConnection();
    const item = await db.get('SELECT * FROM Item WHERE ItemNumber = ?', [itemId]);
    await db.close();

    return item;
}

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

itemRouter.get('/:itemId', async (req, res) => {
    try{
        const id = parseInt(req.params.itemId, 10);
        if(isNaN(id) || id < 0 || id.toString().length === 0){
            res.status(StatusCodes.BAD_REQUEST).send("Invalid item id.");
            return;
        }
        const item = getItemById(id);

        if(!item){
            res.status(StatusCodes.NOT_FOUND).send("Item not found.");
            return;
        }
        res.status(StatusCodes.OK).json(item);

    }catch(error){
        console.error("error getting item by id:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
});

itemRouter.post('/', async (req, res) => {
    try {
        const db = await DB.createDBConnection();
        const { itemName, description, category, available, damaged, picture } = req.body;
        if(itemName == null){
            res.status(StatusCodes.BAD_REQUEST).send("Item name is required. "+ itemName + " " + description + " " + category + " " + available + " " + damaged + " " + picture);
            return;
        }
        const stmt = await db.run(`INSERT INTO Item (ItemName, Description, Category, Available, Damaged, Picture) VALUES (?, ?, ?, ?, ?, ?)`, [itemName, description, category, available, damaged, picture]);
        await db.close();

        const id = stmt.lastID;

        res.status(StatusCodes.CREATED).send({value: id});
    } catch (error) {
        console.log(req.body, error)
        console.error("error adding item:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
});

interface ItemUpdatePayload {
    itemName: string;
    description: string;
    category: string;
    available: 'Y' | 'N';
    damaged: 'Y' | 'N';
    picture?: string
}

itemRouter.put('/:itemId', async (req, res) => {
    try {
        const db = await DB.createDBConnection();
        const itemId = parseInt(req.params.itemId, 10);
        const { itemName, description, category, available, damaged, picture }: ItemUpdatePayload = req.body;

        if(isNaN(itemId) || itemId < 0 || itemId.toString().length === 0){
            res.status(StatusCodes.BAD_REQUEST).send("Invalid item id.");
            return;
        }

        await db.run(
            `UPDATE Item SET ItemName = ?, Description = ?, Category = ?, Available = ?, Damaged = ?, Picture = ? WHERE ItemNumber = ?`,
            [itemName, description, category, available, damaged, picture, itemId]
        );

        await db.close();
        res.status(StatusCodes.OK).send("Item updated successfully.");
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error updating item.");
    }
});

itemRouter.delete('/:itemId', async (req, res) => {
    try {
        const db = await DB.createDBConnection();
        const itemId = parseInt(req.params.itemId, 10);

        await db.run(`DELETE FROM Item WHERE ItemNumber = ?`, [itemId]);

        await db.close();
        res.status(StatusCodes.OK).send("Item deleted successfully.");
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error deleting item.");
    }
});

itemRouter.post('/:itemId/upload', upload.single('image'), async (req, res) => {
    const id = parseInt(req.params.itemId);
    const db = await DB.createDBConnection();

    if (!req.file || isNaN(id) || id < 0 || id.toString().length === 0) {
        return res.status(400).send('Bitte eine Datei hochladen!');
    }

    const imagePath = `images/${req.file.filename}`;

    await db.run(
        `UPDATE Item
         SET Picture = ?
         WHERE ItemNumber = ?`,
        [imagePath, id]
    );

    await db.close();

    res.send({ value: imagePath });
});

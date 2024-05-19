// import modules
import express from "express";
import { StatusCodes } from "http-status-codes";
import { DB } from "../data/items";

// create router
const itemRouter = express.Router();

interface ItemUpdatePayload {
    itemName: string;
    description: string;
    category: string;
    available: string;
    damaged: string;
    picture: string;
}

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
        const {itemName, description, category, available, damaged, picture} = req.body;
        await db.run(`INSERT INTO Item (ItemName, Description, Category, Available, Damaged, Picture) VALUES (?, ?, ?, ?, ?, ?)`, [itemName, description, category, available, damaged, picture]);

        // Log the request body to debug the issue
        console.log('Request Body:', req.body);

        // Validate the presence of itemName
        if (!itemName) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Item name is required' });
        }

        // Insert the item into the database
        const result = await db.run(
            `INSERT INTO Item (ItemName, Description, Category, Available, Damaged, Picture) VALUES (?, ?, ?, ?, ?, ?)`,
            [itemName, description, category, available, damaged, picture]
        );

        await db.close();

        // Send back the ID of the newly created item
        res.status(StatusCodes.CREATED).json({ itemId: result.lastID, message: 'Item added.' });
    } catch (error) {
        console.error("error adding item:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error.");
    }
});

export default itemRouter;

itemRouter.put('/:itemId', async (req, res) => {
    try {
        const db = await DB.createDBConnection();
        const id = parseInt(req.params.itemId, 10);
        if(isNaN(id) || id < 0 || id.toString().length === 0){
            res.status(StatusCodes.BAD_REQUEST).send("Invalid item id.");
            return;
        }
        const { itemName, description, category, available, damaged, picture }: ItemUpdatePayload = req.body;

        await db.run(
            `UPDATE Item SET ItemName = ?, Description = ?, Category = ?, Available = ?, Damaged = ?, Picture = ? WHERE ItemNumber = ?`,
            [itemName, description, category, available, damaged, picture, id]
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
        const id = parseInt(req.params.itemId, 10) ?? 0;
        if(isNaN(id) || id < 0 || id === 0){
            res.status(StatusCodes.BAD_REQUEST).send("Invalid item id.");
            return;
        }
        await db.run(`DELETE FROM Item WHERE ItemNumber = ?`, [id]);

        await db.close();
        res.status(StatusCodes.OK).send("Item deleted successfully.");
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error deleting item.");
    }
});


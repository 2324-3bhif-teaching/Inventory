// import modules
import express from "express";
import { DB } from "../data/data";

// create router
export const itemRouter = express.Router();

// get all items
itemRouter.get('/', async (req, res) => {
    const db = await DB.createDBConnection();
    const items = await db.all('SELECT * FROM Item');
    res.json(items);
});

// get item by item number
itemRouter.get('/:itemNumber', async (req, res) => {
    const db = await DB.createDBConnection();
    const item = await db.get('SELECT * FROM Item WHERE ItemNumber = ?', req.params.itemNumber);
    res.json(item);
});

// create item
itemRouter.post('/', async (req, res) => {
    const db = await DB.createDBConnection();
    await db.run('INSERT INTO Item (ItemNumber, ItemName, Description, Available, Damaged, Category, Picture) VALUES (?, ?, ?, ?, ?, ?, ?)',
        req.body.ItemNumber,
        req.body.ItemName,
        req.body.Description,
        req.body.Available,
        req.body.Damaged,
        req.body.Category,
        req.body.Picture
    );
    res.sendStatus(201);
});

// update item
itemRouter.put('/:itemNumber', async (req, res) => {
    const db = await DB.createDBConnection();
    await db.run('UPDATE Item SET ItemName = ?, Description = ?, Available = ?, Damaged = ?, Category = ?, Picture = ? WHERE ItemNumber = ?',
        req.body.ItemName,
        req.body.Description,
        req.body.Available,
        req.body.Damaged,
        req.body.Category,
        req.body.Picture,
        req.params.itemNumber
    );
    res.sendStatus(204);
});

// delete item
itemRouter.delete('/:itemNumber', async (req, res) => {
    const db = await DB.createDBConnection();
    await db.run('DELETE FROM Item WHERE ItemNumber = ?', req.params.itemNumber);
    res.sendStatus(204);
});



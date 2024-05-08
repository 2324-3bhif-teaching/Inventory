import express from 'express';
import { addCategory, getCategories } from '../data/category';
import { Request, Response } from '../ts/types';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    getCategories((err, categories) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching categories' });
        } else {
            res.json(categories);
        }
    });
});

router.post('/', (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ message: 'Category name is required' });
        return;
    }

    addCategory(name, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error adding category' });
        } else {
            res.status(201).json({ message: 'Category added' });
        }
    });
});

export default router;
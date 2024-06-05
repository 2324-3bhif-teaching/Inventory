import express from 'express';
import { addCategory, getCategories, deleteCategory, updateCategory } from '../data/category';
import { Request, Response } from '../data/types';

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

router.put('/:id', (req, res) => {
    const categoryId = parseInt(req.params.id, 10);
    const newCategoryName = req.body.name;

    if (isNaN(categoryId) || !newCategoryName) {
        return res.status(400).json({ message: 'Ungültige Kategorie-ID oder kein Name angegeben' });
    }

    updateCategory(categoryId, newCategoryName, (err: any) => {
        if (err) {
            res.status(500).json({ message: 'Fehler beim Aktualisieren der Kategorie' });
        } else {
            res.status(200).json({ message: 'Kategorie erfolgreich aktualisiert' });
        }
    });
});

router.delete('/:id', (req, res) => {
    const categoryId = parseInt(req.params.id, 10);

    if (isNaN(categoryId)) {
        return res.status(400).json({ message: 'Ungültige Kategorie-ID' });
    }

    deleteCategory(categoryId, (err: any) => {
        if (err) {
            res.status(500).json({ message: 'Fehler beim Löschen der Kategorie' });
        } else {
            res.status(200).json({ message: 'Kategorie erfolgreich gelöscht' });
        }
    });
});

export default router;
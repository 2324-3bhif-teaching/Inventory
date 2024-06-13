import express from "express";
import upload from "../public/scripts/multerConfig";
import {StatusCodes} from "http-status-codes";

export const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Bitte eine Datei hochladen!');
    }

    res.send({value:`/images/${req.file.filename}`});
});
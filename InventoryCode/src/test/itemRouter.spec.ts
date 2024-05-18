import request from 'supertest';
import express from 'express';
import {itemRouter} from '../Router/ItemRouter';
import * as categoryModule from '../data/category';

const app = express();
app.use(express.json());
app.use(itemRouter);


describe('Confirmation account routes', () => {
    it('should return all categories', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    })
    it('should add a category', async () => {
        const res = await request(app).post('/').send({ name: 'test' });
        expect(res.status).toBe(201);
    })
    it('should update a category', async () => {
        const res = await request(app).put('/1').send({ name: 'test' });
        expect(res.status).toBe(200);
    })
    it('should delete a category', async () => {
        const res = await request(app).delete('/1');
        expect(res.status).toBe(200);
    })
    it('should return an error if the category name is missing', async () => {
        const res = await request(app).post('/').send({});
        expect(res.status).toBe(400);
    })
    it('should return an error if the category id is missing', async () => {
        const res = await request(app).put('/').send({ name: 'test' });
        expect(res.status).toBe(400);
    })
    it('should return an error if the category id is invalid', async () => {
        const res = await request(app).put('/test').send({ name: 'test' });
        expect(res.status).toBe(400);
    })
    it('should return an error if the category name is missing', async () => {
        const res = await request(app).put('/1').send({});
        expect(res.status).toBe(400);
    })
    it('should return an error if the category id is missing', async () => {
        const res = await request(app).delete('/').send({ name: 'test' });
        expect(res.status).toBe(400);
    })

});
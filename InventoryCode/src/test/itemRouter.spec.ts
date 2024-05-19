import request from 'supertest';
import express from 'express';
import * as categoryModule from '../data/category';
import itemRouter from '../Router/ItemRouter';


const app = express();
app.use(express.json());
app.use(itemRouter);




describe('Confirmation account routes', () => {
    it('should return all categories', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    })
    it('should get an item by id', async () => {
        const res = await request(app).get('/1');
        expect(res.status).toBe(200);
    });
    it('should update an item', async () => {
        const res = await request(app).put('/1').send({ ItemName: 'test', Description: 'test', Category: 'test', Available: 'Y', Damaged: 'N', Picture: 'test'});
        expect(res.status).toBe(200);
    })
    it('should add an item', async () => {
        const res = await request(app).post('/').send({ ItemName: 'test', Description: 'test', Category: 'test', Available: 'Y', Damaged: 'N', Picture: 'test' });
        expect(res.status).toBe(201);
    })

    it('should delete an item', async () => {
        const res = await request(app).delete('/1');
        expect(res.status).toBe(200);
    })
    it('should return an error if the item name is missing', async () => {
        const res = await request(app).post('/').send({});
        expect(res.status).toBe(400);
    })
    it('should return an error if item id is missing', async () => {
        const res = await request(app).put('/').send({ name: 'test' });
        expect(res.status).toBe(404);
    })
    it('should return an error if the item id is invalid', async () => {
        const res = await request(app).put('/test').send({ name: 'test' });
        expect(res.status).toBe(400);
    })
    it('should return an error if the category id is missing', async () => {
        const res = await request(app).delete('/').send({ name: 'test' });
        expect(res.status).toBe(404);
    })

});
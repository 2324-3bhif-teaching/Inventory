import request from 'supertest';
import express from 'express';
import router from '../Router/categoryRouter';
import * as categoryModule from '../data/category';

const app = express();
app.use(express.json());
app.use(router);


describe('Confirmation account routes', () => {
    it('should return all categories', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    })
    it('should add a category', async () => {
        const res = await request(app).post('/').send({ name: 'test' });
        expect(res.status).toBe(201);
    })
});
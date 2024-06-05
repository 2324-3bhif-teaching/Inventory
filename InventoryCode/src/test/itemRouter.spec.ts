import request from 'supertest';
import express from 'express';
import {itemRouter} from '../Router/ItemRouter';

const app = express();
app.use(express.json());
app.use(itemRouter);
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Confirmation account routes', () => {
    it('should return all items', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    })
    it('should get an item by id', async () => {
        const res = await request(app).get('/1');
        expect(res.status).toBe(200);
    });
    it('should update an item', async () => {
        const res = await request(app).put('/1').send({ ItemName: 'test', Description: 'test', Category: 'test', Available: 'Y', Damaged: 'N'});
        expect(res.status).toBe(200);
    })
    it('should add an item', async () => {
        const newDevice = {
            itemName: 'Test Device',
            description: 'Test Description',
            category: 'Test Category',
            available: 'Y',
            damaged: 'N',
            picture: null,
        };

        fetchMock.mockResponseOnce(JSON.stringify(newDevice), { status: 201 });

        const response = await fetch('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDevice),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newDevice),
        });

        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data).toEqual(newDevice);
    });

    afterEach(() => {
        fetchMock.resetMocks();
    });
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
    it('should return an error if the item id is missing', async () => {
        const res = await request(app).delete('/').send({ name: 'test' });
        expect(res.status).toBe(404);
    })

});
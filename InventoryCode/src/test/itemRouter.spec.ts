import request from 'supertest';
import {app} from '../app';
import { StatusCodes } from 'http-status-codes';

const mockItem = {
    itemName: 'Test Item',
    description: 'Test Description',
    category: 'Test Category',
    available: 'Y',
    damaged: 'N',
    picture: 'test.jpg'
};

let itemId = '';

describe('Tests for Item API', () => {
    it('should create a new item', async () => {
        const response = await request(app)
            .post('/api/items')
            .send(mockItem)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.CREATED);

        expect(response.body.value).toBeDefined();
        itemId = response.body.value;
    });

    it('should fetch a specific item by ID', async () => {
        const response = await request(app)
            .get(`/api/items/${itemId}`)
            .expect('Content-Type', /json/)
            .expect(StatusCodes.OK);

        expect(response.body).toMatchObject(mockItem);
    });

    it('should update an existing item', async () => {
        const updatedItem = { ...mockItem, description: 'Updated Description' };

        const response = await request(app)
            .put(`/api/items/${itemId}`)
            .send(updatedItem)
            .expect(StatusCodes.OK);

        expect(response.text).toBe('Item updated successfully.');
    });

    it('should delete an existing item', async () => {
        const response = await request(app)
            .delete(`/api/items/${itemId}`)
            .expect(StatusCodes.OK);

        expect(response.text).toBe('Item deleted successfully.');
    });
});
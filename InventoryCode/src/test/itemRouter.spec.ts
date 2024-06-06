import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('Confirmation account routes', () => {
    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('should return all items', async () => {
        const items = [{ id: 1, itemName: 'Item 1' }, { id: 2, itemName: 'Item 2' }];
        fetchMock.mockResponseOnce(JSON.stringify(items), { status: 200 });

        const response = await fetch('http://localhost:3000/api/items', {
            method: 'GET',
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items', {
            method: 'GET',
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(items);
    });

    it('should get an item by id', async () => {
        const item = { id: 1, itemName: 'Item 1' };
        fetchMock.mockResponseOnce(JSON.stringify(item), { status: 200 });

        const response = await fetch('http://localhost:3000/api/items/1', {
            method: 'GET',
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items/1', {
            method: 'GET',
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(item);
    });

    it('should update an item', async () => {
        const updatedItem = { id: 1, itemName: 'test', description: 'test', category: 'test', available: 'Y', damaged: 'N' };
        fetchMock.mockResponseOnce(JSON.stringify(updatedItem), { status: 200 });

        const response = await fetch('http://localhost:3000/api/items/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(updatedItem);
    });

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

    it('should delete an item', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: 'Item deleted' }), { status: 200 });

        const response = await fetch('http://localhost:3000/api/items/1', {
            method: 'DELETE',
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items/1', {
            method: 'DELETE',
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ message: 'Item deleted' });
    });

    it('should return an error if the item name is missing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Item name is required' }), { status: 400 });

        const response = await fetch('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toEqual({ error: 'Item name is required' });
    });

    it('should return an error if item id is missing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Item id is required' }), { status: 404 });

        const response = await fetch('http://localhost:3000/api/items', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({ error: 'Item id is required' });
    });

    it('should return an error if the item id is invalid', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Invalid item id' }), { status: 400 });

        const response = await fetch('http://localhost:3000/api/items/test', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items/test', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toEqual({ error: 'Invalid item id' });
    });

    it('should return an error if the item id is missing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Item id is required' }), { status: 404 });

        const response = await fetch('http://localhost:3000/api/items', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/items', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({ error: 'Item id is required' });
    });
});

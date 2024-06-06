import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('Confirmation account routes', () => {
    afterEach(() => {
        fetchMock.resetMocks();
    });

    it('should return all categories', async () => {
        const categories = [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
        fetchMock.mockResponseOnce(JSON.stringify(categories), { status: 200 });

        const response = await fetch('http://localhost:3000/api/categories', {
            method: 'GET',
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories', {
            method: 'GET',
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(categories);
    });

    it('should add a category', async () => {
        const newCategory = {
            name: 'Test Category'
        };

        fetchMock.mockResponseOnce(JSON.stringify(newCategory), { status: 201 });

        const response = await fetch('http://localhost:3000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        });

        expect(response.status).toBe(201);
        const data = await response.json();
        expect(data).toEqual(newCategory);
    });

    it('should update a category', async () => {
        const updatedCategory = { id: 1, name: 'Updated Category' };
        fetchMock.mockResponseOnce(JSON.stringify(updatedCategory), { status: 200 });

        const response = await fetch('http://localhost:3000/api/categories/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCategory),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCategory),
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual(updatedCategory);
    });

    it('should delete a category', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ message: 'Category deleted' }), { status: 200 });

        const response = await fetch('http://localhost:3000/api/categories/1', {
            method: 'DELETE',
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories/1', {
            method: 'DELETE',
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ message: 'Category deleted' });
    });

    it('should return an error if the category name is missing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Category name is required' }), { status: 400 });

        const response = await fetch('http://localhost:3000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toEqual({ error: 'Category name is required' });
    });

    it('should return an error if the category id is missing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Category id is required' }), { status: 404 });

        const response = await fetch('http://localhost:3000/api/categories', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(response.status).toBe(404);
        const data = await response.json();
        expect(data).toEqual({ error: 'Category id is required' });
    });

    it('should return an error if the category id is invalid', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Invalid category id' }), { status: 400 });

        const response = await fetch('http://localhost:3000/api/categories/test', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories/test', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'test' }),
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toEqual({ error: 'Invalid category id' });
    });

    it('should return an error if the category name is missing when updating', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ error: 'Category name is required' }), { status: 400 });

        const response = await fetch('http://localhost:3000/api/categories/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/categories/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        expect(response.status).toBe(400);
        const data = await response.json();
        expect(data).toEqual({ error: 'Category name is required' });
    });
});

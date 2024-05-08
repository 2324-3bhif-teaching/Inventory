import express from 'express';

export interface Category {
    id: number;
    name: string;
}

export type ErrorCallback = (err: Error | null) => void;

export type GetCategoriesCallback = (err: Error | null, categories: Category[]) => void;

export type Request = express.Request;

export type Response = express.Response;

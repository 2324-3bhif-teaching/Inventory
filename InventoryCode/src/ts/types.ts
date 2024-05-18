import express from 'express';

export interface Category {
    id: number;
    name: string;
}

export interface Item {
    ItemNumber: number;
    ItemName: string;
    Description: string;
    Category: string;
    Available: string;
    Damaged: string;
}

export type ErrorCallback = (err: Error | null) => void;

export type GetCategoriesCallback = (err: Error | null, categories: Category[]) => void;

export type Request = express.Request;

export type Response = express.Response;

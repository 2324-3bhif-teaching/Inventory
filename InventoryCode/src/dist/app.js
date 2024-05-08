"use strict";
// for installing all dependencies once run 'npm install'
// for starting the server run 'npm start'
// for starting the server in watchmode run 'npm run server-dev'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import modules
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ItemRouter_1 = require("./Router/ItemRouter");
const categoryRouter_1 = __importDefault(require("./Router/categoryRouter"));
// create express application
const app = (0, express_1.default)();
// mount middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("./index.html"));
// mount router(s)
app.use("/api/items", ItemRouter_1.itemRouter);
app.use('/api/categories', categoryRouter_1.default);
// start http server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

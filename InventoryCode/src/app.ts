// for installing all dependencies once run 'npm install'
// for starting the server run 'npm start'
// for starting the server in watchmode run 'npm run server-dev'

// import modules
import express from "express";
import upload from "./public/scripts/multerConfig";
import cors from "cors";
import {itemRouter} from "./Router/ItemRouter";
import categoryRouter from './Router/categoryRouter';
import {uploadRouter} from "./Router/uploadRouter";
import path from "node:path";
import session from 'express-session';
import Keycloak from 'keycloak-connect';
// create express application
export const app = express();

const memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'u4ZhRf6B@@FUmLsFmpeGSdQKmfZ@YVBYqc@zQh9Re2y3^VzLV5rST$9EbPW2&%X!9dLz5piKHBmjcMPU4hqZzm3ud6Y7h*aMzNA^^@BDn2!BC7a', //TODO: change secret and save in .env
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware({
    logout: '/logout'
}));

app.get('/logout', keycloak.protect(), (req: any, res) => {
    req.kauth.logout();
    res.redirect('http://localhost:3000/index.html');
});


// mount middleware
app.use(cors());
app.use(express.json());
app.use(express.static("./public/"));

// mount router(s)
app.use("/api/items", itemRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/upload', uploadRouter);
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// start http server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

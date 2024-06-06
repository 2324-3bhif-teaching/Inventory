// for installing all dependencies once run 'npm install'
// for starting the server run 'npm start'
// for starting the server in watchmode run 'npm run server-dev'

// import modules
import express from "express";
import cors from "cors";
import  {itemRouter} from "./Router/ItemRouter";
import categoryRouter from './Router/categoryRouter';

// create express application
export const app = express();

// mount middleware
app.use(cors());
app.use(express.json());
app.use(express.static("../"));

// mount router(s)
app.use("/api/items", itemRouter);
app.use('/api/categories', categoryRouter);

// start http server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});


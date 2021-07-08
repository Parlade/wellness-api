import express from 'express';
import cors from 'cors';

require("./config/database")

import { invoiceRoutes } from "./routes"

const app = express();

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use('/invoice', invoiceRoutes)


app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
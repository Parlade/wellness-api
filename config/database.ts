import mongoose from "mongoose";
const MONGODB_URI = "mongodb://localhost/invoices";

mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((db) => console.log("Database is connected"))
    .catch((err) => console.log(err));

module.exports = mongoose;
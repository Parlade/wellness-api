import mongoose from 'mongoose';
const { Schema } = mongoose;

const invoiceSchema = new Schema({
    date: { type: String },
    hour: { type: String },
    consumption: { type: String },
    price: { type: String },
    costPerHour: { type: String },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export { Invoice }
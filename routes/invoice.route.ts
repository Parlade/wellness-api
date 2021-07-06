import { Router } from 'express';

import { uploadInvoices, getAllInvoices, getInvoiceById, updateInvoiceById, deleteInvoiceById } from "../controllers"

const invoiceRoutes = Router();

invoiceRoutes.post('/upload', uploadInvoices);
invoiceRoutes.get('/', getAllInvoices);
invoiceRoutes.get("/:id", getInvoiceById);
invoiceRoutes.put("/:id", updateInvoiceById);
invoiceRoutes.delete("/:id", deleteInvoiceById);

export { invoiceRoutes }
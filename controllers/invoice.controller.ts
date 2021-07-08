import { Request, Response } from "express"
import path from 'path';
import parse from 'csv-parse';
import fs from 'fs';
import { Invoice } from "../models"
import { IInvoice } from "../interfaces"



//   La manera correcta de hacerlo sería subiendo los ficheros en la peticion
//   POST mediante form-data, de esta manera no tenemos que almacenarlos localmente
//   y así se subirían dinámicamente
const uploadInvoices = async (req: Request, res: Response) => {
    const consumo2019_01 = path.join(process.cwd() + '/resources/consumo-2019-01.csv');
    const consumo2018_12 = path.join(process.cwd() + '/resources/consumo-2018-12.csv');
    const consumo2019_01_BBBB = path.join(process.cwd() + '/resources/consumo-2019-01_BBBBB.csv');
    const consumo2019_02 = path.join(process.cwd() + '/resources/consumo-2019-02.csv');

    await uploadCSV(consumo2019_01);
    await uploadCSV(consumo2018_12);
    await uploadCSV(consumo2019_01_BBBB);
    await uploadCSV(consumo2019_02);

    res.send("Well done");
}


const uploadCSV = async (csvPath: string) => {
    var csvData: any = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvPath)
        .pipe(parse({
          delimiter: ',',
          skip_empty_lines: true,
          trim: true,
          columns: true
        })) 
        .on('data', function(csvrow: any) {
            // estoy usando un mapper para convertir un objeto en otro 
            const invoice = new Invoice({
                date: csvrow['Fecha'],
                hour: csvrow['Hora'],
                consumption: csvrow['Consumo (Wh)'],
                price: csvrow['Precio (€/kWh)'],
                costPerHour: csvrow['Coste por hora (€)']
            })
            invoice.save();
            csvData.push(csvrow);        
        })
        .on('end',function() {
          //do something with csvData
          console.log(csvData);
          resolve("ok")
        });
    })
    
}

const getAllInvoices = (req: Request, res: Response) => {
    Invoice
      .find()
      .then((data: IInvoice) => {
        res.send(data);
      })
      .catch((err: Error) => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving invoices.",
        });
      });
  };
  
const getInvoiceById = async (req: Request, res: Response) => {
    const queryInvoice = await Invoice.findById(req.params.id);
    res.status(200).send(
        queryInvoice,
    );
};

const createInvoice = async (req: Request, res: Response) => {
  const { date, hour, consumption, price, costPerHour } = req.body;
  const invoice = await Invoice.create({ date, hour, consumption, price, costPerHour }, {new: true});
  res.status(200).send(invoice);
};

const updateInvoiceById = async (req: Request, res: Response) => {
    // desestructurado para no tener que repetir
    const { date, hour, consumption, price, costPerHour } = req.body;
    const invoiceUpdated = await Invoice.findOneAndUpdate({_id: req.params.id}, { date, hour, consumption, price, costPerHour }, {new: true});
    res.status(200).send(invoiceUpdated);
};
  
const deleteInvoiceById = async (req: Request, res: Response) => {
    await Invoice.findOneAndDelete({_id: req.params.id});
    res.status(200).send({
        message: "Invoice deleted: " + req.params.id,
    });
};
  


export { uploadInvoices, getAllInvoices, getInvoiceById, updateInvoiceById, deleteInvoiceById, createInvoice }

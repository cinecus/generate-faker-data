import { Request, Response, NextFunction } from 'express';
import { AppRequest } from '../../types';
import { failed, success } from "../../utils";
import excel from 'exceljs';

export async function toJsonFile(req: AppRequest, res: Response, next: NextFunction) {
    try {
        if (req.body.format != 'json') {
            next()
            return
        }
        const jsonString = JSON.stringify(req.data);
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });

        // Convert the Blob to a Buffer
        const buffer = Buffer.from(await jsonBlob.arrayBuffer());
        // Send the JSON Blob as a response
        res.setHeader('Content-Disposition', `attachment; filename=${req.entity}.json`);
        res.setHeader('Content-Type', 'application/json');
        
        return res.send(buffer);
    } catch (error) {
        console.log(error);
        return failed(res, null, error)
    }
}

export async function toCsvFile(req: AppRequest, res: Response, next: NextFunction) {
    try {
        if (req.body.format != 'csv') {
            next()
            return
        }

        // Set response headers for CSV file download
        res.setHeader('Content-Disposition', `attachment; filename=${req.entity}.csv`);
        res.setHeader('Content-Type', 'text/csv');

        // Create a CSV string
        let csv = req.columns?.join(',') + '\n'
        for (const item of req.data as any[]) {
            const row = req.columns?.reduce((prev, cur) => prev + `${item[cur]},`, ``)
            csv += row + '\n'
        }

        // Convert the CSV string to a Blob
        const csvBlob = new Blob([csv], { type: 'text/csv' });

        // Convert the Blob to a Buffer
        const buffer = Buffer.from(await csvBlob.arrayBuffer());
        // Send the Blob as the response
        res.end(buffer);
    } catch (error) {
        console.log(error);
        return failed(res, null, error)
    }
}

export async function toXlsxFile(req: AppRequest, res: Response, next: NextFunction) {
    try {
        if (req.body.format != 'xlsx') {
            return
        }
        // Create an Excel workbook and add a worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        worksheet.columns = req.columns?.map((ent: string) => ({ header: ent, key: ent })) || []

        // Add data to the worksheet
        worksheet.addRows(req.data as any[]);


        // Set the response headers for downloading the Excel file
        res.setHeader('Content-Disposition', `attachment; filename=${req.entity}.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Save the Excel file to a Buffer
        const fileContent = await workbook.xlsx.writeBuffer();

        // Send the Buffer as the response

        return res.end(fileContent);
        // return success(res, "get data file successfully", null)
    } catch (error) {
        console.log(error);
        return failed(res, null, error)
    }
}
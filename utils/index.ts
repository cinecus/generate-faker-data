import { v4 as uuidv4 } from 'uuid';
import { Response } from "express";
import nodemailer from 'nodemailer'
//UUID
export function generateUUID(): string {
    return uuidv4();
}

export function success(res: Response, message: string = 'api successfully', data: any): Response {
    return res.status(200).json({
        status: true,
        message,
        data
    })
}

export function failed(res: Response, message: string | null = 'found issue', error: any): Response {
    if (error instanceof Error) {
        return res.status(400).json({
            status: false,
            message,
            error: error.message
        })
    } else {
        return res.status(400).json({
            status: false,
            message: "found issue",
            error: 'An unknown error occurred'
        })
    }
}

export const sendMail = (mailOptions: any) => {
    const transporter = nodemailer.createTransport({
        host: 'live.smtp.mailtrap.io',
        port: 587,
        auth: {
            user: 'api',
            pass: 'bc610e4ea79275140ac2ccb2d6ccea29'
        }
    });
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            } else {
                resolve(info.response)
            }
        });
    })
}

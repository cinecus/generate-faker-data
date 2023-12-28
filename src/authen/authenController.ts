import { Request, Response } from "express";
import { failed, sendMail, success } from "../../utils";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { AppRequest } from "../../types";
import authenModel from "./authenModel";
import { MailtrapClient } from "mailtrap"
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import sgMail from '@sendgrid/mail'
import { Authen } from "./authenMongooseModel";
import requestCreditModel from "../request-quota/requestCreditModel";
class AuthenController {
    async signup(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password, } = req.body

            const find_email = await authenModel.findUserByEmail(email)
            if (find_email) {
                return failed(res, "This Email is Already use!!", Error("This Email is Already use!!"))
            } else {
                const hash_password = await bcrypt.hash(password, 10);

                const user = await authenModel.createUser({ firstName, lastName, email, password: hash_password, provider: 'email' } as Authen)
                await requestCreditModel.createCredit({ userId: user.id, credit: 100 })
                const token = jwt.sign({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, provider: user.provider }, process.env.SECRET_KEY as string, { expiresIn: '1h' });

                res.cookie('accessToken', token, { httpOnly: true })
            }
            return success(res, 'signup Successfully', null)
        } catch (error) {
            console.log(error);
            return failed(res, null, error)
        }
    }

    async signin(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const user = await authenModel.findUserByEmail(email)

            if (user) {
                const match = await bcrypt.compare(password, user.password as string);
                if (match) {
                    const token = jwt.sign({ id: user.id!, email: user.email, firstName: user.firstName, lastName: user.lastName, provider: user.provider }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
                    res.cookie('accessToken', token, { httpOnly: true, maxAge: 24 * 3600 })
                } else {
                    return failed(res, "Email or Password Incorrect!!", Error("Email or Password Incorrect!!"))
                }
            } else {
                return failed(res, "Email or Password Incorrect!!", Error("Email or Password Incorrect!!"))
            }

            return success(res, 'signin Successfully', null)
        } catch (error) {
            return failed(res, null, error)
        }
    }

    async signout(req: Request, res: Response) {
        try {
            res.clearCookie('accessToken')
            return success(res, 'signout Successfully', null)
        } catch (error) {
            return failed(res, null, error)
        }
    }

    async me(req: AppRequest, res: Response) {
        try {

            console.log(req.user?.firstName);
            return success(res, 'get me Successfully', {
                firstName: req.user?.firstName,
                lastName: req.user?.lastName,
                email: req.user?.email,
                provider: req.user?.provider
            })
        } catch (error) {
            return failed(res, null, error)
        }
    }

    async sender(req: AppRequest, res: Response) {
        try {

            const sgMail = require('@sendgrid/mail')
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: 'chananon.seen@gmail.com', // Change to your recipient
                from: 'chananon.cine@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            }
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error: any) => {
                    console.error(error)
                })
            return success(res, 'get me Successfully', {
                firstName: req.user?.firstName,
                lastName: req.user?.lastName,
                email: req.user?.email,
            })
        } catch (error) {
            console.log(error);
            return failed(res, null, error)
        }
    }

    async githubRedirect(req: AppRequest, res: Response) {

        const findUser = await authenModel.findUserByNodeId(req.user?.nodeId as string, req.user?.provider as string)
        if (findUser) {
            const token = jwt.sign({ id: findUser.id!, firstName: findUser.firstName, lastName: findUser.lastName, provider: findUser.provider }, process.env.SECRET_KEY as string, { expiresIn: '1h' });

            res.cookie('accessToken', token, { httpOnly: true })
        } else {
            const createUser = await authenModel.createUser(req.user as Authen)
            await requestCreditModel.createCredit({ userId: createUser.id, credit: 100 })
            const token = jwt.sign({ id: createUser.id!, firstName: createUser.firstName, lastName: createUser.lastName, provider: createUser.provider }, process.env.SECRET_KEY as string, { expiresIn: '1h' });
            res.cookie('accessToken', token, { httpOnly: true })
        }

        return res.redirect('http://localhost:3000');
    }
}


export default new AuthenController()


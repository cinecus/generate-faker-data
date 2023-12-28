import { Request, Response, NextFunction } from 'express';
import { AppRequest } from '../../types';
import requestCreditModel from '../request-quota/requestCreditModel';

export const checkCredit = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const credit = await requestCreditModel.findCreditUser(req.user?.id as string)

        if (!credit) {
            return res.status(401).json({ message: 'not found credit' });
        } else {
            if (credit.credit <= 0) {
                return res.status(401).json({ message: 'not available credit' });
            }
        }

        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}


export const consumeCredit = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const credit = await requestCreditModel.findCreditUser(req.user?.id as string)
        if (credit) {
            credit.credit -= 1
            credit.save()
        }
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}


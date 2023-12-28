// src/middleware/jwtMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import { AppRequest } from '../../types';

dotenv.config({ path: '.env.develop' });

const secretKey = process.env.SECRET_KEY

export const verifyJwt = async (req: AppRequest, res: Response, next: NextFunction) => {
   // const token = req.headers.authorization?.split('Bearer ')[1];
    const token = req.cookies.accessToken
    console.log(token);
    //console.log(tk);
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey as string, (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded; // Attach the decoded user information to the request object
        next();
    });
};

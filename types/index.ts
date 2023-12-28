import { Request, Response } from "express";

export interface AppRequest extends Request {
    user?: {
        id?: string
        email?: string
        firstName?: string
        lastName?: string
        nodeId?: string
        provider?: string
    },
    data?: any[],
    entity?: string,
    columns?: any[]
}

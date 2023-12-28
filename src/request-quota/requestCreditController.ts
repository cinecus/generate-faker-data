import requestCreditModel from "./requestCreditModel"
import { NextFunction, Request, Response } from "express";
import { AppRequest } from "../../types";
import { failed, success } from "../../utils";

class RequestCreditController {
    async findCreditUser(req: AppRequest, res: Response, next: NextFunction) {
        try {
            const credit = requestCreditModel.findCreditUser(req.user?.id as string)

            return success(res, "get categories credit", credit)
        } catch (error) {
            return failed(res, null, error)
        }
    }
}

export default new RequestCreditController()
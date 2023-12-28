import excel from 'exceljs';
import { generateCategories, generateCustomers, generateProducts ,generateMockups} from "./generateDataFn";
import { NextFunction, Request, Response } from "express";
import { failed, success } from "../../utils";
import { AppRequest } from "../../types";

class GenerateDataController {
    async getCategories(req: AppRequest, res: Response, next: NextFunction) {
        try {
            const { numbers, registerCode, customRandom, customField, format, seed } = req.body
            const categories = generateCategories(numbers, registerCode, customRandom, customField, seed)

            if (['xlsx', 'csv', 'json'].includes(format)) {
                req.data = categories
                req.columns = Object.keys(categories[0])
                req.entity = 'categories'
                next()
                return
            }
            return success(res, "get categories successfully", categories)
        } catch (error) {
            return failed(res, null, error)
        }
    }

    async getCustomers(req: AppRequest, res: Response, next: NextFunction) {
        try {
            const { numbers, registerCode, customRandom, customField, format, seed } = req.body

            const customers = generateCustomers(numbers, registerCode, customRandom, customField, seed)

            if (['xlsx', 'csv', 'json'].includes(format)) {
                req.data = customers
                req.columns = Object.keys(customers[0])
                req.entity = 'customers'
                next()
                return
            }
            return success(res, "get customers successfully", customers)
        } catch (error) {
            return failed(res, null, error)
        }
    }

    async getProducts(req: AppRequest, res: Response, next: NextFunction) {
        try {
            const { numbers, registerCode, customRandom, customField, format, seed } = req.body

            const products = generateProducts(numbers, registerCode, customRandom, customField, seed)

            if (['xlsx', 'csv', 'json'].includes(format)) {
                req.data = products
                req.columns = Object.keys(products[0])
                req.entity = 'products'
                next()
                return
            }
            return success(res, "get products successfully", products)
        } catch (error) {
            return failed(res, null, error)
        }
    }

    async getMockups(req: AppRequest, res: Response, next: NextFunction) {
        try {
            const { numbers, registerCode, customRandom, customField, format, seed } = req.body

            const products = generateMockups(numbers, registerCode, customRandom, customField, seed)

            if (['xlsx', 'csv', 'json'].includes(format)) {
                req.data = products
                req.columns = Object.keys(products[0])
                req.entity = 'products'
                next()
                return
            }
            return success(res, "get products successfully", products)
        } catch (error) {
            return failed(res, null, error)
        }
    }
}

export default new GenerateDataController()
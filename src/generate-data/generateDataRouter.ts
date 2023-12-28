import express from 'express';
import generateDataController from './generateDataController';
import { consumeCredit } from '../middleware/requestCreditMiddleware';

const generateDataRouter = express.Router()

generateDataRouter.post("/categories", generateDataController.getCategories)
generateDataRouter.post("/products", generateDataController.getProducts)
generateDataRouter.post("/customers", generateDataController.getCustomers)
generateDataRouter.post("/mockups", generateDataController.getMockups)

export default generateDataRouter
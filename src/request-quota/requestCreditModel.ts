import mongoose from 'mongoose';
import { RequestCreditMongooseModel, RequestCredit } from './requestCreditMongooseModel';

class RequestCreditModel {
    async createCredit(reqCredit: RequestCredit) {
        try {

            const new_credit = await RequestCreditMongooseModel.create(reqCredit)
            return new_credit
        } catch (error) {
            console.error('Error creating user:', error);
            throw error
        }
    }

    async findCreditUser(userId: string) {
        try {

            const credit = await RequestCreditMongooseModel.findOne({ userId: new mongoose.Types.ObjectId(userId) })
            return credit
        } catch (error) {
            console.error('Error creating user:', error);
            throw error

        }

    }

    // async consumeCreditUser(userId: string, creditUse: number) {
    //     try {
    //         const credit = await RequestCreditMongooseModel.findOne({ userId: new mongoose.Types.ObjectId(userId) })

    //         return credit
    //     } catch (error) {
    //         console.error('Error creating user:', error);
    //         throw error
    //     }
    // }
}
export default new RequestCreditModel()
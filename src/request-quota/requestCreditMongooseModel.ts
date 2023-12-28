import { prop, getModelForClass, } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Authen } from "../authen/authenMongooseModel";

export class RequestCredit {

    @prop({
        type:mongoose.Schema.Types.ObjectId,
        ref:'Authen'
    })
    public userId!: Authen

    @prop({ required: true })
    public credit!: number

}
export const RequestCreditMongooseModel = getModelForClass(RequestCredit)


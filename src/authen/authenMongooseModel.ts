import { prop, getModelForClass, } from "@typegoose/typegoose";
import mongoose from "mongoose";

export class Authen {

    @prop({ required: true })
    public firstName?: string;

    @prop({ required: true })
    public lastName?: string;

    @prop({ required: false, unique: true })
    public email?: string;

    @prop({ required: false })
    public password?: string;

    @prop({ required: false })
    public nodeId?: string

    @prop({ required: true })
    public provider?: string;

}
export const AuthenMongooseModel = getModelForClass(Authen)


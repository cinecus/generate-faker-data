import { AuthenMongooseModel, Authen } from './authenMongooseModel';

class AuthenModel {
    async createUser(user: Authen) {
        try {

            const new_user = await AuthenMongooseModel.create(user)
            return new_user
        } catch (error) {
            console.error('Error creating user:', error);
            throw error
        }
    }

    async findUserByEmail(email: string) {
        try {
            const find_user = await AuthenMongooseModel.findOne({ email })
            return find_user
        } catch (error) {
            console.error('Error creating user:', error);
            throw error
        }
    }

    async findUserByNodeId(nodeId: string, provider: string) {
        try {
            const find_user = await AuthenMongooseModel.findOne({ nodeId, provider })
            return find_user
        } catch (error) {
            console.error('Error creating user:', error);
            throw error
        }
    }
}

export default new AuthenModel()
import { ObjectId } from "mongodb";
import { UserDBType } from "../../db/db-type";
import { userCollection } from "../../db/mongo-db";

export const usersMongoRepository = {

    async createUser(user: UserDBType): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await userCollection.insertOne(user)
            //console.log(insertedInfo)
            return { id: insertedInfo.insertedId } //возвращаем объект
        } catch (e) {
            console.log(e)
            return { error: "Some error" }
        }
    },

    async deleteUser(id: string) {
        const deleteInfo = await userCollection.deleteOne({ _id: new ObjectId(id) })
        return deleteInfo.deletedCount === 1 //eсли 1 - значит true
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await userCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
        return user
    }

}
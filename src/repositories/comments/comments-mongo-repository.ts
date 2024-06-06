import { ObjectId } from "mongodb"
import { CommentDBType } from "../../db/db-type"
import { commentCollection } from "../../db/mongo-db"

export const commentsMongoRepository = {

    async createComment(comment: CommentDBType): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await commentCollection.insertOne(comment)
            //console.log(insertedInfo)
            return { id: insertedInfo.insertedId } //возвращаем объект
        } catch (e) {
            console.log(e)
            return { error: "Some error" }
        }
    }
}
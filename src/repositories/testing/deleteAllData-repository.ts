import { blogCollection, postCollection, userCollection } from "../../db/mongo-db";

export const deleteAllDataRepository = {
    async deleteAllData(): Promise<{ success?: boolean }> {

        try {
            await blogCollection.deleteMany({})
            await postCollection.deleteMany({})
            await userCollection.deleteMany({})
            return { success: true }
        } catch (e) {
            throw new Error('Failed to delete all data')
        }
    }
}

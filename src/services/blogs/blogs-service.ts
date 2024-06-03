import { ObjectId } from "mongodb"
import { CreateBlogModel } from "../../models/blogs-models/CreateBlogModel"
import { currentDateISOString } from "../../helper/helper"
import { blogsMongoRepository } from "../../repositories/blogs/blogs-mongo-repository"
import { BlogDBType } from "../../db/db-type"
import { UpdateBlogModel } from "../../models/blogs-models/UpdateBlogModel"

export const blogsService = {

    async createdBlog(input: CreateBlogModel): Promise<{ error?: string, id?: ObjectId }> {
        const newBlog: BlogDBType = {
            _id: new ObjectId(),
            ...input,
            createdAt: currentDateISOString(),
            isMembership: false

        }
        return blogsMongoRepository.createdBlog(newBlog)
    },

    async deleteBlog(id: string): Promise<boolean> {
        const deleteInfo = await blogsMongoRepository.deleteBlog(id)
        return deleteInfo
    },

    async updateBlog(id: string, input: UpdateBlogModel): Promise<boolean | { error?: string }> {
        const updateInfo = await blogsMongoRepository.updateBlog(id, input)
        return updateInfo
    },
}
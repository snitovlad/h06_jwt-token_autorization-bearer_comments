import { Request, Response } from 'express'
import { CreateBlogModel } from '../../models/blogs-models/CreateBlogModel'
import { ErrorsViewModel } from '../../models/errors-models/ErrorsViewModel'
import { BlogViewModel } from '../../models/blogs-models/BlogViewModel'
import { RequestWithBody } from '../../models/requestTypes'
import { blogsQueryRepository } from '../../repositories/blogs/blogs-query-repository'
import { blogsService } from '../../services/blogs/blogs-service'
import { SETTINGS } from '../../settings'

export const createBlogController = async (
    req: RequestWithBody<CreateBlogModel>,
    res: Response<BlogViewModel | null | ErrorsViewModel | { error?: string }>) => {

    const createdInfo = await blogsService.createdBlog(req.body) //здесь createdInfo = {id: ObjectId()}
    if (!createdInfo.id) {
        res
            .status(SETTINGS.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
            .json({})
        return
    }
    const newBlog = await blogsQueryRepository.findBlog(createdInfo.id.toString())
    res
        .status(SETTINGS.HTTP_STATUSES.CREATED_201)
        .json(newBlog)
}

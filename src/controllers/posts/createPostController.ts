import { Request, Response } from 'express'
import { ErrorsViewModel } from '../../models/errors-models/ErrorsViewModel'
import { RequestWithBody } from '../../models/requestTypes'
import { CreatePostModel } from '../../models/posts-models/CreatePostModel'
import { PostViewModel } from '../../models/posts-models/PostViewModel'
import { postsQueryRepository } from '../../repositories/posts/posts-query-repository'
import { postsService } from '../../services/posts/posts-service'
import { blogsQueryRepository } from '../../repositories/blogs/blogs-query-repository'
import { SETTINGS } from '../../settings'

export const createPostController = async (
    req: RequestWithBody<CreatePostModel>,
    res: Response<PostViewModel | null | ErrorsViewModel | { error?: string }>) => {

    const blogName = await blogsQueryRepository.findBlog(req.body.blogId)

    const createdInfo = await postsService.createPost(req.body, blogName?.name) //здесь createdInfo = {id: ObjectId()}
    if (!createdInfo.id) {
        res
            .status(SETTINGS.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
            .json({})
        return
    }
    const newPost = await postsQueryRepository.findPost(createdInfo.id.toString())
    res
        .status(SETTINGS.HTTP_STATUSES.CREATED_201)
        .json(newPost)
}

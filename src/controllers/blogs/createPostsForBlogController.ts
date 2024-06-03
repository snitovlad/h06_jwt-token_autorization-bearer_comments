import { Response } from "express"
import { PostViewModel } from "../../models/posts-models/PostViewModel"
import { RequestWithParamsAndBody } from "../../models/requestTypes"
import { ErrorsViewModel } from "../../models/errors-models/ErrorsViewModel"
import { postsQueryRepository } from "../../repositories/posts/posts-query-repository"
import { URIParamsBlogIdModel } from "../../models/blogs-models/URIParamsBlogIdModel"
import { CreatePostForBlogModel } from "../../models/posts-models/CreatePostForBlogModel"
import { blogsQueryRepository } from "../../repositories/blogs/blogs-query-repository"
import { postsService } from "../../services/posts/posts-service"
import { SETTINGS } from "../../settings"

export const createPostForBlogController = async (
    req: RequestWithParamsAndBody<URIParamsBlogIdModel, CreatePostForBlogModel>,
    res: Response<PostViewModel | null | ErrorsViewModel | { error?: string }>) => {

    const foundBlog = await blogsQueryRepository.findBlog(req.params.id)
    if (!foundBlog) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    const createdInfo = await postsService.createPostforBlog(foundBlog.id, foundBlog.name, req.body) //здесь createdInfo = {id: ObjectId()}

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
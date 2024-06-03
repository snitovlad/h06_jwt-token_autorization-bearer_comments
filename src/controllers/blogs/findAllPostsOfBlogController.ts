import { Request, Response } from "express"
import { blogsQueryRepository } from "../../repositories/blogs/blogs-query-repository"
import { RequestWithParamsAndQuery, RequestWithQuery } from "../../models/requestTypes"
import { PostsQueryModel } from '../../models/posts-models/PostsQueryModel';
import { URIParamsBlogIdModel } from '../../models/blogs-models/URIParamsBlogIdModel';
import { PostsViewModel } from '../../models/posts-models/PostsViewModel';
import { postsQueryRepository } from '../../repositories/posts/posts-query-repository';
import { queryDefaulPostsValues } from '../../helper/queryDefaultValues';
import { SETTINGS } from '../../settings';

export const findAllPostsOfBlogController = async (
    req: RequestWithParamsAndQuery<URIParamsBlogIdModel, PostsQueryModel>, res: Response<PostsViewModel | { error: string }>) => {

    const foundBlog = await blogsQueryRepository.findBlog(req.params.id)
    if (!foundBlog) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    const sanitizedQuery = queryDefaulPostsValues(req.query)
    const blogId = req.params.id
    const allPosts = await postsQueryRepository.findAllPosts(sanitizedQuery, blogId)
    res
        .status(SETTINGS.HTTP_STATUSES.OK_200)
        .json(allPosts)
}
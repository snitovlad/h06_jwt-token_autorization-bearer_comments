import { Request, Response } from 'express'
import { postsQueryRepository } from '../../repositories/posts/posts-query-repository'
import { PostsViewModel } from '../../models/posts-models/PostsViewModel'
import { PostsQueryModel } from '../../models/posts-models/PostsQueryModel'
import { RequestWithQuery } from '../../models/requestTypes'
import { queryDefaulPostsValues } from '../../helper/queryDefaultValues'
import { SETTINGS } from '../../settings'

export const findAllPostsController = async (
    req: RequestWithQuery<PostsQueryModel>, res: Response<PostsViewModel | { error: string }>) => {
    const sanitizedQuery = queryDefaulPostsValues(req.query)
    const allPosts = await postsQueryRepository.findAllPosts(sanitizedQuery)
    res
        .status(SETTINGS.HTTP_STATUSES.OK_200)
        .json(allPosts)
}
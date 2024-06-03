import { BlogsQueryModel } from '../../models/blogs-models/BlogsQueryModel';
import { Request, Response } from "express"
import { blogsQueryRepository } from "../../repositories/blogs/blogs-query-repository"
import { RequestWithQuery } from "../../models/requestTypes"
import { BlogsViewModel } from "../../models/blogs-models/BlogsViewModel"
import { queryDefaulBlogsValues } from '../../helper/queryDefaultValues';
import { SETTINGS } from '../../settings';


export const findAllBlogsController = async (
    req: RequestWithQuery<BlogsQueryModel>, res: Response<BlogsViewModel | { error: string }>) => {
    const sanitizedQuery = queryDefaulBlogsValues(req.query)

    const allBlogs = await blogsQueryRepository.findAllBlogs(sanitizedQuery)
    res
        .status(SETTINGS.HTTP_STATUSES.OK_200)
        .json(allBlogs)
}
// as {[key: string]: number | undefined}
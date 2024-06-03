import { Request, Response } from 'express'
import { RequestWithParamsAndBody } from '../../models/requestTypes'
import { URIParamsBlogIdModel } from '../../models/blogs-models/URIParamsBlogIdModel'
import { UpdateBlogModel } from '../../models/blogs-models/UpdateBlogModel'
import { blogsService } from '../../services/blogs/blogs-service'
import { SETTINGS } from '../../settings'

export const updateBlogController = async (
    req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>,
    res: Response) => {

    const isUpdate = await blogsService.updateBlog(req.params.id, req.body)
    if (!isUpdate) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    } else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    }
}

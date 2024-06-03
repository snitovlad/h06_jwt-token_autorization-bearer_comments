import { Request, Response } from 'express'
import { RequestWithParams } from '../../models/requestTypes'
import { URIParamsBlogIdModel } from '../../models/blogs-models/URIParamsBlogIdModel'
import { blogsService } from '../../services/blogs/blogs-service'
import { SETTINGS } from '../../settings'

export const deleteBlogController = async (req: RequestWithParams<URIParamsBlogIdModel>,
    res: Response) => {

    const isDelete = await blogsService.deleteBlog(req.params.id)
    if (isDelete) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    }
    else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
    }
}

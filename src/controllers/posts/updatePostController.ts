import { Request, Response } from 'express'
import { RequestWithParamsAndBody } from '../../models/requestTypes'
import { URIParamsPostIdModel } from '../../models/posts-models/URIParamsPostIdModel'
import { UpdatePostModel } from '../../models/posts-models/UpdatePostModel'
import { postsService } from '../../services/posts/posts-service'
import { SETTINGS } from '../../settings'

export const updatePostController = async (req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>,
    res: Response) => {

    const isUpdate = await postsService.updatePost(req.params.id, req.body)
    if (!isUpdate) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res
        .sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
}

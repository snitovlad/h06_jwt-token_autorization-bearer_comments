import { Request, Response } from 'express'
import { RequestWithParams } from '../../models/requestTypes'
import { URIParamsPostIdModel } from '../../models/posts-models/URIParamsPostIdModel'
import { postsService } from '../../services/posts/posts-service'
import { SETTINGS } from '../../settings'


export const deletePostController = async (req: RequestWithParams<URIParamsPostIdModel>,
    res: Response) => {

    const isDelete = await postsService.deletePost(req.params.id)
    if (!isDelete) {
        res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
    } else {
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    }
}

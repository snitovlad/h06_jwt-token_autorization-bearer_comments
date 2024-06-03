import { Request, Response } from 'express'
import { RequestWithParams } from '../../models/requestTypes'
import { URIParamsPostIdModel } from '../../models/posts-models/URIParamsPostIdModel'
import { postsService } from '../../services/posts/posts-service'


export const deletePostController = async (req: RequestWithParams<URIParamsPostIdModel>,
    res: Response) => {

    const isDelete = await postsService.deletePost(req.params.id)
    if (!isDelete) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
}

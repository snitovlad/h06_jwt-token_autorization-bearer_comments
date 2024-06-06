import { Response } from "express"
import { URIParamsCommentIdModel } from "../../models/comments/URIParamsCommentIdModel"
import { UpdateCommentModel } from "../../models/comments/UpdareCommentModel"
import { RequestWithParams, RequestWithParamsAndBody } from "../../models/requestTypes"
import { commentsService } from "../../services/comments/comments-service"
import { SETTINGS } from "../../settings"
import { ResultStatus } from "../../common/types/resultCode"

export const commentsController = {

    async updateComment(req: RequestWithParamsAndBody<URIParamsCommentIdModel, UpdateCommentModel>,
        res: Response) {

        const isUpdate = await commentsService.updateComment(req.params.id, req.body, req.userId!)

        if (isUpdate.status === ResultStatus.NotFound) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        if (isUpdate.status === ResultStatus.Forbidden) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.FORBIDDEN_403)
            return
        }
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    },

    async deleteComment(req: RequestWithParams<URIParamsCommentIdModel>, res: Response) {
        const isDelete = await commentsService.deleteComment(req.params.id, req.userId!)

        if (isDelete.status === ResultStatus.NotFound) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        if (isDelete.status === ResultStatus.Forbidden) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.FORBIDDEN_403)
            return
        }
        res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    }
}
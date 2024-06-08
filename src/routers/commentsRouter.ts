import { Router } from "express";
import { inputCheckErrorsMiddleware } from "../middlewares/input-check-errors-middleware";
import { authBearerMiddleware } from "../middlewares/auth-bearer-middleware";
import { inputIdValidator } from "../middlewares/input-id-validator";
import { commentsController } from "../controllers/comments/commentsController";
import { inputContentCommentValidator } from "../middlewares/comment-validation-middleware";

export const commentsRouter = Router()

commentsRouter.put('/:id',
    authBearerMiddleware,
    inputIdValidator(),
    inputContentCommentValidator(),
    inputCheckErrorsMiddleware,
    commentsController.updateComment)

commentsRouter.delete('/:id',
    authBearerMiddleware,
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    commentsController.deleteComment)

commentsRouter.get('/:id',
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    commentsController.findCommentById)
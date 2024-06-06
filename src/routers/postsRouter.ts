import { Router } from 'express'
import {
    inputBlogIdPostValidator, inputContentPostValidator, inputShortDescriptionPostValidator,
    inputTitlePostValidator
} from '../middlewares/post-validation-middleware';
import { inputCheckErrorsMiddleware } from '../middlewares/input-check-errors-middleware';
import { authMiddleware } from '../middlewares/auth-middleware';
import { inputIdValidator } from '../middlewares/input-id-validator';
import { inputPageNumberQueryValidator, inputPageSizeQueryValidator, inputSortByQueryValidator, inputSortDirectionQueryValidator } from '../middlewares/inputQueryValidation';
import { authBearerMiddleware } from '../middlewares/auth-bearer-middleware';
import { postsController } from '../controllers/posts/postsController';
import { inputContentCommentValidator } from '../middlewares/comment-validation-middleware';


export const postsRouter = Router()

postsRouter.get('/',
    inputSortByQueryValidator(),
    inputSortDirectionQueryValidator(),
    inputPageNumberQueryValidator(),
    inputPageSizeQueryValidator(),
    inputCheckErrorsMiddleware,
    postsController.findAllPosts)

postsRouter.post('/',
    authMiddleware,
    inputTitlePostValidator(),
    inputShortDescriptionPostValidator(),
    inputContentPostValidator(),
    inputBlogIdPostValidator(),
    inputCheckErrorsMiddleware,
    postsController.createPost)

postsRouter.get('/:id',
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    postsController.findPostById)

postsRouter.delete('/:id',
    authMiddleware,
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    postsController.deletePost)

postsRouter.put('/:id',
    authMiddleware,
    inputIdValidator(),
    inputTitlePostValidator(),
    inputShortDescriptionPostValidator(),
    inputContentPostValidator(),
    inputBlogIdPostValidator(),
    inputCheckErrorsMiddleware,
    postsController.updatePost)

postsRouter.post('/:id/comments',
    authBearerMiddleware,
    inputIdValidator(),
    inputContentCommentValidator(),
    inputCheckErrorsMiddleware,
    postsController.createCommentForPost)

postsRouter.get('/:id/comments',
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    postsController.findAllCommentsForPost)



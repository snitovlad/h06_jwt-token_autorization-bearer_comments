import { Router } from "express";
import { usersController } from "../controllers/users/usersController";
import { authMiddleware } from "../middlewares/auth-middleware";
import { inputPageNumberQueryValidator, inputPageSizeQueryValidator, inputSearchEmailTermQueryValidator, inputSearchLoginTermQueryValidator, inputSortByQueryValidator, inputSortDirectionQueryValidator } from "../middlewares/inputQueryValidation";
import { inputCheckErrorsMiddleware } from "../middlewares/input-check-errors-middleware";
import { inputEmailUserBlogValidator, inputLoginUserValidator, inputPasswordUserValidator } from "../middlewares/user-validation-middleware";
import { inputIdValidator } from "../middlewares/input-id-validator";

export const usersRouter = Router()

usersRouter.get('/',
    authMiddleware,
    inputSortByQueryValidator(),
    inputSortDirectionQueryValidator(),
    inputPageNumberQueryValidator(),
    inputPageSizeQueryValidator(),
    inputSearchLoginTermQueryValidator(),
    inputSearchEmailTermQueryValidator(),
    inputCheckErrorsMiddleware,
    usersController.findAllUsers
)

usersRouter.post('/',
    authMiddleware,
    inputLoginUserValidator(),
    inputPasswordUserValidator(),
    inputEmailUserBlogValidator(),
    inputCheckErrorsMiddleware,
    usersController.createUser
)

usersRouter.delete('/:id',
    authMiddleware,
    inputIdValidator(),
    inputCheckErrorsMiddleware,
    usersController.deleteUser
)
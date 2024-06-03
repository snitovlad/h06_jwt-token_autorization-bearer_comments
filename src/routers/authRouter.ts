import { Router } from "express";
import { authController } from "../controllers/auth/authController";
import { inputCheckErrorsMiddleware } from "../middlewares/input-check-errors-middleware";
import { inputLoginOrEmailAuthValidator, inputPasswordAuthValidator } from "../middlewares/auth-login-validator-middleware";

export const authRouter = Router()

authRouter.post('/login',
    inputLoginOrEmailAuthValidator(),
    inputPasswordAuthValidator(),
    inputCheckErrorsMiddleware,
    authController.authResult)
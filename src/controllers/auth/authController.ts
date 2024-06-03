import { Request, Response } from "express";
import { authService } from "../../services/auth/auth-service";
import { RequestWithBody } from "../../models/requestTypes";
import { CreateAuthModel } from "../../models/auth-model/CreateAuthModel";
import { SETTINGS } from "../../settings";

export const authController = {

    async authResult(req: RequestWithBody<CreateAuthModel>, res: Response) {
        const checkResult = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (checkResult) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
        } else {
            res.sendStatus(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
        }
    }
}
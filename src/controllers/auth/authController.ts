import { Request, Response } from "express";
import { authService } from "../../services/auth/auth-service";
import { RequestWithBody } from "../../models/requestTypes";
import { CreateAuthModel } from "../../models/auth-model/CreateAuthModel";

export const authController = {

    async authResult(req: RequestWithBody<CreateAuthModel>, res: Response) {
        const checkResult = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (checkResult) {
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
}
import { Request, Response } from "express";
import { authService } from "../../services/auth/auth-service";
import { RequestWithBody } from "../../models/requestTypes";
import { CreateAuthModel } from "../../models/auth-model/CreateAuthModel";
import { SETTINGS } from "../../settings";
import { jwtService } from "../../common/adapters/jwt.service";
import { ResultStatus } from "../../common/types/resultCode";
import { CurrentUserViewModel } from "../../models/auth-model/CurrentUserViewModel";
import { usersQueryRepository } from "../../repositories/users/users-query-repository";

export const authController = {

    async authResult(req: RequestWithBody<CreateAuthModel>, res: Response) {
        const result = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (result.status === ResultStatus.Success) {
            if (result.data) {
                const accessToken = await jwtService.createJWTToken(result.data)
                res
                    .status(SETTINGS.HTTP_STATUSES.OK_200)
                    .send(accessToken)
                //.json({ accessToken }) //передаст в формате json {accessToken: 'token'}
            }
        } else {
            res.sendStatus(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
        }
    },

    async authMe(req: Request, res: Response<CurrentUserViewModel>) {
        const me = await usersQueryRepository.findUser(req.userId!)
        if (!me) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.UNAUTHORIZED_401)
            return
        }
        res
            .status(SETTINGS.HTTP_STATUSES.OK_200)
            .send({
                email: me.email,
                login: me.login,
                userId: me.id
            })
    }
}

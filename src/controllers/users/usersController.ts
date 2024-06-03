import { URIParamsUserIdModel } from './../../models/users-model/URIParamsUserIdModel';
import { Response } from "express"
import { RequestWithBody, RequestWithParams, RequestWithQuery } from "../../models/requestTypes"
import { queryDefaulUsersValues } from "../../helper/queryDefaultValues"
import { UsersQueryModel } from "../../models/users-model/UsersQueryModel"
import { UsersViewModel } from "../../models/users-model/UsersViewModel"
import { usersQueryRepository } from "../../repositories/users/users-query-repository"
import { CreateUserModel } from "../../models/users-model/CreateUseerModel"
import { UserViewModel } from "../../models/users-model/UserViewModel"
import { ErrorsViewModel, errorMessage } from "../../models/errors-models/ErrorsViewModel"
import { usersService } from "../../services/users/users-service"

export const usersController = {

    async findAllUsers(
        req: RequestWithQuery<UsersQueryModel>, res: Response<UsersViewModel | { error: string }>) {
        const sanitizedQuery = queryDefaulUsersValues(req.query)

        const allUsers = await usersQueryRepository.findAllUsers(sanitizedQuery)
        res
            .status(200)
            .json(allUsers)
    },

    async createUser(
        req: RequestWithBody<CreateUserModel>,
        res: Response<UserViewModel | null | ErrorsViewModel | { errorsMessages?: errorMessage[] }>) {

        //здесь createdInfo = {id: ObjectId()}
        const createdInfo = await usersService.createUser(req.body.login, req.body.password, req.body.email)
        if (!createdInfo.id) {
            res
                .status(400)
                .json(createdInfo)
            return
        }
        const newUser = await usersQueryRepository.findUser(createdInfo.id.toString())
        res
            .status(201)
            .json(newUser)
    },

    async deleteUser(req: RequestWithParams<URIParamsUserIdModel>, res: Response) {

        const isDelete = await usersService.deleteUser(req.params.id)
        if (isDelete) {
            res.sendStatus(204)
        }
        else {
            res.sendStatus(404)
        }
    }
}

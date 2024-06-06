//import { errorMessage } from './../../input-output-types/errors-types/output-errors-type';
import { ObjectId } from "mongodb";
import { UserDBType } from "../../db/db-type";
import { usersMongoRepository } from "../../repositories/users/user-mongo-repository";
import { bcryptService } from "../../common/adapters/bcrypt.service";
import { Result } from "../../common/types/result.type";
import { ResultStatus } from "../../common/types/resultCode";

export const usersService = {

    async createUser(login: string, password: string, email: string): Promise<Result<string>> {

        const userByLogin = await usersMongoRepository.findByLoginOrEmail(login)
        if (userByLogin) return { //возвращаем объект с информацией в контроллер
            status: ResultStatus.BadRequest,
            errorMessage: {
                errorMessages: [{
                    message: 'the login is not unique',
                    field: 'login'
                }]
            }
        }

        const userByEmail = await usersMongoRepository.findByLoginOrEmail(email)
        if (userByEmail) return { //возвращаем объект с информацией в контроллер
            status: ResultStatus.BadRequest,
            errorMessage: {
                errorMessages: [{
                    message: 'the email address is not unique',
                    field: 'email'
                }]
            }
        }
        const passwordHash = await bcryptService.generateHash(password)

        const newUser: UserDBType = {
            _id: new ObjectId(),
            login: login,
            email: email,
            passwordHash,
            //passwordSalt,
            createdAt: new Date().toISOString()
        }
        const userId = await usersMongoRepository.createUser(newUser)
        //возвращаем объект с информацией в контроллер
        return {
            status: ResultStatus.Success,
            data: userId.id?.toString()
        }

    },

    async deleteUser(id: string) {
        const deleteInfo = await usersMongoRepository.deleteUser(id)
        return deleteInfo
    }
}
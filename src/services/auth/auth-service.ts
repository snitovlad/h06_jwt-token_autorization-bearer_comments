import { bcryptService } from "../../common/adapters/bcrypt.service"
import { usersMongoRepository } from "../../repositories/users/user-mongo-repository"
import { ResultStatus } from "../../common/types/resultCode"
import { Result } from "../../common/types/result.type"

export const authService = {

    async checkCredentials(loginOrEmail: string, password: string): Promise<Result<string>> {

        const user = await usersMongoRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return { //возвращаем объект с информацией в контроллер
                status: ResultStatus.NotFound,
                errorMessage: {
                    errorMessages: [{
                        message: 'the user is not found',
                        field: 'user'
                    }]
                }
            }
        }
        const isCorrect = await bcryptService.checkPassword(password, user.passwordHash)
        if (isCorrect) {
            return { //возвращаем объект с информацией в контроллер
                status: ResultStatus.Success,
                data: user._id.toString()
            }
        }
        return { //возвращаем объект с информацией в контроллер
            status: ResultStatus.NotFound,
            errorMessage: {
                errorMessages: [{
                    message: 'the user is not found',
                    field: 'user'
                }]
            }
        }
    },
}
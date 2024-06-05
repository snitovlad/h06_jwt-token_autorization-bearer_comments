import { bcryptService } from "../../common/adapters/bcrypt.service"
import { usersMongoRepository } from "../../repositories/users/user-mongo-repository"

export const authService = {

    async checkCredentials(loginOrEmail: string, password: string) {

        const user = await usersMongoRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false
        }
        const isCorrect = await bcryptService.checkPassword(password, user.passwordHash)
        return isCorrect
    },
}
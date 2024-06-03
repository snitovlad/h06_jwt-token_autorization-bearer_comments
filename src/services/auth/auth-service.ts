import { usersMongoRepository } from "../../repositories/users/user-mongo-repository"
import { usersService } from "../users/users-service"
import bcrypt from 'bcrypt'

export const authService = {

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersMongoRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) {
            return false
        }
        // const passwordHash = await usersService.generateHash(password, user.passwordSalt)
        // if (user.passwordHash !== passwordHash) {
        //     return false
        // }
        // return true

        const isCorrect = await bcrypt.compare(password, user.passwordHash)
        // if (!isCorrect) {
        //     return false
        // }s
        return isCorrect
    },
}
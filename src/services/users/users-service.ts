import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt'
import { UserDBType } from "../../db/db-type";
import { usersMongoRepository } from "../../repositories/users/user-mongo-repository";
import { errorMessage } from "../../models/errors-models/ErrorsViewModel";

export const usersService = {

    async createUser(login: string, password: string, email: string): Promise<{ errorsMessages?: errorMessage[], id?: ObjectId }> {

        const isUnicLogin = await usersMongoRepository.findByLoginOrEmail(login)
        if (isUnicLogin) return {
            errorsMessages: [{
                message: 'the login is not unique"',
                field: 'login'
            }]
        }
        const isUnicEmail = await usersMongoRepository.findByLoginOrEmail(email)
        if (isUnicEmail) return {
            errorsMessages: [{
                message: 'the email address is not unique"',
                field: 'email'
            }]
        }

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password, passwordSalt)
        //const passwordHash = await this.generateHash(password, 10) //можно так, без отдельной генерации соли
        const newUser: UserDBType = {
            _id: new ObjectId(),
            login: login,
            email: email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        return usersMongoRepository.createUser(newUser)
    },

    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        console.log('hash: ', hash)
        return hash
    },

    // async checkCredentials(loginOrEmail: string, password: string) {
    //     const user = await usersMongoRepository.findByLoginOrEmail(loginOrEmail)
    //     if (!user) {
    //         return false
    //     }
    //     const passwordHash = await this.generateHash(password, user.passwordSalt)
    //     if (user.passwordHash !== passwordHash) {
    //         return false
    //     }
    //     return true
    // },

    async deleteUser(id: string) {
        const deleteInfo = await usersMongoRepository.deleteUser(id)
        return deleteInfo
    }
}
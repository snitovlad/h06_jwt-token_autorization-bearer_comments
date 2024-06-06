import { ObjectId } from "mongodb";
import { CommentDBType } from "../../db/db-type";
import { CreateCommentModel } from "../../models/comments/CreateCommentModel";
import { usersMongoRepository } from "../../repositories/users/user-mongo-repository";
import { commentsMongoRepository } from "../../repositories/comments/comments-mongo-repository";
import { Result } from "../../common/types/result.type";
import { ResultStatus } from "../../common/types/resultCode";

export const commentsService = {

    async createComment(content: string, postId: string, userId: string): /*Promise<{ error?: string, id?: ObjectId }>*/
        Promise<Result<string>> {
        //{

        //     const user = await usersMongoRepository.findUserById(id)
        //     const newComment: CommentDBType = {
        //         _id: new ObjectId(),
        //         content: content,
        //         commentatorInfo: {
        //             userId: id,
        //             userLogin: user?.login
        //         },
        //         createdAt: new Date().toISOString(),
        //     }
        //     const createdInfo = await commentsMongoRepository.createComment(newComment)
        //     return createdInfo
        // }

        const user = await usersMongoRepository.findUserById(userId)

        if (!user) return {
            status: ResultStatus.NotFound,
            errorMessage: {
                errorMessages: [{
                    message: 'the login is not found',
                    field: 'login'
                }]
            }
        }
        const newComment: CommentDBType = {
            _id: new ObjectId(),
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
        }
        const createdInfo = await commentsMongoRepository.createComment(newComment)

        if (createdInfo.error) return {
            status: ResultStatus.NotCreated,
            errorMessage: {
                errorMessages: [{
                    message: 'the comment is not created',
                    field: 'comment'
                }]
            }
        }

        return {
            status: ResultStatus.Success,
            data: createdInfo.id?.toString()
        }
    }
}

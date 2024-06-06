import { URIParamsPostIdModel } from "../../models/posts-models/URIParamsPostIdModel";
import { ErrorsViewModel } from "../../models/errors-models/ErrorsViewModel";
import { CreateCommentModel } from "../../models/comments/CreateCommentModel";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../../models/requestTypes";
import { CommentViewModel } from "../../models/comments/CommentViewModel";
import { Response } from "express";
import { postsQueryRepository } from "../../repositories/posts/posts-query-repository";
import { SETTINGS } from "../../settings";
import { commentsService } from "../../services/comments/comments-service";
import { commentsQueryRepository } from "../../repositories/comments/comments-query-repository";
import { ResultStatus } from "../../common/types/resultCode";
import { ErrorMessage } from "../../common/types/result.type";
import { CommentsQueryModel } from "../../models/comments/CommentsQueryModel";
import { CommentsViewModel } from "../../models/comments/CommentsViewModel";
import { queryDefaulPostsValues, queryDefaultCommentsValues } from "../../helper/queryDefaultValues";
import { CreatePostModel } from "../../models/posts-models/CreatePostModel";
import { PostViewModel } from "../../models/posts-models/PostViewModel";
import { blogsQueryRepository } from "../../repositories/blogs/blogs-query-repository";
import { postsService } from "../../services/posts/posts-service";
import { PostsQueryModel } from "../../models/posts-models/PostsQueryModel";
import { PostsViewModel } from "../../models/posts-models/PostsViewModel";
import { UpdatePostModel } from "../../models/posts-models/UpdatePostModel";

export const postsController = {

    async createPost(
        req: RequestWithBody<CreatePostModel>,
        res: Response<PostViewModel | null | ErrorsViewModel | { error?: string }>) {

        const blogName = await blogsQueryRepository.findBlog(req.body.blogId)

        const createdInfo = await postsService.createPost(req.body, blogName?.name) //здесь createdInfo = {id: ObjectId()}
        if (!createdInfo.id) {
            res
                .status(SETTINGS.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                .json({})
            return
        }
        const newPost = await postsQueryRepository.findPost(createdInfo.id.toString())
        res
            .status(SETTINGS.HTTP_STATUSES.CREATED_201)
            .json(newPost)
    },

    async deletePost(req: RequestWithParams<URIParamsPostIdModel>, res: Response) {

        const isDelete = await postsService.deletePost(req.params.id)
        if (!isDelete) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
        } else {
            res.sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
        }
    },

    async findAllPosts(
        req: RequestWithQuery<PostsQueryModel>, res: Response<PostsViewModel | { error: string }>) {
        const sanitizedQuery = queryDefaulPostsValues(req.query)
        const allPosts = await postsQueryRepository.findAllPosts(sanitizedQuery)
        res
            .status(SETTINGS.HTTP_STATUSES.OK_200)
            .json(allPosts)
    },

    async findPostById(req: RequestWithParams<URIParamsPostIdModel>,
        res: Response<PostViewModel>) {

        const foundPost = await postsQueryRepository.findPost(req.params.id)
        if (!foundPost) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.json(foundPost)
    },

    async updatePost(req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>,
        res: Response) {

        const isUpdate = await postsService.updatePost(req.params.id, req.body)
        if (!isUpdate) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res
            .sendStatus(SETTINGS.HTTP_STATUSES.N0_CONTENT_204)
    },

    async createCommentForPost(
        req: RequestWithParamsAndBody<URIParamsPostIdModel, CreateCommentModel>,
        res: Response<CommentViewModel | null | ErrorsViewModel | { error?: string } | ErrorMessage>) {

        const foundPost = await postsQueryRepository.findPost(req.params.id)
        if (!foundPost) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const createdInfo = await commentsService.createComment(req.body.content, foundPost.id, req.userId!)
        if (createdInfo.status !== ResultStatus.Success) {
            res
                .status(SETTINGS.HTTP_STATUSES.INTERNAL_SERVER_ERROR_500)
                .json(createdInfo.errorMessage)
            return
        }

        if (createdInfo.data) {
            const newComment = await commentsQueryRepository.findCommentById(createdInfo.data)
            res
                .status(SETTINGS.HTTP_STATUSES.CREATED_201)
                .json(newComment)
        }
    },

    async findAllCommentsForPost(req: RequestWithParamsAndBody<URIParamsPostIdModel, CommentsQueryModel>,
        res: Response<CommentsViewModel | { error: string }>) {

        const foundPost = await postsQueryRepository.findPost(req.params.id)
        if (!foundPost) {
            res.sendStatus(SETTINGS.HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        const allComments = await commentsQueryRepository.findAllComments(req.query, foundPost.id)
        res
            .status(SETTINGS.HTTP_STATUSES.OK_200)
            .json(allComments)
    }
}
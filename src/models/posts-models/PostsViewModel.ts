import { PostViewModel } from "./PostViewModel";

export type PostsViewModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number;
    items: PostViewModel[]
}
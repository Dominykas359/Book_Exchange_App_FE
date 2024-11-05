export interface CommentEntry{
    id: string,
    userId: string,
    noticeId: string,
    timeSent: Date,
    content: string,
    commentId: string,
    replies: CommentEntry[]
}
import { Message } from "./Message";

export interface ChatEntry{
    id: string,
    userId: string,
    noticeId: string,
    messages: Message[],
    receiver: string,
}
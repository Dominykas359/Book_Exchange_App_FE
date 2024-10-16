import { Message } from "./Message";

export interface Chat{
    id: string,
    userId: string,
    noticeId: string,
    messages: Message[]
}
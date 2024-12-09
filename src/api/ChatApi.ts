import axios from "axios";
import { ChatEntry } from "../models/ChatEntry";

const url = `${import.meta.env.VITE_BACKEND_URL}/chats`;

export const createChat = async (chat: ChatEntry): Promise<ChatEntry> => {

    const response = await axios.post<ChatEntry>(`${url}`, chat);

    return response.data;
}

export const fetchChatsByUser = async (id: string): Promise<ChatEntry[]> => {

    const response = await axios.get<ChatEntry[]>(`${url}/${id}`);

    return response.data;
}

export const fetchChatWithMessages = async (id: string): Promise<ChatEntry> => {

    const response = await axios.get<ChatEntry>(`${url}/${id}/with-messages`);

    return response.data;
}

export const fetchChatByNoticeId = async (id: string): Promise<ChatEntry> => {

    const response = await axios.get<ChatEntry>(`${url}/for-notice/${id}`);

    return response.data;
}
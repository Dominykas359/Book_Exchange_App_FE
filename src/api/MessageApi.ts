import axios from "axios";
import { Message } from "../models/Message";

const url = `${import.meta.env.VITE_BACKEND_URL}/messages`;

export const sendMessage = async (message: Message): Promise<Message> => {

    const response = await axios.post<Message>(`${url}`, message);

    return response.data;
}

export const updateMessage = async (message: Message, id: string): Promise<Message> => {

    const response = await axios.put<Message>(`${url}/${id}`, message);

    return response.data;
}

export const deleteMessage = async (id: string): Promise<Message> => {

    const response = await axios.delete<Message>(`${url}/${id}`);

    return response.data;
}
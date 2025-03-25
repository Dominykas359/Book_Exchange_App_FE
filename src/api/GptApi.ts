import axios from "axios"
import { Notice } from "../models/Notice";

const url = `${import.meta.env.VITE_BACKEND_URL}/api/gpt/chat`;

export const chat = async (promt: string): Promise<Notice[]> => {

    const response = await axios.get<Notice[]>(`${url}?prompt=${promt}`);

    return response.data;
}
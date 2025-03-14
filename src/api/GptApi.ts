import axios from "axios"

const url = `${import.meta.env.VITE_BACKEND_URL}/api/gpt/chat`;

export const chat = async (promt: string): Promise<String> => {

    const response = await axios.get<String>(`${url}?prompt=${promt}`);

    return response.data;
}
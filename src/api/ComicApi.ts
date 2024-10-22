import axios from "axios";
import { Comic } from "../models/Comic";

const url = `${import.meta.env.VITE_BACKEND_URL}/comics`;

export const createComic = async (comic: Comic): Promise<Comic> => {

    const response = await axios.post<Comic>(`${url}`, comic);

    return response.data;
}

export const findComicById = async (id: string): Promise<Comic> => {

    const response = await axios.get<Comic>(`${url}/${id}`);

    return response.data;
}

export const updateComic = async (id: string, comic: Comic): Promise<Comic> => {

    const response = await axios.put<Comic>(`${url}/${id}`, comic);

    return response.data;
}

export const deleteComic = async (id: string): Promise<Comic> => {

    const response = await axios.delete<Comic>(`${url}/${id}`);

    return response.data;
}
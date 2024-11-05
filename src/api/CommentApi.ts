import axios from "axios";
import { CommentEntry } from "../models/CommentEntry";

const url = `${import.meta.env.VITE_BACKEND_URL}/comments`;

export const getCommentsForNotice = async (id: string): Promise<CommentEntry[]> => {

    const response = await axios.get<CommentEntry[]>(`${url}/${id}`);

    return response.data;
}

export const postComment = async (comment: CommentEntry): Promise<CommentEntry> => {

    const response = await axios.post<CommentEntry>(`${url}`, comment);

    return response.data;
}

export const updateComment = async (id:string, comment: CommentEntry): Promise<CommentEntry> => {

    const response = await axios.put<CommentEntry>(`${url}/${id}`, comment);

    return response.data;
}

export const deleteComment = async(id: string): Promise<CommentEntry> => {

    const response = await axios.delete<CommentEntry>(`${url}/${id}`);

    return response.data;
}
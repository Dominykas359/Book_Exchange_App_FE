import axios from "axios";
import { Notice } from "../models/Notice";

const url = `${import.meta.env.VITE_BACKEND_URL}/notices`;

export const createNotice = async (notice: Notice): Promise<Notice> => {

    const response = await axios.post<Notice>(`${url}`, notice);

    return response.data;
}

export const getAllNotices = async (): Promise<Notice[]> => {

    const response = await axios.get<Notice[]>(`${url}`);

    return response.data;
}
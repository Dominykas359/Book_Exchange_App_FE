import axios from "axios";
import { HistoryEntry } from "../models/HistoryEntry";

const url = `${import.meta.env.VITE_BACKEND_URL}/histories`;

export const getHistory = async (id: string): Promise<HistoryEntry[]> => {

    const response = await axios.get<HistoryEntry[]>(`${url}/${id}`);

    return response.data;
} 

export const createHistory = async (history: HistoryEntry): Promise<HistoryEntry> => {

    const response = await axios.post<HistoryEntry>(`${url}`, history);

    return response.data;
}
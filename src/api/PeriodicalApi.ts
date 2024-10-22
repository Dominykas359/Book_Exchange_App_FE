import axios from "axios";
import { Periodical } from "../models/Periodical";

const url = `${import.meta.env.VITE_BACKEND_URL}/periodicals`;

export const createPeriodacal = async (periodical: Periodical): Promise<Periodical> => {

    const response = await axios.post<Periodical>(`${url}`, periodical);

    return response.data;
}

export const findPeriodicalById = async (id: string): Promise<Periodical> => {

    const response = await axios.get<Periodical>(`${url}/${id}`);

    return response.data;
}

export const updatePeriodical = async (id: string, periodical: Periodical): Promise<Periodical> => {

    const response = await axios.put<Periodical>(`${url}/${id}`, periodical);

    return response.data;
}

export const deletePeriodical = async (id: string): Promise<Periodical> => {

    const response = await axios.delete<Periodical>(`${url}/${id}`);

    return response.data;
}
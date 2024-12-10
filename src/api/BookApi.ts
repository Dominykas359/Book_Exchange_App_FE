import axios from "axios";
import { Book } from "../models/Book";

const url = `${import.meta.env.VITE_BACKEND_URL}/books`;

export const createBook = async (book: Book): Promise<Book> => {

    const response = await axios.post<Book>(`${url}`, book);

    return response.data;
}

export const getBooks = async (): Promise<Book[]> => {

    const response = await axios.get<Book[]>(`${url}`);

    return response.data;
}

export const findBookById = async (id: string): Promise<Book> => {

    const response = await axios.get<Book>(`${url}/${id}`);

    return response.data;
}

export const updateBook = async (id: string, book: Book): Promise<Book> => {

    const response = await axios.put<Book>(`${url}/${id}`, book);

    return response.data;
}

export const deleteBook = async (id: string): Promise<Book> => {

    const response = await axios.delete<Book>(`${url}/${id}`);

    return response.data;
}
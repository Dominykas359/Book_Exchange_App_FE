import axios from "axios"
import { User } from "../models/User";

const url = `${import.meta.env.VITE_BACKEND_URL}/users`;

export const fetchUserById = async (id: string): Promise<User> => {

    const response = await axios.get<User>(`${url}/${id}`);

    return response.data;
}

export const fetchUserByEmail = async (email: string): Promise<User> => {

    const response = await axios.get<User>(`http://localhost:8080/auth/check-email/${email}`);

    return response.data;
}

export const changePassword = async (id: string, password: User): Promise<User> => {

    const response = await axios.put<User>(`${url}/change-password/${id}`, password);

    return response.data;
}

export const updateUser = async (id: string, updatedUser: User): Promise<User> => {

    const response = await axios.put<User>(`${url}/${id}`, updatedUser);

    return response.data;
}

export const deleteUser = async (id: string): Promise<User> => {

    const response = await axios.delete<User>(`${url}/${id}`);

    return response.data;
}

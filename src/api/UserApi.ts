import axios from "axios"
import { User } from "../models/User";

const url = `${import.meta.env.VITE_BACKEND_URL}/users`;

export const fetchUserById = async (id: string): Promise<User> => {

    const response = await axios.get<User>(`${url}/${id}`);

    return response.data;
}

import axios from "axios";

const url = `${import.meta.env.VITE_BACKEND_URL}/comments`;

export const getCommentsForNotice = async (id: string): Promise<Comment[]> => {

    const response = await axios.get<Comment[]>(`${url}/${id}`);

    return response.data;
}

export const postComment = async (comment: Comment): Promise<Comment> => {

    const response = await axios.post<Comment>(`${url}`, comment);

    return response.data;
}
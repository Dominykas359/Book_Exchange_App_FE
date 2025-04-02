import axios from "axios";
import { WishListItem } from "../models/WishListItem";

const API_BASE = "http://localhost:8080/api/wishlist";

export const checkIfInWishlist = async (userId: string, noticeId: string): Promise<boolean> => {
    const response = await axios.get(`${API_BASE}/check`, { params: { userId, noticeId } });
    return response.data.inWishlist;
};

export const addToWishlist = async (userId: string, noticeId: string): Promise<WishListItem> => {
    const response = await axios.post(`${API_BASE}`, { userId, noticeId });
    return response.data;
};

export const removeFromWishlist = async (userId: string, noticeId: string): Promise<void> => {
    await axios.delete(`${API_BASE}`, { data: { userId, noticeId } });
};

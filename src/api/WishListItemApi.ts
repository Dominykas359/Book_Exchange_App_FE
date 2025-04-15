import axios from "axios";
import { WishListItem } from "../models/WishListItem";

const url = `${import.meta.env.VITE_BACKEND_URL}/wishlist`;

export const addToWishlist = async (wishlistItem: WishListItem): Promise<WishListItem> => {

    const response = await axios.post<WishListItem>(`${url}`, wishlistItem);

    return response.data;
}

export const removeFromWishlist = async (id: string): Promise<WishListItem> => {

    const response = await axios.delete<WishListItem>(`${url}/${id}`);

    return response.data;
}

export const fetchWishlistByUserId = async (id: string): Promise<WishListItem[]> => {

    const response = await axios.get<WishListItem[]>(`${url}/${id}`);

    return response.data;
}

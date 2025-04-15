import React, { useState, useEffect } from "react";
import { removeFromWishlist, getWishlistItems, setWishlistItem } from "../../api/WishListItemApi";
import { User } from "../../models/User";
import { Book } from '../../models/Book';
import { Comic } from '../../models/Comic';
import { Periodical } from '../../models/Periodical';
import { fetchUserById } from "../../api/UserApi";

interface WishlistProps {
    userId: string;
}

interface WishListItem {
    id: string;
    type: 'book' | 'comic' | 'periodical'; // Tai gali būti tipas, kaip nusakote knygą, komiksą arba periodiką
    book?: Book;
    comic?: Comic;
    periodical?: Periodical;
  }

const Wishlist: React.FC<WishlistProps> = ({ userId }) => {
    const [wishlistItems, setWishlistItems] = useState<(Book | Comic | Periodical)[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            const userData = localStorage.getItem("user");
            if (userData) {
                const data = JSON.parse(userData);
                setCurrentUser(data);
            }
        };

        initializeUser();
    }, []);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                if(currentUser)
                {
                //const items = await getWishlistItems(currentUser.id);
                const updateWishlist = (items: WishListItem[]) => {
                    const updatedItems = items.map(item => {
                      if (item.type === 'book' && item.book) {
                        return item.book; // Paversti į `Book` objektą
                      } else if (item.type === 'comic' && item.comic) {
                        return item.comic; // Paversti į `Comic` objektą
                      } else if (item.type === 'periodical' && item.periodical) {
                        return item.periodical; // Paversti į `Periodical` objektą
                      }
                      return null; // Jei nėra tinkamo objekto
                    }).filter(item => item !== null); // Filtruoti null reikšmes
                  
                    setWishlistItems(updatedItems);
                  };

                }
            } catch (error) {
                console.error("Error fetching wishlist items:", error);
            }
        };

        if (userId) {
            fetchWishlist();
        }
    }, [userId]);

    /*const handleRemoveFromWishlist = async (publicationId: string) => {
        if (currentUser) 
            {
                await setWishlistItem(currentUser.id, itemId, 'remove');

                // Po pašalinimo atnaujinti sąrašą
                setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
            }

        try {
            await removeFromWishlist(currentUser.id, publicationId);  // API leidinio pašalinimui iš sąrašo
            setWishlistItems(wishlistItems.filter(item => item.id !== publicationId));  // Atnaudiname sąrašą
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };*/

    const handleRemoveFromWishlist = async (itemId: string) => {
        if (currentUser) {
            // Pašalinti elementą iš norų sąrašo
            await setWishlistItem(currentUser.id, itemId, 'remove');

            // Po pašalinimo atnaujinti sąrašą
            setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    const renderWishlistItems = () => {
        return wishlistItems.map((item, index) => {
            // Check the type of the item (book, comic, or periodical) and display accordingly
            if ((item as Book).author) {
                const book = item as Book;
                return (
                    <div key={index}>
                        <h3>{book.title}</h3>
                        <p>Author: {book.author}</p>
                        <p>Year: {new Date(book.releaseYear).getFullYear()}</p>
                        <button
                            onClick={() => handleRemoveFromWishlist(book.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Remove from Wishlist
                        </button>
                    </div>
                );
            } else if (item as Comic) {
                const comic = item as Comic;
                return (
                    <div key={index}>
                        <h3>{comic.title}</h3>
                        <p>Year: {new Date(comic.releaseYear).getFullYear()}</p>
                        <button
                            onClick={() => handleRemoveFromWishlist(comic.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Remove from Wishlist
                        </button>
                    </div>
                );
            } else if ((item as Periodical).publisher) {
                const periodical = item as Periodical;
                return (
                    <div key={index}>
                        <h3>{periodical.title}</h3>
                        <p>Publisher: {periodical.publisher}</p>
                        <p>Year: {new Date(periodical.releaseYear).getFullYear()}</p>
                        <button
                            onClick={() => handleRemoveFromWishlist(periodical.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Remove from Wishlist
                        </button>
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <div>
            <h2>Your Wishlist</h2>
            {wishlistItems.length > 0 ? renderWishlistItems() : <p>No items in your wishlist.</p>}
        </div>
    );
};

export default Wishlist;
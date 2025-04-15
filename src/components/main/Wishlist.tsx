import { useEffect, useState } from "react";
import Header from "../../utilities/Header";
import NoticeCard from "../../utilities/NoticeCard";
import { User } from "../../models/User";
import { WishListItem } from "../../models/WishListItem";
import { Notice } from "../../models/Notice"; // Assuming Notice is a model you already have
import { fetchWishlistByUserId } from "../../api/WishListItemApi";
import { fetchNoticeById } from "../../api/NoticeApi"; // Assuming you have an API to fetch notices by ID

const Wishlist: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [wishlistItems, setWishlistItems] = useState<WishListItem[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);

    // Fetch current user from localStorage
    useEffect(() => {
        const initializeUser = () => {
            const data = localStorage.getItem('user');
            if (data) {
                const userData = JSON.parse(data);
                setCurrentUser(userData);
            }
        };

        initializeUser();
    }, []);

    // Fetch wishlist items of the current user
    useEffect(() => {
        if (currentUser?.id) {
            const fetchWishlist = async () => {
                try {
                    const items = await fetchWishlistByUserId(currentUser.id);
                    setWishlistItems(items);

                    // Now fetch the notices associated with each wishlist item
                    const fetchedNotices = await Promise.all(
                        items.map(async (item) => {
                            const notice = await fetchNoticeById(item.notice_id);
                            return notice;
                        })
                    );
                    setNotices(fetchedNotices); // Save the notices in state
                } catch (error) {
                    console.error("Failed to fetch wishlist items or notices", error);
                }
            };

            fetchWishlist();
        }
    }, [currentUser]);

    return (
        <>
            <Header />
            <div>
                <h1 className="text-4xl ml-4">Wishlist</h1>

                {notices.length === 0 ? (
                    <p>No items in your wishlist</p>
                ) : (
                    <div className="grid grid-cols-4 gap-2">
                        {/* Render the notices */}
                        {notices.map((notice) => (
                            <div key={notice.id}>
                                <NoticeCard notice={notice} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Wishlist;

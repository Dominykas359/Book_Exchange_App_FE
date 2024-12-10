import { useEffect, useState } from "react";
import { HistoryEntry } from "../models/HistoryEntry";
import { Notice } from "../models/Notice";
import { User } from "../models/User";
import { findBookById } from "../api/BookApi";
import { findComicById } from "../api/ComicApi";
import { findPeriodicalById } from "../api/PeriodicalApi";
import { fetchNoticeById } from "../api/NoticeApi";
import { fetchUserById } from "../api/UserApi";

interface HistoryCardProps {
    history: HistoryEntry;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ history }) => {
    const [notice, setNotice] = useState<Notice | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [publication, setPublication] = useState<any | null>(null);

    useEffect(() => {
        const initializeCurrentUser = () => {
            const data = localStorage.getItem('user');
            if(data){
                const userData = JSON.parse(data);
                setCurrentUser(userData);
            }
        }

        initializeCurrentUser();
    }, []);

    useEffect(() => {
        const initializeNotice = async (id: string) => {
            try {
                const data = await fetchNoticeById(id);
                setNotice(data);
            } catch (error) {
                console.error("Error fetching notice:", error);
            }
        };

        initializeNotice(history.noticeId);
    }, [history.noticeId]);

    useEffect(() => {
        const fetchPublicationForNotice = async (notice: Notice) => {
            try {
                if (notice.bookId) {
                    const book = await findBookById(notice.bookId);
                    setPublication(book);
                } else if (notice.comicId) {
                    const comic = await findComicById(notice.comicId);
                    setPublication(comic);
                } else if (notice.periodicalId) {
                    const periodical = await findPeriodicalById(notice.periodicalId);
                    setPublication(periodical);
                }
            } catch (error) {
                console.error("Error fetching publication:", error);
            }
        };

        if (notice) fetchPublicationForNotice(notice);
    }, [notice]);

    useEffect(() => {
        const initializeUser = async (userId: string, otherUserId: string) => {
            const data = await fetchUserById(userId);
            const data2 = await fetchUserById(otherUserId);
            setUser(data);
            setOtherUser(data2);
        }
        if(history){
            initializeUser(history.userId, history.buyer);
        }
        
    }, [history]);

    return (
        <div className="flex border solid rounded-3xl m-2 p-3 text-2xl shadow-md">
            {currentUser?.id === history.userId ? (
                <p>{publication?.status === "RENTED" ? "Rented" : "Bought"} {publication?.title} from {otherUser?.firstName} {otherUser?.lastName} for {publication?.price}€</p>
            ) : (
                <p>{publication?.status === "RENTED" ? "Rented" : "Sold"} {publication?.title} to {user?.firstName} {user?.lastName} for {publication?.price}€</p>
            )}
        </div>
    );
    
};

export default HistoryCard;

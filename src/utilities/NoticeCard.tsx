import { useState, useEffect } from "react";
import { findBookById, updateBook } from "../api/BookApi";
import { findComicById, updateComic } from "../api/ComicApi";
import { findPeriodicalById, updatePeriodical } from "../api/PeriodicalApi";
import { Notice } from "../models/Notice";
import { User } from "../models/User";
import { fetchUserById } from "../api/UserApi";
import { Link } from "react-router-dom";
import { AppRoutes } from "./Routes";
import { createHistory } from "../api/HistoryApi";
import { HistoryEntry } from "../models/HistoryEntry";

interface NoticeCardProps {
    notice: Notice;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
    const [publication, setPublication] = useState<any | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const data = JSON.parse(userData);
                setCurrentUser(data);
            }
        };

        initializeUser();
    }, []);

    useEffect(() => {
        const fetchUser = async (notice: Notice) => {
            try{
                if(notice.userId){
                    const user = await fetchUserById(notice.userId);
                    setUser(user);
                }
            } catch(error){
                console.error("Error fetching user", error);
            }
        }

        fetchUser(notice);
    }, []);

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
        }

        fetchPublicationForNotice(notice);
    }, [notice, publication]);

    const handleBuy = async () => {
        if (!publication) return;

        const updatedPublication = { ...publication, status: "SOLD" };

        if (notice.bookId) await updateBook(publication.id, updatedPublication);
        else if (notice.comicId) await updateComic(publication.id, updatedPublication);
        else if (notice.periodicalId) await updatePeriodical(publication.id, updatedPublication);

        const newHistory: HistoryEntry = {
            id: '',
            noticeId: notice.id,
            userId: currentUser?.id || '',
        };

        const historyFromPublisher: HistoryEntry = {
            id: '',
            noticeId: notice.id,
            userId: notice.userId,
        }

        await createHistory(newHistory);
        await createHistory(historyFromPublisher);
    };

    const handleRent = async () => {
        if (!publication) return;

        const updatedPublication = { ...publication, status: "RENTED" };

        if (notice.bookId) await updateBook(publication.id, updatedPublication);
        else if (notice.comicId) await updateComic(publication.id, updatedPublication);
        else if (notice.periodicalId) await updatePeriodical(publication.id, updatedPublication);

        const newHistory: HistoryEntry = {
            id: '',
            noticeId: notice.id,
            userId: currentUser?.id || '',
        };

        const historyFromPublisher: HistoryEntry = {
            id: '',
            noticeId: notice.id,
            userId: notice.userId,
        }

        await createHistory(newHistory);
        await createHistory(historyFromPublisher);
    };

    return (
        <div className="border p-4 rounded-lg shadow-md bg-white" style={{ height: '250px', overflow: 'hidden' }}>
            {publication ? (
                <>
                    <h2 className="text-xl font-bold">{publication.title}</h2>
                    <p>Author: {publication.author}</p>
                    <p>Year: {new Date(publication.releaseYear).getFullYear()}</p>
                    <p>Price: {publication.price}</p>
                    <p>Status: {publication.status}</p>
                    {publication.colored && (
                        <span>Colored: {publication.colored ? <span>Yes</span> : <span>No</span>}</span>
                    )}
                    {publication.number && (
                        <p>Number: {publication.number}</p>
                    )}
                    <p>Posted by {user?.firstName} {user?.lastName}</p>
                    <div>
                        <Link to={AppRoutes.CHATS}>Chat</Link>
                        <Link to={AppRoutes.COMMENTS} state={{ notice, publication }}>Comment</Link>
                        {currentUser?.id === notice?.userId ? (
                            (publication.status !== "SOLD" && publication.status !== "RENTED") && (
                                <Link to={AppRoutes.NOTICE} state={{ notice, publication }}>Edit</Link>
                            )
                        ) : (
                            <>
                                {publication?.status === "SELLING" && (
                                    <button onClick={handleBuy}>Buy</button>
                                )}
                                {publication?.status === "RENTING" && (
                                    <button onClick={handleRent}>Rent</button>
                                )}
                            </>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading publication...</p>
            )}
        </div>
    );
};

export default NoticeCard;

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
import { createChat, fetchChatByNoticeId } from "../api/ChatApi";
import { ChatEntry } from "../models/ChatEntry";

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
            buyer: notice.userId,
        };
        await createHistory(newHistory);
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
            buyer: notice.userId,
        };

        await createHistory(newHistory);
    };

    const handleChat = async () => {
        try {
            await fetchChatByNoticeId(notice.id);
        } catch (error) {
            const newChat: ChatEntry = {
                id: "",
                userId: currentUser?.id || '',
                noticeId: notice.id,
                messages: [],
                receiver: notice.userId
            };

            await createChat(newChat);
        }
    };

    return (
        <div className="border p-3 rounded-lg shadow-md bg-white my-1" style={{ height: '280px', overflow: 'hidden' }}>
            {publication ? (
                <>
                    <h2 className="text-xl font-bold">{publication.title}</h2>
                    <p>Author: {publication.author}</p>
                    <p>Year: {new Date(publication.releaseYear).getFullYear()}</p>
                    <p>Price: {publication.price}</p>
                    <p>Language: {publication.language}</p>
                    {publication.colored && (
                        <p>Colored: {publication.colored ? <span>Yes</span> : <span>No</span>}</p>
                    )}
                    {publication.number && (
                        <p>Number: {publication.number}</p>
                    )}
                    {publication.cover && (
                        <p>Cover: {publication.cover}</p>
                    )}
                    <p>Status: {publication.status}</p>
                    <p>Posted by {user?.firstName} {user?.lastName}</p>
                    <div>
                        {currentUser?.id !== notice.userId && (<Link to={AppRoutes.CHAT} state={{ notice, publication }} onClick={handleChat} className="border solid text-sm px-3 py-1 rounded-3xl m-1 bg-blue-300 text-white">Chat</Link>)}
                        <Link to={AppRoutes.COMMENTS} state={{ notice, publication }} className="border solid text-sm px-3 py-1 rounded-3xl m-1 bg-blue-300 text-white">Comment</Link>
                        {currentUser?.id === notice?.userId ? (
                            (publication.status !== "SOLD" && publication.status !== "RENTED") && (
                                <Link to={AppRoutes.NOTICE} state={{ notice, publication }} className="border solid text-sm px-3 py-1 rounded-3xl m-1 bg-blue-300 text-white">Edit</Link>
                            )
                        ) : (
                            <>
                                {publication?.status === "SELLING" && (
                                    <button onClick={handleBuy} className="border solid text-sm px-3 py-1 rounded-3xl m-1 bg-blue-500 text-white">Buy</button>
                                )}
                                {publication?.status === "RENTING" && (
                                    <button onClick={handleRent} className="border solid text-sm px-3 py-1 rounded-3xl m-1 bg-blue-500 text-white">Rent</button>
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

import { useState, useEffect } from "react";
import { findBookById } from "../api/BookApi";
import { findComicById } from "../api/ComicApi";
import { fetchNoticeById } from "../api/NoticeApi";
import { findPeriodicalById } from "../api/PeriodicalApi";
import { ChatEntry } from "../models/ChatEntry";
import { Notice } from "../models/Notice";
import { User } from "../models/User";
import { fetchUserById } from "../api/UserApi";

interface ChatCardProps{
    chat: ChatEntry;
}

const ChatCard: React.FC<ChatCardProps> =({ chat }) => {

    const [user, setUser] = useState<User | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [publication, setPublication] = useState<any | null>(null);

    useEffect(() => {
        const initializeNotice = async (id: string) => {
            const data = await fetchNoticeById(id);
            setNotice(data);
        };

        initializeNotice(chat.noticeId);
    }, [chat]);

    useEffect(() => {
        const initializeUser = async (id: string) => {
            const data = await fetchUserById(id);
            setUser(data);
        }

        initializeUser(chat?.userId || '');
    }, [chat]);

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

        if (notice) {
            fetchPublicationForNotice(notice);
        }
    }, [notice]);

    return(
        <h1>Chat with {user?.firstName} {user?.lastName} about {publication?.title}</h1>
    );
}

export default ChatCard;
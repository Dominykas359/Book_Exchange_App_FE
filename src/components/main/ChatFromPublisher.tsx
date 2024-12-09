import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatEntry } from "../../models/ChatEntry";
import { fetchChatWithMessages } from "../../api/ChatApi";
import { deleteMessage, sendMessage } from "../../api/MessageApi";
import { Message } from "../../models/Message";
import { User } from "../../models/User";
import { Notice } from "../../models/Notice";
import { fetchUserById } from "../../api/UserApi";
import { findBookById } from "../../api/BookApi";
import { findComicById } from "../../api/ComicApi";
import { findPeriodicalById } from "../../api/PeriodicalApi";
import { fetchNoticeById } from "../../api/NoticeApi";
import ConfirmationModal from "../../utilities/ConfirmationModal";

function ChatFromPublisher() {
    const location = useLocation();
    const { chat } = location.state || {};
    const [chatWithMessages, setChatWithMessages] = useState<ChatEntry | null>(null);
    const [messageText, setMessageText] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [sender, setSender] = useState<User | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [publication, setPublication] = useState<any | null>(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [messageToDeleteId, setMessageToDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const initializeCurrentUser = () => {
            const data = localStorage.getItem("user");
            if (data) {
                const userData = JSON.parse(data);
                setCurrentUser(userData);
            }
        };

        initializeCurrentUser();
    }, []);

    useEffect(() => {
        const initializeSender = async (id: string) => {
            const data = await fetchUserById(id);
            setSender(data);
        };

        initializeSender(chat?.userId);
    }, []);

    useEffect(() => {
        const initializeChatWithMessages = async (id: string) => {
            try {
                const chat = await fetchChatWithMessages(id);
                setChatWithMessages(chat);
            } catch (error) {
                console.error("Error fetching chat with messages:", error);
            }
        };

        if (chat?.id) {
            initializeChatWithMessages(chat.id);
        }
    }, [chat]);

    useEffect(() => {
        const initializeNotice = async (id: string) => {
            const data = await fetchNoticeById(id);
            setNotice(data);
        };

        initializeNotice(chat.noticeId);
    }, [chat]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const newMessage: Message = {
            id: "",
            userId: currentUser?.id || "",
            chatId: chat?.id || "",
            text: messageText,
            timeSent: new Date(),
        };

        try {
            await sendMessage(newMessage);
            setMessageText("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

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

    const handleConfirmation = (id: string) => {
        setMessageToDeleteId(id);
        setShowConfirmationModal(true);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmationModal(false);
        setMessageToDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (!messageToDeleteId) return;

        try {
            await deleteMessage(messageToDeleteId);
            setShowConfirmationModal(false);
            setMessageToDeleteId(null);

            if (chat?.id) {
                const updatedChat = await fetchChatWithMessages(chat.id);
                setChatWithMessages(updatedChat);
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <>
            <h1>
                Chat with {sender?.firstName} {sender?.lastName} about {publication?.title}
            </h1>
            <div>
                {chatWithMessages?.messages.map((message) => (
                    <div key={message.id}>
                        {message.text}
                        {message.userId === currentUser?.id ? (
                            <>
                                <button>Update</button>
                                <button onClick={() => handleConfirmation(message.id)}>Delete</button>
                            </>
                        ) : null}
                    </div>
                ))}
            </div>
            <ConfirmationModal
                isOpen={showConfirmationModal}
                message="Are you sure you want to delete this message?"
                onConfirm={handleConfirmDelete} // Call handleConfirmDelete directly
                onCancel={handleCancelConfirmation}
            />
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Write your message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        required
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </>
    );
}

export default ChatFromPublisher;
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatEntry } from "../../models/ChatEntry";
import { fetchChatWithMessages } from "../../api/ChatApi";
import { deleteMessage, sendMessage, updateMessage } from "../../api/MessageApi";
import { Message } from "../../models/Message";
import { User } from "../../models/User";
import { Notice } from "../../models/Notice";
import { fetchUserById } from "../../api/UserApi";
import { findBookById } from "../../api/BookApi";
import { findComicById } from "../../api/ComicApi";
import { findPeriodicalById } from "../../api/PeriodicalApi";
import { fetchNoticeById } from "../../api/NoticeApi";
import ConfirmationModal from "../../utilities/ConfirmationModal";
import UpdateModal from "../../utilities/UpdateModal";

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
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [messageToUpdate, setMessageToUpdate] = useState<Message | null>(null);

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

    const handleUpdate = (message: Message) => {
        setMessageToUpdate(message); // Set the message to be updated
        setShowUpdateModal(true); // Show the modal
    };

    const handleCancelUpdate = () => {
        setShowUpdateModal(false);
        setMessageToUpdate(null); // Clear the selected message
    };

    const handleUpdateSubmit = async (updatedText: string) => {
        if (!messageToUpdate) return;

        try {
            const updatedMessage = { ...messageToUpdate, text: updatedText };
            await updateMessage(updatedMessage, messageToUpdate.id);
            setShowUpdateModal(false);
            setMessageToUpdate(null);

            // Refresh the chat messages
            if (chat?.id) {
                const updatedChat = await fetchChatWithMessages(chat.id);
                setChatWithMessages(updatedChat);
            }
        } catch (error) {
            console.error("Error updating message:", error);
        }
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
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex flex-grow justify-center items-center">
                <div className="flex flex-col w-2/3 h-4/5 bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 border-b bg-blue-500 text-white">
                    Chat with {sender?.firstName} {sender?.lastName} about {publication?.title}
                    </div>
                    {/* Chat Messages */}
                    <div className="flex flex-col flex-grow p-4 overflow-y-auto">
                        {chatWithMessages?.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-2 rounded-lg mb-2 ${
                                    message.userId === currentUser?.id
                                        ? "self-end bg-blue-100"
                                        : "self-start bg-gray-200"
                                }`}
                            >
                                {message.text}
                                {message.userId === currentUser?.id && (
                                    <div className="mt-1 flex space-x-2">
                                        <button
                                            className="text-sm text-blue-600"
                                            onClick={() => handleUpdate(message)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="text-sm text-red-600"
                                            onClick={() => handleConfirmation(message.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Chat Input */}
                    <div className="p-4 border-t flex items-center">
                        <form className="flex w-full" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Write your message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="flex-grow p-2 border rounded-lg focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Modals */}
            <ConfirmationModal
                isOpen={showConfirmationModal}
                message="Are you sure you want to delete this message?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelConfirmation}
            />
            {showUpdateModal && messageToUpdate && (
                <UpdateModal
                    messageText={messageToUpdate.text}
                    onUpdate={handleUpdateSubmit}
                    onCancel={handleCancelUpdate}
                />
            )}
        </div>
    );
}

export default ChatFromPublisher;

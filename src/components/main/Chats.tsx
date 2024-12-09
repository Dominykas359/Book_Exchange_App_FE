import { useEffect, useState } from "react";
import Header from "../../utilities/Header";
import { User } from "../../models/User";
import { ChatEntry } from "../../models/ChatEntry";
import { fetchChatsByUser } from "../../api/ChatApi";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";
import ChatCard from "../../utilities/ChatCard";

function Chats() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [chats, setChats] = useState<ChatEntry[] | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            const data = localStorage.getItem('user');
            if (data) {
                const userData = JSON.parse(data);
                setCurrentUser(userData);
            }
        };

        initializeUser();
    }, []);

    useEffect(() => {
        const fetchChats = async (id: string) => {
            const data = await fetchChatsByUser(id);
            setChats(data);
        };

        if (currentUser) {
            fetchChats(currentUser.id);
        }
    }, [currentUser]);

    return (
        <div>
            <Header />
            {chats?.map((chat) => (
                <div key={chat.id}>
                    <Link to={AppRoutes.CHATPUBLISHER} state={{ chat }}>
                        <ChatCard chat={chat}/>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default Chats;

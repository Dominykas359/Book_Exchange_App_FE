import { useEffect, useState } from "react";
import Header from "../../utilities/Header";
import { HistoryEntry } from "../../models/HistoryEntry";
import { getHistory } from "../../api/HistoryApi";
import { User } from "../../models/User";
import HistoryCard from "../../utilities/HistoryCard";

function History(){

    const [histories, setHistories] = useState<HistoryEntry[] | null>(null);
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
        const fetchHistories = async (id: string) =>{

            const data = await getHistory(id);
            setHistories(data);
        }

        if(currentUser){
            fetchHistories(currentUser.id);
        }
    });

    return(
        <div>
            <Header />
            <div>
                {histories ? (
                    <div>
                        {histories?.map(history => (
                            <div key={history.id}>
                                <HistoryCard key={history.id} history={history}/>
                            </div>
                        ))}
                    </div>
                ):(
                    <p>Loading</p>
                )}
                
            </div>
        </div>
    );
}

export default History;
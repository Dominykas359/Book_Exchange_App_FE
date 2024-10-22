import { Link } from "react-router-dom";
import Header from "../../utilities/Header";
import { AppRoutes } from "../../utilities/Routes";
import { useEffect, useState } from "react";
import { Notice } from "../../models/Notice";
import { getAllNotices } from "../../api/NoticeApi";
import NoticeCard from "../../utilities/NoticeCard";

function Notices(){

    const [notices, setNotices] = useState<Notice[] | null>(null);

    useEffect(() => {
        const fetchNotices = async() => {
            const data = await getAllNotices();
            setNotices(data);
        }

        fetchNotices();
    }, [])

    return(
        <>
            <Header />
            <div className="flex">
                <div className="h-screen flex flex-col border-r border-gray-300 w-1/5 mr-1">
                    <div className="flex flex-col">
                        <Link to={AppRoutes.NEW_NOTICE}>Add new notice</Link>
                    </div>
                    <div className="flex h-full">
                        <form className="flex flex-col p-4 text-sm h-full">
                            <label htmlFor="notices">
                                <input type="radio" name="notices"></input> Posted by me
                            </label>
                            <label className="flex flex-col">
                                Publication type
                                <div className="flex flex-col">
                                    <label htmlFor="book">
                                        <input type="checkbox" id="book" name="publication-type"></input> Books
                                    </label>
                                    <label htmlFor="comic">
                                        <input type="checkbox" id="comic" name="publication-type"></input> Comics
                                    </label>
                                    <label htmlFor="periodical">
                                        <input type="checkbox" id="periodical" name="publication-type"></input> Periodicals
                                    </label>
                                </div>
                            </label>
                            <label htmlFor="author" className="flex flex-col">
                                Author
                                <input type="text" id="author" placeholder="Type to search..."></input>
                            </label>
                            <label htmlFor="title" className="flex flex-col">
                                Title
                                <input type="text" id="title" placeholder="Type to search..."></input>
                            </label>
                            <label className="flex flex-col">
                                Release year
                                <br></br>
                                <div>
                                    From: <input type="date" id="from"></input>
                                </div>
                                <div>
                                    To: <input type="date" id="to"></input>
                                </div>
                            </label>
                            <label className="flex flex-col">
                                Price
                                <br></br>
                                <div>
                                    From: <input type="number" id="from"></input>
                                </div>
                                <div>
                                    To: <input type="number" id="to"></input>
                                </div>
                            </label>
                            <label htmlFor="languages" className="flex flex-col">
                                Language
                                <select id="languages" name="languages">
                                    <option value="english">English</option>
                                    <option value="lithuanian">Lithuanian</option>
                                </select>
                            </label>
                            <label className="flex flex-col">
                                Status
                                <div>
                                    <input type="radio" id="renting" name="status"></input> Renting
                                </div>
                                <div>
                                    <input type="radio" id="selling" name="status"></input> Selling
                                </div>
                            </label>
                            <label htmlFor="cover" className="flex flex-col">
                                Cover
                                <select id="cover" name="cover">
                                    <option value="hard">Hard</option>
                                    <option value="soft">Soft</option>
                                </select>
                            </label>
                            <button type="submit">Search</button>
                        </form>
                    </div>
                </div>
                <div>
                    {notices ? (
                        <div className="grid grid-cols-4 gap-2">
                            {notices.map(notice => (
                                <div key={notice.id} className="">
                                    <NoticeCard key={notice.id} notice={notice} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Notices;
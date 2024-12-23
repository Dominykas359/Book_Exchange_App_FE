import { Link } from "react-router-dom";
import Header from "../../utilities/Header";
import { AppRoutes } from "../../utilities/Routes";
import { useEffect, useState } from "react";
import { Notice } from "../../models/Notice";
import { Book } from "../../models/Book";
import { Comic } from "../../models/Comic";
import { Periodical } from "../../models/Periodical";
import { getAllNotices } from "../../api/NoticeApi";
import NoticeCard from "../../utilities/NoticeCard";
import { User } from "../../models/User";
import { getBooks } from "../../api/BookApi";
import { getComics } from "../../api/ComicApi";
import { getPeriodicals } from "../../api/PeriodicalApi";

function Notices() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [allNotices, setAllNotices] = useState<Notice[] | null>(null);
    const [filteredNotices, setFilteredNotices] = useState<Notice[] | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [comics, setComics] = useState<Comic[]>([]);
    const [periodicals, setPeriodicals] = useState<Periodical[]>([]);
    const [postedByMe, setPostedByMe] = useState<boolean>(false);
    const [book, setBook] = useState<boolean>(false);
    const [comic, setComic] = useState<boolean>(false);
    const [periodical, setPeriodical] = useState<boolean>(false);
    const [author, setAuthor] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [fromPrice, setFromPrice] = useState<number | undefined>(undefined);
    const [toPrice, setToPrice] = useState<number | undefined>(undefined);
    const [language, setLanguage] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [cover, setCover] = useState<string>('');

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

    useEffect(() => {
        const fetchAllData = async () => {
            const noticesData = await getAllNotices();
            const booksData = await getBooks();
            const comicsData = await getComics();
            const periodicalsData = await getPeriodicals();

            setAllNotices(noticesData);
            setFilteredNotices(noticesData);
            setBooks(booksData);
            setComics(comicsData);
            setPeriodicals(periodicalsData);
        };

        fetchAllData();
    }, []);

    const handleSearch = () => {
        if (!allNotices) return;

        const filtered = allNotices.filter((notice) => {
            const { bookId, comicId, periodicalId } = notice;

            // Filter by user ownership
            if (postedByMe && notice.userId !== currentUser?.id) {
                return false;
            }

            // Determine the associated entity (Book, Comic, Periodical)
            const entity = bookId
                ? books.find((b) => b.id === bookId)
                : comicId
                ? comics.find((c) => c.id === comicId)
                : periodicals.find((p) => p.id === periodicalId);

            if (!entity) return false;

            // Filter by publication type
            const isBook = book && !!bookId;
            const isComic = comic && !!comicId;
            const isPeriodical = periodical && !!periodicalId;
            if ((book || comic || periodical) && !(isBook || isComic || isPeriodical)) {
                return false;
            }

            // Filter by author
            if (author && !entity.author?.toLowerCase().includes(author.toLowerCase())) {
                return false;
            }

            // Filter by title
            if (title && !entity.title?.toLowerCase().includes(title.toLowerCase())) {
                return false;
            }

            // Filter by release year
            if (fromDate && new Date(entity.releaseYear) < new Date(fromDate)) {
                return false;
            }
            if (toDate && new Date(entity.releaseYear) > new Date(toDate)) {
                return false;
            }

            // Filter by price range
            if (fromPrice !== undefined && entity.price < fromPrice) {
                return false;
            }
            if (toPrice !== undefined && entity.price > toPrice) {
                return false;
            }

            // Filter by language
            if (language && entity.language !== language) {
                return false;
            }

            // Filter by status
            if (status && entity.status !== status) {
                return false;
            }

            // Filter by cover type
            if (cover && 'cover' in entity && entity.cover !== cover) {
                return false;
            }

            return true; // Pass all filters
        });

        setFilteredNotices(filtered);
    };

    const resetFilters = () => {
        setPostedByMe(false);
        setBook(false);
        setComic(false);
        setPeriodical(false);
        setAuthor('');
        setTitle('');
        setFromDate('');
        setToDate('');
        setFromPrice(undefined);
        setToPrice(undefined);
        setLanguage('');
        setStatus('');
        setCover('');
        setFilteredNotices(allNotices); // Reset the displayed notices
    };

    return (
        <>
            <Header />
            <div className="flex">
                <div className="h-screen flex flex-col border-r border-gray-300 w-1/5 mr-1">
                    <div className="flex flex-col">
                        {currentUser?.role !== "ADMIN" && (
                            <Link 
                            to={AppRoutes.NEW_NOTICE} 
                            className="flex items-center justify-center border solid text-lg px-3 py-1 rounded-3xl my-1 bg-blue-500 text-white">
                                Post notice
                            </Link>
                        )}
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="border solid text-lg px-3 py-1 rounded-3xl my-1 bg-blue-500 text-white">
                            Reset filters
                        </button>
                    </div>
                    <div className="flex h-full">
                        <form
                            className="flex flex-col p-4 text-m h-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSearch();
                            }}
                        >
                            <label htmlFor="notices" className="text-m">
                                <input
                                    type="radio"
                                    name="notices"
                                    value="true"
                                    checked={postedByMe}
                                    onChange={() => setPostedByMe(true)}
                                />
                                Posted by me
                            </label>
                            <label htmlFor="all" className="text-m">
                                <input
                                    type="radio"
                                    name="notices"
                                    value="false"
                                    checked={!postedByMe}
                                    onChange={() => setPostedByMe(false)}
                                />
                                All notices
                            </label>
                            <label className="flex flex-col text-m mt-2">
                                <span className="font-bold">Publication type</span>
                                <div className="flex flex-col">
                                    <label htmlFor="book">
                                        <input
                                            type="checkbox"
                                            id="book"
                                            name="publication-type"
                                            checked={book}
                                            onChange={() => setBook(!book)}
                                        />
                                        Books
                                    </label>
                                    <label htmlFor="comic">
                                        <input
                                            type="checkbox"
                                            id="comic"
                                            name="publication-type"
                                            checked={comic}
                                            onChange={() => setComic(!comic)}
                                        />
                                        Comics
                                    </label>
                                    <label htmlFor="periodical">
                                        <input
                                            type="checkbox"
                                            id="periodical"
                                            name="publication-type"
                                            checked={periodical}
                                            onChange={() => setPeriodical(!periodical)}
                                        />
                                        Periodicals
                                    </label>
                                </div>
                            </label>
                            <label htmlFor="author" className="flex flex-col text-m mt-2">
                                <span className="font-bold">Author</span>
                                <input
                                    type="text"
                                    id="author"
                                    placeholder="Type to search..."
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="border solid rounded-lg my-1 p-1"
                                />
                            </label>
                            <label htmlFor="title" className="flex flex-col text-m mt-2">
                                <span className="font-bold">Title</span>
                                <input
                                    type="text"
                                    id="title"
                                    placeholder="Type to search..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border solid rounded-lg my-1 p-1"
                                />
                            </label>
                            <label className="flex flex-col text-m mt-2">
                                <span className="font-bold">Release year</span>
                                <div>
                                    From:
                                    <input
                                        type="date"
                                        id="from"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="border solid rounded-lg my-1 p-1"
                                    />
                                </div>
                                <div>
                                    To:
                                    <input
                                        type="date"
                                        id="to"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="border solid rounded-lg my-1 p-1"
                                    />
                                </div>
                            </label>
                            <label className="flex flex-col text-m mt-2">
                                <span className="font-bold">Price</span>
                                <div>
                                    From:
                                    <input
                                        type="number"
                                        id="fromPrice"
                                        value={fromPrice || ''}
                                        onChange={(e) => setFromPrice(parseFloat(e.target.value) || undefined)}
                                        className="border solid rounded-lg my-1 p-1"
                                    />
                                </div>
                                <div>
                                    To:
                                    <input
                                        type="number"
                                        id="toPrice"
                                        value={toPrice || ''}
                                        onChange={(e) => setToPrice(parseFloat(e.target.value) || undefined)}
                                        className="border solid rounded-lg my-1 p-1"
                                    />
                                </div>
                            </label>
                            <label htmlFor="languages" className="flex flex-col text-m mt-2">
                                <span className="font-bold">Language</span>
                                <select
                                    id="languages"
                                    name="languages"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="border solid rounded-lg my-1 p-1"
                                >
                                    <option value="">Select</option>
                                    <option value="English">English</option>
                                    <option value="Lithuanian">Lithuanian</option>
                                    <option value="German">German</option>
                                    <option value="Russian">Russian</option>
                                    <option value="Spanish">Spanish</option>
                                </select>
                            </label>
                            <label className="flex flex-col text-m mt-2">
                                <span className="font-bold">Status</span>
                                <div>
                                    <input
                                        type="radio"
                                        id="renting"
                                        name="status"
                                        value="renting"
                                        checked={status === "renting"}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="border solid rounded-lg my-1 p-1"
                                    />
                                    Renting
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="selling"
                                        name="status"
                                        value="selling"
                                        checked={status === "selling"}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="border solid rounded-lg my-1 p-1"
                                    />
                                    Selling
                                </div>
                            </label>
                            <label htmlFor="cover" className="flex flex-col text-m mt-2">
                                <span className="font-bold">Cover</span>
                                <select
                                    id="cover"
                                    name="cover"
                                    value={cover}
                                    onChange={(e) => setCover(e.target.value)}
                                    className="border solid rounded-lg my-1 p-1"
                                >
                                    <option value="">Select</option>
                                    <option value="hard">Hard</option>
                                    <option value="soft">Soft</option>
                                </select>
                            </label>
                            <button type="submit" className="border solid text-lg px-3 py-1 rounded-3xl my-1 bg-blue-500 text-white">Search</button>
                        </form>
                    </div>
                </div>
                <div>
                    {filteredNotices ? (
                        <div className="grid grid-cols-4 gap-2">
                            {filteredNotices.map((notice) => (
                                <div key={notice.id}>
                                    <NoticeCard notice={notice} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default Notices;

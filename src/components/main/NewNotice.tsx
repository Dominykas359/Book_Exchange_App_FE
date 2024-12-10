import { SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";
import { createBook } from "../../api/BookApi";
import { createComic } from "../../api/ComicApi";
import { createPeriodacal } from "../../api/PeriodicalApi"; 
import { User } from "../../models/User";
import { createNotice } from "../../api/NoticeApi";
import { Book } from "../../models/Book";
import { Comic } from "../../models/Comic";
import { Notice } from "../../models/Notice";
import { Periodical } from "../../models/Periodical";

function NewNotice() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    
    // Shared fields
    const [publicationType, setPublicationType] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [releaseYear, setReleaseYear] = useState("");
    const [publisher, setPublisher] = useState("");
    const [language, setLanguage] = useState("");
    const [status, setStatus] = useState("RENTING");
    const [price, setPrice] = useState(0);

    // Book-specific fields
    const [pageCount, setPageCount] = useState(0);
    const [cover, setCover] = useState("hard");
    const [translator, setTranslator] = useState("");

    // Comic-specific fields
    const [colored, setColored] = useState("true");

    // Periodical-specific fields
    const [number, setNumber] = useState(1);

    useEffect(() => {
        const initializeUser = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const data = JSON.parse(userData);
                setUser(data);
            }
        };

        initializeUser();
    }, []);

    const handlePublicationChange = (event: { target: { value: SetStateAction<string> } }) => {
        setPublicationType(event.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        let newNotice: Notice = {
            id: '',
            userId: user.id,
            bookId: '',
            comicId: '',
            periodicalId: '',
            timePosted: new Date(),
        };

        let publicationId = '';

        try {
            if (publicationType === "book") {
                const newBook: Book = {
                    id: '',
                    releaseYear: new Date(releaseYear),
                    title,
                    publisher,
                    author,
                    language,
                    status,
                    price,
                    pageCount,
                    cover,
                    translator,
                };
                const response = await createBook(newBook);
                if (response) {
                    publicationId = response.id;
                    newNotice.bookId = publicationId;
                }

            } else if (publicationType === "comic") {
                const newComic: Comic = {
                    id: '',
                    releaseYear: new Date(releaseYear),
                    title,
                    publisher,
                    author,
                    language,
                    status,
                    price,
                    pageCount,
                    colored: colored === "true",
                };
                const response = await createComic(newComic);
                if (response) {
                    publicationId = response.id;
                    newNotice.comicId = publicationId;
                }

            } else if (publicationType === "periodical") {
                const newPeriodical: Periodical = {
                    id: '',
                    releaseYear: new Date(releaseYear),
                    title,
                    publisher,
                    author,
                    language,
                    status,
                    price,
                    number,
                };
                const response = await createPeriodacal(newPeriodical);
                if (response) {
                    publicationId = response.id;
                    newNotice.periodicalId = publicationId;
                }
            }

            const createdNoticeResponse = await createNotice(newNotice);
            if (createdNoticeResponse) {
                navigate(AppRoutes.NOTICES);
            }

        } catch (error) {
            console.error("Error creating publication or notice:", error);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center">
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div>
                    <span>Publication type</span>
                    <select
                        id="publication"
                        name="publication"
                        value={publicationType}
                        onChange={handlePublicationChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="book">Book</option>
                        <option value="comic">Comic</option>
                        <option value="periodical">Periodical</option>
                    </select>
                </div>

                <div>
                    <span>Title</span>
                    <input
                        type="text"
                        name="title"
                        placeholder="Write title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <span>Author</span>
                    <input
                        type="text"
                        name="author"
                        placeholder="Write author..."
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <span>Release year</span>
                    <input
                        type="date"
                        name="year"
                        value={releaseYear}
                        onChange={(e) => setReleaseYear(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <span>Publisher</span>
                    <input
                        type="text"
                        name="publisher"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        required
                    />
                </div>
                <div>
                <label htmlFor="languages" className="flex flex-col">
                                Language
                                <select
                                    id="languages"
                                    name="languages"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="">Select</option>
                                    <option value="english">English</option>
                                    <option value="lithuanian">Lithuanian</option>
                                    <option value="german">German</option>
                                    <option value="russian">Russian</option>
                                    <option value="spanish">Spanish</option>
                                </select>
                            </label>
                </div>
                <div>
                    <span>Status</span>
                    <select
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="RENTING">Renting</option>
                        <option value="SELLING">Selling</option>
                    </select>
                </div>
                <div>
                    <span>Price</span>
                    <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                    />
                </div>

                {/* Conditional Fields for Books */}
                {publicationType === "book" && (
                    <>
                        <div>
                            <span>Page count</span>
                            <input
                                type="number"
                                name="page-count"
                                value={pageCount}
                                min={1}
                                onChange={(e) => setPageCount(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <span>Cover</span>
                            <select
                                id="cover"
                                name="cover"
                                value={cover}
                                onChange={(e) => setCover(e.target.value)}
                                required
                            >
                                <option value="hard">Hard</option>
                                <option value="soft">Soft</option>
                            </select>
                        </div>
                        <div>
                            <span>Translator</span>
                            <input
                                type="text"
                                name="translator"
                                value={translator}
                                onChange={(e) => setTranslator(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {/* Conditional Fields for Comics */}
                {publicationType === "comic" && (
                    <>
                        <div>
                            <span>Page count</span>
                            <input
                                type="number"
                                name="page-count"
                                value={pageCount}
                                min={1}
                                onChange={(e) => setPageCount(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div>
                            <span>Colored</span>
                            <select
                                id="colored"
                                name="colored"
                                value={colored}
                                onChange={(e) => setColored(e.target.value)}
                                required
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </>
                )}

                {/* Conditional Fields for Periodicals */}
                {publicationType === "periodical" && (
                    <>
                        <div>
                            <span>Number</span>
                            <input
                                type="number"
                                name="number"
                                value={number}
                                onChange={(e) => setNumber(Number(e.target.value))}
                                min={1}
                                required
                            />
                        </div>
                    </>
                )}
                <div className="flex">
                    <Link to={AppRoutes.NOTICES}>Cancel</Link>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default NewNotice;

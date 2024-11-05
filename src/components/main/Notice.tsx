import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";
import { deleteBook, updateBook } from "../../api/BookApi";
import { deleteComic, updateComic } from "../../api/ComicApi";
import { deletePeriodical, updatePeriodical } from "../../api/PeriodicalApi";
import { useState, useEffect } from "react";

function Notice() {
    const location = useLocation();
    const { notice, publication } = location.state || {};
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

    // Set publication type on component mount
    useEffect(() => {
        if (notice?.bookId) setPublicationType("Book");
        else if (notice?.comicId) setPublicationType("Comic");
        else if (notice?.periodicalId) setPublicationType("Periodical");

        if (publication) {
            setTitle(publication.title || "");
            setAuthor(publication.author || "");
            setReleaseYear(new Date(publication.releaseYear).toISOString().substring(0, 10));
            setPublisher(publication.publisher || "");
            setLanguage(publication.language || "");
            setStatus(publication.status || "RENTING");
            setPrice(publication.price || 0);

            if (publicationType === "Book") {
                setPageCount(publication.pageCount || 0);
                setCover(publication.cover || "hard");
                setTranslator(publication.translator || "");
            }

            if (publicationType === "Comic") {
                setPageCount(publication.pageCount || 0);
                setColored(publication.colored ? "true" : "false");
            }

            if (publicationType === "Periodical") {
                setNumber(publication.number || 1);
            }
        }
    }, [notice, publication, publicationType]);

    const handleUpdate = async () => {
        try {
            // Convert releaseYear to Date type
            const updatedReleaseYear = new Date(releaseYear);

            const updatedData = {
                id: publication.id,
                title,
                author,
                releaseYear: updatedReleaseYear, // Change releaseYear to Date type
                publisher,
                language,
                status,
                price,
            };

            if (publicationType === "Book") {
                await updateBook(publication.id, { ...updatedData, pageCount, cover, translator });
            } else if (publicationType === "Comic") {
                // Convert colored from string to boolean
                const isColored = colored === "true";
                await updateComic(publication.id, { ...updatedData, pageCount, colored: isColored });
            } else if (publicationType === "Periodical") {
                await updatePeriodical(publication.id, { ...updatedData, number });
            }

            // Redirect back to notices after update
            navigate(AppRoutes.NOTICES);
        } catch (error) {
            console.error("Error updating notice:", error);
        }
    };

    const handleDelete = async () => {
        try {
            if (publicationType === "Book") await deleteBook(publication.id);
            else if (publicationType === "Comic") await deleteComic(publication.id);
            else if (publicationType === "Periodical") await deletePeriodical(publication.id);
            navigate(AppRoutes.NOTICES);
        } catch (error) {
            console.error("Error deleting notice:", error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div>
                <p>{publicationType}</p>
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
                    <span>Language</span>
                    <input
                        type="text"
                        name="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    />
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

                {publicationType === "Book" && (
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

                {publicationType === "Comic" && (
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

                {publicationType === "Periodical" && (
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
            </div>
            <div>
                <button onClick={handleDelete}>Delete</button>
                <Link to={AppRoutes.NOTICES}>Cancel</Link>
                <button onClick={handleUpdate}>Save Changes</button>
            </div>
        </div>
    );
}

export default Notice;

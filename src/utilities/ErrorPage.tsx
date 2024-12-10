import { Link } from "react-router-dom";
import { AppRoutes } from "./Routes";

function ErrorPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-xl font-medium text-gray-800 mb-6">
                Oops! Such page does not exist.
            </h2>
            <Link
                to={AppRoutes.NOTICES}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
                Go to Main Page
            </Link>
        </div>
    );
}

export default ErrorPage;

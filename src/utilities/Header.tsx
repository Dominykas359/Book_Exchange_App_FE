import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "./Routes";

function Header(){

    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.removeItem('user');
        navigate(AppRoutes.LOG_IN);
      };

    return(
        <div className="flex flex-col">
            <div className="flex items-center mt-2">
                <Link to={AppRoutes.NOTICES}>
                    <img src="/article.png" className="w-16 h-16 hover:scale-110 transition-transform mx-4"></img>
                </Link>
                <Link to={AppRoutes.CHATS}>
                    <img src="/chat.png" className="w-16 h-16 hover:scale-110 transition-transform mx-4"></img>
                </Link>
                <Link to={AppRoutes.HISTORY}>
                    <img src="/refresh.png" className="w-16 h-16 hover:scale-110 transition-transform mx-4"></img>
                </Link>
                <Link to={AppRoutes.SETTINGS}>
                    <img src="/settings.png" className="w-16 h-16 hover:scale-110 transition-transform mx-4"></img>
                </Link>
                <div className="ml-auto mr-2 hover:scale-110 transition-transform rounded-full bg-blue-500 text-white shadow hover:bg-blue-700 px-4 py-2">
                    <button onClick={handleClick}>Log out</button>
                </div>
            </div>
            <hr className="border-t border-gray-300 my-2 w-full"></hr>
        </div>
    );
}

export default Header;
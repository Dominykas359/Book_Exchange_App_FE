import { Link } from "react-router-dom";
import { AppRoutes } from "./Routes";

function ErrorPage(){

    return(
        <div>
            <h1>Such page does not exist</h1>
            <Link to={AppRoutes.NOTICES}>Go to main page</Link>
        </div>
    );
}

export default ErrorPage;
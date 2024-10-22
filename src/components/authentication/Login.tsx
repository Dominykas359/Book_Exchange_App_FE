import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";

interface Credentials {
    email: string,
    password: string
}

function Login(){

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, credentials);

            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('user', JSON.stringify(data));
                navigate(AppRoutes.NOTICES);
            } else {
                setError('Wrong email or password. Please try again.');
            }
        } catch (error) {
            setError('Wrong email or password. Please try again.');
        }
    }

    return(
        <div className="min-w-full min-h-full flex justify-center items-center">
            <div className="flex flex-col">
                <h1>Welcome to booky</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <br></br>
                    <input type="email" name="email" value={credentials.email} onChange={handleInputChange} className="border solid"></input>
                    <br></br>
                    <label htmlFor="password">Password</label>
                    <br></br>
                    <input type="password" name="password" value={credentials.password} onChange={handleInputChange} className="border solid"></input>
                    <div className="child">
                        <button className="authentication-button" type="submit">Login</button>
                    </div>
                </form>
                {error && (
                            <span className="error-message">{error}</span>
                        )}
                <span>Don't have an accout yet?</span>
                <Link to={AppRoutes.SIGN_UP} className="no-underline text-[hsl(272,76%,52%)]">Sign up</Link>
            </div>
        </div>
    );
}

export default Login;
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
            <div className="min-h-full flex flex-col justify-center items-center mt-20">
                <div className="flex my-5">
                    <img src="/book.png" className="w-8 h-8 hover:scale-110 transition-transform mx-4"></img>
                    <h1 className="text-3xl">Welcome to Booky</h1>
                    <img src="/book.png" className="w-8 h-8 hover:scale-110 transition-transform mx-4"></img>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="text-lg">Email</label>
                    <br></br>
                    <input type="email" name="email" value={credentials.email} onChange={handleInputChange} className="border solid rounded-lg my-1 p-1"></input>
                    <br></br>
                    <label htmlFor="password" className="text-lg">Password</label>
                    <br></br>
                    <input type="password" name="password" value={credentials.password} onChange={handleInputChange} className="border solid rounded-lg my-1 p-1"></input>
                    <div className="child">
                        <button className="border solid text-lg px-3 py-1 rounded-3xl my-1 bg-blue-500 text-white" type="submit">Login</button>
                    </div>
                </form>
                {error && (
                            <span className="text-red-500">{error}</span>
                        )}
                <div className="flex">
                    <span className="text-m">Don't have an accout yet?</span>
                    <Link to={AppRoutes.SIGN_UP} className="no-underline text-[hsl(272,76%,52%)] text-m">Sign up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
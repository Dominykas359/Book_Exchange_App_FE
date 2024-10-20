import axios from "axios";
import { useState } from "react";
import { AppRoutes } from "../../utilities/Routes";
import { Link, useNavigate } from "react-router-dom";

interface Credentials{
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
    birthday: string
}

enum ErrorType {
    NoError = "no_error",
    UsernameTaken = "username_is_already_taken",
    EmailRegistered = "this_email_is_already_registered",
    TooWeakPassword = "password_too_week",
    PasswordNotMatch = "password_do_not_match",
    Other = "other"
}

interface Err {
    message: String,
    errorType: ErrorType
}

function Registration(){

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const[credentials, setCredentials] = useState<Credentials>({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        birthday: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState<Err>({
        message: '',
        errorType: ErrorType.NoError 
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        validatePasswords(event.target.value, credentials.confirmPassword);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        validatePasswords(credentials.password, event.target.value);
    };
    function isPasswordStrong(password: string): boolean {
        const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
        return regex.test(password);
    }

    function validatePasswords(password: string, confirmPassword: string) {
        if (!isPasswordStrong(password)) {
            setError({
                message: '',
                errorType: ErrorType.TooWeakPassword
            });
        }
        else {
            if (password !== confirmPassword) {
                setError({
                    message: '',
                    errorType: ErrorType.PasswordNotMatch
                });
            }
            else {
                setError({
                    message: '',
                    errorType: ErrorType.NoError
                });
            }
        }
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || error.errorType === ErrorType.PasswordNotMatch || error.errorType === ErrorType.TooWeakPassword) return;
        setIsSubmitting(true);
        setError({
            message: '',
            errorType: ErrorType.NoError
        });

        const registerCredentials = {
            email: credentials.email,
            password: credentials.password,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            birthday: credentials.birthday
        }

        let response;
        try {
            response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/registration`, registerCredentials);
            console.log(response);
            navigate(AppRoutes.LOG_IN);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="min-w-full min-h-full flex justify-center items-center">
            <div>
                <h1>Welcome to Booky</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <br></br>
                    <input type="email" name="email" value={credentials.email} onChange={handleInputChange} className="border solid"></input>
                    <br></br>
                    <label htmlFor="firstName">Firstname</label>
                    <br></br>
                    <input type="text" name="firstName" value={credentials.firstName} onChange={handleInputChange} className="border solid"></input>
                    <br></br>
                    <label htmlFor="lastName">Lastname</label>
                    <br></br>
                    <input type="text" name="lastName" value={credentials.lastName} onChange={handleInputChange} className="border solid"></input>
                    <br></br>
                    <label htmlFor="birthday">birthday</label>
                    <br></br>
                    <input type="date" name="birthday" value={credentials.birthday} onChange={handleInputChange} className="border solid"></input>
                    <br></br>
                    <label htmlFor="password">Password</label>
                    <br></br>
                    <input type="password" name="password" value={credentials.password} onChange={handlePasswordChange} className="border solid"></input>
                    <br></br>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <br></br>
                    <input type="password" name="confirmPassword" value={credentials.confirmPassword} onChange={handleConfirmPasswordChange} className="border solid"></input>
                    <div className="child">
                            <button type="submit" className="border solid">Sign Up</button>
                        </div>
                </form>
                <span>Already have an account? </span>
                <Link to={AppRoutes.LOG_IN} className="no-underline text-[hsl(272,76%,52%)]">Log in</Link>
            </div>
        </div>
    );
}

export default Registration;
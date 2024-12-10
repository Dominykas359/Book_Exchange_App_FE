import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../utilities/Routes";
import { ErrorType } from "../../utilities/validations/ErrorType";
import { validatePasswords } from "../../utilities/validations/PasswordValidation";
import { fetchUserByEmail } from "../../api/UserApi";

interface Credentials {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    birthday: string;
}

interface Err {
    message: string;
    errorType: ErrorType;
}

function Registration() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [credentials, setCredentials] = useState<Credentials>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        birthday: new Date().toISOString().split("T")[0],
    });
    const [error, setError] = useState<Err>({
        message: "",
        errorType: ErrorType.NoError,
    });
    const [emailError, setEmailError] = useState<Err>({
        message: "",
        errorType: ErrorType.NoError
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        const validationError = validatePasswords(event.target.value, credentials.confirmPassword);
        setError({ message: "", errorType: validationError });
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        const validationError = validatePasswords(credentials.password, event.target.value);
        setError({ message: "", errorType: validationError });
    };

    const handleCheckEmail = async (event: React.FocusEvent<HTMLInputElement>) => {
        const { value } = event.target;

        try {
            const response = await fetchUserByEmail(value);

            if (response) {
                setEmailError({
                    message: 'Email is already registered',
                    errorType: ErrorType.EmailRegistered
                });
            } else {
                setEmailError({
                    message: '',
                    errorType: ErrorType.NoError
                });
            }
        } catch (error) {
            
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || error.errorType !== ErrorType.NoError) return;

        setIsSubmitting(true);
        setError({ message: "", errorType: ErrorType.NoError });

        const registerCredentials = {
            email: credentials.email,
            password: credentials.password,
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            birthday: credentials.birthday,
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/registration`, registerCredentials);
            console.log(response);
            navigate(AppRoutes.LOG_IN);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-w-full min-h-full flex justify-center items-center">
            <div className="min-h-full flex flex-col justify-center items-center mt-15">
                <div className="flex my-5">
                    <img src="/book.png" className="w-8 h-8 hover:scale-110 transition-transform mx-4"></img>
                    <h1 className="text-3xl">Welcome to Booky</h1>
                    <img src="/book.png" className="w-8 h-8 hover:scale-110 transition-transform mx-4"></img>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="text-lg">Email</label>
                    <br />
                    <input type="email" name="email" value={credentials.email} onChange={handleInputChange} onBlur={handleCheckEmail} required className="border solid rounded-lg my-1 p-1" />
                    {emailError.errorType === ErrorType.EmailRegistered && (
                        <>
                            <br />
                            <span className="text-red-500">{emailError.message}</span>
                        </>
                    )}
                    <br />
                    <label htmlFor="firstName" className="text-lg">Firstname</label>
                    <br />
                    <input type="text" name="firstName" value={credentials.firstName} onChange={handleInputChange} required className="border solid rounded-lg my-1 p-1" />
                    <br />
                    <label htmlFor="lastName" className="text-lg">Lastname</label>
                    <br />
                    <input type="text" name="lastName" value={credentials.lastName} onChange={handleInputChange} required className="border solid rounded-lg my-1 p-1" />
                    <br />
                    <label htmlFor="birthday" className="text-lg">Birthday</label>
                    <br />
                    <input type="date" name="birthday" value={credentials.birthday} onChange={handleInputChange} required className="border solid rounded-lg my-1 p-1" />
                    <br />
                    <label htmlFor="password" className="text-lg">Password</label>
                    <br />
                    <input type="password" name="password" value={credentials.password} onChange={handlePasswordChange} required className="border solid rounded-lg my-1 p-1" />
                    {error.errorType === ErrorType.TooWeakPassword && (
                        <>
                            <br />
                            <span className="text-red-500">Password is too weak</span>
                        </>
                    )}
                    <br />
                    <label htmlFor="confirmPassword" className="text-lg">Confirm Password</label>
                    <br />
                    <input type="password" name="confirmPassword" value={credentials.confirmPassword} onChange={handleConfirmPasswordChange} required className="border solid rounded-lg my-1 p-1" />
                    {error.errorType === ErrorType.PasswordNotMatch && (
                        <>
                            <br />
                            <span className="text-red-500">Passwords do not match</span>
                        </>
                    )}
                    <div className="min-w-full">
                        <button type="submit" className="border solid text-lg px-3 py-1 rounded-3xl my-1 bg-blue-500 text-white">
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="flex">
                    <span className="text-m">Already have an account?</span>
                    <Link to={AppRoutes.LOG_IN} className="no-underline text-[hsl(272,76%,52%)] text-m">Log in</Link>
                </div>
            </div>
        </div>
    );
}

export default Registration;

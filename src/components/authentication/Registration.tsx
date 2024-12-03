import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
            <div>
                <h1>Welcome to Booky</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input type="email" name="email" value={credentials.email} onChange={handleInputChange} onBlur={handleCheckEmail} required className="border solid" />
                    {emailError.errorType === ErrorType.EmailRegistered && (
                        <>
                            <br />
                            <span className="error-message">{emailError.message}</span>
                        </>
                    )}
                    <br />
                    <label htmlFor="firstName">Firstname</label>
                    <br />
                    <input type="text" name="firstName" value={credentials.firstName} onChange={handleInputChange} required className="border solid" />
                    <br />
                    <label htmlFor="lastName">Lastname</label>
                    <br />
                    <input type="text" name="lastName" value={credentials.lastName} onChange={handleInputChange} required className="border solid" />
                    <br />
                    <label htmlFor="birthday">Birthday</label>
                    <br />
                    <input type="date" name="birthday" value={credentials.birthday} onChange={handleInputChange} required className="border solid" />
                    <br />
                    <label htmlFor="password">Password</label>
                    <br />
                    <input type="password" name="password" value={credentials.password} onChange={handlePasswordChange} required className="border solid" />
                    {error.errorType === ErrorType.TooWeakPassword && (
                        <>
                            <br />
                            <span className="error-message">Password is too weak</span>
                        </>
                    )}
                    <br />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <br />
                    <input type="password" name="confirmPassword" value={credentials.confirmPassword} onChange={handleConfirmPasswordChange} required className="border solid" />
                    {error.errorType === ErrorType.PasswordNotMatch && (
                        <>
                            <br />
                            <span className="error-message">Passwords do not match</span>
                        </>
                    )}
                    <div className="child">
                        <button type="submit" className="border solid">
                            Sign Up
                        </button>
                    </div>
                </form>
                <span>Already have an account? </span>
                <a href={AppRoutes.LOG_IN} className="no-underline text-[hsl(272,76%,52%)]">
                    Log in
                </a>
            </div>
        </div>
    );
}

export default Registration;

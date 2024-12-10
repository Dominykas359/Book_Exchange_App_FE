import React, { useEffect, useState } from "react";
import Header from "../../utilities/Header";
import { validatePasswords } from "../../utilities/validations/PasswordValidation";
import { User } from "../../models/User";
import { changePassword, deleteUser, fetchUserByEmail, updateUser } from "../../api/UserApi";
import { ErrorType } from "../../utilities/validations/ErrorType";
import ConfirmationModal from "../../utilities/ConfirmationModal";
import { AppRoutes } from "../../utilities/Routes";
import { useNavigate } from "react-router-dom";

interface Err {
    message: string;
    errorType: ErrorType;
}

function Settings(){

    const [user, setUser] = useState<User | null>(null);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [birthday, setBirthday] = useState<Date>(new Date());
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<Err>({
        message: "",
        errorType: ErrorType.NoError,
    });
    const [emailError, setEmailError] = useState<Err>({
        message: "",
        errorType: ErrorType.NoError,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const initializeUser = async () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                const data = JSON.parse(userData);
    
                setUser(data);
                setEmail(data.email);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setBirthday(new Date(data.birthday));
            }
        };

        initializeUser();
    }, []);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordValue = event.target.value;
        setPassword(newPasswordValue);
        const validationError = validatePasswords(newPasswordValue, confirmPassword);
        setPasswordError({message: "Password is too weak", errorType: validationError});
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPasswordValue = event.target.value;
        setConfirmPassword(confirmPasswordValue);
        const validationError = validatePasswords(password, confirmPasswordValue);
        setPasswordError({message: "Passwords do not match", errorType: validationError});
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        setEmail(email);
    }

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const firstName = event.target.value;
        setFirstName(firstName);
    }

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const lastName = event.target.value;
        setLastName(lastName);
    }

    const handleBirthdayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const parsedDate = new Date(value);
        setBirthday(parsedDate);
    }

    const handleConfirmation = () => {
        setShowConfirmationModal(true);
    };

    const handleCancelConfirmation = () => {
        setShowConfirmationModal(false);
    };

    const handleConfirmDelete = async () => {
        try {
            if(user){
                await deleteUser(user.id);
            }
            setShowConfirmationModal(false);
            localStorage.removeItem('user');
            navigate(AppRoutes.LOG_IN);
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (passwordError.errorType !== ErrorType.NoError) {
            return;
        }

        try {
            if (user) {
                user.password = password;
                await changePassword(user.id, user);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError({
                message: 'Error changing password',
                errorType: ErrorType.Other,
            });
        }
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

    const handleInfoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(emailError.errorType !== ErrorType.NoError){
            return;
        }

        try {
            if (user) {
                user.username = email;
                user.firstName = firstName;
                user.lastName = lastName;
                user.birthday = birthday;
                await updateUser(user.id, user);
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    return (
        <div>
            <Header />
            <div className="flex">
                {/* Left Section - Personal Information */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 border-r border-gray-300">
                    <h1 className="text-xl font-semibold mb-4">Personal Information</h1>
                    <form onSubmit={handleInfoSubmit} className="w-3/4 max-w-md">
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleCheckEmail}
                            required
                            className="w-full border border-gray-300 rounded-lg my-2 p-2"
                        />
                        {emailError.errorType === ErrorType.EmailRegistered && (
                            <span className="text-red-500">{emailError.message}</span>
                        )}
    
                        <label htmlFor="firstName" className="block text-sm font-medium">
                            Firstname
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            required
                            className="w-full border border-gray-300 rounded-lg my-2 p-2"
                        />
    
                        <label htmlFor="lastName" className="block text-sm font-medium">
                            Lastname
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleLastNameChange}
                            required
                            className="w-full border border-gray-300 rounded-lg my-2 p-2"
                        />
    
                        <label htmlFor="birthday" className="block text-sm font-medium">
                            Birthday
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            value={birthday.toISOString().split('T')[0]}
                            onChange={handleBirthdayChange}
                            required
                            className="w-full border border-gray-300 rounded-lg my-2 p-2"
                        />
    
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded-lg py-2 mt-4 hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </form>
                </div>
    
                {/* Right Section - Password Change */}
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <h1 className="text-xl font-semibold mb-4">Password Change</h1>
                    <form onSubmit={handlePasswordSubmit} className="w-3/4 max-w-md">
                        <label htmlFor="newPassword" className="block text-sm font-medium">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="******"
                            value={password}
                            onChange={handleNewPasswordChange}
                            className="w-full border border-gray-300 rounded-lg my-2 p-2"
                            required
                        />
                        {passwordError.errorType === ErrorType.TooWeakPassword && (
                            <span className="text-red-500">Password is too weak</span>
                        )}
    
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mt-4">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="******"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            className="w-full border border-gray-300 rounded-lg my-2 p-2"
                            required
                        />
                        {passwordError.errorType === ErrorType.PasswordNotMatch && (
                            <span className="text-red-500">Passwords do not match</span>
                        )}
    
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white rounded-lg py-2 mt-4 hover:bg-green-600"
                        >
                            Change Password
                        </button>
                    </form>
    
                    <button
                        onClick={handleConfirmation}
                        className="w-3/4 max-w-md bg-red-500 text-white rounded-lg py-2 mt-4 hover:bg-red-600"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
    
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showConfirmationModal}
                message="Are you sure you want to delete your account?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelConfirmation}
            />
        </div>
    );
    
}

export default Settings;
import { ErrorType } from "./ErrorType";

export function isPasswordStrong(password: string): boolean {
    const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$');
    return regex.test(password);
}

export function validatePasswords(password: string, confirmPassword: string): ErrorType {
    if (!isPasswordStrong(password)) {
        return ErrorType.TooWeakPassword;
    } 
    if (password !== confirmPassword) {
        return ErrorType.PasswordNotMatch;
    }
    return ErrorType.NoError;
}

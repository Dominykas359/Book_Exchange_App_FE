export enum ErrorType {
    NoError = "no_error",
    EmailRegistered = "this_email_is_already_registered",
    TooWeakPassword = "password_too_week",
    PasswordNotMatch = "password_do_not_match",
    Other = "other"
}
/** SECURITY CONSTANTS */
export const SECURITY = {
  PASSWORD_REGEX:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PASSWORD_ERROR_MSG:
    "Password must contain an uppercase letter, a lowercase letter, a digit and a special character and must be at least 8 characters long",
};

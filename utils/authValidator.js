class IError {
    constructor(field, message) {
        this.field = field;
        this.message = message;
    }
}

// Function to validate signup payload
async function validateSignup(payload) {
    const errors = [];

    if (payload == null) {
        errors.push(new IError("payload", "Payload is required"));
        return errors;
    }

    const { email, fullName, password } = payload;

    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
        errors.push(...emailErrors);
    }


    if (fullName == null || fullName === "") {
        errors.push(new IError("fullName", "Fullname is required"));
        return errors;
    }

    // Fullname must be at least 3 characters long
    if (payload.fullName.length < 3) {
        errors.push(new IError("fullName", "Fullname must be at least 3 characters long"));
    }

    const passwordErrors = validatePassword(password);
    console.log(passwordErrors)
    if (passwordErrors.length > 0) {
        errors.push(...passwordErrors);
    }

    return errors;
}

// Function to validate sign-in payload
async function validateSignIn(payload) {
    const errors = [];

    if (payload == null || JSON.stringify(payload) === "{}") {
        errors.push(new IError("payload", "Payload is required"));
        return errors;
    }

    const { email, password } = payload;

    const emailErrors = validateEmail(email);
    if (emailErrors.length > 0) {
        errors.push(...emailErrors);
    }

    if (password == null || password === "") {
        errors.push(new IError("password", "Password is required"));
        return errors;
    }

    return errors;
}

// Function to validate update user detail
async function validateUpdateUser(id, payload) {
    const errors = [];

    if (payload == null || JSON.stringify(payload) === "{}") {
        errors.push(new IError("payload", "Payload is required"));
        return errors;
    }
}

// Function to validate email format
function validateEmail(email) {
    const errors = [];
    if (email == null || email === "") {
        errors.push(new IError("email", "Email is required"));
        return errors;
    }

    const emailRegex = /\S+@\S+\.[a-zA-Z]+$/;
    if (!emailRegex.test(email)) {
        errors.push(new IError("email", "Invalid email"));
    }

    return errors;
}

// Function to validate password strength
function validatePassword(password) {
    const errors = [];

    if (password == null || password === "") {
        errors.push(new IError("password", "Password is required"));
        return errors;
    }

    // Password must be at least 8 characters long
    if (password.length < 8) {
        errors.push(new IError("password", "Password must be at least 8 characters long"));
    }

    // Password must contain at least 1 lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push({
            message: "Password must contain at least 1 lowercase letter",
            field: "password",
        });
    }

    // Password must contain at least 1 uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push({
            message: "Password must contain at least 1 uppercase letter",
            field: "password",
        });
    }

    // Password must contain at least 1 number
    if (!/\d/.test(password)) {
        errors.push({
            message: "Password must contain at least 1 number",
            field: "password",
        });
    }

    // Password must contain at least 1 special character
    if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push({
            message: "Password must contain at least 1 special character",
            field: "password",
        });
    }

    return errors;
}


function validateId(id) {
    const errors = [];

    if (id == null || id === "") {
        errors.push({
            field: "id",
            message: "id is required",
        });
        return errors;
    }

    return errors;
}
// Export the functions/types if required
module.exports = { validateSignup, validateSignIn, validateUpdateUser, validatePassword, validateEmail };

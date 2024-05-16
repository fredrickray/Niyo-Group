const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { InvalidInput } = require("../middlewares/errorHandler")

// Generate token for authorization
const generateToken = (payload, tokenType) => {
    const secretKey = process.env.JWT_SECRET;

    if (secretKey == null) {
        throw new Error("JWT secret key is not defined");
    }

    let expiresIn = "4h";
    if (tokenType === "refresh") {
        expiresIn = "7d";
    } else if (tokenType === "reset") {
        return; // Return early for reset token
    } else if (tokenType === "access") {
        expiresIn = "4h";
    }

    const token = jwt.sign(payload, secretKey, { expiresIn });
    if (!token) {
        throw new Error("Failed to generate token");
    }
    return token;
};

// Verify token
const verifyToken = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        if (!token || !secretKey) {
            throw new InvalidInput("Token or secretKey is missing");
        }

        const decodedUser = jwt.verify(token, secretKey);

        return decodedUser;
    } catch (error) {
        throw new InvalidInput("Invalid token");
    }
};

// Hash data using bcrypt
const hashData = async (data) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data, salt);
    return hash;
};

// Export functions
module.exports = { generateToken, verifyToken, hashData };

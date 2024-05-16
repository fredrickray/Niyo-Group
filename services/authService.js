const { UserModel } = require("../models/userModel");
const { sendMail } = require("../utils/email");
const { generateOtp } = require("../utils/otp");
const { generateToken } = require("../utils/authorization");
const { maxAge } = require("../middlewares/createToken")
const { verifyToken } = require("../utils/authorization")
const {
    validateSignup,
    validateSignIn,
    validateUpdateUser,
    validatePassword,
    validateEmail } = require("../utils/authValidator");
const {
    BadRequest,
    Unauthorized,
    ResourceNotFound,
    InvalidInput,
    Conflict
} = require('../middlewares/errorHandler');


class AuthService {
    static async signup(req, res, next) {
        try {
            const reqBody = req.body;

            const errors = await validateSignup(reqBody);
            if (errors.length > 0) {
                throw new InvalidInput("Invalid input", errors);
            }

            let { email } = reqBody;
            email = email.toLowerCase();
            reqBody.email = email;

            const existingUser = await UserModel.findOne({ email });

            if (existingUser != null) {
                throw new Conflict("User already exists");
            }

            const newUser = new UserModel(reqBody);

            const verificationCode = generateOtp();
            newUser.otp = verificationCode;
            newUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

            await sendMail(
                email,
                "Email Verification",
                `Your verification code is: ${verificationCode}`
            );

            await newUser.save();

            const resPayload = {
                success: true,
                message: `A verification code was sent to ${email}`,
            };

            res.status(201).json(resPayload);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    static async signin(req, res, next) {
        try {
            const reqBody = req.body;

            const errors = await validateSignIn(reqBody);
            if (errors.length > 0) {
                throw new InvalidInput("Invalid input", errors);
            }

            let { email, password } = reqBody;
            email = email.toLowerCase();

            const existingUser = await UserModel.findOne({ email });
            if (!existingUser) {
                throw new ResourceNotFound("User not found");
            }

            const isPasswordMatch = await existingUser.isPasswordMatch(password);

            if (!isPasswordMatch) {
                throw new Unauthorized("Authentication failed: wrong password");
            }

            if (existingUser.isVerified === false) {
                console.log("line 93:", existingUser.otp)
                // if (existingUser.otp == null) {

                const verificationCode = generateOtp();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

                await sendMail(
                    email,
                    "Email Verification",
                    `Your verification code is: ${verificationCode}`
                );

                await existingUser.updateOne({ otp: verificationCode, otpExpiry });
                console.log("line 106:", existingUser.otp)
                // }

                throw new Unauthorized(
                    "User is not verified, check your email for verification code"
                );
            }

            const payload = { id: existingUser.id };

            const token = generateToken(payload, "access");
            res.header("authorization", `Bearer ${token}`);

            const resPayload = {
                success: true,
                message: "Login successful!",
                user: existingUser.toJSON(),
                token,
            };

            res.status(200).json(resPayload);
        } catch (error) {
            next(error);
        }
    }

    static async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;

            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new ResourceNotFound("User not found");
            }

            if (otp !== user.otp) {
                throw new Unauthorized("Invalid OTP");
            }

            if (user.otpExpiry && user.otpExpiry < new Date()) {
                const verificationCode = generateOtp();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

                await sendMail(
                    email,
                    "Email Verification",
                    `Your verification code is: ${verificationCode}`
                );
                // httpLogger.info("Verification email sent successfully");

                await user.updateOne({ otp: verificationCode, otpExpiry });

                throw new Unauthorized("OTP expired, check your email for new OTP");
            }

            user.isVerified = true;
            user.otp = null;
            user.otpExpiry = null;

            await user.save();

            const payload = { id: user.id };

            const token = generateToken(payload, "access");

            res.header("authorization", `Bearer ${token}`);

            res.status(200).json({
                success: true,
                message: "User verified successfully",
                user: user.toJSON(),
            });
        } catch (error) {
            next(error);
        }
    }

    static async forgotpassword(req, res, next) {
        try {
            const { email } = req.body;

            const emailErrors = validateEmail(email);
            if (emailErrors.length > 0) {
                throw new InvalidInput("Invalid input", emailErrors);
            }

            const user = await UserModel.findOne({ email });

            if (!user) {
                throw new ResourceNotFound("User not found");
            }

            const payload = { id: user.id }

            const token = generateToken(payload, 'access');

            // await user.save();
            const frontend_url = process.env.FRONTEND_BASE_URL;

            if (frontend_url == null) {
                throw new Error("Frontend URL is not defined");
            }

            const resetUrl = `${frontend_url}/login/forgot-password?token=${token}`;

            user.passwordResetToken = token
            user.passwordResetExpiry = maxAge

            await user.save()

            await sendMail(
                email,
                "Reset Password",
                `Click the link to reset your password: ${resetUrl}`
            );

            const resPayload = {
                success: true,
                message: `A reset link was sent to ${email}`,
            };

            res.status(200).json(resPayload);
        } catch (error) {
            next(error);
        }
    }

    static async resetpassword(req, res, next) {
        try {
            const { token } = req.query;
            const { password } = req.body;

            const errors = validatePassword(password);


            const { id } = verifyToken(token);

            const user = await UserModel.findById(id);

            if (!user) {
                throw new Unauthorized("User not found");
            }


            if (user.passwordResetToken !== token) {
                throw new Unauthorized("Invalid or expired reset token");
            }

            // Check if the reset token has expired
            if (user.passwordResetExpiry > maxAge) {
                throw new Unauthorized("Reset token has expired");
            }

            if (errors.length > 0) {
                throw new InvalidInput("Invalid input", errors);
            }

            // Reset the user's password
            user.password = password;
            user.passwordResetToken = null;
            user.passwordResetExpiry = null;

            await user.save();

            const resPayload = {
                success: true,
                message: "Password reset successful",
            };

            res.status(200).json(resPayload);
        } catch (error) {
            // console.log(error)
            next(error);
        }
    }

    static async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const reqBody = req.body;

            const errors = await validateUpdateUser(userId, reqBody);

            if (errors) {
                throw new InvalidInput("Invalid input", errors);
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                reqBody,
                { runValidators: true, new: true }
            ).exec();

            if (updatedUser === null) {
                throw new ResourceNotFound("User not found");
            }

            const resPayload = {
                success: true,
                message: 'User updated successfully',
                user: updatedUser
            };

            res.status(200).json(resPayload);

        } catch (error) {
            // console.log(error)
            next(error);
        }
    }

    static async changePassword(req, res, next) {
        try {

        } catch (error) {
            next(error)
        }
    }
}

module.exports = AuthService;

const AuthService = require('../services/authService');

class AuthController {
    constructor() {
        this.authService = AuthService;
    }

    // Unauthenticated user controllers

    /**
     * @route POST api/auth/signup
     * @desc Register a user
     * @access Public
     */
    signup = async (req, res, next) => {
        await this.authService.signup(req, res, next);
    };

    /**
     * @route POST api/auth/signin
     * @desc Login a user
     * @access Public
     */
    signin = async (req, res, next) => {
        await this.authService.signin(req, res, next);
    };

    /**
     * @route POST api/auth/verify-otp
     * @desc Verify a user
     * @access Public
     */
    verifyOtp = async (req, res, next) => {
        await this.authService.verifyOtp(req, res, next);
    };

    /**
     * @route POST api/auth/forgot-password
     * @desc Send verification link
     * @access Public
     */
    forgotPassword = async (req, res, next) => {
        await this.authService.forgotpassword(req, res, next);
    };

    /**
     * @route POST api/auth/reset-password
     * @desc Verify a user
     * @access Public
     */
    resetPassword = async (req, res, next) => {
        await this.authService.resetpassword(req, res, next);
    };

    // Authenticated user controllers

    /**
     * @route PATCH api/auth/user/:id
     * @desc Update a user
     * @access Public
     */
    updateUser = async (req, res, next) => {
        await this.authService.updateUser(req, res, next);
    };

    /**
     * @route PATCH api/auth/:id/change-password
     * @desc Change user password
     * @access Public
     */
    changePassword = async (req, res, next) => {
        await this.authService.changePassword(req, res, next);
    };

}

module.exports = AuthController;

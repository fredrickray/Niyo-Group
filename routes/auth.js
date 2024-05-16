const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router()
const userController = new AuthController();

// route for authentication
router.get("/auth", (req, res) => {
    res.send("auth route");
});

router.use(express.json());

// Unauthenticated user routes

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

router.post("/verify-otp", userController.verifyOtp);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword);


// Aunthenticated user routes 
router.patch("/update/:id", userController.updateUser);

router.put("/:id/change-password", userController.changePassword);

module.exports = router
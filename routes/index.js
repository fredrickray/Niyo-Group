const express = require("express");
const TaskRouter = require("./task");
const AuthRouter = require("./auth");
const authrorizeUser = require("../middlewares/authorizeUser")

const router = express.Router();

router.use(express.json());

router.use("/task", authrorizeUser, TaskRouter);
router.use("/auth", AuthRouter);

module.exports = router;
const express = require("express");
const TaskRouter = require("./task");
const AuthRouter = require("./auth");

const router = express.Router();

router.use(express.json());

router.use("/task", TaskRouter);
router.use("/auth", AuthRouter);

module.exports = router;
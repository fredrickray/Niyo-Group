const express = require("express");
const TaskRouter = require("../routes/task");
const router = express.Router();

router.use(express.json())

router.use("/task", TaskRouter)

module.exports = router;
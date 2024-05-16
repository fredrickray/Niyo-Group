const express = require("express");
const TaskController = require("../controllers/taskController");

const router = express.Router()
const taskController = new TaskController();

router.use(express.json());

router.post("/", taskController.createTask);

router.get("/", taskController.getTasks);

router.get("/:id", taskController.getTask);

router.put("/:id", taskController.updateTask);

router.delete("/:id", taskController.deleteTask);

router.delete("/", taskController.bulkDeleteTask);

router.put("/:id/completed", taskController.taskCompleted);

router.post("/completed", taskController.bulkTaskCompleted);

module.exports = router;
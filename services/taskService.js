const { TaskModel } = require("../models/taskModel");
const { isValidObjectId } = require("mongoose");
const {
    BadRequest,
    Unauthorized,
    ResourceNotFound,
    InvalidInput,
    Conflict
} = require('../middlewares/errorHandler');
const { validateCreateTask, validateUpdateTask } = require("../utils/taskValidator")


class TaskService {
    static async createTask(req, res, next) {
        try {
            const reqBody = req.body;

            const errors = await validateCreateTask(reqBody);
            if (errors.length > 0) {
                throw new InvalidInput("Invalid input", errors);
            }

            let { name } = reqBody;

            const existingTask = await TaskModel.find({ name: name });
            if (existingTask.length > 0) {
                console.log(existingTask)
                throw new Conflict("Task already exist");
            }

            const newTask = new TaskModel(reqBody);
            await newTask.save();
            req.io.emit('taskCreated', newTask.toJSON());

            const resPayload = {
                success: true,
                message: "Task created successfully",
                task: newTask.toJSON()
            }

            res.status(201).json(resPayload)
        } catch (error) {
            next(error)
        }
    }

    static async getTasks(req, res, next) {
        try {
            const tasks = await TaskModel.find()

            if (!tasks || tasks.length === 0) {
                throw new ResourceNotFound("No tasks found");
            }

            const resPayload = {
                success: true,
                message: "Tasks retrieved successfully",
                tasks: tasks
            }

            res.status(200).json(resPayload)
        } catch (error) {
            next(error)
        }
    }

    static async getTask(req, res, next) {
        try {
            const taskId = req.params.id;
            if (!taskId || taskId === "") {
                throw new BadRequest("Task Id is required");
            }

            if (!isValidObjectId(taskId)) {
                throw new BadRequest("Invalid task Id");
            }

            const task = await TaskModel.findById(taskId);

            if (!task) {
                throw new ResourceNotFound("Task not found");
            }

            const resPayload = {
                success: true,
                message: "Task retrieved successfully",
                tasks: task.toJSON()
            }

            res.status(200).json(resPayload);
        } catch (error) {
            next(error);
        }
    }

    static async updateTask(req, res, next) {
        try {
            const taskId = req.params.id;
            const reqBody = req.body;
            const errors = await validateUpdateTask(taskId, reqBody);


            if (!taskId || taskId === "") {
                throw new ResourceNotFound("Task id is required")
            }

            if (errors.length > 0) {
                throw new InvalidInput("Invalid input", errors);
            }

            const updatedTask = await TaskModel.findByIdAndUpdate(taskId, reqBody, { runValidators: true, new: true }
            ).exec();

            if (!updatedTask) {
                throw new ResourceNotFound("Task not found");
            }

            req.io.emit('taskUpdated', updatedTask);
            const resPayload = {
                success: true,
                message: 'Task updated successfully',
                task: updatedTask
            };

            res.status(200).json(resPayload);

        } catch (error) {
            next(error)
        }
    }

    static async deleteTask(req, res, next) {
        try {
            const taskId = req.params.id;

            if (!taskId || taskId === "") {
                throw new BadRequest("Task Id is required");
            }

            if (!isValidObjectId(taskId)) {
                throw new BadRequest("Invalid task Id");
            }

            const deletedTask = await TaskModel.findByIdAndDelete(taskId);

            if (!deletedTask) {
                throw new ResourceNotFound("Task not found");
            }

            req.io.emit('taskDeleted', taskId);
            const resPayload = {
                success: true,
                message: 'Task deleted successfully'
            };

            res.status(200).json(resPayload);
        } catch (error) {
            next(error);
        }
    }

    static async bulkDeleteTask(req, res, next) {
        try {
            const { taskIds } = req.body;
            if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
                throw new BadRequest("Invalid or empty taskIds array");
            }

            const deletedTasks = await TaskModel.deleteMany({ _id: { $in: taskIds } });

            if (deletedTasks.deletedCount === 0) {
                throw new ResourceNotFound(`Tasks with IDs: [${taskIds}] not found`);
            }

            req.io.emit('bulkTaskDeleted', taskIds);
            const resPayload = {
                success: true,
                message: `${deletedTasks.deletedCount} tasks deleted successfully`
            };

            res.status(200).json(resPayload);
        } catch (error) {
            console.log
            next(error)
        }
    }

    static async taskMarkCompleted(req, res, next) {
        try {
            const taskId = req.params.id;
            if (!taskId || taskId === "") {
                throw new BadRequest("Task Id is required");
            }

            if (!isValidObjectId(taskId)) {
                throw new BadRequest("Invalid task Id");
            }

            const task = await TaskModel.findById(taskId);

            if (!task) {
                throw new ResourceNotFound("Task not found")
            }

            task.completed = true;
            await task.save();

            const resPayload = {
                success: true,
                message: "Task marked completed",
                tasks: task.toJSON()
            }

            res.status(200).json(resPayload)
        } catch (error) {
            next(error)
        }
    }

    static async bulkTaskMarkCompleted(req, res, next) {
        try {
            const taskIds = req.body;
            console.log("line 216: ", taskIds)

            if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
                throw new BadRequest("Invalid or empty taskIds array");
            }

            taskIds.forEach(taskId => {
                if (!isValidObjectId(taskId)) {
                    throw new BadRequest("Invalid task Id");
                }
            });

            const updatedTasks = await Task.updateMany(
                { _id: { $in: taskIds } },
                { completed: true }
            );

            if (updatedTasks.modifiedCount === 0) {
                throw new ResourceNotFound("No tasks were updated");
            }

            const resPayload = {
                success: true,
                message: `${updatedTasks.modifiedCount} task(s) marked as complete`,
                tasks: updatedTasks
            };

            res.status(200).json(resPayload);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = TaskService;
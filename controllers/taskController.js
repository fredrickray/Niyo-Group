const TaskService = require("../services/taskService");

class TaskController {
    constructor() {
        this.taskService = TaskService;
    }

    /**
   * @route POST api/task
   * @desc Create a task
   * @access Public
   */
    createTask = async (req, res, next) => {
        await this.taskService.createTask(req, res, next);
    };

    /**
   * @route GET api/task
   * @desc Get all task
   * @access Public
   */
    getTasks = async (req, res, next) => {
        await this.taskService.getTasks(req, res, next);
    };

    /**
   * @route GET api/task/:id
   * @desc Get a single task
   * @access Public
   */
    getTask = async (req, res, next) => {
        await this.taskService.getTask(req, res, next);
    };


    /**
   * @route PUT api/task/:id
   * @desc Update a task
   * @access Public
   */
    updateTask = async (req, res, next) => {
        await this.taskService.updateTask(req, res, next);
    };

    /**
   * @route DELETE api/task/:id
   * @desc Create a task
   * @access Public
   */
    deleteTask = async (req, res, next) => {
        await this.taskService.deleteTask(req, res, next);
    };

    /**
   * @route DELETE api/task
   * @desc Create a task
   * @access Public
   */
    bulkDeleteTask = async (req, res, next) => {
        await this.taskService.bulkDeleteTask(req, res, next);
    };

    /**
   * @route PUT api/task/:id/completed
   * @desc Mark a task as completed
   * @access Public
   */
    taskCompleted = async (req, res, next) => {
        await this.taskService.taskMarkCompleted(req, res, next);
    };

    /**
   * @route PUT api/task/completed
   * @desc Bulk mark tasks as completed
   * @access Public
   */
    bulkTaskCompleted = async (req, res, next) => {
        await this.taskService.bulkTaskMarkCompleted(req, res, next);
    };
}

module.exports = TaskController;
const TaskService = require('./services/taskService');

function initializeSocket(io) {
    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
        });

        // Emit events to clients when tasks are created, updated, or deleted
        TaskService.on('taskCreated', (task) => {
            io.emit('taskCreated', task);
        });

        TaskService.on('taskUpdated', (task) => {
            io.emit('taskUpdated', task);
        });

        TaskService.on('taskDeleted', (taskId) => {
            io.emit('taskDeleted', taskId);
        });
    });
}

module.exports = initializeSocket;
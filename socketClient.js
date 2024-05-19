const socketIo = require('socket.io');

function initializeSocket(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('A client disconnected:', socket.id);
        });

        // Additional event handlers
        socket.on('taskCreated', (task) => {
            console.log('New task created:', task);
            io.emit('taskCreated', task);
        });

        socket.on('taskUpdated', (task) => {
            console.log('Task updated:', task);
            io.emit('taskUpdated', task);
        });

        socket.on('taskDeleted', (taskId) => {
            console.log('Task deleted:', taskId);
            io.emit('taskDeleted', taskId);
        });
    });

    return io;
}

module.exports = initializeSocket;

// socket.js
const { Server } = require('socket.io');

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                callback(null, true);
            },
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
            credentials: true,
            optionsSuccessStatus: 204,
        },
    });

    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('message', (message) => {
            console.log(message);
            io.emit('message', `${socket.id.substr(0, 2)} said ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('a user disconnected!');
        });
    });

    return io;
}

module.exports = initializeSocket;

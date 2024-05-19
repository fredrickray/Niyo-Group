const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require('http');
const { errorHandler, routeNotFound } = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const indexRouter = require("./routes/index");
const initializeSocket = require('./socketClient');
const socketIo = require('socket.io');

dotenv.config();
const port = process.env.PORT || 7777;


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

initializeSocket(io);

// io.on('connection', (socket) => {
//     console.log('A client connected');
//     socket.on('disconnect', () => {
//         console.log('A client disconnected');
//     });
// });

app.get('/', (req, res) => {
    res.send({
        success: true,
        message: "Server is live and running"
    });
});

// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });

app.use(
    cors({
        origin: ["*", "http://localhost:3000", "http://127.0.0.1:5173/"],
        optionsSuccessStatus: 200,
        credentials: true,
        allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    })
);

app.options("*", cors())

app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api", indexRouter);

app.use(routeNotFound);

app.use(errorHandler);



connectDB().then(() => {
    app.listen(port, () => {
        console.log("listening for requests")
    })
}).catch(err => {
    console.error('Failed to connect to database', err);
})